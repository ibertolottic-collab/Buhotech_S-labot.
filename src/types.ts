export type TipoAsignatura = 'General' | 'Específica' | 'Especialidad';
export type ModalidadAsignatura = 'Presencial' | 'Semipresencial' | 'A distancia';

export interface HorasDetalle {
  teoriaLectivaPresencial: number;
  teoriaLectivaDistancia: number;
  teoriaNoLectivaPresencial: number;
  teoriaNoLectivaDistancia: number;
  practicaLectivaPresencial: number;
  practicaLectivaDistancia: number;
  practicaNoLectivaPresencial: number;
  practicaNoLectivaDistancia: number;
}

export interface CreditosDetalle {
  teoria: number;
  practica: number;
  total: number;
}

export interface Docente {
  id: string;
  grado: string;
  nombre: string;
  email?: string;
}

export interface SemanaProgramacion {
  semana: number;
  contenidosConceptuales: string[];
  contenidosProcedimentales: string[];
  actividadesAprendizaje: string[];
  horasLectivas: {
    teoria: number;
    practica: number;
  };
  horasNoLectivas: {
    teoria: number;
    practica: number;
  };
}

export interface UnidadAprendizaje {
  numero: number;
  titulo: string;
  capacidad: string;
  semanas: SemanaProgramacion[];
}

export interface FuenteBibliografica {
  id: string;
  autor: string;
  anio: string;
  titulo: string;
  edicion?: string;
  lugar?: string;
  editorial: string;
  esActualizada?: boolean;
}

export interface FuenteElectronica {
  id: string;
  autor: string;
  anio: string;
  titulo: string;
  fuenteORevista?: string;
  fechaRecuperado: string;
  url: string;
  doi?: string;
  esActualizada?: boolean;
}

export interface ComponenteEvaluacion {
  nombre: string;
  pesoPorcentaje: number;
  descripcion: string;
}

export interface SilaboData {
  id: string;
  institucion: {
    nombreUniversidad: string;
    institutoOFacultad: string;
    departamentoAcademico: string;
    logoTipo: 'usmp' | 'custom';
    customLogoUrl?: string;
    logoAjuste?: {
      modo: 'auto' | 'manual';
      alturaPx?: number;
      alineacion?: 'left' | 'center' | 'right';
      escalaGrises?: boolean;
    };
  };
  datosGenerales: {
    nombreAsignatura: string;
    programaAcademico: string;
    semestreAcademico: string;
    tipoAsignatura: TipoAsignatura;
    modalidad: ModalidadAsignatura;
    codigoAsignatura: string;
    ciclo: string;
    requisitos: string;
    horas: HorasDetalle;
    creditos: CreditosDetalle;
    docentes: Docente[];
  };
  sumilla: {
    texto: string;
    areaFormacion: string;
    naturaleza: string;
    unidades: string[];
    exigencias: string;
  };
  competencias: {
    general: string;
    especificas: string[];
    capacidades: string[];
    contenidosActitudinales: string[];
  };
  programacionContenidos: {
    unidades: UnidadAprendizaje[];
  };
  estrategiasMetodologicas: {
    fundamentacion: string;
    estrategias: string[];
  };
  recursosDidacticos: string[];
  evaluacion: {
    normativa: string;
    formula: string;
    sistemaCalificacion: string;
    notaMinima: number;
    reglaMedioPunto: boolean;
    componentes: ComponenteEvaluacion[];
  };
  fuentesInformacion: {
    bibliograficas: FuenteBibliografica[];
    electronicas: FuenteElectronica[];
  };
  metadatosAuditoria?: {
    ultimaActualizacion: string;
    modeloUtilizado?: string;
    puntajePedagogico?: number;
    alineamientoMercado?: string;
  };
}

export type AIProvider = 'gemini' | 'openai' | 'anthropic' | 'deepseek';

export interface ModelOption {
  id: string;
  provider: AIProvider;
  name: string;
  tag: string;
  description: string;
  requiresKey?: boolean;
}

export interface AIProviderConfig {
  provider: AIProvider;
  apiKey?: string;
  model: string;
}

export interface ComparisonEvaluation {
  modelId: string;
  modelName: string;
  provider: AIProvider;
  durationMs?: number;
  generatedContent: string;
  metrics: {
    alineamientoBloom: number; // 0-100
    actualidadMercado: number; // 0-100
    rigorPedagogico: number; // 0-100
    precisionHoras: number; // 0-100
    promedioGeneral: number;
  };
  analisisCritico: string;
  puntosFuertes: string[];
  oportunidadesMejora: string[];
}

export interface TendenciaMercado {
  tema: string;
  justificacion: string;
  demandaLaboral: 'Alta' | 'Media' | 'Crítica Emergente';
  referenciaSugerida: string;
  unidadRecomendada: number;
}

export interface AuditoriaPedagogica {
  puntajeTotal: number;
  estado: 'Excelente' | 'Aceptable' | 'Requiere Ajustes' | 'Crítico';
  hallazgos: Array<{
    tipo: 'exito' | 'advertencia' | 'error';
    seccion: string;
    mensaje: string;
    sugerencia: string;
  }>;
  resumenHorasCreditos: {
    horasTeoria: number;
    horasPractica: number;
    totalHoras: number;
    creditosCalculados: number;
    creditosDeclarados: number;
    coherente: boolean;
    detalleNormativa: string;
  };
}
