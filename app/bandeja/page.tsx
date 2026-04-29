"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { 
  Search, 
  ArrowUp, 
  Edit2, 
  Eye, 
  MessageCircle,
  X,
  Activity,
  FileText,
  Share2
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"

// Mock Data para la tabla
const MOCK_DATA = [
  {
    id: "1297",
    prioridad: "Baja",
    afiliado: "ERCILIA MARIN MATEUS",
    ips: "901139193 MIRED BARRANQUILLA IPS S.A.S.",
    tipo: "Informe de la Atención de Urgencia",
    servicio: "",
    bandeja: "",
    estado: "Nuevo",
    fecha: "2026-04-28 13:19:16",
    vencimiento: "A tiempo",
    mensajes: false,
  },
  {
    id: "1296",
    prioridad: "Baja",
    afiliado: "ERCILIA MARIN MATEUS",
    ips: "901139193 MIRED BARRANQUILLA IPS S.A.S.",
    tipo: "Informe de la Atención de Urgencia",
    servicio: "",
    bandeja: "",
    estado: "Nuevo",
    fecha: "2026-04-28 11:20:45",
    vencimiento: "A tiempo",
    mensajes: true,
  },
  {
    id: "1293",
    prioridad: "Baja",
    afiliado: "ERCILIA MARIN MATEUS",
    ips: "901139193 MIRED BARRANQUILLA IPS S.A.S.",
    tipo: "Informe de la Atención de Urgencia",
    servicio: "",
    bandeja: "",
    estado: "Nuevo",
    fecha: "2026-04-27 16:32:45",
    vencimiento: "A tiempo",
    mensajes: false,
  },
  {
    id: "1292",
    prioridad: "Baja",
    afiliado: "LEIBYS PATRICIA GUTIERREZ CASTRO",
    ips: "901139193 MIRED BARRANQUILLA IPS S.A.S.",
    tipo: "Informe de la Atención de Urgencia",
    servicio: "",
    bandeja: "",
    estado: "Nuevo",
    fecha: "2026-04-27 15:40:58",
    vencimiento: "A tiempo",
    mensajes: false,
  },
  {
    id: "1291",
    prioridad: "Baja",
    afiliado: "ERCILIA MARIN MATEUS",
    ips: "901139193 MIRED BARRANQUILLA IPS S.A.S.",
    tipo: "Informe de la Atención de Urgencia",
    servicio: "",
    bandeja: "",
    estado: "Nuevo",
    fecha: "2026-04-27 15:32:13",
    vencimiento: "A tiempo",
    mensajes: false,
  },
]

// Componente para las tarjetas superiores (Pestañas)
function SummaryTab({ title, active = false }: { title: string, active?: boolean }) {
  return (
    <div className={`flex items-center p-3 rounded-lg border-b-4 bg-white shadow-sm transition-all cursor-pointer hover:shadow-md ${active ? 'border-[#00A9A3]' : 'border-transparent'}`}>
      <div className="bg-[#00A9A3] p-1.5 rounded text-white mr-3">
        <ArrowUp className="h-4 w-4" />
      </div>
      <span className={`text-sm font-medium ${active ? 'text-[#00A9A3]' : 'text-gray-600'}`}>
        {title}
      </span>
    </div>
  )
}

