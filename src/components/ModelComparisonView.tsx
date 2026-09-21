import React, { useState } from 'react';
import {
  Layers,
  Sparkles,
  Trophy,
  Zap,
  Bot,
  RefreshCw,
  CheckCircle2,
  ShieldCheck,
  Cpu,
  Calculator,
  BookOpen,
  Scale,
  Award,
  ChevronRight,
  Info,
  Check,
  FileText,
  Key,
} from 'lucide-react';
import { SilaboData, ModelOption, ComparisonEvaluation, AIProviderConfig } from '../types';

interface Props {
  silabo: SilaboData;
  availableModels: ModelOption[];
  onAdoptContent: (modelId: string, content: string) => void;
  onRunComparison: (
    selectedModelIds: string[],
    taskType: string,
    customInstruction?: string
  ) => Promise<ComparisonEvaluation[]>;
  apiConfigs: Record<string, AIProviderConfig>;
  isComparing?: boolean;
}

export const ModelComparisonView: React.FC<Props> = ({
  silabo,
  availableModels,
  onAdoptContent,
  onRunComparison,
  apiConfigs,
  isComparing = false,
}) => {
  const [selectedModels, setSelectedModels] = useState<string[]>([
    'gemini-3.8-flash',
    'claude-3-5-sonnet',
    'gpt-4o',
  ]);
  const [taskType, setTaskType] = useState<string>('sumilla_competencias');
  const [customInstruction, setCustomInstruction] = useState<string>('');
  const [comparisonResults, setComparisonResults] = useState<ComparisonEvaluation[]>([]);
  const [adoptedModelId, setAdoptedModelId] = useState<string | null>(null);

  const toggleModel = (id: string) => {
    if (selectedModels.includes(id)) {
      if (selectedModels.length > 1) {
        setSelectedModels(selectedModels.filter((m) => m !== id));
      }
    } else {
      setSelectedModels([...selectedModels, id]);
    }
  };

  const handleExecuteComparison = async () => {
    try {
      const results = await onRunComparison(selectedModels, taskType, customInstruction);
      if (results && results.length > 0) {
        setComparisonResults(results);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Find winner model
  const winningModel = comparisonResults.reduce<ComparisonEvaluation | null>((prev, current) => {
    if (!prev) return current;
    return current.metrics.promedioGeneral > prev.metrics.promedioGeneral ? current : prev;
  }, null);

  return (
    <div className="w-full max-w-6xl mx-auto my-6 px-4 sm:px-6 space-y-6">
      {/* 1. Header Banner */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200 mb-2">
              <Layers className="w-3.5 h-3.5" />
              <span>Benchmark Multi-IA de Buhotech Sílabot</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Comparativa de Modelos de Frontera: ¿Qué IA Diseña Mejor el Sílabo?
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-3xl leading-relaxed">
              Al alimentar al agente de IA con diferentes API Keys (Gemini, Claude, GPT-4o, DeepSeek), cada inteligencia aporta un estilo distintivo en redacción y rigor pedagógico, pero <strong>todas operan bajo el mismo sistema de reglas inmutables</strong> configurado en Buhotech Sílabot.
            </p>
          </div>
        </div>

        {/* 2. ARQUITECTURA: DIVISIÓN DE ROLES (SISTEMA vs AGENTE IA VIA API KEY) */}
        <div className="mt-4 p-5 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-850 text-white space-y-4 shadow-sm border border-slate-800">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-700/80">
            <Scale className="w-5 h-5 text-amber-400" />
            <h3 className="font-extrabold text-sm sm:text-base text-white tracking-tight">
              División de Responsabilidades: Sistema Buhotech Sílabot vs. Agente IA vía API Key
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            {/* LADO A: SISTEMA DETERMINISTA */}
            <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700 space-y-2.5">
              <div className="flex items-center gap-2 text-rose-400 font-bold uppercase tracking-wider text-[11px]">
                <ShieldCheck className="w-4 h-4 text-rose-400" />
                <span>¿Qué realiza el Sistema Base (Buhotech Sílabot)?</span>
              </div>
              <p className="text-slate-300 text-[11px] leading-relaxed">
                El sistema base actúa como el <strong>marco normativo y matemático inviolable</strong>. La IA no puede inventar horas ni alterar la estructura canónica universitaria:
              </p>
              <ul className="space-y-1.5 text-slate-200">
                <li className="flex items-start gap-1.5">
                  <Calculator className="w-3.5 h-3.5 text-rose-400 mt-0.5 shrink-0" />
                  <span><strong>Cuadre Matemático de Horas:</strong> Cálculo estricto de 80h para 4 créditos (16h TL + 32h TNL + 8h PL + 24h PNL). No alucina números.</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-rose-400 mt-0.5 shrink-0" />
                  <span><strong>Estructura Canónica de 8 Secciones:</strong> Garantiza las 8 partes obligatorias del sílabo oficial USMP.</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-rose-400 mt-0.5 shrink-0" />
                  <span><strong>Condensación en 4 Unidades:</strong> Bloquea la programación en exactamente 4 Unidades Temáticas modulares.</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <Award className="w-3.5 h-3.5 text-rose-400 mt-0.5 shrink-0" />
                  <span><strong>Fórmulas de Evaluación:</strong> Ponderación 40% continua / 60% tareas y casos, con redondeo a medio punto (0.5) a favor del estudiante.</span>
                </li>
              </ul>
            </div>

            {/* LADO B: AGENTE IA VIA API KEY */}
            <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700 space-y-2.5">
              <div className="flex items-center gap-2 text-emerald-400 font-bold uppercase tracking-wider text-[11px]">
                <Cpu className="w-4 h-4 text-emerald-400" />
                <span>¿Qué realiza el Agente de IA vía API Key?</span>
              </div>
              <p className="text-slate-300 text-[11px] leading-relaxed">
                Al alimentar el agente con una API Key (Gemini, Claude, GPT, DeepSeek), este asume la <strong>labor semántica, pedagógica y de investigación</strong>:
              </p>
              <ul className="space-y-1.5 text-slate-200">
                <li className="flex items-start gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-400 mt-0.5 shrink-0" />
                  <span><strong>Redacción Semántica de Sumilla:</strong> Propósito formativo, naturaleza y trascendencia disciplinar.</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <Bot className="w-3.5 h-3.5 text-emerald-400 mt-0.5 shrink-0" />
                  <span><strong>Taxonomía de Bloom:</strong> Formulación de competencias y capacidades con verbos de desempeño de alto nivel cognitivo.</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-emerald-400 mt-0.5 shrink-0" />
                  <span><strong>Literatura 2025–2026:</strong> Búsqueda de papers indexados y libros de vanguardia en formato APA 7ma con DOIs.</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-emerald-400 mt-0.5 shrink-0" />
                  <span><strong>Actividades Auténticas:</strong> Creación de foros, casos prácticos peruanos y tareas aplicadas para cada unidad.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* 3. MATRIZ CUALITATIVA DE MODELOS */}
        <div className="pt-2">
          <label className="text-xs font-bold text-slate-800 flex items-center justify-between mb-2">
            <span>¿En qué se diferencian las IAs bajo las mismas reglas? Seleccione las que desea comparar:</span>
            <span className="text-[11px] font-normal text-slate-500">Mínimo 2 modelos</span>
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {availableModels.map((m) => {
              const isSelected = selectedModels.includes(m.id);
              const hasKey = Boolean(apiConfigs[m.provider]?.apiKey);

              return (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => toggleModel(m.id)}
                  className={`p-3.5 rounded-xl border text-left transition-all flex flex-col justify-between cursor-pointer ${
                    isSelected
                      ? 'border-rose-600 bg-rose-50/50 shadow-2xs ring-1 ring-rose-500/30'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-extrabold text-xs text-slate-900">{m.name}</span>
                      <span
                        className={`w-4 h-4 rounded-full border flex items-center justify-center text-[10px] font-bold ${
                          isSelected
                            ? 'border-rose-600 bg-rose-600 text-white'
                            : 'border-slate-300 text-transparent'
                        }`}
                      >
                        ✓
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-600 line-clamp-2 leading-relaxed">
                      {m.description}
                    </span>
                  </div>

                  <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[9px]">
                    <span className="font-mono uppercase font-bold text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded">
                      {m.provider}
                    </span>
                    <span className={`flex items-center gap-1 font-medium ${hasKey ? 'text-emerald-700' : 'text-slate-600'}`}>
                      <Key className="w-3 h-3" />
                      {hasKey ? 'API Key lista' : 'Perfil calibrado'}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* 4. SELECCIÓN DE TAREA */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
          <div>
            <label className="text-xs font-bold text-slate-800 block mb-1.5">
              Dimensión Curricular a Comparar:
            </label>
            <select
              value={taskType}
              onChange={(e) => setTaskType(e.target.value)}
              className="w-full py-2.5 px-3 border border-slate-300 rounded-xl text-xs sm:text-sm bg-white focus:outline-hidden focus:ring-2 focus:ring-rose-500/20"
            >
              <option value="sumilla_competencias">
                1. Sumilla y Competencias con Taxonomía de Bloom
              </option>
              <option value="actualizacion_2026">
                2. Actualización de Vanguardia 2026 y Fuentes APA 7ma
              </option>
              <option value="programacion_semanal">
                3. Síntesis de Contenidos para las 4 Unidades USMP
              </option>
            </select>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-800 block mb-1.5">
              Instrucción Adicional del Docente (Opcional):
            </label>
            <input
              type="text"
              value={customInstruction}
              onChange={(e) => setCustomInstruction(e.target.value)}
              placeholder="Ej: Enfatizar casos clínicos peruanos, ética e inteligencia artificial..."
              className="w-full py-2.5 px-3 border border-slate-300 rounded-xl text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-rose-500/20"
            />
          </div>
        </div>

        {/* 5. BOTÓN DE DISPARO DEL BENCHMARK */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-100">
          <div className="text-[11px] text-slate-500 flex items-center gap-1.5">
            <Info className="w-4 h-4 text-slate-400 shrink-0" />
            <span>Se evaluará a {selectedModels.length} IAs con las mismas reglas oficiales USMP en paralelo.</span>
          </div>

          <button
            onClick={handleExecuteComparison}
            disabled={isComparing || selectedModels.length < 2}
            className="w-full sm:w-auto px-6 py-2.5 bg-rose-700 hover:bg-rose-800 text-white rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-xs transition-colors disabled:opacity-50 cursor-pointer"
          >
            {isComparing ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Ejecutando Modelos en Paralelo...</span>
              </>
            ) : (
              <>
                <Zap className="w-4 h-4 text-amber-300" />
                <span>Correr Comparativa de {selectedModels.length} Modelos</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* 6. RESULTADOS DEL BENCHMARK */}
      {comparisonResults.length > 0 && (
        <div className="space-y-6">
          {/* Winner Banner */}
          {winningModel && (
            <div className="p-4 sm:p-5 bg-gradient-to-r from-amber-500 via-amber-600 to-orange-600 text-white rounded-2xl shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
                  <Trophy className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-amber-100">
                    Propuesta Mejor Calificada en este Benchmark:
                  </div>
                  <div className="text-lg font-black tracking-tight">
                    {winningModel.modelName} ({winningModel.metrics.promedioGeneral}/100 Puntos Ponderados)
                  </div>
                </div>
              </div>

              <button
                onClick={() => {
                  onAdoptContent(winningModel.modelId, winningModel.generatedContent);
                  setAdoptedModelId(winningModel.modelId);
                }}
                className="px-4 py-2 bg-white text-slate-900 rounded-xl text-xs font-bold hover:bg-amber-50 transition-colors shadow-2xs whitespace-nowrap cursor-pointer"
              >
                {adoptedModelId === winningModel.modelId ? '✓ Adoptado en el Sílabo' : 'Adoptar Ganador en Sílabo'}
              </button>
            </div>
          )}

          {/* Comparativa Lado a Lado */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {comparisonResults.map((result) => {
              const isWinner = winningModel?.modelId === result.modelId;
              const isAdopted = adoptedModelId === result.modelId;

              return (
                <div
                  key={result.modelId}
                  className={`bg-white rounded-2xl border ${
                    isWinner ? 'border-amber-400 ring-2 ring-amber-400/20' : 'border-slate-200'
                  } p-6 shadow-2xs space-y-4 flex flex-col justify-between`}
                >
                  <div className="space-y-3">
                    {/* Header del Modelo */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Bot className="w-5 h-5 text-rose-600" />
                        <div>
                          <h4 className="font-extrabold text-slate-900 text-base">{result.modelName}</h4>
                          <span className="text-[10px] text-slate-500 font-mono">
                            Latencia: {result.durationMs}ms
                          </span>
                        </div>
                      </div>
                      <span className="text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 uppercase">
                        {result.provider}
                      </span>
                    </div>

                    {/* Desglose de Métricas Pedagógicas */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] p-3 bg-slate-50 rounded-xl border border-slate-100">
                      <div>
                        <span className="text-slate-500 block text-[10px]">Taxonomía Bloom:</span>
                        <span className="font-bold text-slate-900 font-mono text-xs">
                          {result.metrics.alineamientoBloom}%
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[10px]">Actualidad 2026:</span>
                        <span className="font-bold text-slate-900 font-mono text-xs">
                          {result.metrics.actualidadMercado}%
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[10px]">Rigor Académico:</span>
                        <span className="font-bold text-slate-900 font-mono text-xs">
                          {result.metrics.rigorPedagogico}%
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[10px]">Puntaje Global:</span>
                        <span className="font-black text-rose-700 font-mono text-xs">
                          {result.metrics.promedioGeneral}/100
                        </span>
                      </div>
                    </div>

                    {/* Vista Previa del Contenido Generado */}
                    <div className="p-4 bg-slate-50/80 rounded-xl border border-slate-200/80 text-xs text-slate-800 max-h-72 overflow-y-auto font-sans leading-relaxed whitespace-pre-wrap">
                      {result.generatedContent}
                    </div>

                    {/* Fortalezas Identificadas */}
                    <div className="space-y-1">
                      <span className="text-[11px] font-bold text-slate-700 block">
                        Fortalezas Clave de este Modelo:
                      </span>
                      <ul className="text-xs text-slate-600 space-y-0.5 list-disc list-inside">
                        {result.puntosFuertes.map((pf, i) => (
                          <li key={i}>{pf}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Botón de Adopción */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[11px] text-slate-500">
                      {isWinner ? '★ Mayor puntuación' : 'Alternativa viable'}
                    </span>
                    <button
                      onClick={() => {
                        onAdoptContent(result.modelId, result.generatedContent);
                        setAdoptedModelId(result.modelId);
                      }}
                      className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                        isAdopted
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-300'
                          : 'bg-slate-900 hover:bg-slate-800 text-white'
                      }`}
                    >
                      {isAdopted ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Adoptado en Sílabo</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                          <span>Adoptar esta Propuesta</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
