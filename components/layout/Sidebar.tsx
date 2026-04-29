"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, FileText, Menu, X } from "lucide-react"

export function Sidebar() {
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const navItems = [
    {
      title: "Dashboard",
      subtitle: "Panel Principal",
      href: "/",
      icon: <Home className="h-6 w-6" />,
    },
    {
      title: "Bandeja de Casos",
      subtitle: "Gestión de Solicitudes",
      href: "/bandeja",
      icon: <FileText className="h-6 w-6" />,
    },
    {
      title: "Autorización de Servicios",
      subtitle: "Formulario de Autorización",
      href: "/autorizacion",
      icon: <FileText className="h-6 w-6" />,
    },
  ]

  return (
    <>
      {/* Mobile Menu Toggle */}
      <div className="md:hidden flex items-center justify-between p-4 bg-white border-b border-gray-200">
        <span className="font-bold text-[#00A9A3]">COOSALUD TEST</span>
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="text-gray-500 hover:text-[#00A9A3] focus:outline-none"
        >
          {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Sidebar Content */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out
        md:translate-x-0 md:static md:inset-auto md:flex md:w-72 md:flex-col
        ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}
      `}>
        <div className="flex flex-col h-full">
          {/* Logo / Brand */}
          <div className="hidden md:flex items-center justify-center h-16 border-b border-gray-200">
            <h1 className="text-xl font-bold text-[#00A9A3] tracking-wide">COOSALUD</h1>
          </div>

          {/* Navigation Items */}
          <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
            <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4 px-2">Navegación</h2>
            {navItems.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link 
                  key={item.href} 
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-start p-3 mb-2 rounded-xl transition-all duration-200 border border-transparent ${
                    isActive 
                      ? 'bg-[#00A9A3]/10 border-[#00A9A3]/20 shadow-sm' 
                      : 'hover:bg-gray-50 hover:border-gray-200'
                  }`}
                >
                  <div className={`mt-0.5 flex-shrink-0 ${isActive ? 'text-[#00A9A3]' : 'text-gray-400'}`}>
                    {item.icon}
                  </div>
                  <div className="ml-3 flex flex-col">
                    <span className={`font-bold text-sm leading-tight ${isActive ? 'text-[#00A9A3]' : 'text-gray-700'}`}>
                      {item.title}
                    </span>
                    <span className="text-xs text-gray-500 mt-1 leading-snug">
                      {item.subtitle}
                    </span>
                  </div>
                </Link>
              )
            })}
          </nav>
          
          {/* User Profile / Bottom */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center">
              <div className="h-8 w-8 rounded-full bg-[#00A9A3]/20 flex items-center justify-center text-[#00A9A3] font-bold text-sm">
                US
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-700">Usuario Sistema</p>
                <p className="text-xs text-gray-500">Administrador</p>
              </div>
            </div>
          </div>
        </div>
      </aside>
      
      {/* Overlay for mobile */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/20 z-40 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  )
}
