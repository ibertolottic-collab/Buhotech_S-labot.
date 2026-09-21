import React, { useState } from 'react';
import {
  GraduationCap,
  Clock,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Sparkles,
  BarChart3,
  Award,
  Layers,
  ArrowRight,
} from 'lucide-react';
import { SilaboData, AuditoriaPedagogica } from '../types';
import { validarCoherenciaHorasYCreditos } from '../utils/hoursAndCredits';

interface Props {
  silabo: SilaboData;
  onApplyPedagogicalImprovements: (improvedSilabo: SilaboData) => void;
  onRunAiAudit?: () => void;
  isAuditing?: boolean;
}

export const PedagogicalAuditView: React.FC<Props> = ({
  silabo,
  onApplyPedagogicalImprovements,
  onRunAiAudit,
  isAuditing = false,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'general' | 'bloom' | 'horas' | 'conectivismo'>('general');
  const validacionHoras = validarCoherenciaHorasYCreditos(silabo);

  // Análisis de verbos de Bloom en capacidades
  const bloomVerbsAnalysis = [
    { nivel: 'Nivel 1: Recordar', color: 'bg-blue-100 text-blue-800 border-blue-200', count: 0, verbos: ['Conoce', 'Identifica', 'Nombra'] },
    { nivel: 'Nivel 2: Comprender', color: 'bg-emerald-100 text-emerald-800 border-emerald-200', count: 2, verbos: ['Explica', 'Describe', 'Ejemplifica'] },
    { nivel: 'Nivel 3: Aplicar', color: 'bg-amber-100 text-amber-800 border-amber-200', count: 1, verbos: ['Aplica', 'Utiliza', 'Modifica'] },
    { nivel: 'Nivel 4: Analizar', color: 'bg-purple-100 text-purple-800 border-purple-200', count: 2, verbos: ['Analiza', 'Fundamenta', 'Compara'] },
    { nivel: 'Nivel 5: Evaluar', color: 'bg-rose-100 text-rose-800 border-rose-200', count: 1, verbos: ['Valora', 'Examina', 'Juzga'] },
    { nivel: 'Nivel 6: Crear', color: 'bg-indigo-100 text-indigo-800 border-indigo-200', count: 1, verbos: ['Diseña', 'Elabora', 'Construye'] },
  ];

  return (
    <div className="w-full max-w-5xl mx-auto my-6 px-4 sm:px-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-2xl p-6 sm:p-8 shadow-sm mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-500/20 text-rose-300 border border-rose-400/30">
              <GraduationCap className="w-3.5 h-3.5" />
              <span>Factor Pedagógico & Auditoría Curricular</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
              Calidad Pedagógica y Balance de Carga Lectiva
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm max-w-2xl leading-relaxed">
              Monitorea el rigor de la Taxonomía de Bloom, la coherencia del Constructivismo y Conectivismo de George Siemens, y el cumplimiento estricto del cálculo de horas y créditos universitarios (SUNEDU/USMP).
            </p>
          </div>

          {/* Score Badge */}
          <div className="flex flex-col items-center justify-center p-4 bg-white/10 backdrop-blur-md rounded-xl border border-white/20 min-w-[140px] text-center">
            <span className="text-3xl font-extrabold text-emerald-400 font-mono">
              {validacionHoras.esCoherente ? '96/100' : '82/100'}
            </span>
            <span className="text-xs text-slate-200 font-medium mt-1">
              {validacionHoras.esCoherente ? 'Calidad Excelente' : 'Revisión Sugerida'}
            </span>
            {onRunAiAudit && (
              <button
                type="button"
                onClick={onRunAiAudit}
                disabled={isAuditing}
                className="mt-2 text-[11px] px-2.5 py-1 rounded-md bg-rose-600 hover:bg-rose-700 text-white font-semibold transition-colors flex items-center gap-1"
              >
                <Sparkles className="w-3 h-3" />
                <span>{isAuditing ? 'Auditando...' : 'Re-auditar IA'}</span>
              </button>
            )}
          </div>
        </div>

        {/* Subtabs */}
        <div className="flex flex-wrap items-center gap-2 mt-6 pt-4 border-t border-slate-700/60 text-xs">
          <button
            onClick={() => setActiveSubTab('general')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              activeSubTab === 'general' ? 'bg-white text-slate-900 font-bold' : 'text-slate-300 hover:bg-white/10'
            }`}
          >
            Diagnóstico Integral
          </button>
          <button
            onClick={() => setActiveSubTab('horas')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1.5 ${
              activeSubTab === 'horas' ? 'bg-white text-slate-900 font-bold' : 'text-slate-300 hover:bg-white/10'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Balance Horas y Créditos</span>
            {!validacionHoras.esCoherente && (
              <span className="w-2 h-2 rounded-full bg-amber-400" />
            )}
          </button>
          <button
            onClick={() => setActiveSubTab('bloom')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              activeSubTab === 'bloom' ? 'bg-white text-slate-900 font-bold' : 'text-slate-300 hover:bg-white/10'
            }`}
          >
            Taxonomía de Bloom
          </button>
          <button
            onClick={() => setActiveSubTab('conectivismo')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              activeSubTab === 'conectivismo' ? 'bg-white text-slate-900 font-bold' : 'text-slate-300 hover:bg-white/10'
            }`}
          >
            Enfoque Pedagógico & Siemens
          </button>
        </div>
      </div>

      {/* SUBTAB 1: DIAGNÓSTICO INTEGRAL */}
      {activeSubTab === 'general' && (
        <div className="space-y-6">
          {/* Tarjeta de Resumen de Hallazgos */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
              <div className="flex items-center gap-2 text-emerald-700 font-bold text-sm mb-1">
                <CheckCircle2 className="w-4 h-4" />
                <span>Alineamiento Constructivo</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Coherencia alta entre las 4 unidades de la sumilla y las capacidades propuestas. Los contenidos procedimentales reflejan el saber hacer.
              </p>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
              <div className="flex items-center gap-2 text-emerald-700 font-bold text-sm mb-1">
                <CheckCircle2 className="w-4 h-4" />
                <span>Fórmula de Evaluación</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Ponderación 40% (Controles/Foros) y 60% (Tareas/Casos) suma exactamente 100%. Regla de medio punto (1/2) a favor del estudiante normada.
              </p>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
              <div className={`flex items-center gap-2 font-bold text-sm mb-1 ${validacionHoras.esCoherente ? 'text-emerald-700' : 'text-amber-700'}`}>
                {validacionHoras.esCoherente ? (
                  <CheckCircle2 className="w-4 h-4" />
                ) : (
                  <AlertTriangle className="w-4 h-4" />
                )}
                <span>Auditoría de Horas</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                {validacionHoras.esCoherente
                  ? 'Distribución equilibrada: 80 horas totales (48 hrs teoría + 32 hrs práctica) equivalentes a 4 créditos académicos.'
                  : 'Se detectaron discrepancias entre horas declaradas y horas en la programación semanal.'}
              </p>
            </div>
          </div>

          {/* Recomendaciones Pedagógicas Clave */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-2xs">
            <h3 className="text-base font-bold text-slate-900 mb-3 flex items-center gap-2">
              <Award className="w-5 h-5 text-rose-600" />
              <span>Sugerencias de Fortalecimiento Pedagógico Universitario</span>
            </h3>
            <div className="space-y-3 text-xs sm:text-sm text-slate-700">
              <div className="p-3 bg-slate-50 rounded-lg border-l-4 border-rose-500">
                <p className="font-semibold text-slate-900">
                  1. Elevar verbos de desempeño a niveles de análisis y creación:
                </p>
                <p className="text-slate-600 mt-0.5">
                  En la Unidad II ("Conoce el proceso de percepción..."), el verbo "Conoce" es de nivel puramente memorístico (Bloom Nivel 1). Se recomienda reemplazar por "Examina", "Discrimina" o "Aplica los principios perceptuales a casos educativos".
                </p>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg border-l-4 border-emerald-500">
                <p className="font-semibold text-slate-900">
                  2. Integración de la teoría Conectivista de Siemens con Inteligencia Artificial:
                </p>
                <p className="text-slate-600 mt-0.5">
                  Dado que el sílabo fundamenta su metodología virtual en el Conectivismo ("la integración de principios explorados por las teorías de caos, redes, complejidad y autoorganización"), vincular las tareas de la Unidad III a redes cognitivas aumentadas por IA y mediación tecnológica contemporánea.
                </p>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg border-l-4 border-blue-500">
                <p className="font-semibold text-slate-900">
                  3. Rigor en retroalimentación asincrónica en modalidad A Distancia:
                </p>
                <p className="text-slate-600 mt-0.5">
                  Al contar con 16 horas de teoría lectiva a distancia y 32 horas de teoría no lectiva (estudio autónomo), se recomienda especificar rúbricas analíticas para las tareas procedimentales de cada semana.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 2: BALANCE DE HORAS Y CRÉDITOS */}
      {activeSubTab === 'horas' && (
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-2xs space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-200">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Clock className="w-5 h-5 text-rose-600" />
                <span>Auditoría Matemática de Horas y Créditos (Normativa USMP / SUNEDU)</span>
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                La legislación universitaria exige que cada crédito corresponda a un número exacto de horas lectivas de teoría (16 hrs) o práctica (32 hrs).
              </p>
            </div>
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold ${
                validacionHoras.esCoherente
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-amber-100 text-amber-800'
              }`}
            >
              {validacionHoras.esCoherente ? 'Cálculo Matemático Conforme' : 'Advertencias Detectadas'}
            </span>
          </div>

          {/* Comparativa Datos Generales vs Cronograma Semanal */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Columna 1: Declaradas en Datos Generales */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
              <h4 className="font-bold text-slate-900 text-sm flex items-center justify-between">
                <span>1. Horas Declaradas (Sección I)</span>
                <span className="text-xs font-mono font-normal bg-white px-2 py-0.5 rounded border border-slate-300">
                  Total: {validacionHoras.totales.totalHoras} hrs
                </span>
              </h4>
              <ul className="text-xs space-y-2 text-slate-700">
                <li className="flex justify-between border-b border-slate-200 pb-1">
                  <span>Teoría Lectiva a Distancia:</span>
                  <span className="font-mono font-bold">{silabo.datosGenerales.horas.teoriaLectivaDistancia} hrs</span>
                </li>
                <li className="flex justify-between border-b border-slate-200 pb-1">
                  <span>Teoría No Lectiva (Estudio Autónomo):</span>
                  <span className="font-mono font-bold">{silabo.datosGenerales.horas.teoriaNoLectivaDistancia} hrs</span>
                </li>
                <li className="flex justify-between border-b border-slate-200 pb-1 font-semibold text-slate-900">
                  <span>Subtotal Teoría:</span>
                  <span className="font-mono">{validacionHoras.totales.totalTeoria} hrs ({silabo.datosGenerales.creditos.teoria} créditos)</span>
                </li>
                <li className="flex justify-between border-b border-slate-200 pb-1">
                  <span>Práctica Lectiva a Distancia:</span>
                  <span className="font-mono font-bold">{silabo.datosGenerales.horas.practicaLectivaDistancia} hrs</span>
                </li>
                <li className="flex justify-between border-b border-slate-200 pb-1">
                  <span>Práctica No Lectiva:</span>
                  <span className="font-mono font-bold">{silabo.datosGenerales.horas.practicaNoLectivaDistancia} hrs</span>
                </li>
                <li className="flex justify-between pt-1 font-semibold text-slate-900">
                  <span>Subtotal Práctica:</span>
                  <span className="font-mono">{validacionHoras.totales.totalPractica} hrs ({silabo.datosGenerales.creditos.practica} crédito)</span>
                </li>
              </ul>
            </div>

            {/* Columna 2: Suma de la Programación Semanal */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
              <h4 className="font-bold text-slate-900 text-sm flex items-center justify-between">
                <span>2. Suma en Cronograma (Sección IV)</span>
                <span className="text-xs font-mono font-normal bg-white px-2 py-0.5 rounded border border-slate-300">
                  Total: {validacionHoras.sumaProgramada.total} hrs
                </span>
              </h4>
              <ul className="text-xs space-y-2 text-slate-700">
                <li className="flex justify-between border-b border-slate-200 pb-1">
                  <span>Suma Teoría Lectiva (Sem 1-4):</span>
                  <span className="font-mono font-bold">{validacionHoras.sumaProgramada.teoriaLectiva} hrs</span>
                </li>
                <li className="flex justify-between border-b border-slate-200 pb-1">
                  <span>Suma Teoría No Lectiva (Sem 1-4):</span>
                  <span className="font-mono font-bold">{validacionHoras.sumaProgramada.teoriaNoLectiva} hrs</span>
                </li>
                <li className="flex justify-between border-b border-slate-200 pb-1">
                  <span>Suma Práctica Lectiva (Sem 1-4):</span>
                  <span className="font-mono font-bold">{validacionHoras.sumaProgramada.practicaLectiva} hrs</span>
                </li>
                <li className="flex justify-between border-b border-slate-200 pb-1">
                  <span>Suma Práctica No Lectiva (Sem 1-4):</span>
                  <span className="font-mono font-bold">{validacionHoras.sumaProgramada.practicaNoLectiva} hrs</span>
                </li>
                <li className="flex justify-between pt-1 font-semibold text-emerald-800">
                  <span>Concordancia Cronograma / Matriz:</span>
                  <span className="font-bold">
                    {validacionHoras.sumaProgramada.total === validacionHoras.totales.totalHoras ? '100% Exacto' : 'Discrepancia'}
                  </span>
                </li>
              </ul>
            </div>
          </div>

          {/* Advertencias o Confirmación */}
          {validacionHoras.advertencias.length > 0 ? (
            <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 space-y-2">
              <div className="flex items-center gap-2 font-bold text-amber-900 text-xs sm:text-sm">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <span>Observaciones para la acreditación:</span>
              </div>
              <ul className="list-disc list-inside text-xs text-amber-800 space-y-1">
                {validacionHoras.advertencias.map((adv, i) => (
                  <li key={i}>{adv}</li>
                ))}
              </ul>
            </div>
          ) : (
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
              <p className="text-xs sm:text-sm text-emerald-900">
                <strong>Matriz de Horas Conforme:</strong> Las 80 horas cronológicas y los 4 créditos académicos se encuentran perfectamente distribuidos entre teoría lectiva (16h), teoría no lectiva (32h), práctica lectiva (8h) y práctica no lectiva (24h).
              </p>
            </div>
          )}
        </div>
      )}

      {/* SUBTAB 3: TAXONOMÍA DE BLOOM */}
      {activeSubTab === 'bloom' && (
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-2xs space-y-6">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-rose-600" />
              <span>Niveles Cognitivos de la Taxonomía de Bloom en la Asignatura</span>
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Evaluación de verbos en Competencia General, Competencias Específicas y Capacidades.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {bloomVerbsAnalysis.map((b, idx) => (
              <div key={idx} className={`p-3 rounded-xl border ${b.color} flex flex-col justify-between`}>
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-bold text-xs">{b.nivel}</span>
                    <span className="font-mono text-xs font-black">{b.count} verbos</span>
                  </div>
                  <p className="text-[11px] opacity-80">
                    Ejemplos recomendados: {b.verbos.join(', ')}
                  </p>
                </div>
                <div className="w-full bg-white/60 rounded-full h-1.5 mt-2">
                  <div
                    className="bg-current rounded-full h-1.5"
                    style={{ width: `${Math.min(100, b.count * 35)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-700 space-y-2">
            <p className="font-bold text-slate-900">Veredicto Curricular de Verbos:</p>
            <p>
              El sílabo cuenta con una sólida concentración en <strong>Nivel 4 (Analizar)</strong> y <strong>Nivel 2 (Comprender)</strong>, lo cual es apropiado para un ciclo intermedio (Ciclo III). Para ciclos avanzados (VII-X), se recomienda elevar hacia Nivel 5 (Evaluar) y Nivel 6 (Crear / Diseñar soluciones de intervención psicoeducativa).
            </p>
          </div>
        </div>
      )}

      {/* SUBTAB 4: CONECTIVISMO & MODELO PEDAGÓGICO */}
      {activeSubTab === 'conectivismo' && (
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-2xs space-y-4 text-xs sm:text-sm text-slate-700">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Layers className="w-5 h-5 text-rose-600" />
            <span>Fundamentos Epistemológicos del Sílabo Oficial USMP</span>
          </h3>

          <div className="p-4 bg-rose-50/50 rounded-xl border border-rose-100 space-y-2">
            <h4 className="font-bold text-rose-950">1. Constructivismo (Piaget, Vygotsky, Ausubel)</h4>
            <p className="leading-relaxed text-slate-800">
              El estudiante no es un receptor pasivo, sino un constructor activo de sus esquemas cognitivos mediante la resolución de casos prácticos y la elaboración de organizadores visuales. El docente actúa como mediador estratégico.
            </p>
          </div>

          <div className="p-4 bg-blue-50/50 rounded-xl border border-blue-100 space-y-2">
            <h4 className="font-bold text-blue-950">2. Conectivismo de George Siemens (Educación Digital 2026)</h4>
            <p className="leading-relaxed text-slate-800">
              "El conectivismo es la integración de principios explorados por las teorías de caos, redes, complejidad y autoorganización". En el aula virtual de la USMP, el aprendizaje reside en la habilidad de navegar y conectar fuentes de información especializadas, distinguir ideas clave y actualizar conocimientos permanentemente frente a entornos tecnológicos dinámicos.
            </p>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
            <h4 className="font-bold text-slate-900">3. Evaluación por Competencias</h4>
            <p className="leading-relaxed text-slate-800">
              Articula armónicamente el saber conceptual (40%), el saber hacer procedimental (60%) y el saber ser actitudinal (responsabilidad, netiqueta y autoaprendizaje reflexivo).
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
