import React, { useState } from 'react';
import {
  X,
  Key,
  Cloud,
  CheckCircle2,
  Server,
  Cpu,
  ShieldCheck,
  ExternalLink,
  Save,
  HelpCircle,
} from 'lucide-react';
import { AIProvider, AIProviderConfig } from '../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  apiConfigs: Record<string, AIProviderConfig>;
  onSaveConfigs: (configs: Record<string, AIProviderConfig>) => void;
  activeProvider: AIProvider;
  onSelectActiveProvider: (provider: AIProvider) => void;
}

export const CloudAndApiKeyModal: React.FC<Props> = ({
  isOpen,
  onClose,
  apiConfigs,
  onSaveConfigs,
  activeProvider,
  onSelectActiveProvider,
}) => {
  const [localConfigs, setLocalConfigs] = useState<Record<string, AIProviderConfig>>(apiConfigs);
  const [testStatus, setTestStatus] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleKeyChange = (provider: AIProvider, key: string) => {
    setLocalConfigs({
      ...localConfigs,
      [provider]: {
        ...localConfigs[provider],
        apiKey: key,
      },
    });
  };

  const handleSave = () => {
    onSaveConfigs(localConfigs);
    setTestStatus('Configuración guardada correctamente.');
    setTimeout(() => setTestStatus(null), 2500);
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
            <Key className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">
              Motores de IA y Arquitectura Google Cloud
            </h3>
            <p className="text-xs text-slate-500">
              Gestione las claves API para las IAs de frontera y consulte el despliegue en Cloud Run.
            </p>
          </div>
        </div>

        {/* Google Cloud Run Architecture Notice */}
        <div className="mb-6 p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
              <Cloud className="w-4 h-4 text-blue-600" />
              <span>Arquitectura Google Cloud Run (Producción Lista)</span>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold">
              PORT: 3000 / DOCKER OK
            </span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            La aplicación cuenta con una arquitectura full-stack nativa para <strong>Google Cloud Run</strong>: servidor Express compilado con esbuild en un solo bundle de alto rendimiento (<code className="font-mono text-slate-800">dist/server.cjs</code>), soporte para contenedores ligeros Alpine y variables de entorno protegidas para el backend.
          </p>
          <div className="flex items-center gap-4 text-[11px] text-slate-500 pt-1">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Claves no expuestas al navegador
            </span>
            <span className="flex items-center gap-1">
              <Server className="w-3.5 h-3.5 text-blue-600" /> Escalado automático a cero
            </span>
          </div>
        </div>

        {/* AI Provider Configs */}
        <div className="space-y-4 mb-6">
          <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
            Alimentar el Agente con Claves API (Modelos de Frontera)
          </h4>

          {/* Gemini */}
          <div className="p-3.5 rounded-xl border border-slate-200 hover:border-slate-300 transition-colors">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm text-slate-900">Google Gemini (Por Defecto)</span>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.2 rounded-full">
                  Servidor Conectado
                </span>
              </div>
              <label className="flex items-center gap-1 text-xs text-slate-600 cursor-pointer">
                <input
                  type="radio"
                  name="activeProviderRadio"
                  checked={activeProvider === 'gemini'}
                  onChange={() => onSelectActiveProvider('gemini')}
                />
                <span>Motor Principal</span>
              </label>
            </div>
            <p className="text-xs text-slate-500 mb-2">
              Utiliza automáticamente la variable <code className="font-mono text-slate-700">GEMINI_API_KEY</code> provista por Google Cloud / AI Studio, o introduzca una personalizada:
            </p>
            <input
              type="password"
              placeholder="GEMINI_API_KEY (opcional si ya está en .env)"
              value={localConfigs.gemini?.apiKey || ''}
              onChange={(e) => handleKeyChange('gemini', e.target.value)}
              className="w-full text-xs font-mono p-2 border border-slate-300 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-rose-500"
            />
          </div>

          {/* OpenAI */}
          <div className="p-3.5 rounded-xl border border-slate-200 hover:border-slate-300 transition-colors">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm text-slate-900">OpenAI (GPT-4o)</span>
              </div>
              <label className="flex items-center gap-1 text-xs text-slate-600 cursor-pointer">
                <input
                  type="radio"
                  name="activeProviderRadio"
                  checked={activeProvider === 'openai'}
                  onChange={() => onSelectActiveProvider('openai')}
                />
                <span>Motor Principal</span>
              </label>
            </div>
            <input
              type="password"
              placeholder="sk-... (clave de OpenAI)"
              value={localConfigs.openai?.apiKey || ''}
              onChange={(e) => handleKeyChange('openai', e.target.value)}
              className="w-full text-xs font-mono p-2 border border-slate-300 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-rose-500"
            />
          </div>

          {/* Anthropic */}
          <div className="p-3.5 rounded-xl border border-slate-200 hover:border-slate-300 transition-colors">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm text-slate-900">Anthropic (Claude 3.5 Sonnet)</span>
              </div>
              <label className="flex items-center gap-1 text-xs text-slate-600 cursor-pointer">
                <input
                  type="radio"
                  name="activeProviderRadio"
                  checked={activeProvider === 'anthropic'}
                  onChange={() => onSelectActiveProvider('anthropic')}
                />
                <span>Motor Principal</span>
              </label>
            </div>
            <input
              type="password"
              placeholder="sk-ant-... (clave de Anthropic)"
              value={localConfigs.anthropic?.apiKey || ''}
              onChange={(e) => handleKeyChange('anthropic', e.target.value)}
              className="w-full text-xs font-mono p-2 border border-slate-300 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-rose-500"
            />
          </div>

          {/* DeepSeek */}
          <div className="p-3.5 rounded-xl border border-slate-200 hover:border-slate-300 transition-colors">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm text-slate-900">DeepSeek (DeepSeek V3 / R1)</span>
              </div>
              <label className="flex items-center gap-1 text-xs text-slate-600 cursor-pointer">
                <input
                  type="radio"
                  name="activeProviderRadio"
                  checked={activeProvider === 'deepseek'}
                  onChange={() => onSelectActiveProvider('deepseek')}
                />
                <span>Motor Principal</span>
              </label>
            </div>
            <input
              type="password"
              placeholder="sk-... (clave de DeepSeek)"
              value={localConfigs.deepseek?.apiKey || ''}
              onChange={(e) => handleKeyChange('deepseek', e.target.value)}
              className="w-full text-xs font-mono p-2 border border-slate-300 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-rose-500"
            />
          </div>
        </div>

        {/* Status indicator */}
        {testStatus && (
          <div className="p-3 mb-4 rounded-lg bg-emerald-50 text-emerald-800 text-xs font-medium flex items-center gap-2 border border-emerald-200">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{testStatus}</span>
          </div>
        )}

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors"
          >
            Cerrar
          </button>
          <button
            onClick={handleSave}
            className="px-5 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
          >
            <Save className="w-4 h-4" />
            <span>Guardar Configuración</span>
          </button>
        </div>
      </div>
    </div>
  );
};
