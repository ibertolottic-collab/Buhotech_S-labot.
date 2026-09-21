import React, { useState } from 'react';
import {
  Sparkles,
  GraduationCap,
  Building2,
  Clock,
  Layers,
  Sliders,
  Image,
  Upload,
  Link,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  BookOpen,
  Compass,
  Cpu,
  RefreshCw,
  FileCheck,
  ShieldCheck,
  Scale,
  Calculator,
} from 'lucide-react';
import { SilaboData } from '../types';
import { UniversityHeader } from './UniversityHeader';
import { calcularTotalesHoras } from '../utils/hoursAndCredits';

interface Props {
  silabo: SilaboData;
  onUpdateSilabo: (updated: SilaboData) => void;
  onStartAIGeneration: (options: {
    nombreAsignatura: string;
    duracionModelo: '4_semanas' | '16_semanas';
    enfoquePedagogico: string;
    nivelBloom: string;
    instruccionDocente?: string;
  }) => Promise<void>;
  onGoToSyllabusView: () => void;
  onOpenApiModal: () => void;
  isGenerating?: boolean;
}

export const SyllabusCoverSetupView: React.FC<Props> = ({
  silabo,
  onUpdateSilabo,
  onStartAIGeneration,
  onGoToSyllabusView,
  onOpenApiModal,
  isGenerating = false,
}) => {
  // Estado local para los campos de la portada
  const [nombreAsignatura, setNombreAsignatura] = useState(silabo.datosGenerales.nombreAsignatura);
  const [duracionModelo, setDuracionModelo] = useState<'4_semanas' | '16_semanas'>('4_semanas');
  const [enfoquePedagogico, setEnfoquePedagogico] = useState(
    'Constructivismo y Conectivismo de George Siemens (Redes digitales y mediación con IA)'
  );
  const [nivelBloom, setNivelBloom] = useState('Nivel 3 y 4 (Aplicar y Analizar - Ciclos Intermedios)');
  const [instruccionDocente, setInstruccionDocente] = useState('');

  // Configuración de logo
  const [logoMode, setLogoMode] = useState<'usmp' | 'upload' | 'url'>(
    silabo.institucion.logoTipo === 'usmp' ? 'usmp' : silabo.institucion.customLogoUrl ? 'url' : 'usmp'
  );
  const [customLogoUrl, setCustomLogoUrl] = useState(silabo.institucion.customLogoUrl || '');
  const [ajusteModo, setAjusteModo] = useState<'auto' | 'manual'>(
    silabo.institucion.logoAjuste?.modo || 'auto'
  );
  const [alturaPx, setAlturaPx] = useState<number>(silabo.institucion.logoAjuste?.alturaPx || 64);
  const [escalaGrises, setEscalaGrises] = useState<boolean>(
    silabo.institucion.logoAjuste?.escalaGrises || false
  );

  // Institución
  const [nombreUniversidad, setNombreUniversidad] = useState(silabo.institucion.nombreUniversidad);
  const [institutoOFacultad, setInstitutoOFacultad] = useState(silabo.institucion.institutoOFacultad);
  const [departamentoAcademico, setDepartamentoAcademico] = useState(
    silabo.institucion.departamentoAcademico || 'Departamento Académico de Educación'
  );
  const [carreraPrograma, setCarreraPrograma] = useState(silabo.datosGenerales.programaAcademico);
  const [ciclo, setCiclo] = useState(silabo.datosGenerales.ciclo);
  const [semestre, setSemestre] = useState(silabo.datosGenerales.semestreAcademico);
  const [creditos, setCreditos] = useState<number>(silabo.datosGenerales.creditos.total);

  // Sugerencias rápidas de asignaturas
  const sugerenciasAsignaturas = [
    'Psicología General',
    'Inteligencia Artificial Aplicada a la Educación',
    'Neurociencia Cognitiva y Aprendizaje',
    'Diseño y Evaluación Curricular Universitaria',
    'Metodología de la Investigación Científica',
    'Psicología del Desarrollo y Aprendizaje',
  ];

  // Manejo de carga de archivo de logo
  const handleLogoFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64Url = event.target?.result as string;
      setCustomLogoUrl(base64Url);
      setLogoMode('upload');

      // Actualizar inmediatamente en el sílabo
      onUpdateSilabo({
        ...silabo,
        institucion: {
          ...silabo.institucion,
          logoTipo: 'custom',
          customLogoUrl: base64Url,
          logoAjuste: {
            modo: ajusteModo,
            alturaPx,
            escalaGrises,
          },
        },
      });
    };
    reader.readAsDataURL(file);
  };

  // Guardar cambios en el sílabo cuando cambian los datos de institución o logo
  const applyLogoChanges = (
    tipo: 'usmp' | 'custom',
    url?: string,
    modo: 'auto' | 'manual' = ajusteModo,
    altura: number = alturaPx,
    grises: boolean = escalaGrises
  ) => {
    onUpdateSilabo({
      ...silabo,
      institucion: {
        ...silabo.institucion,
        nombreUniversidad,
        institutoOFacultad,
        departamentoAcademico,
        logoTipo: tipo,
        customLogoUrl: url,
        logoAjuste: {
          modo,
          alturaPx: altura,
          escalaGrises: grises,
        },
      },
      datosGenerales: {
        ...silabo.datosGenerales,
        nombreAsignatura,
        programaAcademico: carreraPrograma,
        ciclo,
        semestreAcademico: semestre,
      },
    });
  };

  const handleLaunchAIGeneration = async () => {
    // Sincronizar primero
    applyLogoChanges(
      logoMode === 'usmp' ? 'usmp' : 'custom',
      logoMode === 'usmp' ? undefined : customLogoUrl,
      ajusteModo,
      alturaPx,
      escalaGrises
    );

    // Ejecutar agente IA con los parámetros solicitados
    await onStartAIGeneration({
      nombreAsignatura,
      duracionModelo,
      enfoquePedagogico,
      nivelBloom,
      instruccionDocente,
    });
  };

  return (
    <div className="w-full max-w-5xl mx-auto my-6 px-4 sm:px-6 space-y-6">
      {/* Header Banner de Portada Buhotech Sílabot */}
      <div className="bg-gradient-to-r from-rose-950 via-rose-900 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-sm relative overflow-hidden">
        <div className="absolute -right-12 -top-12 w-64 h-64 bg-rose-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-white p-1.5 shadow-md flex items-center justify-center overflow-hidden shrink-0 border border-rose-200">
                <img
                  src="https://lh3.googleusercontent.com/d/1OdufJ5QXGbxxhOjfyvDhfuM2gp-reMgi"
                  alt="Logo Buhotech Sílabot"
                  className="w-full h-full object-contain"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-white/10 text-rose-200 border border-white/20">
                  <Sparkles className="w-3 h-3 text-rose-300" />
                  <span>Plataforma Curricular Universitaria</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white leading-tight">
                  Buhotech <span className="text-rose-400">Sílabot</span>
                </h1>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-rose-100/90 leading-relaxed">
              Diseño, condensación y auditoría de sílabos universitarios bajo el <strong>Modelo Oficial USMP</strong>. El <strong>Sistema Base</strong> garantiza la inviolabilidad matemática de horas y créditos, mientras el <strong>Agente de IA vía API Key</strong> investiga literatura contemporánea 2025–2026 y formula competencias según la Taxonomía de Bloom.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row md:flex-col gap-2.5 min-w-[210px]">
            <button
              type="button"
              onClick={handleLaunchAIGeneration}
              disabled={isGenerating || !nombreAsignatura.trim()}
              className="px-5 py-3 rounded-xl bg-white hover:bg-rose-50 text-rose-900 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xs transition-all disabled:opacity-50 cursor-pointer"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-rose-700" />
                  <span>Agente Investigando...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-rose-600" />
                  <span>Iniciar Agente IA</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={onGoToSyllabusView}
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium text-xs flex items-center justify-center gap-1.5 border border-white/20 transition-colors cursor-pointer"
            >
              <FileCheck className="w-3.5 h-3.5" />
              <span>Ver Sílabo Oficial en Pantalla</span>
            </button>
          </div>
        </div>
      </div>

      {/* Live Preview del Membrete Universitario */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
            <GraduationCap className="w-4 h-4 text-rose-700" />
            <span>Vista Previa en Vivo del Membrete Institucional</span>
          </span>
          <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-600">
            Ajuste: {ajusteModo === 'auto' ? 'Automático (IA Óptica 64px)' : `${alturaPx}px Manual`}
          </span>
        </div>

        {/* Componente Header en vivo */}
        <div className="p-4 bg-slate-50/50 rounded-xl border border-slate-200/80">
          <UniversityHeader institucion={silabo.institucion} />
        </div>
      </div>

      {/* ARQUITECTURA: DIVISIÓN DE RESPONSABILIDADES EN BUHOTECH SÍLABOT */}
      <div className="bg-slate-900 text-white rounded-2xl p-5 sm:p-6 shadow-2xs border border-slate-800 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <Scale className="w-5 h-5 text-amber-400" />
            <div>
              <h3 className="font-extrabold text-sm sm:text-base text-white tracking-tight">
                Arquitectura Buhotech Sílabot: Separación de Roles y Garantía Normativa
              </h3>
              <p className="text-[11px] text-slate-400">
                ¿Qué realiza el Sistema Base y qué realiza el Agente de IA vía API Key?
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onOpenApiModal}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Cpu className="w-3.5 h-3.5 text-rose-400" />
            <span>Configurar API Keys</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          {/* Columna Sistema Base */}
          <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700/80 space-y-2">
            <div className="flex items-center gap-2 text-rose-400 font-bold uppercase tracking-wider text-[10px]">
              <ShieldCheck className="w-4 h-4 text-rose-400" />
              <span>Garantizado por el Sistema Buhotech Sílabot (Inviolable)</span>
            </div>
            <ul className="space-y-1.5 text-slate-300 text-[11px]">
              <li className="flex items-start gap-1.5">
                <Calculator className="w-3.5 h-3.5 text-rose-400 mt-0.5 shrink-0" />
                <span><strong>Cuadre algebraico de horas:</strong> 4 créditos = exactamente 80h (16h TL + 32h TNL + 8h PL + 24h PNL). No alucina números.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-rose-400 mt-0.5 shrink-0" />
                <span><strong>Las 8 Secciones Canónicas USMP:</strong> Estructura inmutable oficial desde Datos Generales hasta Fuentes de Información.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-rose-400 mt-0.5 shrink-0" />
                <span><strong>4 Unidades Temáticas:</strong> Condensación obligatoria de los contenidos en exactamente 4 bloques modulares.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <FileCheck className="w-3.5 h-3.5 text-rose-400 mt-0.5 shrink-0" />
                <span><strong>Fórmula de Evaluación y Redondeo:</strong> 40% continua / 60% tareas y casos con medio punto (0.5) a favor del alumno.</span>
              </li>
            </ul>
          </div>

          {/* Columna Agente IA */}
          <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700/80 space-y-2">
            <div className="flex items-center gap-2 text-emerald-400 font-bold uppercase tracking-wider text-[10px]">
              <Cpu className="w-4 h-4 text-emerald-400" />
              <span>Generado por el Agente IA vía API Key (Semántico y Cognitivo)</span>
            </div>
            <ul className="space-y-1.5 text-slate-300 text-[11px]">
              <li className="flex items-start gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400 mt-0.5 shrink-0" />
                <span><strong>Redacción de Sumilla:</strong> Propósito de aprendizaje, naturaleza disciplinar y síntesis adaptada a la carrera.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-emerald-400 mt-0.5 shrink-0" />
                <span><strong>Taxonomía de Bloom:</strong> Formulación de competencias con verbos activos de alto orden cognitivo (Analiza, Evalúa, Diseña).</span>
              </li>
              <li className="flex items-start gap-1.5">
                <FileCheck className="w-3.5 h-3.5 text-emerald-400 mt-0.5 shrink-0" />
                <span><strong>Literatura 2025–2026:</strong> Rastreo de artículos científicos y libros contemporáneos en formato APA 7ma con enlaces DOI.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <Compass className="w-3.5 h-3.5 text-emerald-400 mt-0.5 shrink-0" />
                <span><strong>Actividades de Aprendizaje Auténtico:</strong> Diseño de foros, casos prácticos reales y tareas formativas semanales.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* TARJETA 1: GESTIÓN DE LOGO Y ADAPTACIÓN DE TAMAÑO */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-700 flex items-center justify-center">
              <Image className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                1. Logotipo Institucional y Adaptación Visual
              </h2>
              <p className="text-xs text-slate-500">
                Seleccione el escudo oficial USMP, cargue un archivo o ingrese una URL. Configure si el agente IA adapta el tamaño o regúlelo manualmente.
              </p>
            </div>
          </div>
        </div>

        {/* Selector de Tipo de Logo */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Opción 1: USMP */}
          <button
            type="button"
            onClick={() => {
              setLogoMode('usmp');
              applyLogoChanges('usmp');
            }}
            className={`p-3.5 rounded-xl border text-left transition-all flex flex-col justify-between ${
              logoMode === 'usmp'
                ? 'border-rose-600 bg-rose-50/40 ring-2 ring-rose-600/10'
                : 'border-slate-200 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-xs text-slate-900">Escudo Oficial USMP</span>
              {logoMode === 'usmp' && <CheckCircle2 className="w-4 h-4 text-rose-600" />}
            </div>
            <p className="text-[11px] text-slate-500">
              Escudo heráldico vectorial con lema Veritas Liberabit Vos y colores institucionales.
            </p>
          </button>

          {/* Opción 2: Cargar Archivo */}
          <label
            className={`p-3.5 rounded-xl border text-left transition-all flex flex-col justify-between cursor-pointer ${
              logoMode === 'upload'
                ? 'border-rose-600 bg-rose-50/40 ring-2 ring-rose-600/10'
                : 'border-slate-200 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
                <Upload className="w-3.5 h-3.5 text-rose-600" />
                <span>Subir Archivo de Logo</span>
              </span>
              {logoMode === 'upload' && <CheckCircle2 className="w-4 h-4 text-rose-600" />}
            </div>
            <p className="text-[11px] text-slate-500">
              Cargar imagen institucional (.PNG, .JPG, .SVG, .WebP con fondo transparente).
            </p>
            <input
              type="file"
              accept="image/*"
              onChange={handleLogoFileUpload}
              className="hidden"
            />
          </label>

          {/* Opción 3: URL de Logo */}
          <button
            type="button"
            onClick={() => {
              setLogoMode('url');
              if (customLogoUrl) {
                applyLogoChanges('custom', customLogoUrl);
              }
            }}
            className={`p-3.5 rounded-xl border text-left transition-all flex flex-col justify-between ${
              logoMode === 'url'
                ? 'border-rose-600 bg-rose-50/40 ring-2 ring-rose-600/10'
                : 'border-slate-200 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
                <Link className="w-3.5 h-3.5 text-rose-600" />
                <span>Ingresar URL de Logo</span>
              </span>
              {logoMode === 'url' && <CheckCircle2 className="w-4 h-4 text-rose-600" />}
            </div>
            <p className="text-[11px] text-slate-500">
              Vincular enlace web público directo al imagotipo de la universidad.
            </p>
          </button>
        </div>

        {/* Input si seleccionó URL */}
        {logoMode === 'url' && (
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
            <label className="text-xs font-bold text-slate-700 block">
              URL del Logotipo Institucional:
            </label>
            <div className="flex gap-2">
              <input
                type="url"
                value={customLogoUrl}
                onChange={(e) => setCustomLogoUrl(e.target.value)}
                placeholder="https://ejemplo.edu.pe/logo-universidad.png"
                className="flex-1 px-3 py-1.5 border border-slate-300 rounded-lg text-xs bg-white focus:outline-hidden focus:ring-1 focus:ring-rose-500"
              />
              <button
                type="button"
                onClick={() => applyLogoChanges('custom', customLogoUrl)}
                className="px-3 py-1.5 bg-slate-900 text-white rounded-lg text-xs font-semibold hover:bg-slate-800 transition-colors"
              >
                Aplicar
              </button>
            </div>
          </div>
        )}

        {/* PANEL DE ADAPTACIÓN Y TAMAÑO DE LOGO */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <Sliders className="w-4 h-4 text-rose-600" />
              <span>Modalidad de Calibración de Tamaño:</span>
            </span>

            <div className="inline-flex rounded-lg border border-slate-300 bg-white p-0.5 text-xs">
              <button
                type="button"
                onClick={() => {
                  setAjusteModo('auto');
                  applyLogoChanges(
                    logoMode === 'usmp' ? 'usmp' : 'custom',
                    logoMode === 'usmp' ? undefined : customLogoUrl,
                    'auto'
                  );
                }}
                className={`px-3 py-1 rounded-md font-semibold transition-all ${
                  ajusteModo === 'auto'
                    ? 'bg-rose-700 text-white shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                🤖 Auto-Adaptación por Agente IA
              </button>
              <button
                type="button"
                onClick={() => {
                  setAjusteModo('manual');
                  applyLogoChanges(
                    logoMode === 'usmp' ? 'usmp' : 'custom',
                    logoMode === 'usmp' ? undefined : customLogoUrl,
                    'manual',
                    alturaPx
                  );
                }}
                className={`px-3 py-1 rounded-md font-semibold transition-all ${
                  ajusteModo === 'manual'
                    ? 'bg-rose-700 text-white shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                ⚙️ Ajuste Manual Milimétrico
              </button>
            </div>
          </div>

          {ajusteModo === 'auto' ? (
            <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200 flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
              <div className="text-xs text-emerald-900 leading-relaxed">
                <strong>Optimización Óptica Activada:</strong> El agente IA ajusta automáticamente el aspect-ratio, normaliza la altura a 64px (proporción institucional de membrete), recorta los márgenes transparentes excedentes y garantiza la lectura armónica con el nombre de la facultad.
              </div>
            </div>
          ) : (
            <div className="space-y-3 pt-1">
              <div className="flex items-center justify-between text-xs">
                <label className="font-semibold text-slate-700">
                  Altura del imagotipo: <span className="font-mono font-bold text-rose-700">{alturaPx}px</span>
                </label>
                <span className="text-slate-400 text-[11px]">(Rango normado: 40px – 130px)</span>
              </div>
              <input
                type="range"
                min={40}
                max={130}
                value={alturaPx}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setAlturaPx(val);
                  applyLogoChanges(
                    logoMode === 'usmp' ? 'usmp' : 'custom',
                    logoMode === 'usmp' ? undefined : customLogoUrl,
                    'manual',
                    val
                  );
                }}
                className="w-full accent-rose-600 cursor-pointer"
              />

              <div className="flex items-center gap-4 pt-1 text-xs">
                <label className="flex items-center gap-2 cursor-pointer text-slate-700">
                  <input
                    type="checkbox"
                    checked={escalaGrises}
                    onChange={(e) => {
                      setEscalaGrises(e.target.checked);
                      applyLogoChanges(
                        logoMode === 'usmp' ? 'usmp' : 'custom',
                        logoMode === 'usmp' ? undefined : customLogoUrl,
                        'manual',
                        alturaPx,
                        e.target.checked
                      );
                    }}
                    className="rounded text-rose-600 focus:ring-rose-500"
                  />
                  <span>Modo Monocromático / Escala de Grises (Impresión institucional económica)</span>
                </label>
              </div>
            </div>
          )}
        </div>

        {/* Nombres de Universidad y Facultad */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Nombre de la Universidad:
            </label>
            <input
              type="text"
              value={nombreUniversidad}
              onChange={(e) => {
                setNombreUniversidad(e.target.value);
                onUpdateSilabo({
                  ...silabo,
                  institucion: { ...silabo.institucion, nombreUniversidad: e.target.value },
                });
              }}
              className="w-full p-2.5 border border-slate-300 rounded-xl text-xs sm:text-sm bg-white focus:outline-hidden focus:ring-2 focus:ring-rose-500/20"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Facultad o Instituto Responsable:
            </label>
            <input
              type="text"
              value={institutoOFacultad}
              onChange={(e) => {
                setInstitutoOFacultad(e.target.value);
                onUpdateSilabo({
                  ...silabo,
                  institucion: { ...silabo.institucion, institutoOFacultad: e.target.value },
                });
              }}
              className="w-full p-2.5 border border-slate-300 rounded-xl text-xs sm:text-sm bg-white focus:outline-hidden focus:ring-2 focus:ring-rose-500/20"
            />
          </div>
        </div>
      </div>

      {/* TARJETA 2: DATOS ESENCIALES PARA EL AGENTE IA Y CONDENSACIÓN EN 4 UNIDADES */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-700 flex items-center justify-center">
              <Cpu className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                2. Parámetros de Investigación y Condensación Curricular
              </h2>
              <p className="text-xs text-slate-500">
                El Agente IA tomará el nombre de la asignatura para realizar su búsqueda comparativa de literatura y competencias de mercado contemporáneas.
              </p>
            </div>
          </div>
        </div>

        {/* NOMBRE DE LA ASIGNATURA (CAMPO CLAVE) */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-800 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <span>Nombre de la Asignatura a Diseñar:</span>
              <span className="text-rose-600 font-bold">*</span>
            </span>
            <span className="text-[11px] text-slate-500 font-normal">
              Base de la búsqueda del Agente IA
            </span>
          </label>
          <div className="relative">
            <input
              type="text"
              value={nombreAsignatura}
              onChange={(e) => setNombreAsignatura(e.target.value)}
              placeholder="Ej: Psicología General, Inteligencia Artificial en Educación, Neurociencia..."
              className="w-full px-4 py-3 border-2 border-rose-300 focus:border-rose-600 rounded-xl text-sm sm:text-base font-bold text-slate-900 bg-white focus:outline-hidden shadow-2xs"
            />
          </div>

          {/* Sugerencias Rápidas con 1 clic */}
          <div className="flex flex-wrap items-center gap-1.5 pt-1">
            <span className="text-[11px] font-semibold text-slate-500">Ejemplos frecuentes:</span>
            {sugerenciasAsignaturas.map((sug, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setNombreAsignatura(sug)}
                className="text-[11px] px-2.5 py-1 rounded-full bg-slate-100 hover:bg-rose-100 hover:text-rose-800 text-slate-700 transition-colors border border-slate-200"
              >
                {sug}
              </button>
            ))}
          </div>
        </div>

        {/* ESTRUCTURA DE DURACIÓN: CONDENSACIÓN 4 UNIDADES (MODELO USMP) */}
        <div className="space-y-3 pt-2">
          <label className="text-xs font-bold text-slate-800 block">
            Estructura y Duración del Curso (Condensación de Temas):
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Opción A: Modelo Modular USMP 4 Semanas */}
            <button
              type="button"
              onClick={() => setDuracionModelo('4_semanas')}
              className={`p-4 rounded-xl border text-left transition-all relative flex flex-col justify-between ${
                duracionModelo === '4_semanas'
                  ? 'border-rose-600 bg-rose-50/50 ring-2 ring-rose-600/10'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-bold text-xs sm:text-sm text-slate-900 flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-rose-700" />
                    <span>Modelo Modular USMP: 4 Semanas</span>
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-200">
                    Oficial USMP
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  <strong>Condensación intensiva:</strong> 4 semanas = 4 unidades temáticas (1 semana por unidad). El agente sintetiza los contenidos conceptuales, procedimentales y actitudinales en 4 bloques de alta demanda cognitiva.
                </p>
              </div>

              <div className="mt-3 pt-2 border-t border-rose-200/50 text-[11px] text-rose-800 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>80 horas cronológicas = 4 créditos académicos</span>
              </div>
            </button>

            {/* Opción B: Modelo Semestral Regular */}
            <button
              type="button"
              onClick={() => setDuracionModelo('16_semanas')}
              className={`p-4 rounded-xl border text-left transition-all relative flex flex-col justify-between ${
                duracionModelo === '16_semanas'
                  ? 'border-rose-600 bg-rose-50/50 ring-2 ring-rose-600/10'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-bold text-xs sm:text-sm text-slate-900 flex items-center gap-1.5">
                    <Layers className="w-4 h-4 text-slate-700" />
                    <span>Modelo Semestral: 16 Semanas</span>
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-100 text-slate-600">
                    Semestral Tradicional
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Distribución semestral extendida: 4 semanas por cada unidad (16 semanas lectivas en total para ciclos presenciales o regulares).
                </p>
              </div>

              <div className="mt-3 pt-2 border-t border-slate-200 text-[11px] text-slate-600 font-medium">
                Desglose extendido por semanas
              </div>
            </button>
          </div>
        </div>

        {/* DATOS DE CARRERA, CICLO Y CRÉDITOS */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Programa / Carrera:
            </label>
            <input
              type="text"
              value={carreraPrograma}
              onChange={(e) => setCarreraPrograma(e.target.value)}
              className="w-full p-2.5 border border-slate-300 rounded-xl text-xs sm:text-sm bg-white focus:outline-hidden focus:ring-2 focus:ring-rose-500/20"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Ciclo y Semestre:
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={ciclo}
                onChange={(e) => setCiclo(e.target.value)}
                placeholder="Ciclo III"
                className="w-1/2 p-2.5 border border-slate-300 rounded-xl text-xs bg-white focus:outline-hidden focus:ring-2 focus:ring-rose-500/20"
              />
              <input
                type="text"
                value={semestre}
                onChange={(e) => setSemestre(e.target.value)}
                placeholder="2026-I"
                className="w-1/2 p-2.5 border border-slate-300 rounded-xl text-xs bg-white focus:outline-hidden focus:ring-2 focus:ring-rose-500/20"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Créditos Académicos:
            </label>
            <select
              value={creditos}
              onChange={(e) => setCreditos(Number(e.target.value))}
              className="w-full p-2.5 border border-slate-300 rounded-xl text-xs sm:text-sm bg-white focus:outline-hidden focus:ring-2 focus:ring-rose-500/20"
            >
              <option value={2}>2 Créditos (40 horas totales)</option>
              <option value={3}>3 Créditos (60 horas totales)</option>
              <option value={4}>4 Créditos (80 horas totales - Oficial USMP)</option>
              <option value={5}>5 Créditos (100 horas totales)</option>
            </select>
          </div>
        </div>

        {/* DIRECTRICES PEDAGÓGICAS Y DE MERCADO */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
          <div className="flex items-center gap-2">
            <Compass className="w-4 h-4 text-rose-700" />
            <span className="text-xs font-bold text-slate-800">
              Directrices Pedagógicas y de Demanda Laboral para el Agente:
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <label className="text-slate-600 block mb-1 font-semibold">
                Enfoque Epistemológico:
              </label>
              <select
                value={enfoquePedagogico}
                onChange={(e) => setEnfoquePedagogico(e.target.value)}
                className="w-full p-2 border border-slate-300 rounded-lg bg-white"
              >
                <option value="Constructivismo y Conectivismo de George Siemens (Redes digitales y mediación con IA)">
                  Constructivismo y Conectivismo de Siemens (Oficial USMP Virtual)
                </option>
                <option value="Aprendizaje Basado en Problemas y Casos Clínicos">
                  Aprendizaje Basado en Problemas (ABP) y Estudio de Casos
                </option>
                <option value="Enfoque por Competencias y Evaluación Auténtica">
                  Enfoque por Competencias con Rúbricas Formativas
                </option>
              </select>
            </div>

            <div>
              <label className="text-slate-600 block mb-1 font-semibold">
                Demanda Cognitiva (Taxonomía de Bloom):
              </label>
              <select
                value={nivelBloom}
                onChange={(e) => setNivelBloom(e.target.value)}
                className="w-full p-2 border border-slate-300 rounded-lg bg-white"
              >
                <option value="Nivel 3 y 4 (Aplicar y Analizar - Ciclos Intermedios)">
                  Nivel 3 y 4: Aplicar y Analizar (Recomendado Ciclos III-VI)
                </option>
                <option value="Nivel 5 y 6 (Evaluar y Crear - Ciclos Avanzados)">
                  Nivel 5 y 6: Evaluar y Diseñar Soluciones (Ciclos VII-X)
                </option>
                <option value="Nivel 1 y 2 (Recordar y Comprender - Ciclos Básicos)">
                  Nivel 1 y 2: Recordar y Comprender (Ciclos I-II)
                </option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-slate-600 block mb-1 font-semibold text-xs">
              Instrucción Docente Opcional para el Agente (Prioridades de Contenido):
            </label>
            <input
              type="text"
              value={instruccionDocente}
              onChange={(e) => setInstruccionDocente(e.target.value)}
              placeholder="Ej: Enfatizar el impacto de la IA generativa en el aprendizaje y añadir casos prácticos peruanos..."
              className="w-full p-2 border border-slate-300 rounded-lg text-xs bg-white focus:outline-hidden focus:ring-1 focus:ring-rose-500"
            />
          </div>
        </div>
      </div>

      {/* FOOTER ACTION BAR */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <button
            type="button"
            onClick={onOpenApiModal}
            className="text-rose-700 font-semibold hover:underline flex items-center gap-1"
          >
            <span>Cambiar Clave API / Motor de IA</span>
          </button>
          <span>•</span>
          <span>Google Gemini 3.8 Flash (Server Native)</span>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            type="button"
            onClick={onGoToSyllabusView}
            className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-50 transition-colors"
          >
            Abrir Sílabo Actual
          </button>

          <button
            type="button"
            onClick={handleLaunchAIGeneration}
            disabled={isGenerating || !nombreAsignatura.trim()}
            className="flex-1 sm:flex-initial px-6 py-2.5 rounded-xl bg-rose-700 hover:bg-rose-800 text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-xs transition-all disabled:opacity-50"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-white" />
                <span>Investigando y Condensando...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Iniciar Agente IA y Condensar 4 Unidades</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
