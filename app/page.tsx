"use client"

import { useState } from "react"
import { Plus, ChevronRight, ChevronDown, Trash2, Search, X, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

// Mock CUPS codes data
const CUPS_CODES = [
  { code: "890301", name: "Hemograma completo", tipo: "Laboratorio", valor: 85000 },
  { code: "270901", name: "Oxígeno medicinal", tipo: "Insumo", valor: 3200 },
  { code: "310101", name: "Ceftriaxona 1g IV", tipo: "Medicamento", valor: 45000 },
  { code: "481101", name: "Electrocardiograma", tipo: "Procedimiento", valor: 55000 },
  { code: "895901", name: "Gasometría arterial", tipo: "Laboratorio", valor: 40000 },
  { code: "890601", name: "Estancia UCI adultos", tipo: "Estancia", valor: 150000 },
]

const CONTRATOS = [
  { id: "08001S0060150-25", name: "144444 - Servicio de prueba", tipo: "Evento - Pago por Servicio", cantidad: 1, valor: 52000 },
  { id: "08001S0060151-25", name: "155555 - Hospitalización general", tipo: "Cápita - Pago mensual", cantidad: 1, valor: 120000 },
  { id: "08001S0060152-25", name: "166666 - UCI Adultos", tipo: "Evento - Pago por Servicio", cantidad: 1, valor: 350000 },
]

interface CupsService {
  id: string
  code: string
  name: string
  tipo: string
  fecha: string
  cantidad: number
  valorUnitario: number
  total: number
}

interface Bloque {
  id: string
  cups: string
  nombre: string
  numero: number
  fechaInicio: string
  fechaFin: string
  contrato: string | null
  estado: "Abierto" | "Cerrado"
  servicios: CupsService[]
  needsContract: boolean
}

// Type badge component
function TypeBadge({ tipo }: { tipo: string }) {
  const colors: Record<string, string> = {
    Laboratorio: "bg-red-500",
    Insumo: "bg-amber-500",
    Medicamento: "bg-purple-500",
    Procedimiento: "bg-blue-500",
    Estancia: "bg-emerald-600",
  }
  return (
    <span className={`text-xs px-2 py-0.5 rounded-full text-white ${colors[tipo] || "bg-gray-500"}`}>
      {tipo}
    </span>
  )
}

// Status badge component
function StatusBadge({ estado }: { estado: "Abierto" | "Cerrado" }) {
  return (
    <span className={`flex items-center gap-1.5 text-sm font-medium ${estado === "Abierto" ? "text-emerald-600" : "text-gray-400"}`}>
      <span className={`w-2 h-2 rounded-full ${estado === "Abierto" ? "bg-emerald-500" : "bg-gray-400"}`} />
      {estado}
    </span>
  )
}

// Disabled select component for the form
function DisabledSelect({ label, value, required = false }: { label: string; value: string; required?: boolean }) {
  return (
    <div>
      <label className="block text-sm mb-1 text-gray-600">
        {label}{required && <span className="text-red-500">*</span>}
      </label>
      <div className="flex items-center justify-between px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-gray-500 text-sm">
        <span>{value}</span>
        <ChevronDown className="h-4 w-4" />
      </div>
    </div>
  )
}



export default function AutorizacionServicios() {
  const [bloques, setBloques] = useState<Bloque[]>([])
  const [expandedBloque, setExpandedBloque] = useState<string | null>(null)
  const [showNewPeriodForm, setShowNewPeriodForm] = useState(false)
  const [showAddServiceForm, setShowAddServiceForm] = useState<string | null>(null)
  const [showContractForm, setShowContractForm] = useState<string | null>(null)
  const [procedimiento, setProcedimiento] = useState<string>("autorizacion")
  const [urgenciaServicios, setUrgenciaServicios] = useState<CupsService[]>([])
  const [urgenciaContrato, setUrgenciaContrato] = useState<string | null>(null)
  
  // New period form state
  const [newPeriodCups, setNewPeriodCups] = useState("")
  const [newPeriodFechaInicio, setNewPeriodFechaInicio] = useState("")
  const [newPeriodFechaFin, setNewPeriodFechaFin] = useState("")
  const [pendingContrato, setPendingContrato] = useState("")
  
  // Add service form state
  const [serviceTipo, setServiceTipo] = useState("")
  const [serviceCups, setServiceCups] = useState("")
  const [serviceFecha, setServiceFecha] = useState("")
  const [serviceCantidad, setServiceCantidad] = useState("1")

  const MONTHS = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"]
  
  const formatDate = (dateStr: string) => {
    const [year, month, day] = dateStr.split("-").map(Number)
    return `${day} ${MONTHS[month - 1]} ${year}`
  }
  
  const formatDateShort = (dateStr: string) => {
    const [, month, day] = dateStr.split("-").map(Number)
    return `${day} ${MONTHS[month - 1]}`
  }

  const formatCurrency = (value: number) => {
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(2)}M`
    }
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(value)
  }

  const formatCurrencyFull = (value: number) => {
    return `$ ${new Intl.NumberFormat("es-CO").format(value)}`
  }

  const calcularTotalBloque = (bloque: Bloque) => {
    return bloque.servicios.reduce((acc, s) => acc + s.total, 0)
  }





  const handleCreatePeriod = () => {
    if (!newPeriodCups || !newPeriodFechaInicio || !newPeriodFechaFin) return
    
    const cupsData = CUPS_CODES.find(c => c.code === newPeriodCups)
    if (!cupsData) return

    // Check if this is the first block (needs contract selection after creation)
    const isFirstBlock = bloques.length === 0

    const newBloque: Bloque = {
      id: `bloque-${Date.now()}`,
      cups: newPeriodCups,
      nombre: cupsData.name,
      numero: bloques.length + 1,
      fechaInicio: newPeriodFechaInicio,
      fechaFin: newPeriodFechaFin,
      contrato: isFirstBlock ? null : bloques[0]?.contrato || null,
      estado: "Abierto",
      servicios: [],
      needsContract: isFirstBlock,
    }

    // Close previous open blocks
    const updatedBloques = bloques.map(b => ({
      ...b,
      estado: "Cerrado" as const,
    }))

    setBloques([...updatedBloques, newBloque])
    setExpandedBloque(null)
    setShowNewPeriodForm(false)
    setNewPeriodCups("")
    setNewPeriodFechaInicio("")
    setNewPeriodFechaFin("")
    
    // If first block, show contract selection
    if (isFirstBlock) {
      setShowContractForm(newBloque.id)
    }
  }

  const handleSelectContract = (bloqueId: string) => {
    if (!pendingContrato) return
    
    setBloques(bloques.map(b => 
      b.id === bloqueId 
        ? { ...b, contrato: pendingContrato, needsContract: false }
        : b
    ))
    setShowContractForm(null)
    setPendingContrato("")
  }

  const handleAddService = (bloqueId: string) => {
    if (!serviceCups || !serviceCantidad || !serviceFecha) return

    const bloque = bloques.find(b => b.id === bloqueId)
    if (!bloque) return

    const cupsData = CUPS_CODES.find(c => c.code === serviceCups)
    if (!cupsData) return

    const cantidad = parseInt(serviceCantidad)
    const newService: CupsService = {
      id: `service-${Date.now()}`,
      code: cupsData.code,
      name: cupsData.name,
      tipo: cupsData.tipo,
      fecha: serviceFecha,
      cantidad,
      valorUnitario: cupsData.valor,
      total: cupsData.valor * cantidad,
    }

    setBloques(bloques.map(b => 
      b.id === bloqueId 
        ? { ...b, servicios: [...b.servicios, newService] }
        : b
    ))

    setShowAddServiceForm(null)
    setServiceTipo("")
    setServiceCups("")
    setServiceFecha("")
    setServiceCantidad("1")
  }

  const handleDeleteService = (bloqueId: string, serviceId: string) => {
    setBloques(bloques.map(b =>
      b.id === bloqueId
        ? { ...b, servicios: b.servicios.filter(s => s.id !== serviceId) }
        : b
    ))
  }

  const handleDeleteBloque = (bloqueId: string) => {
    setBloques(bloques.filter(b => b.id !== bloqueId))
  }

  const handleAddUrgenciaService = () => {
    if (!serviceCups) return
    const cupsData = CUPS_CODES.find(c => c.code === serviceCups)
    if (!cupsData) return
    const cantidad = 1
    const newService: CupsService = {
      id: `urg-${Date.now()}`,
      code: cupsData.code,
      name: cupsData.name,
      tipo: cupsData.tipo,
      fecha: new Date().toISOString().split('T')[0], // Use today's date format for display
      cantidad,
      valorUnitario: cupsData.valor,
      total: cupsData.valor * cantidad,
    }
    setUrgenciaServicios(prev => [...prev, newService])
    setShowAddServiceForm(null)
    setServiceTipo("")
    setServiceCups("")
    setServiceFecha("")
    setServiceCantidad("1")
  }


  const selectedContrato = bloques.length > 0 
    ? CONTRATOS.find(c => c.id === bloques[0]?.contrato)?.name 
    : null

  const targetBloque = bloques.find(b => b.id === showAddServiceForm)

  // Filter CUPS by tipo
  const filteredCups = serviceTipo 
    ? CUPS_CODES.filter(c => c.tipo === serviceTipo)
    : CUPS_CODES

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        
        {/* Section: Información del prestador */}
        <section>
          <h2 className="text-teal-600 font-medium mb-3">Información del prestador</h2>
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <DisabledSelect 
                label="Obligado a reportar" 
                value="901139193 - MIRED BARRANQUILLA IPS S.A.S." 
                required 
              />
              <DisabledSelect 
                label="Código prestador" 
                value="MIRED BARRANQUILLA PASO PRADERA" 
                required 
              />
            </div>
          </div>
        </section>

        {/* Section: Procedimiento */}
        <section>
          <h2 className="text-teal-600 font-medium mb-3">Procedimiento</h2>
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <label className="block text-sm text-gray-600 mb-1">
              Procedimiento objeto de la información<span className="text-red-500">*</span>
            </label>
            <Select value={procedimiento} onValueChange={setProcedimiento}>
              <SelectTrigger className="bg-gray-50 border-gray-200 text-gray-700 text-sm h-10">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="autorizacion" className="text-sm">Solicitud de autorización de servicios y tecnologías en salud</SelectItem>
                <SelectItem value="urgencias" className="text-sm">Informe de atención de urgencias</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </section>

        {/* Section: Información de la atención y servicios solicitados */}
        <section>
          <h2 className="text-teal-600 font-medium mb-3">Información de la atención y servicios solicitados</h2>
          <div className="bg-white rounded-lg border border-gray-200 p-4 space-y-4">
            {/* Row 1 */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Consecutivo del procedimiento objeto de la formación<span className="text-red-500">*</span>
                </label>
                <Input 
                  value="20260409" 
                  disabled 
                  className="bg-gray-50 border-gray-200 text-gray-700"
                />
              </div>
              <DisabledSelect label="Causa que motiva la atención" value="Select..." required />
              <DisabledSelect label="Prioridad de la atención" value="Select..." required />
              <DisabledSelect label="Tipo de atención solicitada" value="Select..." required />
            </div>
            
            {/* Row 2 */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <DisabledSelect label="Condición y destino de la persona" value="Select..." required />
              <DisabledSelect label="Diagnóstico principal" value="Seleccione diagnóstico" required />
              <DisabledSelect label="Diagnóstico relacionado 1" value="Seleccione diagnóstico" />
              <DisabledSelect label="Diagnóstico relacionado 2" value="Seleccione diagnóstico" />
            </div>
            
            {/* Row 3 */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <DisabledSelect label="Grupo de servicios" value="Select..." required />
              <DisabledSelect label="Modalidad de realización de la tecnología de salud" value="Select..." required />
              <DisabledSelect label="Finalidad de la tecnología de salud" value="Select..." required />
              <DisabledSelect label="Tipo de servicio" value="Select..." required />
            </div>
          </div>
        </section>

        {/* Section: Highlighted Block - Service Management */}
        <section className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm">
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            {/* Header with button */}
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-emerald-600">
                {procedimiento === "urgencias" ? "Servicios de Urgencias" : "Gestión de Servicios por Bloque"}
              </h3>
              {procedimiento === "urgencias" ? (
                <Button 
                  onClick={() => setShowAddServiceForm("urgencias")}
                  size="sm"
                  disabled={urgenciaServicios.length > 0 && !urgenciaContrato}
                  className="bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-300 disabled:text-gray-500 text-white text-xs"
                >
                  <Plus className="h-3 w-3 mr-1" />
                  Agregar servicio
                </Button>
              ) : (
                <Button 
                  onClick={() => setShowNewPeriodForm(true)}
                  size="sm"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs"
                >
                  <Plus className="h-3 w-3 mr-1" />
                  Iniciar nuevo evento hospitalario
                </Button>
              )}
            </div>



            {/* New Period Form as Dialog */}
            <Dialog open={showNewPeriodForm} onOpenChange={setShowNewPeriodForm}>
              <DialogContent className="sm:max-w-[480px] bg-white border-gray-200 p-0 overflow-hidden">
                <div className="p-6 pb-4 border-b border-gray-100">
                  <DialogHeader>
                    <DialogTitle className="text-gray-800 text-lg font-semibold">Nuevo evento hospitalario</DialogTitle>
                    <p className="text-gray-400 text-sm mt-1">Define el CUPS principal y el rango de fechas</p>
                  </DialogHeader>
                </div>
                <div className="px-6 py-5 space-y-4">
                  <div>
                    <label className="block text-[10px] text-gray-500 mb-1.5 uppercase tracking-widest font-medium">CUPS Principal</label>
                    <Select value={newPeriodCups} onValueChange={setNewPeriodCups}>
                      <SelectTrigger className="bg-gray-50 border-gray-200 text-gray-800 text-sm h-10 w-full">
                        <SelectValue placeholder="Seleccionar CUPS..." />
                      </SelectTrigger>
                      <SelectContent>
                        {CUPS_CODES.map(c => (
                          <SelectItem key={c.code} value={c.code} className="text-sm">
                            {c.code} — {c.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] text-gray-500 mb-1.5 uppercase tracking-widest font-medium">Fecha Inicio</label>
                      <Input 
                        type="date" 
                        value={newPeriodFechaInicio}
                        onChange={e => setNewPeriodFechaInicio(e.target.value)}
                        className="bg-gray-50 border-gray-200 text-gray-800 text-sm h-10"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-gray-500 mb-1.5 uppercase tracking-widest font-medium">Fecha Fin</label>
                      <Input 
                        type="date" 
                        value={newPeriodFechaFin}
                        onChange={e => setNewPeriodFechaFin(e.target.value)}
                        className="bg-gray-50 border-gray-200 text-gray-800 text-sm h-10"
                      />
                    </div>
                  </div>
                </div>
                <div className="flex justify-end gap-2 px-6 py-4 border-t border-gray-100 bg-gray-50">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setShowNewPeriodForm(false)}
                    className="border-gray-300 text-gray-600 hover:bg-gray-100 text-sm h-9"
                  >
                    Cancelar
                  </Button>
                  <Button onClick={handleCreatePeriod} size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white text-sm h-9 px-5">
                    Crear evento
                  </Button>
                </div>
              </DialogContent>
            </Dialog>

            {/* Contract Selection and Display placed before the accordions */}
            {(showContractForm || (procedimiento === "urgencias" && urgenciaServicios.length > 0 && !urgenciaContrato)) && (
              <div className="bg-white border border-emerald-200 rounded-lg mb-4 overflow-hidden shadow-sm">
                <div className="px-4 py-3 bg-emerald-50 border-b border-emerald-200 flex items-center justify-between">
                  <h3 className="text-sm font-medium text-emerald-800">Seleccionar contrato para el evento</h3>
                </div>
                {/* Contract Table Header */}
                <div className="grid grid-cols-12 gap-2 px-4 py-2 bg-gray-100 text-[11px] text-gray-500 uppercase tracking-wide font-medium border-b border-gray-200">
                  <div className="col-span-1"></div>
                  <div className="col-span-3">Servicio</div>
                  <div className="col-span-3">Contrato</div>
                  <div className="col-span-3">Tipo</div>
                  <div className="col-span-1 text-center">Cantidad</div>
                  <div className="col-span-1 text-right">Valor</div>
                </div>
                
                {/* Contract Options */}
                {CONTRATOS.map((contrato) => (
                  <div 
                    key={contrato.id}
                    className={`grid grid-cols-12 gap-2 px-4 py-3 border-b border-gray-100 items-center cursor-pointer hover:bg-gray-50 transition-colors ${pendingContrato === contrato.id ? 'bg-emerald-50' : ''}`}
                    onClick={() => setPendingContrato(contrato.id)}
                  >
                    <div className="col-span-1 flex justify-center">
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${pendingContrato === contrato.id ? 'border-emerald-500' : 'border-gray-300'}`}>
                        {pendingContrato === contrato.id && (
                          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                        )}
                      </div>
                    </div>
                    <div className="col-span-3 text-sm text-emerald-600 font-medium">
                      {contrato.name}
                    </div>
                    <div className="col-span-3 text-sm text-blue-600">
                      {contrato.id}
                    </div>
                    <div className="col-span-3 text-sm text-emerald-600">
                      {contrato.tipo}
                    </div>
                    <div className="col-span-1 text-center text-sm text-gray-700">
                      {contrato.cantidad}
                    </div>
                    <div className="col-span-1 text-right text-sm text-gray-700">
                      ${contrato.valor.toLocaleString()}
                    </div>
                  </div>
                ))}
                
                {/* Contract Footer */}
                <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-t border-gray-200">
                  <div className="text-sm">
                    <span className="text-gray-600">Contrato seleccionado: </span>
                    <span className="text-gray-800 font-medium">
                      {pendingContrato ? CONTRATOS.find(c => c.id === pendingContrato)?.id : ''}
                    </span>
                  </div>
                  <Button 
                    onClick={() => {
                      if (procedimiento === "urgencias") {
                        setUrgenciaContrato(pendingContrato)
                        setPendingContrato("")
                      } else {
                        handleSelectContract(showContractForm!)
                      }
                    }} 
                    size="sm" 
                    disabled={!pendingContrato}
                    className="bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-300 disabled:text-gray-500 text-xs h-9 px-4"
                  >
                    <Check className="h-4 w-4 mr-1" />
                    Confirmar Contrato
                  </Button>
                </div>
              </div>
            )}

            {!(showContractForm || (procedimiento === "urgencias" && urgenciaServicios.length > 0 && !urgenciaContrato)) && (selectedContrato || urgenciaContrato) && (
              <div className="bg-emerald-50 border border-emerald-200 rounded-lg mb-4 px-4 py-3 flex items-center justify-between shadow-sm">
                <div className="text-sm">
                  <span className="text-emerald-800 mr-2 font-medium">Contrato aplicado:</span>
                  <span className="text-emerald-700 font-semibold">
                    {procedimiento === "urgencias" ? CONTRATOS.find(c => c.id === urgenciaContrato)?.name : selectedContrato}
                  </span>
                </div>
              </div>
            )}

            {/* URGENCIAS MODE: Flat service list */}
            {procedimiento === "urgencias" ? (
              urgenciaServicios.length === 0 ? (
                <div className="border-2 border-dashed border-emerald-300 rounded-lg py-12 text-center bg-white">
                  <Search className="h-10 w-10 mx-auto mb-3 text-emerald-400" />
                  <p className="text-gray-500">No hay servicios registrados</p>
                  <p className="text-xs text-gray-400 mt-1">Agrega servicios del informe de urgencias</p>
                </div>
              ) : (
                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                  <div className="grid grid-cols-12 gap-2 px-4 py-2 bg-gray-100 text-[10px] text-gray-500 uppercase tracking-wide font-medium">
                    <div className="col-span-1">CUPS</div>
                    <div className="col-span-4">SERVICIO</div>
                    <div className="col-span-2">FECHA</div>
                    <div className="col-span-1 text-center">CANT.</div>
                    <div className="col-span-2 text-right">V. UNITARIO</div>
                    <div className="col-span-2 text-right">TOTAL</div>
                  </div>
                  {urgenciaServicios.map((servicio) => (
                    <div key={servicio.id} className="grid grid-cols-12 gap-2 px-4 py-3 border-t border-gray-100 items-center hover:bg-gray-50 text-sm">
                      <div className="col-span-1 font-mono text-xs text-gray-500">{servicio.code}</div>
                      <div className="col-span-4">
                        <div className="font-medium text-sm text-gray-800">{servicio.name}</div>
                        <TypeBadge tipo={servicio.tipo} />
                      </div>
                      <div className="col-span-2 text-gray-600 text-xs">{formatDate(servicio.fecha)}</div>
                      <div className="col-span-1 text-center text-gray-700 text-xs">{servicio.cantidad}</div>
                      <div className="col-span-2 text-right text-gray-600 text-xs">{formatCurrencyFull(servicio.valorUnitario)}</div>
                      <div className="col-span-2 text-right flex items-center justify-end gap-1">
                        <span className="font-semibold text-emerald-600 text-sm">{formatCurrencyFull(servicio.total)}</span>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setUrgenciaServicios(prev => prev.filter(s => s.id !== servicio.id))}
                          className="h-6 w-6 text-gray-400 hover:text-red-500 hover:bg-red-50"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  {urgenciaServicios.length > 0 && (
                    <div className="grid grid-cols-12 gap-2 px-4 py-2 bg-emerald-50 border-t border-emerald-200">
                      <div className="col-span-10 text-right text-[10px] text-gray-500 uppercase tracking-wide font-medium">TOTAL URGENCIAS</div>
                      <div className="col-span-2 text-right font-bold text-emerald-600 text-sm">
                        {formatCurrencyFull(urgenciaServicios.reduce((acc, s) => acc + s.total, 0))}
                      </div>
                    </div>
                  )}
                </div>
              )
            ) : (
            <>{/* HOSPITALARIO MODE: Accordion/blocks list */}
            {bloques.length === 0 && !showNewPeriodForm ? (
              <div className="border-2 border-dashed border-emerald-300 rounded-lg py-12 text-center bg-white">
                <Search className="h-10 w-10 mx-auto mb-3 text-emerald-400" />
                <p className="text-gray-500">No se encontraron resultados</p>
                <p className="text-xs text-gray-400 mt-1">Inicie un nuevo periodo para agregar servicios</p>
              </div>
            ) : (
              <div className="space-y-3">
                {bloques.map((bloque) => {
                  const isExpanded = expandedBloque === bloque.id
                  const totalBloque = calcularTotalBloque(bloque)
                  
                  return (
                    <div key={bloque.id} className="border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm">
                      {/* Bloque Header */}
                      <div 
                        className="flex items-center justify-between px-4 py-3 bg-gray-50 cursor-pointer hover:bg-gray-100"
                        onClick={() => setExpandedBloque(isExpanded ? null : bloque.id)}
                      >
                        <div className="flex items-center gap-3">
                          {isExpanded ? (
                            <ChevronDown className="h-4 w-4 text-gray-400" />
                          ) : (
                            <ChevronRight className="h-4 w-4 text-gray-400" />
                          )}
                          <div className="bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded text-xs font-mono font-medium">
                            {bloque.cups}
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-800">
                              {bloque.nombre} — Evento {bloque.numero}
                            </div>
                            <div className="text-[10px] text-gray-500">
                              {formatDate(bloque.fechaInicio)} → {formatDate(bloque.fechaFin)}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <div className="text-[10px] text-gray-400">Total bloque</div>
                            <div className="text-sm font-semibold text-gray-800">{formatCurrencyFull(totalBloque)}</div>
                          </div>
                          <StatusBadge estado={bloque.estado} />
                          {bloque.estado === "Abierto" && (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={(e) => {
                                e.stopPropagation()
                                handleDeleteBloque(bloque.id)
                              }}
                              className="h-7 w-7 text-gray-400 hover:text-red-500 hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </div>

                      {/* Bloque Content */}
                      {isExpanded && (
                        <div className="border-t border-gray-200">
                          {/* Table Header */}
                          <div className="grid grid-cols-12 gap-2 px-4 py-2 bg-gray-100 text-[10px] text-gray-500 uppercase tracking-wide font-medium">
                            <div className="col-span-1">CUPS</div>
                            <div className="col-span-4">SERVICIO</div>
                            <div className="col-span-2">FECHA</div>
                            <div className="col-span-1 text-center">CANT.</div>
                            <div className="col-span-2 text-right">V. UNITARIO</div>
                            <div className="col-span-2 text-right">TOTAL</div>
                          </div>

                          {/* Services */}
                          {bloque.servicios.length === 0 ? (
                            <div className="px-4 py-8 text-center text-gray-400 text-sm">
                              <Search className="h-6 w-6 mx-auto mb-2 text-gray-300" />
                              <p>No hay servicios en este bloque</p>
                            </div>
                          ) : (
                            bloque.servicios.map((servicio) => (
                              <div 
                                key={servicio.id} 
                                className="grid grid-cols-12 gap-2 px-4 py-3 border-t border-gray-100 items-center hover:bg-gray-50 text-sm"
                              >
                                <div className="col-span-1 font-mono text-xs text-gray-500">
                                  {servicio.code}
                                </div>
                                <div className="col-span-4">
                                  <div className="font-medium text-sm text-gray-800">{servicio.name}</div>
                                  <TypeBadge tipo={servicio.tipo} />
                                </div>
                                <div className="col-span-2 text-gray-600 text-xs">
                                  {formatDate(servicio.fecha)}
                                </div>
                                <div className="col-span-1 text-center text-gray-700 text-xs">
                                  {servicio.cantidad}
                                </div>
                                <div className="col-span-2 text-right text-gray-600 text-xs">
                                  {formatCurrencyFull(servicio.valorUnitario)}
                                </div>
                                <div className="col-span-2 text-right flex items-center justify-end gap-1">
                                  <span className="font-semibold text-emerald-600 text-sm">
                                    {formatCurrencyFull(servicio.total)}
                                  </span>
                                  {bloque.estado === "Abierto" && (
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      onClick={() => handleDeleteService(bloque.id, servicio.id)}
                                      className="h-6 w-6 text-gray-400 hover:text-red-500 hover:bg-red-50"
                                    >
                                      <Trash2 className="h-3 w-3" />
                                    </Button>
                                  )}
                                </div>
                              </div>
                            ))
                          )}

                          {/* Subtotal Row */}
                          {bloque.servicios.length > 0 && (
                            <div className="grid grid-cols-12 gap-2 px-4 py-2 bg-emerald-50 border-t border-emerald-200">
                              <div className="col-span-10 text-right text-[10px] text-gray-500 uppercase tracking-wide font-medium">
                                SUBTOTAL EVENTO
                              </div>
                              <div className="col-span-2 text-right font-bold text-emerald-600 text-sm">
                                {formatCurrencyFull(totalBloque)}
                              </div>
                            </div>
                          )}

                          {/* Add Service Button */}
                          {bloque.estado === "Abierto" && !bloque.needsContract && (
                            <div className="px-4 py-3 border-t border-gray-200">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  setShowAddServiceForm(bloque.id)
                                }}
                                className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 text-xs h-8"
                              >
                                <Plus className="h-3 w-3 mr-1" />
                                Agregar servicio asociado
                              </Button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
            </>)}


          </div>
        </section>

      </div>

      {/* Global Dialog Add Service */}
      <Dialog open={!!showAddServiceForm} onOpenChange={(open) => {
        if (!open) {
          setShowAddServiceForm(null)
          setServiceTipo("")
          setServiceCups("")
          setServiceFecha("")
          setServiceCantidad("1")
        }
      }}>
        <DialogContent className="sm:max-w-[480px] bg-white border-gray-200 p-0 overflow-hidden">
          <div className="p-6 pb-4 border-b border-gray-100">
            <DialogHeader>
              <DialogTitle className="text-gray-800 text-lg font-semibold">Agregar servicio asociado</DialogTitle>
              {targetBloque && (
                <p className="text-gray-400 text-sm mt-1">
                  Evento {targetBloque.numero} &bull; {formatDateShort(targetBloque.fechaInicio)} – {formatDateShort(targetBloque.fechaFin)}
                </p>
              )}
            </DialogHeader>
          </div>
          <div className="px-6 py-5 space-y-4">
            <div>
              <label className="block text-[10px] text-gray-500 mb-1.5 uppercase tracking-widest font-medium">Categoría</label>
              <Select value={serviceTipo} onValueChange={(v) => {
                setServiceTipo(v)
                setServiceCups("")
              }}>
                <SelectTrigger className="bg-gray-50 border-gray-200 text-gray-800 text-sm h-10 w-full">
                  <SelectValue placeholder="Seleccionar categoría..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Laboratorio" className="text-sm">Laboratorio</SelectItem>
                  <SelectItem value="Medicamento" className="text-sm">Medicamento</SelectItem>
                  <SelectItem value="Insumo" className="text-sm">Insumo</SelectItem>
                  <SelectItem value="Procedimiento" className="text-sm">Procedimiento</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-[10px] text-gray-500 mb-1.5 uppercase tracking-widest font-medium">CUPS / Servicio</label>
              <Select value={serviceCups} onValueChange={setServiceCups}>
                <SelectTrigger className="bg-gray-50 border-gray-200 text-gray-800 text-sm h-10 w-full">
                  <SelectValue placeholder="Buscar código CUPS..." />
                </SelectTrigger>
                <SelectContent>
                  {filteredCups.map(c => (
                    <SelectItem key={c.code} value={c.code} className="text-sm">
                      {c.code} — {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {showAddServiceForm !== "urgencias" && (
              <>
                <div>
                  <label className="block text-[10px] text-gray-500 mb-1.5 uppercase tracking-widest font-medium">Fecha del servicio</label>
                  <Input 
                    type="date" 
                    value={serviceFecha}
                    onChange={e => setServiceFecha(e.target.value)}
                    {...(targetBloque ? { min: targetBloque.fechaInicio, max: targetBloque.fechaFin } : {})}
                    className="bg-gray-50 border-gray-200 text-gray-800 text-sm h-10 w-full"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-gray-500 mb-1.5 uppercase tracking-widest font-medium">Cantidad</label>
                  <Input 
                    type="number" 
                    min="1"
                    value={serviceCantidad}
                    onChange={e => setServiceCantidad(e.target.value)}
                    className="bg-gray-50 border-gray-200 text-gray-800 text-sm h-10 w-full"
                  />
                </div>
              </>
            )}
          </div>
          <div className="flex justify-end gap-2 px-6 py-4 border-t border-gray-100 bg-gray-50">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => {
                setShowAddServiceForm(null)
                setServiceTipo("")
                setServiceCups("")
                setServiceFecha("")
                setServiceCantidad("1")
              }}
              className="border-gray-300 text-gray-600 hover:bg-gray-100 text-sm h-9"
            >
              Cancelar
            </Button>
            <Button 
              onClick={() => {
                if (showAddServiceForm === "urgencias") {
                  handleAddUrgenciaService()
                } else if (targetBloque) {
                  handleAddService(targetBloque.id)
                }
              }}
              size="sm"
              className="bg-emerald-600 hover:bg-emerald-700 text-white text-sm h-9 px-5"
            >
              Agregar servicio
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
