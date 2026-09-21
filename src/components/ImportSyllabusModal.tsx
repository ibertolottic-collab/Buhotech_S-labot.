import React, { useState } from 'react';
import {
  X,
  Upload,
  FileText,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  FileCode,
  ArrowRight,
} from 'lucide-react';
import { SilaboData } from '../types';
import { SILABO_EJEMPLO_USMP } from '../data/defaultSyllabus';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onImportSyllabus: (imported: SilaboData) => void;
  onParseRawTextWithAI: (rawText: string) => Promise<SilaboData | null>;
}

export const ImportSyllabusModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onImportSyllabus,
  onParseRawTextWithAI,
}) => {
  const [importMode, setImportMode] = useState<'text' | 'json'>('text');
  const [pastedText, setPastedText] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        if (file.name.endsWith('.json')) {
          const parsed = JSON.parse(content);
          if (parsed.datosGenerales && parsed.sumilla) {
            onImportSyllabus(parsed);
            onClose();
          } else {
            setErrorMsg('El archivo JSON no contiene la estructura requerida de un sílabo.');
          }
        } else {
          setPastedText(content);
        }
      } catch (err: any) {
        setErrorMsg('Error al leer el archivo: ' + err.message);
      }
    };
    reader.readAsText(file);
  };

  const handleProcessPastedText = async () => {
    if (!pastedText.trim()) {
      setErrorMsg('Por favor pegue el texto del sílabo.');
      return;
    }

    setIsProcessing(true);
    setErrorMsg(null);
    try {
      // Intenta parsear directamente como JSON si el usuario pegó JSON
      try {
        const directJson = JSON.parse(pastedText);
        if (directJson.datosGenerales) {
          onImportSyllabus(directJson);
          setIsProcessing(false);
          onClose();
          return;
        }
      } catch {
        // No es JSON, parsear con IA
      }

      const parsedWithAi = await onParseRawTextWithAI(pastedText);
      if (parsedWithAi) {
        onImportSyllabus(parsedWithAi);
        onClose();
      } else {
        setErrorMsg('No se pudo estructurar el texto. Se cargó una plantilla base con el texto detectado.');
      }
    } catch (err: any) {
      setErrorMsg('Error en el procesamiento: ' + err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative my-8">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center">
            <Upload className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">
              Subir o Actualizar Sílabo Existente
            </h3>
            <p className="text-xs text-slate-500">
              Cargue un archivo o pegue el contenido de cualquier sílabo universitario para adaptarlo al formato oficial.
            </p>
          </div>
        </div>

        {/* File Drag and Drop / Selection */}
        <div className="mb-4">
          <label className="border-2 border-dashed border-slate-300 hover:border-rose-400 rounded-2xl p-6 flex flex-col items-center justify-center gap-2 cursor-pointer bg-slate-50 hover:bg-rose-50/20 transition-all text-center">
            <Upload className="w-8 h-8 text-slate-400" />
            <span className="text-xs font-semibold text-slate-700">
              Haga clic aquí para seleccionar un archivo (.json o .txt)
            </span>
            <span className="text-[11px] text-slate-500">
              O arrastre y suelte el documento aquí
            </span>
            <input
              type="file"
              accept=".json,.txt"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>
        </div>

        {/* Paste Raw Text or JSON */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-700">
              O Pegue el texto copiado de su PDF / Word de Sílabo:
            </label>
            <button
              type="button"
              onClick={() => {
                setPastedText(
                  `SÍLABO DE EJEMPLO: NEUROCIENCIA COGNITIVA\nCarrera: Educación\nCiclo: IV\nHoras: Teoría 48, Práctica 32, Total 80\nCréditos: 4\nSumilla: Asignatura de especialidad orientada al estudio de las bases neurobiológicas del aprendizaje...`
                );
              }}
              className="text-[11px] text-rose-700 hover:underline"
            >
              Insertar texto de muestra
            </button>
          </div>
          <textarea
            rows={6}
            value={pastedText}
            onChange={(e) => setPastedText(e.target.value)}
            placeholder="Pegue aquí el contenido completo del sílabo que desea actualizar..."
            className="w-full p-3 border border-slate-300 rounded-xl text-xs font-mono focus:outline-hidden focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
          />
        </div>

        {errorMsg && (
          <div className="p-3 mb-4 rounded-lg bg-red-50 text-red-800 text-xs font-medium flex items-center gap-2 border border-red-200">
            <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-200">
          <button
            type="button"
            onClick={() => {
              onImportSyllabus(SILABO_EJEMPLO_USMP);
              onClose();
            }}
            className="text-xs text-slate-600 hover:text-slate-900 font-medium"
          >
            Cargar Plantilla Oficial USMP
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handleProcessPastedText}
              disabled={isProcessing || !pastedText.trim()}
              className="px-5 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-xs transition-colors flex items-center gap-1.5 disabled:opacity-50"
            >
              {isProcessing ? (
                <>
                  <Sparkles className="w-4 h-4 animate-spin" />
                  <span>Procesando y Estructurando...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Procesar y Actualizar Sílabo</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
