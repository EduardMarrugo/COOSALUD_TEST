"use client"

import Link from "next/link"
import { FileText, ClipboardList, ShieldAlert, ArrowRight } from "lucide-react"

export default function Dashboard() {
  const prototypes = [
    {
      title: "Bandeja de Casos",
      description: "Visualización, filtrado y gestión general de todas las solicitudes de referencia y urgencias.",
      icon: <ClipboardList className="h-7 w-7 text-white" />,
      href: "/bandeja",
      gradient: "from-emerald-500 to-emerald-600",
      shadow: "shadow-emerald-500/30",
      status: "Activo"
    },
    {
      title: "Autorización de Servicios",
      description: "Formulario avanzado para la solicitud de autorización de servicios y tecnologías en salud o urgencias.",
      icon: <FileText className="h-7 w-7 text-white" />,
      href: "/autorizacion",
      gradient: "from-[#00A9A3] to-[#008f8a]",
      shadow: "shadow-[#00A9A3]/30",
      status: "Activo"
    },
    {
      title: "Auditoría Médica",
      description: "Revisión automatizada y validación de cuentas médicas y pertinencia de servicios prestados.",
      icon: <ClipboardList className="h-7 w-7 text-white" />,
      href: "#",
      gradient: "from-blue-500 to-blue-600",
      shadow: "shadow-blue-500/30",
      status: "Próximamente"
    },
    {
      title: "Gestión de Riesgos",
      description: "Módulo analítico para la identificación, evaluación y mitigación proactiva de riesgos en salud.",
      icon: <ShieldAlert className="h-7 w-7 text-white" />,
      href: "#",
      gradient: "from-amber-400 to-amber-500",
      shadow: "shadow-amber-500/30",
      status: "Próximamente"
    }
  ]

  return (
    <div className="max-w-7xl mx-auto py-8">
      <div className="mb-10 text-center md:text-left">
        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight mb-3">
          Dashboard de <span className="text-[#00A9A3]">Prototipos</span>
        </h1>
        <p className="text-gray-500 text-lg max-w-2xl">
          Bienvenido al entorno de pruebas. Selecciona un módulo para comenzar a interactuar con la nueva experiencia de usuario.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {prototypes.map((proto, index) => (
          <Link 
            key={index} 
            href={proto.href}
            className={`group relative flex flex-col bg-white rounded-2xl p-6 transition-all duration-300 ${
              proto.status === 'Activo' 
                ? 'hover:-translate-y-2 hover:shadow-2xl hover:shadow-gray-200/50 border border-gray-100 shadow-xl shadow-gray-100/50' 
                : 'border border-gray-200 opacity-70 cursor-not-allowed grayscale-[30%]'
            }`}
            onClick={(e) => proto.status !== 'Activo' && e.preventDefault()}
          >
            {/* Top Row: Icon & Status */}
            <div className="flex items-start justify-between mb-6">
              <div className={`p-4 rounded-2xl bg-gradient-to-br ${proto.gradient} shadow-lg ${proto.shadow} transform group-hover:scale-110 transition-transform duration-300`}>
                {proto.icon}
              </div>
              <div>
                {proto.status === "Activo" ? (
                  <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 text-xs font-bold px-3 py-1.5 rounded-full border border-emerald-100">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    {proto.status}
                  </span>
                ) : (
                  <span className="bg-gray-100 text-gray-500 text-xs font-bold px-3 py-1.5 rounded-full border border-gray-200">
                    {proto.status}
                  </span>
                )}
              </div>
            </div>
            
            {/* Content */}
            <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-[#00A9A3] transition-colors">{proto.title}</h3>
            <p className="text-gray-500 text-sm leading-relaxed mb-8 flex-grow">
              {proto.description}
            </p>
            
            {/* Footer */}
            <div className={`mt-auto flex items-center justify-between text-sm font-bold pt-4 border-t border-gray-50 transition-colors ${proto.status === 'Activo' ? 'text-[#00A9A3]' : 'text-gray-400'}`}>
              {proto.status === 'Activo' ? (
                <>
                  <span>Ingresar al módulo</span>
                  <div className="w-8 h-8 rounded-full bg-[#00A9A3]/10 flex items-center justify-center group-hover:bg-[#00A9A3] group-hover:text-white transition-all">
                    <ArrowRight className="h-4 w-4 transform group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </>
              ) : (
                <span>En desarrollo</span>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
