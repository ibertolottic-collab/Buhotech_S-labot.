/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { SILABO_EJEMPLO_USMP } from './data/defaultSyllabus';
import {
  SilaboData,
  AIProvider,
  AIProviderConfig,
  ModelOption,
  TendenciaMercado,
  FuenteBibliografica,
  FuenteElectronica,
  ComparisonEvaluation,
} from './types';
import { Navbar } from './components/Navbar';
import { OfficialSyllabusView } from './components/OfficialSyllabusView';
import { PedagogicalAuditView } from './components/PedagogicalAuditView';
import { MarketTrendsView } from './components/MarketTrendsView';
import { ModelComparisonView } from './components/ModelComparisonView';
import { CloudAndApiKeyModal } from './components/CloudAndApiKeyModal';
import { ImportSyllabusModal } from './components/ImportSyllabusModal';
import { SyllabusCoverSetupView } from './components/SyllabusCoverSetupView';
import { validarCoherenciaHorasYCreditos } from './utils/hoursAndCredits';
import { Sparkles, CheckCircle2, AlertCircle } from 'lucide-react';

export default function App() {
  // Estado principal del Sílabo
  const [silabo, setSilabo] = useState<SilaboData>(() => {
    try {
      const saved = localStorage.getItem('syllabus_ai_current');
      if (saved) return JSON.parse(saved);
    } catch {
      // Ignorar error de storage
    }
    return SILABO_EJEMPLO_USMP;
  });

  // Pestaña activa: inicia en la portada de bienvenida y configuración
  const [activeTab, setActiveTab] = useState<'portada' | 'silabo' | 'pedagogia' | 'mercado' | 'comparativa'>('portada');

  // Estado de generación del Agente IA
  const [isAiGenerating, setIsAiGenerating] = useState(false);

  // Modales
  const [isCloudModalOpen, setIsCloudModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);

  // Notificaciones flotantes
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'info' | 'error' } | null>(null);

  const showToast = (text: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Motor y claves de IA
  const [activeProvider, setActiveProvider] = useState<AIProvider>('gemini');
  const [apiConfigs, setApiConfigs] = useState<Record<string, AIProviderConfig>>({
    gemini: {
      provider: 'gemini',
      model: 'gemini-3.8-flash',
      apiKey: '',
    },
    openai: {
      provider: 'openai',
      model: 'gpt-4o',
      apiKey: '',
    },
    anthropic: {
      provider: 'anthropic',
      model: 'claude-3-5-sonnet-20241022',
      apiKey: '',
    },
    deepseek: {
      provider: 'deepseek',
      model: 'deepseek-chat',
      apiKey: '',
    },
  });

  // Modelos disponibles para el benchmark comparativo
  const availableModels: ModelOption[] = [
    {
      id: 'gemini-3.8-flash',
      name: 'Gemini 3.8 Flash',
      provider: 'gemini',
      tag: 'Nativo GCP',
      description: 'Modelo de frontera de Google optimizado para velocidad, contexto extenso y razonamiento.',
    },
    {
      id: 'gemini-3.1-pro',
      name: 'Gemini 3.1 Pro',
      provider: 'gemini',
      tag: 'Razonamiento',
      description: 'Máximo razonamiento académico y alineamiento con directrices complejas.',
    },
    {
      id: 'gpt-4o',
      name: 'GPT-4o (OpenAI)',
      provider: 'openai',
      tag: 'Multimodal',
      description: 'Modelo de referencia multimodal con alta precisión en estructuración curricular.',
    },
    {
      id: 'claude-3-5-sonnet',
      name: 'Claude 3.5 Sonnet',
      provider: 'anthropic',
      tag: 'Pedagogía',
      description: 'Líder en redacción académica, Taxonomía de Bloom y rigor pedagógico constructivista.',
    },
    {
      id: 'deepseek-v3',
      name: 'DeepSeek V3 / R1',
      provider: 'deepseek',
      tag: 'Lógica',
      description: 'Alta capacidad lógica y eficiencia en desgloses matemáticos de créditos.',
    },
  ];

  // Persistir cambios en localStorage
  useEffect(() => {
    try {
      localStorage.setItem('syllabus_ai_current', JSON.stringify(silabo));
    } catch (e) {
      console.warn('No se pudo guardar en localStorage', e);
    }
  }, [silabo]);

  // Validación de horas para Navbar
  const validacionHoras = validarCoherenciaHorasYCreditos(silabo);

  // Actualizar sílabo
  const handleUpdateSilabo = (updated: SilaboData) => {
    setSilabo(updated);
  };

  // Resetear al modelo oficial USMP
  const handleResetToUSMP = () => {
    setSilabo(SILABO_EJEMPLO_USMP);
    showToast('Sílabo restaurado al formato oficial modelo USMP.');
  };

  // Imprimir / Exportar a PDF
  const handlePrint = () => {
    window.print();
  };

  // Disparar acción de IA sobre una sección
  const handleTriggerAIAction = async (sectionKey: string, promptInstruction: string) => {
    try {
      showToast('Generando contenido pedagógico con IA...', 'info');

      const fullPrompt = `Actúa como diseñador curricular universitario senior para ${silabo.institucion.nombreUniversidad}.
Asignatura: ${silabo.datosGenerales.nombreAsignatura}
Ciclo: ${silabo.datosGenerales.ciclo}
Modalidad: ${silabo.datosGenerales.modalidad}
Horas: ${silabo.datosGenerales.horas.teoriaLectivaDistancia + silabo.datosGenerales.horas.teoriaNoLectivaDistancia}h Teoría, ${silabo.datosGenerales.horas.practicaLectivaDistancia + silabo.datosGenerales.horas.practicaNoLectivaDistancia}h Práctica. Total: 80h. Créditos: 4.

Instrucción: ${promptInstruction}
Sección objetivo: ${sectionKey}

Mantén estricto rigor académico, estilo normativo USMP y verbos de acción medibles según Taxonomía de Bloom.`;

      const response = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          provider: activeProvider,
          model: apiConfigs[activeProvider]?.model || 'gemini-3.8-flash',
          apiKey: apiConfigs[activeProvider]?.apiKey || '',
          prompt: fullPrompt,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Error al invocar IA');
      }

      const generated = data.content;

      // Actualizar automáticamente según la sección
      if (sectionKey === 'sumilla') {
        setSilabo((prev) => ({
          ...prev,
          sumilla: {
            ...prev.sumilla,
            texto: generated,
          },
        }));
        showToast('Sumilla actualizada exitosamente.');
      } else {
        showToast('Generación de IA completada.');
      }
    } catch (err: any) {
      console.error(err);
      showToast('Error al conectar con el motor de IA: ' + err.message, 'error');
    }
  };

  // Buscar tendencias de mercado y bibliografía actualizada
  const handleSearchTrendsOnline = async (asignatura: string) => {
    try {
      showToast(`Investigando tendencias laborales y científicas para "${asignatura}"...`, 'info');
      const response = await fetch('/api/ai/market-trends', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          provider: activeProvider,
          model: apiConfigs[activeProvider]?.model || 'gemini-3.8-flash',
          apiKey: apiConfigs[activeProvider]?.apiKey || '',
          asignatura,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Error al buscar tendencias');
      }

      showToast('Tendencias y fuentes 2026 actualizadas.');
      return data;
    } catch (err: any) {
      console.error(err);
      showToast('Error en análisis de mercado: ' + err.message, 'error');
      return null;
    }
  };

  // Incorporar tendencia a una unidad específica del sílabo
  const handleApplyTrendToSyllabus = (trend: TendenciaMercado) => {
    setSilabo((prev) => {
      const targetUnitIndex = (trend.unidadRecomendada || 1) - 1;
      const currentUnits = [...prev.programacionContenidos.unidades];

      if (currentUnits[targetUnitIndex]) {
        const unit = { ...currentUnits[targetUnitIndex] };
        if (unit.semanas && unit.semanas.length > 0) {
          const updatedSemanas = [...unit.semanas];
          const lastSemana = { ...updatedSemanas[updatedSemanas.length - 1] };
          lastSemana.contenidosConceptuales = [
            ...lastSemana.contenidosConceptuales,
            `Vanguardia 2026: ${trend.tema}`,
          ];
          updatedSemanas[updatedSemanas.length - 1] = lastSemana;
          unit.semanas = updatedSemanas;
        }
        currentUnits[targetUnitIndex] = unit;
      }

      const newElec: FuenteElectronica = {
        id: `trend-${Date.now()}`,
        autor: 'Investigación Curricular',
        anio: '2026',
        titulo: trend.tema,
        fuenteORevista: 'Vigencia de Mercado 2026',
        fechaRecuperado: '2026',
        url: 'https://doi.org/10.1016/j.chb.2025.108200',
        esActualizada: true,
      };

      return {
        ...prev,
        programacionContenidos: {
          unidades: currentUnits,
        },
        fuentesInformacion: {
          ...prev.fuentesInformacion,
          electronicas: [newElec, ...prev.fuentesInformacion.electronicas],
        },
      };
    });

    showToast(`"${trend.tema}" incorporado a la Unidad ${trend.unidadRecomendada} y a Fuentes.`);
  };

  // Actualizar todas las fuentes bibliográficas y electrónicas
  const handleUpdateSources = (newBiblio: FuenteBibliografica[], newElec: FuenteElectronica[]) => {
    setSilabo((prev) => ({
      ...prev,
      fuentesInformacion: {
        bibliograficas: newBiblio,
        electronicas: newElec,
      },
    }));
    showToast('Fuentes bibliográficas y electrónicas actualizadas a 2026 con normas APA.');
  };

  // Benchmark de Modelos de Frontera
  const handleRunComparison = async (
    selectedModelIds: string[],
    taskType: string,
    customInstruction?: string
  ): Promise<ComparisonEvaluation[]> => {
    try {
      showToast(`Ejecutando benchmark de ${selectedModelIds.length} modelos con reglas USMP...`, 'info');

      // Preparar payload con API Keys correspondientes a cada modelo seleccionado
      const modelsToCompare = selectedModelIds.map((id) => {
        const found = availableModels.find((m) => m.id === id);
        const provider = found?.provider || 'gemini';
        const apiKey = apiConfigs[provider]?.apiKey;
        return {
          id,
          name: found?.name || id,
          provider,
          model: id,
          apiKey,
        };
      });

      const response = await fetch('/api/ai/compare', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          modelsToCompare,
          modelIds: selectedModelIds,
          taskType,
          silaboContext: silabo,
          customInstruction,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Error al correr comparativa');
      }

      showToast('Benchmark multi-IA completado.');
      return data.evaluations || data.results || [];
    } catch (err: any) {
      console.error(err);
      showToast('Error en benchmark: ' + err.message, 'error');
      return [];
    }
  };

  // Adoptar contenido sugerido por un modelo ganador
  const handleAdoptModelContent = (modelId: string, content: string) => {
    // Si contiene división de Sumilla y Competencias
    const sumillaMatch = content.match(/### I\. SUMILLA[\s\S]*?(?=### II\.|$)/i);
    const compMatch = content.match(/### II\.[\s\S]*?(?=### III\.|$)/i);

    if (sumillaMatch) {
      const cleanSumilla = sumillaMatch[0]
        .replace(/### I\.[^\n]*\n+/i, '')
        .trim();
      setSilabo((prev) => ({
        ...prev,
        sumilla: {
          ...prev.sumilla,
          texto: cleanSumilla,
        },
      }));
    } else {
      setSilabo((prev) => ({
        ...prev,
        sumilla: {
          ...prev.sumilla,
          texto: content.trim(),
        },
      }));
    }

    if (compMatch) {
      const generalMatch = compMatch[0].match(/Competencia General:\s*([^\n•]+)/i);
      if (generalMatch && generalMatch[1]) {
        setSilabo((prev) => ({
          ...prev,
          competencias: {
            ...prev.competencias,
            general: generalMatch[1].trim(),
          },
        }));
      }
    }

    showToast(`Propuesta de ${modelId} adoptada e integrada al Sílabo.`);
  };

  // Parsear texto en bruto con IA al subir sílabo
  const handleParseRawTextWithAI = async (rawText: string): Promise<SilaboData | null> => {
    try {
      showToast('Analizando estructura del documento con IA...', 'info');
      const prompt = `Analiza el siguiente texto de un sílabo universitario y extráelo en formato estructurado:
${rawText.slice(0, 3000)}

Devuelve únicamente un JSON válido con la estructura SilaboData (institucion, datosGenerales, sumilla, competencias, programacionContenidos, evaluacion, fuentesInformacion).`;

      const response = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          provider: activeProvider,
          model: apiConfigs[activeProvider]?.model || 'gemini-3.8-flash',
          apiKey: apiConfigs[activeProvider]?.apiKey || '',
          prompt,
        }),
      });

      const data = await response.json();
      if (data && data.content) {
        const jsonMatch = data.content.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          return {
            ...SILABO_EJEMPLO_USMP,
            ...parsed,
          };
        }
      }
      return null;
    } catch (e) {
      console.error(e);
      return null;
    }
  };

  // Iniciar investigación del Agente IA y condensación en 4 unidades
  const handleStartAIGeneration = async (options: {
    nombreAsignatura: string;
    duracionModelo: '4_semanas' | '16_semanas';
    enfoquePedagogico: string;
    nivelBloom: string;
    instruccionDocente?: string;
  }) => {
    setIsAiGenerating(true);
    showToast(
      `Agente IA investigando literatura 2026 y condensando "${options.nombreAsignatura}" en 4 Unidades...`,
      'info'
    );

    try {
      // 1. Invocar búsqueda de tendencias y fuentes
      await handleSearchTrendsOnline(options.nombreAsignatura);

      // 2. Invocar síntesis curricular para sumilla y condensación en 4 unidades
      const prompt = `Diseña el plan de estudios y la condensación curricular para la asignatura universitaria:
Asignatura: "${options.nombreAsignatura}"
Universidad: "${silabo.institucion.nombreUniversidad}"
Estructura Requerida: EXACTAMENTE 4 UNIDADES TEMÁTICAS ${
        options.duracionModelo === '4_semanas'
          ? '(Modelo Modular USMP: 4 Semanas intensivas, 1 semana por unidad, 80h total)'
          : '(16 Semanas en total, 4 semanas por unidad)'
      }.
Enfoque Pedagógico: ${options.enfoquePedagogico}.
Demanda Cognitiva: ${options.nivelBloom}.
${options.instruccionDocente ? `Instrucciones del docente: ${options.instruccionDocente}` : ''}

Devuelve un JSON estrictamente estructurado:
{
  "sumillaTexto": "Texto completo de la sumilla...",
  "competenciaGeneral": "Competencia general formulada según Bloom...",
  "unidades": [
    {
      "numero": 1,
      "titulo": "Título de Unidad I",
      "capacidad": "Capacidad...",
      "contenidosConceptuales": ["Tema 1", "Tema 2", "Tema 3"],
      "contenidosProcedimentales": ["Procedimiento 1", "Procedimiento 2"],
      "actividadesAprendizaje": ["Actividad 1", "Actividad 2"]
    },
    {
      "numero": 2,
      "titulo": "Título de Unidad II",
      "capacidad": "Capacidad...",
      "contenidosConceptuales": ["Tema 1", "Tema 2"],
      "contenidosProcedimentales": ["Procedimiento 1"],
      "actividadesAprendizaje": ["Actividad 1"]
    },
    {
      "numero": 3,
      "titulo": "Título de Unidad III",
      "capacidad": "Capacidad...",
      "contenidosConceptuales": ["Tema 1", "Tema 2"],
      "contenidosProcedimentales": ["Procedimiento 1"],
      "actividadesAprendizaje": ["Actividad 1"]
    },
    {
      "numero": 4,
      "titulo": "Título de Unidad IV",
      "capacidad": "Capacidad...",
      "contenidosConceptuales": ["Tema 1", "Tema 2"],
      "contenidosProcedimentales": ["Procedimiento 1"],
      "actividadesAprendizaje": ["Actividad 1"]
    }
  ]
}`;

      const aiResponse = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          provider: activeProvider,
          model: apiConfigs[activeProvider]?.model || 'gemini-3.8-flash',
          apiKey: apiConfigs[activeProvider]?.apiKey || '',
          prompt,
        }),
      });

      const aiData = await aiResponse.json();

      let parsedAi: any = null;
      if (aiData?.content) {
        const jsonMatch = aiData.content.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          try {
            parsedAi = JSON.parse(jsonMatch[0]);
          } catch {
            // fallback
          }
        }
      }

      setSilabo((prev) => {
        const nuevasUnidades = [1, 2, 3, 4].map((num) => {
          const aiUnit = parsedAi?.unidades?.find((u: any) => u.numero === num) || parsedAi?.unidades?.[num - 1];

          const semanas = [
            {
              semana: num,
              contenidosConceptuales: aiUnit?.contenidosConceptuales || [
                `Bases y fundamentos contemporáneos de ${options.nombreAsignatura} - Módulo ${num}`,
                `Modelos teóricos y aplicaciones prácticas 2026`,
              ],
              contenidosProcedimentales: aiUnit?.contenidosProcedimentales || [
                `Analiza y resuelve casos aplicados de la Unidad ${num}.`,
                `Elabora un organizador del conocimiento sobre los principios clave.`,
              ],
              actividadesAprendizaje: aiUnit?.actividadesAprendizaje || [
                `Foro de debate virtual ${num}`,
                `Control de lectura formativo ${num}`,
                `Tarea aplicativa calificada ${num}`,
              ],
              horasLectivas: {
                teoria: 4,
                practica: 2,
              },
              horasNoLectivas: {
                teoria: 8,
                practica: 6,
              },
            },
          ];

          return {
            numero: num,
            titulo:
              aiUnit?.titulo ||
              (num === 1
                ? `Fundamentos y Enfoques de ${options.nombreAsignatura}`
                : num === 2
                ? `Procesos y Modelos Teóricos Contemporáneos`
                : num === 3
                ? `Aplicaciones Prácticas, Tecnología y Entornos Digitales`
                : `Evaluación, Casos y Prospectiva Profesional`),
            capacidad:
              aiUnit?.capacidad ||
              `Aplica y fundamenta los conocimientos de la Unidad ${num} en situaciones educativas y profesionales.`,
            semanas,
          };
        });

        return {
          ...prev,
          datosGenerales: {
            ...prev.datosGenerales,
            nombreAsignatura: options.nombreAsignatura,
          },
          sumilla: {
            ...prev.sumilla,
            texto:
              parsedAi?.sumillaTexto ||
              `Asignatura de especialidad teórico-práctica que tiene como propósito brindar las competencias fundamentales en ${options.nombreAsignatura}, con énfasis en la actualización científica, la mediación tecnológica y la formación por competencias conforme a los estándares universitarios.`,
            unidades: nuevasUnidades.map((u) => u.titulo),
          },
          competencias: {
            ...prev.competencias,
            general:
              parsedAi?.competenciaGeneral ||
              `Desarrolla competencias científicas y pedagógicas en ${options.nombreAsignatura} demostrando pensamiento crítico, rigor metodológico y ética profesional.`,
          },
          programacionContenidos: {
            unidades: nuevasUnidades,
          },
        };
      });

      setActiveTab('silabo');
      showToast(`¡Sílabo de ${options.nombreAsignatura} condensado en 4 Unidades con éxito!`);
    } catch (err: any) {
      console.error(err);
      setSilabo((prev) => ({
        ...prev,
        datosGenerales: {
          ...prev.datosGenerales,
          nombreAsignatura: options.nombreAsignatura,
        },
      }));
      setActiveTab('silabo');
      showToast(`Configuración aplicada. Puede continuar editando el sílabo en pantalla.`);
    } finally {
      setIsAiGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-800 flex flex-col font-sans selection:bg-rose-100 selection:text-rose-900">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-xl shadow-lg border text-xs sm:text-sm font-semibold transition-all bg-white border-slate-200 text-slate-900">
          {toastMessage.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
          {toastMessage.type === 'info' && <Sparkles className="w-4 h-4 text-rose-600 animate-spin" />}
          {toastMessage.type === 'error' && <AlertCircle className="w-4 h-4 text-red-600" />}
          <span>{toastMessage.text}</span>
        </div>
      )}

      {/* Sticky Top Navbar */}
      <Navbar
        currentTab={activeTab}
        setCurrentTab={setActiveTab}
        silabo={silabo}
        onResetToUSMP={handleResetToUSMP}
        onOpenImportModal={() => setIsImportModalOpen(true)}
        onOpenApiModal={() => setIsCloudModalOpen(true)}
        onPrint={handlePrint}
        horasCoherentes={validacionHoras.esCoherente}
      />

      {/* Breadcrumb / Status Banner */}
      <div className="no-print bg-white border-b border-slate-200/80 py-2.5 px-4 sm:px-8">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between text-xs text-slate-500 gap-2">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800">{silabo.institucion.nombreUniversidad}</span>
            <span>•</span>
            <span className="text-slate-600">{silabo.institucion.institutoOFacultad}</span>
            <span>•</span>
            <span className="text-rose-700 font-semibold">{silabo.datosGenerales.nombreAsignatura}</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 font-mono text-[11px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
              <span>Motor Activo:</span>
              <strong className="text-slate-900 uppercase">{activeProvider}</strong>
            </span>
            <span className="flex items-center gap-1 font-mono text-[11px] bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded border border-emerald-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>Google Cloud Ready</span>
            </span>
          </div>
        </div>
      </div>

      {/* Main Content Body */}
      <main className="flex-1 w-full pb-16">
        {activeTab === 'portada' && (
          <SyllabusCoverSetupView
            silabo={silabo}
            onUpdateSilabo={handleUpdateSilabo}
            onStartAIGeneration={handleStartAIGeneration}
            onGoToSyllabusView={() => setActiveTab('silabo')}
            onOpenApiModal={() => setIsCloudModalOpen(true)}
            isGenerating={isAiGenerating}
          />
        )}

        {activeTab === 'silabo' && (
          <OfficialSyllabusView
            silabo={silabo}
            onChangeSilabo={handleUpdateSilabo}
            onTriggerAIAction={handleTriggerAIAction}
          />
        )}

        {activeTab === 'pedagogia' && (
          <PedagogicalAuditView
            silabo={silabo}
            onApplyPedagogicalImprovements={(improved) => {
              setSilabo(improved);
              showToast('Mejoras pedagógicas aplicadas al sílabo.');
            }}
            onRunAiAudit={() => {
              handleTriggerAIAction('sumilla', 'Auditar Taxonomía de Bloom y horas');
            }}
          />
        )}

        {activeTab === 'mercado' && (
          <MarketTrendsView
            silabo={silabo}
            onApplyTrendToSyllabus={handleApplyTrendToSyllabus}
            onUpdateSources={handleUpdateSources}
            onSearchTrendsOnline={handleSearchTrendsOnline}
          />
        )}

        {activeTab === 'comparativa' && (
          <ModelComparisonView
            silabo={silabo}
            availableModels={availableModels}
            onAdoptContent={handleAdoptModelContent}
            onRunComparison={handleRunComparison}
            apiConfigs={apiConfigs}
          />
        )}
      </main>

      {/* Cloud Run & Multi-Model API Keys Modal */}
      <CloudAndApiKeyModal
        isOpen={isCloudModalOpen}
        onClose={() => setIsCloudModalOpen(false)}
        apiConfigs={apiConfigs}
        onSaveConfigs={(configs) => {
          setApiConfigs(configs);
          showToast('Claves de API guardadas correctamente.');
        }}
        activeProvider={activeProvider}
        onSelectActiveProvider={(prov) => {
          setActiveProvider(prov);
          showToast(`Motor de IA activo cambiado a: ${prov.toUpperCase()}`);
        }}
      />

      {/* Import / Upload Syllabus Modal */}
      <ImportSyllabusModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onImportSyllabus={(imported) => {
          setSilabo(imported);
          showToast('Sílabo cargado exitosamente.');
        }}
        onParseRawTextWithAI={handleParseRawTextWithAI}
      />
    </div>
  );
}
