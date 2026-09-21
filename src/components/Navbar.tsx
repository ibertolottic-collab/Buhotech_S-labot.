import React from 'react';
import {
  FileText,
  GraduationCap,
  Sparkles,
  Layers,
  Printer,
  Key,
  Upload,
  RotateCcw,
  Sliders,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';
import { SilaboData } from '../types';

interface NavbarProps {
  currentTab: 'portada' | 'silabo' | 'pedagogia' | 'mercado' | 'comparativa';
  setCurrentTab: (tab: 'portada' | 'silabo' | 'pedagogia' | 'mercado' | 'comparativa') => void;
  silabo: SilaboData;
  onResetToUSMP: () => void;
  onOpenImportModal: () => void;
  onOpenApiModal: () => void;
  onPrint: () => void;
  horasCoherentes: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  silabo,
  onResetToUSMP,
  onOpenImportModal,
  onOpenApiModal,
  onPrint,
  horasCoherentes,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-2xs no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand */}
          <div
            onClick={() => setCurrentTab('portada')}
            className="flex items-center gap-3 cursor-pointer select-none group"
          >
            <div className="w-10 h-10 rounded-xl bg-white border border-rose-100 p-1 flex items-center justify-center shadow-xs overflow-hidden group-hover:border-rose-300 transition-colors">
              <img
                src="https://lh3.googleusercontent.com/d/1OdufJ5QXGbxxhOjfyvDhfuM2gp-reMgi"
                alt="Logo Buhotech Sílabot"
                className="w-full h-full object-contain"
                referrerPolicy="no-referrer"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-slate-900 text-base sm:text-lg tracking-tight">
                  Buhotech <span className="text-rose-700">Sílabot</span>
                </span>
                <span className="px-2 py-0.5 text-[10px] font-bold bg-rose-100 text-rose-800 rounded-full border border-rose-200">
                  Modelo USMP
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium truncate max-w-[180px] sm:max-w-xs">
                {silabo.datosGenerales.nombreAsignatura}
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="hidden md:flex items-center space-x-1 bg-slate-100/80 p-1 rounded-xl border border-slate-200/70">
            <button
              onClick={() => setCurrentTab('portada')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                currentTab === 'portada'
                  ? 'bg-white text-rose-800 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              <Sliders className="w-3.5 h-3.5 text-rose-600" />
              <span>Portada & Configuración</span>
            </button>

            <button
              onClick={() => setCurrentTab('silabo')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                currentTab === 'silabo'
                  ? 'bg-white text-rose-800 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Sílabo Oficial</span>
            </button>

            <button
              onClick={() => setCurrentTab('pedagogia')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                currentTab === 'pedagogia'
                  ? 'bg-white text-rose-800 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5" />
              <span>Factor Pedagógico</span>
              {!horasCoherentes ? (
                <span className="w-2 h-2 rounded-full bg-amber-500" />
              ) : (
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
              )}
            </button>

            <button
              onClick={() => setCurrentTab('mercado')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                currentTab === 'mercado'
                  ? 'bg-white text-rose-800 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Vigencia Mercado</span>
            </button>

            <button
              onClick={() => setCurrentTab('comparativa')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                currentTab === 'comparativa'
                  ? 'bg-white text-rose-800 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Comparar IAs</span>
            </button>
          </nav>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={onOpenImportModal}
              title="Subir o actualizar sílabo"
              className="p-2 sm:px-3 sm:py-1.5 text-xs font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg border border-slate-200 flex items-center gap-1.5 transition-colors"
            >
              <Upload className="w-4 h-4 text-slate-500" />
              <span className="hidden lg:inline">Subir Sílabo</span>
            </button>

            <button
              onClick={onResetToUSMP}
              title="Restaurar Sílabo Oficial USMP de Ejemplo"
              className="p-2 sm:px-3 sm:py-1.5 text-xs font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg border border-slate-200 flex items-center gap-1.5 transition-colors"
            >
              <RotateCcw className="w-4 h-4 text-slate-500" />
              <span className="hidden xl:inline">Ejemplo USMP</span>
            </button>

            <button
              onClick={onOpenApiModal}
              title="Gestionar API Keys y Arquitectura Cloud"
              className="p-2 sm:px-3 sm:py-1.5 text-xs font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg border border-slate-200 flex items-center gap-1.5 transition-colors"
            >
              <Key className="w-4 h-4 text-rose-600" />
              <span className="hidden sm:inline">Motores IA & Cloud</span>
            </button>

            <button
              onClick={onPrint}
              className="px-3.5 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg flex items-center gap-2 shadow-xs transition-colors"
            >
              <Printer className="w-4 h-4" />
              <span>Imprimir / PDF</span>
            </button>
          </div>
        </div>

        {/* Mobile Tab selector */}
        <div className="flex md:hidden items-center justify-around py-2 border-t border-slate-100 overflow-x-auto gap-1">
          <button
            onClick={() => setCurrentTab('portada')}
            className={`px-2.5 py-1 text-xs font-medium rounded-md whitespace-nowrap ${
              currentTab === 'portada' ? 'bg-rose-100 text-rose-900 font-bold' : 'text-slate-600'
            }`}
          >
            Portada
          </button>
          <button
            onClick={() => setCurrentTab('silabo')}
            className={`px-2.5 py-1 text-xs font-medium rounded-md whitespace-nowrap ${
              currentTab === 'silabo' ? 'bg-rose-100 text-rose-900 font-bold' : 'text-slate-600'
            }`}
          >
            Sílabo Oficial
          </button>
          <button
            onClick={() => setCurrentTab('pedagogia')}
            className={`px-2.5 py-1 text-xs font-medium rounded-md whitespace-nowrap ${
              currentTab === 'pedagogia' ? 'bg-rose-100 text-rose-900 font-bold' : 'text-slate-600'
            }`}
          >
            Pedagogía
          </button>
          <button
            onClick={() => setCurrentTab('mercado')}
            className={`px-2.5 py-1 text-xs font-medium rounded-md whitespace-nowrap ${
              currentTab === 'mercado' ? 'bg-rose-100 text-rose-900 font-bold' : 'text-slate-600'
            }`}
          >
            Mercado
          </button>
          <button
            onClick={() => setCurrentTab('comparativa')}
            className={`px-2.5 py-1 text-xs font-medium rounded-md whitespace-nowrap ${
              currentTab === 'comparativa' ? 'bg-rose-100 text-rose-900 font-bold' : 'text-slate-600'
            }`}
          >
            Comparar IAs
          </button>
        </div>
      </div>
    </header>
  );
};
