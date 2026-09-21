import React, { useState } from 'react';
import {
  Edit3,
  Check,
  Plus,
  Trash2,
  Sparkles,
  Calculator,
  BookOpen,
  HelpCircle,
  ExternalLink,
} from 'lucide-react';
import { SilaboData, UnidadAprendizaje, FuenteBibliografica, FuenteElectronica } from '../types';
import { UniversityHeader } from './UniversityHeader';
import { calcularTotalesHoras } from '../utils/hoursAndCredits';

interface Props {
  silabo: SilaboData;
  onChangeSilabo: (updated: SilaboData) => void;
  onTriggerAIAction?: (sectionKey: string, promptInstruction: string) => void;
  isAiLoading?: boolean;
}

export const OfficialSyllabusView: React.FC<Props> = ({
  silabo,
  onChangeSilabo,
  onTriggerAIAction,
  isAiLoading = false,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const totalesHoras = calcularTotalesHoras(silabo.datosGenerales.horas);

  // Quick field updater
  const updateGeneral = (field: string, value: any) => {
    onChangeSilabo({
      ...silabo,
      datosGenerales: {
        ...silabo.datosGenerales,
        [field]: value,
      },
    });
  };

  const updateHoras = (field: string, val: number) => {
    const newHoras = {
      ...silabo.datosGenerales.horas,
      [field]: val,
    };
    onChangeSilabo({
      ...silabo,
      datosGenerales: {
        ...silabo.datosGenerales,
        horas: newHoras,
      },
    });
  };

  const updateCreditos = (field: string, val: number) => {
    const current = silabo.datosGenerales.creditos;
    const next = { ...current, [field]: val };
    if (field === 'teoria' || field === 'practica') {
      next.total = next.teoria + next.practica;
    }
    onChangeSilabo({
      ...silabo,
      datosGenerales: {
        ...silabo.datosGenerales,
        creditos: next,
      },
    });
  };

  return (
    <div className="w-full max-w-5xl mx-auto my-6 px-4 sm:px-6">
      {/* Top Banner Toolbar */}
      <div className="flex flex-wrap items-center justify-between bg-white border border-slate-200 rounded-xl p-3.5 mb-6 shadow-2xs no-print">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-700">Modo de Visualización:</span>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              isEditing
                ? 'bg-rose-600 text-white shadow-2xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            {isEditing ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Guardar y Ver Oficial</span>
              </>
            ) : (
              <>
                <Edit3 className="w-3.5 h-3.5" />
                <span>Editar Contenido Directamente</span>
              </>
            )}
          </button>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-500">
          <span className="inline-flex items-center gap-1 font-medium text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Estructura Modelo Oficial USMP
          </span>
          <span className="text-slate-400">|</span>
          <span>{totalesHoras.totalHoras} Horas Totales</span>
          <span className="text-slate-400">|</span>
          <span>{silabo.datosGenerales.creditos.total} Créditos</span>
        </div>
      </div>

      {/* DOCUMENT CANVAS (A4-Style Sheet) */}
      <div
        id="official-syllabus-document"
        className="bg-white border border-slate-300 shadow-sm p-8 sm:p-12 text-slate-900 font-sans print:border-none print:shadow-none print:p-0 print:m-0"
      >
        {/* Header Universitario y Logo Oficial */}
        <UniversityHeader
          institucion={silabo.institucion}
          onUpdateInstitucion={(update) =>
            onChangeSilabo({
              ...silabo,
              institucion: { ...silabo.institucion, ...update },
            })
          }
          editable={isEditing}
        />

        {/* Título Oficial del Documento */}
        <div className="text-center my-8">
          <h1 className="text-xl sm:text-2xl font-bold tracking-widest uppercase text-slate-900 mb-1 font-serif">
            SÍLABO
          </h1>
          {isEditing ? (
            <input
              type="text"
              value={silabo.datosGenerales.nombreAsignatura}
              onChange={(e) => updateGeneral('nombreAsignatura', e.target.value.toUpperCase())}
              className="text-lg sm:text-xl font-black text-center text-slate-900 border-b-2 border-rose-500 focus:outline-hidden w-full max-w-md uppercase tracking-wider"
              placeholder="NOMBRE DE LA ASIGNATURA"
            />
          ) : (
            <h2 className="text-lg sm:text-xl font-black tracking-wider uppercase text-slate-900">
              {silabo.datosGenerales.nombreAsignatura}
            </h2>
          )}
        </div>

        {/* SECCIÓN I: DATOS GENERALES */}
        <section className="mb-10">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-base uppercase tracking-wide text-slate-900 font-serif">
              I. DATOS GENERALES:
            </h3>
            {isEditing && (
              <span className="text-xs text-rose-700 italic no-print">
                Edite las casillas o modifique los valores numéricos
              </span>
            )}
          </div>

          <div className="border border-slate-900 text-sm">
            {/* Departamento Académico */}
            <div className="grid grid-cols-1 md:grid-cols-12 border-b border-slate-900">
              <div className="md:col-span-4 p-2.5 font-bold bg-slate-50 border-r border-slate-900">
                Departamento Académico
              </div>
              <div className="md:col-span-8 p-2.5">
                {isEditing ? (
                  <input
                    type="text"
                    value={silabo.institucion.departamentoAcademico}
                    onChange={(e) =>
                      onChangeSilabo({
                        ...silabo,
                        institucion: { ...silabo.institucion, departamentoAcademico: e.target.value },
                      })
                    }
                    className="w-full border border-slate-300 rounded px-2 py-1 text-sm"
                  />
                ) : (
                  silabo.institucion.departamentoAcademico
                )}
              </div>
            </div>

            {/* Programa Académico */}
            <div className="grid grid-cols-1 md:grid-cols-12 border-b border-slate-900">
              <div className="md:col-span-4 p-2.5 font-bold bg-slate-50 border-r border-slate-900">
                Programa académico
              </div>
              <div className="md:col-span-8 p-2.5">
                {isEditing ? (
                  <input
                    type="text"
                    value={silabo.datosGenerales.programaAcademico}
                    onChange={(e) => updateGeneral('programaAcademico', e.target.value)}
                    className="w-full border border-slate-300 rounded px-2 py-1 text-sm"
                  />
                ) : (
                  silabo.datosGenerales.programaAcademico
                )}
              </div>
            </div>

            {/* Semestre Académico */}
            <div className="grid grid-cols-1 md:grid-cols-12 border-b border-slate-900">
              <div className="md:col-span-4 p-2.5 font-bold bg-slate-50 border-r border-slate-900">
                Semestre Académico
              </div>
              <div className="md:col-span-8 p-2.5">
                {isEditing ? (
                  <input
                    type="text"
                    value={silabo.datosGenerales.semestreAcademico}
                    onChange={(e) => updateGeneral('semestreAcademico', e.target.value)}
                    className="w-48 border border-slate-300 rounded px-2 py-1 text-sm"
                  />
                ) : (
                  silabo.datosGenerales.semestreAcademico
                )}
              </div>
            </div>

            {/* Tipo de asignatura */}
            <div className="grid grid-cols-1 md:grid-cols-12 border-b border-slate-900">
              <div className="md:col-span-4 p-2.5 font-bold bg-slate-50 border-r border-slate-900">
                Tipo de asignatura
              </div>
              <div className="md:col-span-8 p-2.5 flex flex-wrap gap-4 items-center">
                {(['General', 'Específica', 'Especialidad'] as const).map((tipo) => (
                  <label
                    key={tipo}
                    className={`flex items-center gap-1.5 cursor-pointer ${
                      silabo.datosGenerales.tipoAsignatura === tipo ? 'font-bold text-slate-900' : 'text-slate-600'
                    }`}
                  >
                    <span>{tipo}</span>
                    <span className="font-mono text-sm">
                      ({silabo.datosGenerales.tipoAsignatura === tipo ? ' x ' : ' -- '})
                    </span>
                    {isEditing && (
                      <input
                        type="radio"
                        name="tipoAsignatura"
                        checked={silabo.datosGenerales.tipoAsignatura === tipo}
                        onChange={() => updateGeneral('tipoAsignatura', tipo)}
                        className="ml-1"
                      />
                    )}
                  </label>
                ))}
              </div>
            </div>

            {/* Modalidad de la asignatura */}
            <div className="grid grid-cols-1 md:grid-cols-12 border-b border-slate-900">
              <div className="md:col-span-4 p-2.5 font-bold bg-slate-50 border-r border-slate-900">
                Modalidad de la asignatura
              </div>
              <div className="md:col-span-8 p-2.5 flex flex-wrap gap-4 items-center">
                {(['Presencial', 'Semipresencial', 'A distancia'] as const).map((mod) => (
                  <label
                    key={mod}
                    className={`flex items-center gap-1.5 cursor-pointer ${
                      silabo.datosGenerales.modalidad === mod ? 'font-bold text-slate-900' : 'text-slate-600'
                    }`}
                  >
                    <span>{mod}</span>
                    <span className="font-mono text-sm">
                      ({silabo.datosGenerales.modalidad === mod ? ' x ' : ' -- '})
                    </span>
                    {isEditing && (
                      <input
                        type="radio"
                        name="modalidadAsignatura"
                        checked={silabo.datosGenerales.modalidad === mod}
                        onChange={() => updateGeneral('modalidad', mod)}
                        className="ml-1"
                      />
                    )}
                  </label>
                ))}
              </div>
            </div>

            {/* Código de la asignatura */}
            <div className="grid grid-cols-1 md:grid-cols-12 border-b border-slate-900">
              <div className="md:col-span-4 p-2.5 font-bold bg-slate-50 border-r border-slate-900">
                Código de la asignatura
              </div>
              <div className="md:col-span-8 p-2.5 font-mono">
                {isEditing ? (
                  <input
                    type="text"
                    value={silabo.datosGenerales.codigoAsignatura}
                    onChange={(e) => updateGeneral('codigoAsignatura', e.target.value)}
                    className="w-48 border border-slate-300 rounded px-2 py-1 text-sm font-mono"
                  />
                ) : (
                  silabo.datosGenerales.codigoAsignatura
                )}
              </div>
            </div>

            {/* Ciclo */}
            <div className="grid grid-cols-1 md:grid-cols-12 border-b border-slate-900">
              <div className="md:col-span-4 p-2.5 font-bold bg-slate-50 border-r border-slate-900">
                Ciclo
              </div>
              <div className="md:col-span-8 p-2.5">
                {isEditing ? (
                  <input
                    type="text"
                    value={silabo.datosGenerales.ciclo}
                    onChange={(e) => updateGeneral('ciclo', e.target.value)}
                    className="w-32 border border-slate-300 rounded px-2 py-1 text-sm"
                  />
                ) : (
                  silabo.datosGenerales.ciclo
                )}
              </div>
            </div>

            {/* Requisitos */}
            <div className="grid grid-cols-1 md:grid-cols-12 border-b border-slate-900">
              <div className="md:col-span-4 p-2.5 font-bold bg-slate-50 border-r border-slate-900">
                Requisitos
              </div>
              <div className="md:col-span-8 p-2.5">
                {isEditing ? (
                  <input
                    type="text"
                    value={silabo.datosGenerales.requisitos}
                    onChange={(e) => updateGeneral('requisitos', e.target.value)}
                    className="w-full border border-slate-300 rounded px-2 py-1 text-sm"
                  />
                ) : (
                  silabo.datosGenerales.requisitos
                )}
              </div>
            </div>

            {/* Cantidad de horas (Desglose exacto USMP) */}
            <div className="grid grid-cols-1 md:grid-cols-12 border-b border-slate-900">
              <div className="md:col-span-4 p-2.5 font-bold bg-slate-50 border-r border-slate-900 flex flex-col justify-between">
                <span>Cantidad de horas</span>
                <span className="text-[11px] font-normal text-slate-500 mt-2">
                  (Cálculo automático de totales lectivos y no lectivos)
                </span>
              </div>
              <div className="md:col-span-8 p-2.5 space-y-1.5 text-xs sm:text-sm">
                <div className="font-semibold text-slate-900 pb-1 border-b border-slate-200">
                  Teoría ( {totalesHoras.totalTeoria} ) Práctica ( {totalesHoras.totalPractica} ) Total horas ( {totalesHoras.totalHoras} )
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 text-slate-700 pt-1">
                  <div className="flex justify-between items-center py-0.5">
                    <span>Teoría lectiva presencial</span>
                    {isEditing ? (
                      <input
                        type="number"
                        min="0"
                        value={silabo.datosGenerales.horas.teoriaLectivaPresencial}
                        onChange={(e) => updateHoras('teoriaLectivaPresencial', parseInt(e.target.value) || 0)}
                        className="w-16 border rounded px-1 text-right text-xs"
                      />
                    ) : (
                      <span className="font-mono">
                        ( {silabo.datosGenerales.horas.teoriaLectivaPresencial > 0 ? String(silabo.datosGenerales.horas.teoriaLectivaPresencial).padStart(2, '0') : '--'} )
                      </span>
                    )}
                  </div>

                  <div className="flex justify-between items-center py-0.5">
                    <span>Teoría lectiva a distancia</span>
                    {isEditing ? (
                      <input
                        type="number"
                        min="0"
                        value={silabo.datosGenerales.horas.teoriaLectivaDistancia}
                        onChange={(e) => updateHoras('teoriaLectivaDistancia', parseInt(e.target.value) || 0)}
                        className="w-16 border rounded px-1 text-right text-xs"
                      />
                    ) : (
                      <span className="font-mono">
                        ( {silabo.datosGenerales.horas.teoriaLectivaDistancia > 0 ? String(silabo.datosGenerales.horas.teoriaLectivaDistancia).padStart(2, '0') : '--'} )
                      </span>
                    )}
                  </div>

                  <div className="flex justify-between items-center py-0.5">
                    <span>Teoría no lectiva presencial</span>
                    {isEditing ? (
                      <input
                        type="number"
                        min="0"
                        value={silabo.datosGenerales.horas.teoriaNoLectivaPresencial}
                        onChange={(e) => updateHoras('teoriaNoLectivaPresencial', parseInt(e.target.value) || 0)}
                        className="w-16 border rounded px-1 text-right text-xs"
                      />
                    ) : (
                      <span className="font-mono">
                        ( {silabo.datosGenerales.horas.teoriaNoLectivaPresencial > 0 ? String(silabo.datosGenerales.horas.teoriaNoLectivaPresencial).padStart(2, '0') : '--'} )
                      </span>
                    )}
                  </div>

                  <div className="flex justify-between items-center py-0.5">
                    <span>Teoría no lectiva a distancia</span>
                    {isEditing ? (
                      <input
                        type="number"
                        min="0"
                        value={silabo.datosGenerales.horas.teoriaNoLectivaDistancia}
                        onChange={(e) => updateHoras('teoriaNoLectivaDistancia', parseInt(e.target.value) || 0)}
                        className="w-16 border rounded px-1 text-right text-xs"
                      />
                    ) : (
                      <span className="font-mono">
                        ( {silabo.datosGenerales.horas.teoriaNoLectivaDistancia > 0 ? String(silabo.datosGenerales.horas.teoriaNoLectivaDistancia).padStart(2, '0') : '--'} )
                      </span>
                    )}
                  </div>

                  <div className="flex justify-between items-center py-0.5">
                    <span>Práctica lectiva presencial</span>
                    {isEditing ? (
                      <input
                        type="number"
                        min="0"
                        value={silabo.datosGenerales.horas.practicaLectivaPresencial}
                        onChange={(e) => updateHoras('practicaLectivaPresencial', parseInt(e.target.value) || 0)}
                        className="w-16 border rounded px-1 text-right text-xs"
                      />
                    ) : (
                      <span className="font-mono">
                        ( {silabo.datosGenerales.horas.practicaLectivaPresencial > 0 ? String(silabo.datosGenerales.horas.practicaLectivaPresencial).padStart(2, '0') : '--'} )
                      </span>
                    )}
                  </div>

                  <div className="flex justify-between items-center py-0.5">
                    <span>Práctica lectiva a distancia</span>
                    {isEditing ? (
                      <input
                        type="number"
                        min="0"
                        value={silabo.datosGenerales.horas.practicaLectivaDistancia}
                        onChange={(e) => updateHoras('practicaLectivaDistancia', parseInt(e.target.value) || 0)}
                        className="w-16 border rounded px-1 text-right text-xs"
                      />
                    ) : (
                      <span className="font-mono">
                        ( {silabo.datosGenerales.horas.practicaLectivaDistancia > 0 ? String(silabo.datosGenerales.horas.practicaLectivaDistancia).padStart(2, '0') : '--'} )
                      </span>
                    )}
                  </div>

                  <div className="flex justify-between items-center py-0.5">
                    <span>Práctica no lectiva presencial</span>
                    {isEditing ? (
                      <input
                        type="number"
                        min="0"
                        value={silabo.datosGenerales.horas.practicaNoLectivaPresencial}
                        onChange={(e) => updateHoras('practicaNoLectivaPresencial', parseInt(e.target.value) || 0)}
                        className="w-16 border rounded px-1 text-right text-xs"
                      />
                    ) : (
                      <span className="font-mono">
                        ( {silabo.datosGenerales.horas.practicaNoLectivaPresencial > 0 ? String(silabo.datosGenerales.horas.practicaNoLectivaPresencial).padStart(2, '0') : '--'} )
                      </span>
                    )}
                  </div>

                  <div className="flex justify-between items-center py-0.5">
                    <span>Práctica no lectiva a distancia</span>
                    {isEditing ? (
                      <input
                        type="number"
                        min="0"
                        value={silabo.datosGenerales.horas.practicaNoLectivaDistancia}
                        onChange={(e) => updateHoras('practicaNoLectivaDistancia', parseInt(e.target.value) || 0)}
                        className="w-16 border rounded px-1 text-right text-xs"
                      />
                    ) : (
                      <span className="font-mono">
                        ( {silabo.datosGenerales.horas.practicaNoLectivaDistancia > 0 ? String(silabo.datosGenerales.horas.practicaNoLectivaDistancia).padStart(2, '0') : '--'} )
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Cantidad de Créditos */}
            <div className="grid grid-cols-1 md:grid-cols-12 border-b border-slate-900">
              <div className="md:col-span-4 p-2.5 font-bold bg-slate-50 border-r border-slate-900">
                Cantidad de Créditos
              </div>
              <div className="md:col-span-8 p-2.5 flex items-center gap-4">
                {isEditing ? (
                  <div className="flex items-center gap-3">
                    <label className="flex items-center gap-1">
                      <span>Teoría:</span>
                      <input
                        type="number"
                        min="0"
                        value={silabo.datosGenerales.creditos.teoria}
                        onChange={(e) => updateCreditos('teoria', parseInt(e.target.value) || 0)}
                        className="w-14 border rounded px-1 text-sm"
                      />
                    </label>
                    <label className="flex items-center gap-1">
                      <span>Práctica:</span>
                      <input
                        type="number"
                        min="0"
                        value={silabo.datosGenerales.creditos.practica}
                        onChange={(e) => updateCreditos('practica', parseInt(e.target.value) || 0)}
                        className="w-14 border rounded px-1 text-sm"
                      />
                    </label>
                    <span className="font-bold text-slate-800">
                      Total créditos ( {silabo.datosGenerales.creditos.total} )
                    </span>
                  </div>
                ) : (
                  <div>
                    Teoría ( {silabo.datosGenerales.creditos.teoria} ) Práctica ( {silabo.datosGenerales.creditos.practica} ) Total créditos ( {silabo.datosGenerales.creditos.total} )
                  </div>
                )}
              </div>
            </div>

            {/* Docentes */}
            <div className="grid grid-cols-1 md:grid-cols-12">
              <div className="md:col-span-4 p-2.5 font-bold bg-slate-50 border-r border-slate-900">
                Docente(s)
              </div>
              <div className="md:col-span-8 p-2.5 space-y-1">
                {silabo.datosGenerales.docentes.map((doc, idx) => (
                  <div key={doc.id || idx} className="flex items-center justify-between">
                    {isEditing ? (
                      <div className="flex items-center gap-2 w-full">
                        <input
                          type="text"
                          value={doc.grado}
                          onChange={(e) => {
                            const newDocs = [...silabo.datosGenerales.docentes];
                            newDocs[idx].grado = e.target.value;
                            updateGeneral('docentes', newDocs);
                          }}
                          className="w-16 border rounded px-1 py-0.5 text-xs font-mono"
                          placeholder="Grado"
                        />
                        <input
                          type="text"
                          value={doc.nombre}
                          onChange={(e) => {
                            const newDocs = [...silabo.datosGenerales.docentes];
                            newDocs[idx].nombre = e.target.value;
                            updateGeneral('docentes', newDocs);
                          }}
                          className="flex-1 border rounded px-1.5 py-0.5 text-xs"
                          placeholder="Nombre del Docente"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const newDocs = silabo.datosGenerales.docentes.filter((_, i) => i !== idx);
                            updateGeneral('docentes', newDocs);
                          }}
                          className="text-red-500 hover:text-red-700 p-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <span className="block font-medium">
                        {doc.grado} {doc.nombre}
                      </span>
                    )}
                  </div>
                ))}
                {isEditing && (
                  <button
                    type="button"
                    onClick={() => {
                      const newDocs = [
                        ...silabo.datosGenerales.docentes,
                        { id: `doc-${Date.now()}`, grado: 'Mg.', nombre: 'Nuevo Docente' },
                      ];
                      updateGeneral('docentes', newDocs);
                    }}
                    className="text-xs text-rose-700 hover:underline flex items-center gap-1 mt-2"
                  >
                    <Plus className="w-3.5 h-3.5" /> Agregar Docente
                  </button>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* SECCIÓN II: SUMILLA */}
        <section className="mb-10">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-base uppercase tracking-wide text-slate-900 font-serif">
              II. SUMILLA
            </h3>
            {onTriggerAIAction && (
              <button
                type="button"
                onClick={() =>
                  onTriggerAIAction(
                    'sumilla',
                    'Optimiza y redacta la sumilla universitaria formalmente para esta asignatura, garantizando área de formación, naturaleza teórica/práctica, propósito y desglose de 4 unidades.'
                  )
                }
                disabled={isAiLoading}
                className="text-xs text-rose-700 hover:text-rose-900 font-medium flex items-center gap-1 no-print"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Optimizar Sumilla con IA</span>
              </button>
            )}
          </div>

          <div className="space-y-4 text-justify text-sm leading-relaxed text-slate-800">
            {isEditing ? (
              <textarea
                rows={4}
                value={silabo.sumilla.texto}
                onChange={(e) =>
                  onChangeSilabo({
                    ...silabo,
                    sumilla: { ...silabo.sumilla, texto: e.target.value },
                  })
                }
                className="w-full border border-slate-300 rounded p-2.5 text-sm"
              />
            ) : (
              <p>{silabo.sumilla.texto}</p>
            )}

            <div>
              <p className="font-medium mb-1.5">La asignatura desarrolla las siguientes unidades de aprendizaje:</p>
              <ul className="list-disc list-inside space-y-1 pl-2">
                {silabo.sumilla.unidades.map((unid, idx) => (
                  <li key={idx}>
                    {isEditing ? (
                      <input
                        type="text"
                        value={unid}
                        onChange={(e) => {
                          const newUnids = [...silabo.sumilla.unidades];
                          newUnids[idx] = e.target.value;
                          onChangeSilabo({
                            ...silabo,
                            sumilla: { ...silabo.sumilla, unidades: newUnids },
                          });
                        }}
                        className="border border-slate-300 rounded px-1.5 py-0.5 text-sm w-3/4 inline-block ml-1"
                      />
                    ) : (
                      <span>{unid}</span>
                    )}
                  </li>
                ))}
              </ul>
            </div>

            {isEditing ? (
              <div className="mt-2">
                <label className="text-xs font-semibold text-slate-600 block mb-1">
                  Exigencias del estudiante:
                </label>
                <input
                  type="text"
                  value={silabo.sumilla.exigencias}
                  onChange={(e) =>
                    onChangeSilabo({
                      ...silabo,
                      sumilla: { ...silabo.sumilla, exigencias: e.target.value },
                    })
                  }
                  className="w-full border border-slate-300 rounded px-2 py-1 text-sm"
                />
              </div>
            ) : (
              <p className="mt-2">{silabo.sumilla.exigencias}</p>
            )}
          </div>
        </section>

        {/* SECCIÓN III: COMPETENCIAS Y COMPONENTES */}
        <section className="mb-10">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-base uppercase tracking-wide text-slate-900 font-serif">
              III. COMPETENCIAS Y SUS COMPONENTES COMPRENDIDOS EN LA ASIGNATURA
            </h3>
            {onTriggerAIAction && (
              <button
                type="button"
                onClick={() =>
                  onTriggerAIAction(
                    'competencias',
                    'Armoniza las competencias con Taxonomía de Bloom revisada (verbos de acción observables y medibles), articulando la competencia general, 4 competencias específicas, 4 capacidades y contenidos actitudinales.'
                  )
                }
                disabled={isAiLoading}
                className="text-xs text-rose-700 hover:text-rose-900 font-medium flex items-center gap-1 no-print"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Auditar Verbos Bloom con IA</span>
              </button>
            )}
          </div>

          <div className="space-y-6 text-sm text-slate-800">
            {/* 3.1 Competencias */}
            <div>
              <h4 className="font-bold text-slate-900 mb-2">3.1. Competencias:</h4>

              <div className="mb-4">
                <span className="font-bold block text-slate-900 mb-1">Competencia General</span>
                {isEditing ? (
                  <textarea
                    rows={2}
                    value={silabo.competencias.general}
                    onChange={(e) =>
                      onChangeSilabo({
                        ...silabo,
                        competencias: { ...silabo.competencias, general: e.target.value },
                      })
                    }
                    className="w-full border border-slate-300 rounded p-2 text-sm"
                  />
                ) : (
                  <p className="text-justify pl-2">{silabo.competencias.general}</p>
                )}
              </div>

              <div>
                <span className="font-bold block text-slate-900 mb-1">Competencias Específicas</span>
                <ul className="list-disc list-inside space-y-2 pl-2">
                  {silabo.competencias.especificas.map((comp, idx) => (
                    <li key={idx} className="text-justify leading-relaxed">
                      {isEditing ? (
                        <div className="inline-flex items-start gap-1 w-full pl-1">
                          <textarea
                            rows={2}
                            value={comp}
                            onChange={(e) => {
                              const next = [...silabo.competencias.especificas];
                              next[idx] = e.target.value;
                              onChangeSilabo({
                                ...silabo,
                                competencias: { ...silabo.competencias, especificas: next },
                              });
                            }}
                            className="flex-1 border border-slate-300 rounded p-1 text-sm"
                          />
                        </div>
                      ) : (
                        <span>{comp}</span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* 3.2 Componentes */}
            <div>
              <h4 className="font-bold text-slate-900 mb-2">3.2. Componentes</h4>

              <div className="mb-4">
                <span className="font-bold block text-slate-900 mb-1">Capacidades</span>
                <ul className="list-disc list-inside space-y-2 pl-2">
                  {silabo.competencias.capacidades.map((cap, idx) => (
                    <li key={idx} className="text-justify leading-relaxed">
                      {isEditing ? (
                        <textarea
                          rows={2}
                          value={cap}
                          onChange={(e) => {
                            const next = [...silabo.competencias.capacidades];
                            next[idx] = e.target.value;
                            onChangeSilabo({
                              ...silabo,
                              competencias: { ...silabo.competencias, capacidades: next },
                            });
                          }}
                          className="w-full border border-slate-300 rounded p-1 text-sm mt-1"
                        />
                      ) : (
                        <span>{cap}</span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <span className="font-bold block text-slate-900 mb-1">Contenidos actitudinales</span>
                <ul className="list-disc list-inside space-y-1 pl-2">
                  {silabo.competencias.contenidosActitudinales.map((act, idx) => (
                    <li key={idx}>
                      {isEditing ? (
                        <input
                          type="text"
                          value={act}
                          onChange={(e) => {
                            const next = [...silabo.competencias.contenidosActitudinales];
                            next[idx] = e.target.value;
                            onChangeSilabo({
                              ...silabo,
                              competencias: { ...silabo.competencias, contenidosActitudinales: next },
                            });
                          }}
                          className="border border-slate-300 rounded px-1.5 py-0.5 text-sm w-3/4 ml-1"
                        />
                      ) : (
                        <span>{act}</span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* SECCIÓN IV: PROGRAMACIÓN DE CONTENIDOS (TABLAS OFICIALES USMP) */}
        <section className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-base uppercase tracking-wide text-slate-900 font-serif">
                IV. PROGRAMACIÓN DE CONTENIDOS
              </h3>
              <p className="text-xs text-slate-600 mt-0.5">
                Estructura por Unidades con desglose exacto de contenidos conceptuales, procedimentales, actividades y horas lectivas/no lectivas.
              </p>
            </div>
            {onTriggerAIAction && (
              <button
                type="button"
                onClick={() =>
                  onTriggerAIAction(
                    'programacion',
                    'Perfecciona la programación de contenidos semanales garantizando que las actividades de aprendizaje y las horas lectivas/no lectivas coincidan matemáticamente con los totales del sílabo.'
                  )
                }
                disabled={isAiLoading}
                className="text-xs text-rose-700 hover:text-rose-900 font-medium flex items-center gap-1 no-print"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Enriquecer Actividades con IA</span>
              </button>
            )}
          </div>

          {/* Tablas por Unidad (Páginas 5, 6, 7, 8 del Sílabo Oficial) */}
          <div className="space-y-8">
            {silabo.programacionContenidos.unidades.map((unidad, uIdx) => (
              <div key={unidad.numero || uIdx} className="border border-slate-900">
                {/* Header de la Unidad */}
                <div className="bg-slate-100 border-b border-slate-900 p-2 text-center">
                  <div className="font-bold uppercase text-sm tracking-wide text-slate-900 font-serif">
                    UNIDAD {unidad.numero === 1 ? 'I' : unidad.numero === 2 ? 'II' : unidad.numero === 3 ? 'III' : 'IV'}
                  </div>
                  <div className="font-extrabold uppercase text-sm tracking-wide text-slate-900">
                    {unidad.titulo}
                  </div>
                </div>

                {/* Capacidad de la Unidad */}
                <div className="border-b border-slate-900 p-2.5 text-xs sm:text-sm bg-white">
                  <span className="font-bold uppercase mr-1">CAPACIDAD:</span>
                  <span>{unidad.capacidad}</span>
                </div>

                {/* Tabla de Cronograma Semanal */}
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-900 bg-slate-50 text-slate-900">
                        <th className="p-2 border-r border-slate-900 text-center font-bold w-14">
                          SEMANA
                        </th>
                        <th className="p-2 border-r border-slate-900 font-bold min-w-[160px]">
                          CONTENIDOS CONCEPTUALES
                        </th>
                        <th className="p-2 border-r border-slate-900 font-bold min-w-[160px]">
                          CONTENIDOS PROCEDIMENTALES
                        </th>
                        <th className="p-2 border-r border-slate-900 font-bold min-w-[160px]">
                          ACTIVIDAD DE APRENDIZAJE
                        </th>
                        <th className="p-1 border-r border-slate-900 text-center font-bold w-24">
                          <div className="border-b border-slate-400 pb-0.5 mb-0.5">HORAS LECTIVAS</div>
                          <div className="grid grid-cols-2 text-[10px]">
                            <span>Teoría</span>
                            <span>Práctica</span>
                          </div>
                        </th>
                        <th className="p-1 text-center font-bold w-24">
                          <div className="border-b border-slate-400 pb-0.5 mb-0.5">HORAS NO LECTIVAS</div>
                          <div className="grid grid-cols-2 text-[10px]">
                            <span>Teoría</span>
                            <span>Práctica</span>
                          </div>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {unidad.semanas.map((sem, sIdx) => (
                        <tr key={sem.semana || sIdx} className="align-top border-b border-slate-900 last:border-b-0">
                          {/* Semana */}
                          <td className="p-2 border-r border-slate-900 text-center font-bold text-sm">
                            {sem.semana}
                          </td>

                          {/* Conceptuales */}
                          <td className="p-2 border-r border-slate-900">
                            <ul className="list-disc list-inside space-y-1">
                              {sem.contenidosConceptuales.map((c, i) => (
                                <li key={i} className="leading-snug">
                                  {c}
                                </li>
                              ))}
                            </ul>
                          </td>

                          {/* Procedimentales */}
                          <td className="p-2 border-r border-slate-900">
                            <ul className="list-disc list-inside space-y-1">
                              {sem.contenidosProcedimentales.map((p, i) => (
                                <li key={i} className="leading-snug">
                                  {p}
                                </li>
                              ))}
                            </ul>
                          </td>

                          {/* Actividad de Aprendizaje */}
                          <td className="p-2 border-r border-slate-900">
                            <ul className="list-disc list-inside space-y-1">
                              {sem.actividadesAprendizaje.map((a, i) => (
                                <li key={i} className="leading-snug">
                                  {a}
                                </li>
                              ))}
                            </ul>
                          </td>

                          {/* Horas Lectivas */}
                          <td className="p-2 border-r border-slate-900 text-center font-mono">
                            <div className="grid grid-cols-2 gap-1 text-xs">
                              <span>{String(sem.horasLectivas.teoria).padStart(2, '0')}</span>
                              <span>{String(sem.horasLectivas.practica).padStart(2, '0')}</span>
                            </div>
                          </td>

                          {/* Horas No Lectivas */}
                          <td className="p-2 text-center font-mono">
                            <div className="grid grid-cols-2 gap-1 text-xs">
                              <span>{String(sem.horasNoLectivas.teoria).padStart(2, '0')}</span>
                              <span>{String(sem.horasNoLectivas.practica).padStart(2, '0')}</span>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* SECCIÓN V: ESTRATEGIAS METODOLÓGICAS */}
        <section className="mb-10">
          <h3 className="font-bold text-base uppercase tracking-wide text-slate-900 font-serif mb-3">
            V. ESTRATEGIAS METODOLÓGICAS
          </h3>
          <div className="space-y-4 text-justify text-sm leading-relaxed text-slate-800">
            <p>{silabo.estrategiasMetodologicas.fundamentacion}</p>
            <div>
              <p className="font-medium mb-1.5">Entre las que utilizamos tenemos:</p>
              <ul className="list-disc list-inside space-y-1 pl-2 grid grid-cols-1 sm:grid-cols-2 gap-x-4">
                {silabo.estrategiasMetodologicas.estrategias.map((est, i) => (
                  <li key={i}>{est}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* SECCIÓN VI: RECURSOS DIDÁCTICOS */}
        <section className="mb-10">
          <h3 className="font-bold text-base uppercase tracking-wide text-slate-900 font-serif mb-3">
            VI. RECURSOS DIDACTICOS
          </h3>
          <div className="text-sm text-slate-800">
            <p className="mb-2">Los recursos didácticos empleados son:</p>
            <ul className="list-disc list-inside space-y-1 pl-2 grid grid-cols-1 sm:grid-cols-2 gap-x-4">
              {silabo.recursosDidacticos.map((rec, i) => (
                <li key={i}>{rec}</li>
              ))}
            </ul>
          </div>
        </section>

        {/* SECCIÓN VII: EVALUACIÓN DE APRENDIZAJES */}
        <section className="mb-10">
          <h3 className="font-bold text-base uppercase tracking-wide text-slate-900 font-serif mb-3">
            VII. EVALUACION DE APRENDIZAJES
          </h3>
          <div className="space-y-4 text-justify text-sm leading-relaxed text-slate-800">
            <p>{silabo.evaluacion.normativa}</p>

            <p>
              La evaluación de las actividades conceptuales, procedimentales y actitudinales está en relación a las competencias, capacidades, actitudes que el estudiante debe lograr al concluir la asignatura.
            </p>

            <p className="font-semibold text-slate-900">
              El Promedio Final de la asignatura se calcula de la siguiente forma:
            </p>

            {/* Caja Destacada de Fórmula Matemática */}
            <div className="w-full max-w-xl mx-auto my-4 p-4 border-2 border-slate-900 bg-slate-50 text-center font-bold text-sm sm:text-base tracking-wide rounded-2xl shadow-xs">
              {silabo.evaluacion.formula}
            </div>

            <div className="space-y-2 mt-4">
              <p>
                <strong>Evaluación Conceptual:</strong> se realiza examinándose principalmente el saber conceptual.
              </p>
              <p>
                <strong>Evaluación Procedimental:</strong> se realiza a través de la observación progresiva del desempeño del estudiante en el proceso de desarrollo de la exigencia académica de la asignatura y las actividades de aprendizaje significativo previstas en la misma. Evalúa preferentemente el saber hacer y las actitudes de las capacidades demostradas por los estudiantes.
              </p>
              <p>
                {silabo.evaluacion.sistemaCalificacion}
              </p>
            </div>
          </div>
        </section>

        {/* SECCIÓN VIII: FUENTES DE INFORMACIÓN */}
        <section className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-base uppercase tracking-wide text-slate-900 font-serif">
              VIII. FUENTES DE INFORMACION
            </h3>
            {onTriggerAIAction && (
              <button
                type="button"
                onClick={() =>
                  onTriggerAIAction(
                    'fuentes',
                    'Actualiza las fuentes bibliográficas y electrónicas con literatura y artículos científicos de impacto indexados (2023-2026) en formato estricto APA 7ma edición con enlaces y DOIs vigentes.'
                  )
                }
                disabled={isAiLoading}
                className="text-xs text-rose-700 hover:text-rose-900 font-medium flex items-center gap-1 no-print"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Actualizar Fuentes a 2026</span>
              </button>
            )}
          </div>

          {/* 8.1 Bibliográficas */}
          <div className="mb-6">
            <h4 className="font-bold text-slate-900 text-sm mb-3">8.1. Bibliográficas</h4>
            <div className="space-y-3 text-sm text-slate-800">
              {silabo.fuentesInformacion.bibliograficas.map((bib, i) => (
                <div key={bib.id || i} className="pl-6 -indent-6 leading-relaxed">
                  <span>
                    {bib.autor} ({bib.anio}). <em>{bib.titulo}</em>
                    {bib.edicion ? ` (${bib.edicion})` : ''}. {bib.lugar ? `${bib.lugar}: ` : ''}
                    {bib.editorial}.
                  </span>
                  {bib.esActualizada && (
                    <span className="ml-2 text-[10px] px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold uppercase no-print">
                      Vigente 2023-2026
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* 8.2 Electrónicas */}
          <div>
            <h4 className="font-bold text-slate-900 text-sm mb-3">8.2. Electrónicas</h4>
            <div className="space-y-3 text-sm text-slate-800">
              {silabo.fuentesInformacion.electronicas.map((elec, i) => (
                <div key={elec.id || i} className="pl-6 -indent-6 leading-relaxed break-all">
                  <span>
                    {elec.autor} ({elec.anio}). <em>{elec.titulo}</em>. {elec.fuenteORevista ? `${elec.fuenteORevista}. ` : ''}
                    Recuperado el {elec.fechaRecuperado}, de{' '}
                    <a
                      href={elec.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-rose-800 underline hover:text-rose-900 inline-flex items-center gap-0.5"
                    >
                      {elec.url}
                      <ExternalLink className="w-3 h-3 inline ml-0.5 no-print" />
                    </a>
                    {elec.doi && <span> [DOI: {elec.doi}]</span>}
                  </span>
                  {elec.esActualizada && (
                    <span className="ml-2 text-[10px] px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold uppercase no-print">
                      Artículo Indexado Actual
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Firmas de Docentes y Aprobación (Estándar Académico) */}
        <div className="mt-16 pt-8 border-t border-slate-300 grid grid-cols-2 sm:grid-cols-4 gap-6 text-center text-xs text-slate-600 print:mt-12">
          {silabo.datosGenerales.docentes.slice(0, 4).map((doc, idx) => (
            <div key={idx} className="flex flex-col items-center">
              <div className="w-32 border-b border-slate-400 mb-1" />
              <span className="font-semibold text-slate-800">
                {doc.grado} {doc.nombre}
              </span>
              <span className="text-[10px] text-slate-500">Docente de Asignatura</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
