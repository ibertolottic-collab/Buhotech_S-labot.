import React from 'react';
import { Building2, Upload } from 'lucide-react';
import { SilaboData } from '../types';

interface Props {
  institucion: SilaboData['institucion'];
  onUpdateInstitucion?: (update: Partial<SilaboData['institucion']>) => void;
  editable?: boolean;
}

export const UniversityHeader: React.FC<Props> = ({
  institucion,
  onUpdateInstitucion,
  editable = false,
}) => {
  const isUsmp = institucion.logoTipo === 'usmp';

  return (
    <div className="w-full flex flex-col md:flex-row items-center justify-between pb-6 border-b border-slate-300 gap-4">
      {/* Logo y Nombre Institucional */}
      <div className="flex items-center gap-4">
        {isUsmp ? (
          <div className="flex items-center gap-3.5 select-none">
            {/* Escudo Heráldico USMP */}
            <div className="w-16 h-20 relative flex-shrink-0 flex items-center justify-center">
              <svg viewBox="0 0 100 120" className="w-full h-full drop-shadow-xs">
                {/* Contorno Escudo */}
                <path
                  d="M10 10 H90 V70 C90 95 50 115 50 115 C50 115 10 95 10 70 Z"
                  fill="#991B1B"
                  stroke="#7F1D1D"
                  strokeWidth="3"
                />
                {/* Cruz central blanca y estrella */}
                <path
                  d="M44 20 H56 V100 H44 Z M20 44 H80 V56 H20 Z"
                  fill="#FFFFFF"
                />
                <circle cx="50" cy="50" r="14" fill="#991B1B" />
                <path
                  d="M50 39 L53 47 L61 47 L55 52 L57 60 L50 55 L43 60 L45 52 L39 47 L47 47 Z"
                  fill="#FBBF24"
                />
                {/* Lema en borde */}
                <text
                  x="15"
                  y="18"
                  fontSize="7"
                  fill="#FFFFFF"
                  fontWeight="bold"
                  transform="rotate(-90 15,20)"
                >
                  VERITAS
                </text>
                <text
                  x="82"
                  y="18"
                  fontSize="7"
                  fill="#FFFFFF"
                  fontWeight="bold"
                  transform="rotate(90 82,18)"
                >
                  LIBERABIT VOS
                </text>
              </svg>
            </div>

            {/* Texto Oficial USMP */}
            <div className="flex flex-col">
              <div className="text-2xl font-black tracking-wider text-[#991B1B] leading-none">
                USMP
              </div>
              <div className="text-[9px] font-semibold tracking-widest text-[#7F1D1D] uppercase mt-1 leading-tight">
                Universidad de<br />San Martín de Porres
              </div>
            </div>

            {/* Divisor vertical */}
            <div className="h-14 w-[1.5px] bg-[#991B1B]/40 mx-2 hidden sm:block" />

            {/* Instituto / Facultad */}
            <div className="max-w-[210px] text-xs font-serif text-[#991B1B] font-semibold leading-tight hidden sm:block">
              {institucion.institutoOFacultad}
            </div>
          </div>
        ) : institucion.customLogoUrl ? (
          <div className="flex items-center gap-3">
            <img
              src={institucion.customLogoUrl}
              alt="Logo Institucional"
              style={{
                height:
                  institucion.logoAjuste?.modo === 'manual' && institucion.logoAjuste?.alturaPx
                    ? `${institucion.logoAjuste.alturaPx}px`
                    : '64px',
                filter: institucion.logoAjuste?.escalaGrises ? 'grayscale(100%)' : 'none',
              }}
              className="w-auto object-contain max-w-[180px] transition-all"
            />
            <div className="flex flex-col">
              <span className="font-bold text-slate-800 text-lg leading-tight">
                {institucion.nombreUniversidad}
              </span>
              <span className="text-xs text-slate-600 font-medium">
                {institucion.institutoOFacultad}
              </span>
              {institucion.departamentoAcademico && (
                <span className="text-[11px] text-slate-500">
                  {institucion.departamentoAcademico}
                </span>
              )}
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-lg bg-slate-100 border border-slate-300 flex items-center justify-center text-slate-500">
              <Building2 className="w-8 h-8" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-slate-800 text-base">
                {institucion.nombreUniversidad}
              </span>
              <span className="text-xs text-slate-600">
                {institucion.institutoOFacultad}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Controles de Institución (si es editable) */}
      {editable && onUpdateInstitucion && (
        <div className="flex items-center gap-2 no-print">
          <button
            type="button"
            onClick={() =>
              onUpdateInstitucion({
                logoTipo: isUsmp ? 'custom' : 'usmp',
                nombreUniversidad: isUsmp
                  ? 'Universidad Nacional Mayor de San Marcos'
                  : 'Universidad de San Martín de Porres',
                institutoOFacultad: isUsmp
                  ? 'Facultad de Educación'
                  : 'Instituto para la Calidad de la Educación',
              })
            }
            className="text-xs px-2.5 py-1.5 rounded-md border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-medium transition-colors shadow-2xs flex items-center gap-1.5"
          >
            {isUsmp ? 'Cambiar a Logo Personalizado' : 'Restaurar Logo Oficial USMP'}
          </button>
        </div>
      )}
    </div>
  );
};