export default function BandejaCasos() {
  const router = useRouter()
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [tipoSolicitud, setTipoSolicitud] = useState<string>("")

  const handleCreateCase = () => {
    if (tipoSolicitud === "autorizacion" || tipoSolicitud === "urgencia") {
      router.push("/autorizacion")
    } else if (tipoSolicitud === "referencia") {
      // Si hubiera ruta para referencia
      router.push("/autorizacion") 
    }
    setShowCreateModal(false)
  }

  return (
    <div className="min-h-screen space-y-6">
      
      {/* Tarjetas Superiores */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <SummaryTab title="Informe de la Atención Inicial de Urgencias" active={true} />
        <SummaryTab title="Solicitud de Autorización de Servicios de Salud" />
        <SummaryTab title="Referencia de Pacientes" />
        <SummaryTab title="Reportes" />
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        {/* Header de Filtros y Crear Caso */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <h1 className="text-xl font-bold text-gray-800">
            Solicitudes de Referencia Urgente
          </h1>
          <Button 
            onClick={() => setShowCreateModal(true)}
            className="bg-[#00A9A3] hover:bg-[#008f8a] text-white w-full md:w-auto px-8 shadow-md"
          >
            Crear caso
          </Button>
        </div>

        {/* Grid de Filtros */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-4 gap-y-3 mb-6">
          {/* Row 1 */}
          <div className="md:col-span-2">
            <Input placeholder="Buscar afiliado" className="bg-gray-50 border-gray-200 w-full" />
          </div>
          <div>
            <Select>
              <SelectTrigger className="bg-gray-50 border-gray-200 w-full">
                <SelectValue placeholder="Prioridad" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="alta">Alta</SelectItem>
                <SelectItem value="media">Media</SelectItem>
                <SelectItem value="baja">Baja</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Row 2 */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input placeholder="Buscar caso" className="bg-gray-50 border-gray-200 pl-9 w-full" />
          </div>
          <div>
            <Select>
              <SelectTrigger className="bg-gray-50 border-gray-200 w-full">
                <SelectValue placeholder="Seleccione un prestador" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="mired">MIRED BARRANQUILLA</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Select>
              <SelectTrigger className="bg-gray-50 border-gray-200 w-full">
                <SelectValue placeholder="Sucursales" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Row 3 */}
          <div>
            <Select>
              <SelectTrigger className="bg-gray-50 border-gray-200 w-full">
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="nuevo">Nuevo</SelectItem>
                <SelectItem value="proceso">En Proceso</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="relative flex items-center">
            <Input placeholder="2026-04-27 to 2026-04-29" className="bg-gray-50 border-gray-200 pr-8 w-full" />
            <X className="absolute right-3 h-4 w-4 text-gray-400 cursor-pointer hover:text-gray-600" />
          </div>
          <div>
            <Select>
              <SelectTrigger className="bg-gray-50 border-gray-200 w-full">
                <SelectValue placeholder="Sucursales" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Row 4 */}
          <div>
            <Select>
              <SelectTrigger className="bg-gray-50 border-gray-200 w-full">
                <SelectValue placeholder="Departamento de origen" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="atlantico">Atlántico</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Select>
              <SelectTrigger className="bg-gray-50 border-gray-200 w-full">
                <SelectValue placeholder="Seleccione un municipio" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="baq">Barranquilla</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Select>
              <SelectTrigger className="bg-gray-50 border-gray-200 w-full">
                <SelectValue placeholder="Vencimiento" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="atiempo">A tiempo</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Row 5 */}
          <div className="md:col-span-2 hidden md:block"></div>
          <div>
            <Select>
              <SelectTrigger className="bg-gray-50 border-gray-200 w-full">
                <SelectValue placeholder="Tipo de solicitud" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="urgencia">Informe de la Atención de Urgencia</SelectItem>
                <SelectItem value="autorizacion">Solicitud de autorización de servicios</SelectItem>
                <SelectItem value="referencia">Referencia</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Botón Buscar */}
        <div className="flex justify-end mb-6">
          <Button className="bg-[#00A9A3] hover:bg-[#008f8a] text-white">
            Buscar casos
          </Button>
        </div>

        {/* Tabla de Resultados */}
        <div className="overflow-x-auto rounded-lg border border-gray-100">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50/50 text-gray-500 font-medium border-b border-gray-100">
              <tr>
                <th className="px-4 py-3 w-16"></th>
                <th className="px-4 py-3">Prioridad</th>
                <th className="px-4 py-3 min-w-[150px]">Afiliado</th>
                <th className="px-4 py-3 min-w-[200px]">IPS Solicitante</th>
                <th className="px-4 py-3">Caso</th>
                <th className="px-4 py-3 min-w-[150px]">Tipo de caso</th>
                <th className="px-4 py-3">Servicio solicitado</th>
                <th className="px-4 py-3">Bandeja Escala</th>
                <th className="px-4 py-3">Estado</th>
                <th className="px-4 py-3">Fecha</th>
                <th className="px-4 py-3 text-center">Vencimiento</th>
                <th className="px-4 py-3 text-center">Mensajes<br/>Pendiente</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {MOCK_DATA.map((row) => (
                <tr key={row.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2 text-gray-500">
                      <Edit2 className="h-4 w-4 cursor-pointer hover:text-[#00A9A3]" />
                      <Eye className="h-4 w-4 cursor-pointer hover:text-[#00A9A3]" />
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <span className="bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                      {row.prioridad}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-gray-700 font-medium text-xs leading-tight">
                    {row.afiliado}
                  </td>
                  <td className="px-4 py-4 text-gray-500 text-xs leading-tight">
                    {row.ips}
                  </td>
                  <td className="px-4 py-4 text-gray-700 font-medium">
                    {row.id}
                  </td>
                  <td className="px-4 py-4 text-gray-500 text-xs leading-tight">
                    {row.tipo}
                  </td>
                  <td className="px-4 py-4 text-gray-500 text-xs">{row.servicio}</td>
                  <td className="px-4 py-4 text-gray-500 text-xs">{row.bandeja}</td>
                  <td className="px-4 py-4 text-gray-700 text-xs">{row.estado}</td>
                  <td className="px-4 py-4 text-gray-500 text-xs leading-tight whitespace-pre-wrap">
                    {row.fecha.replace(" ", "\n")}
                  </td>
                  <td className="px-4 py-4 text-center">
                    <div className="flex flex-col items-center gap-1">
                      <span className="text-[10px] text-gray-500">{row.vencimiento}</span>
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-center">
                    {row.mensajes && (
                      <MessageCircle className="h-5 w-5 text-emerald-500 mx-auto" />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>

      {/* Modal Interactivo para Crear Caso */}
      <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-[#00A9A3] text-xl">Crear nuevo caso</DialogTitle>
          </DialogHeader>
          <div className="py-6 space-y-3">
            <button 
              onClick={() => setTipoSolicitud("urgencia")}
              className={`w-full flex items-center p-4 rounded-xl border-2 text-left transition-all ${tipoSolicitud === 'urgencia' ? 'border-[#00A9A3] bg-[#00A9A3]/5 shadow-sm' : 'border-gray-100 hover:border-gray-200 hover:bg-gray-50'}`}
            >
              <div className={`p-2 rounded-lg mr-4 ${tipoSolicitud === 'urgencia' ? 'bg-[#00A9A3] text-white shadow-md' : 'bg-gray-100 text-gray-400'}`}>
                <Activity className="h-6 w-6" />
              </div>
              <div>
                <h3 className={`font-bold ${tipoSolicitud === 'urgencia' ? 'text-[#00A9A3]' : 'text-gray-800'}`}>Informe de la Atención de Urgencia</h3>
                <p className="text-xs text-gray-500 mt-1">Registro inicial de atención por urgencias.</p>
              </div>
            </button>
            
            <button 
              onClick={() => setTipoSolicitud("autorizacion")}
              className={`w-full flex items-center p-4 rounded-xl border-2 text-left transition-all ${tipoSolicitud === 'autorizacion' ? 'border-[#00A9A3] bg-[#00A9A3]/5 shadow-sm' : 'border-gray-100 hover:border-gray-200 hover:bg-gray-50'}`}
            >
              <div className={`p-2 rounded-lg mr-4 ${tipoSolicitud === 'autorizacion' ? 'bg-[#00A9A3] text-white shadow-md' : 'bg-gray-100 text-gray-400'}`}>
                <FileText className="h-6 w-6" />
              </div>
              <div>
                <h3 className={`font-bold ${tipoSolicitud === 'autorizacion' ? 'text-[#00A9A3]' : 'text-gray-800'}`}>Solicitud de Autorización</h3>
                <p className="text-xs text-gray-500 mt-1">Solicitud formal de servicios y tecnologías.</p>
              </div>
            </button>

            <button 
              onClick={() => setTipoSolicitud("referencia")}
              className={`w-full flex items-center p-4 rounded-xl border-2 text-left transition-all ${tipoSolicitud === 'referencia' ? 'border-[#00A9A3] bg-[#00A9A3]/5 shadow-sm' : 'border-gray-100 hover:border-gray-200 hover:bg-gray-50'}`}
            >
              <div className={`p-2 rounded-lg mr-4 ${tipoSolicitud === 'referencia' ? 'bg-[#00A9A3] text-white shadow-md' : 'bg-gray-100 text-gray-400'}`}>
                <Share2 className="h-6 w-6" />
              </div>
              <div>
                <h3 className={`font-bold ${tipoSolicitud === 'referencia' ? 'text-[#00A9A3]' : 'text-gray-800'}`}>Referencia de Paciente</h3>
                <p className="text-xs text-gray-500 mt-1">Traslado o remisión a otra institución.</p>
              </div>
            </button>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateModal(false)}>
              Cancelar
            </Button>
            <Button 
              disabled={!tipoSolicitud} 
              onClick={handleCreateCase}
              className="bg-[#00A9A3] hover:bg-[#008f8a] text-white"
            >
              Continuar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
