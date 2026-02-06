import React from 'react';
import { Brain, Play, FileText, ExternalLink } from 'lucide-react';

const AutocareSection: React.FC = () => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center mb-6">
        <Brain className="w-8 h-8 text-pink-500 mr-3" />
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Autocuidado y prevención</h2>
          <p className="text-gray-600">Consejos e información importante para cuidar de tu salud.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6 border border-blue-200">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-blue-800 mb-2">Infografía Pie Diabético</h3>
              <p className="text-blue-700 text-sm mb-4">Señales de alerta en el pie diabético</p>
            </div>
            <FileText className="w-8 h-8 text-blue-600 ml-4" />
          </div>
          
          <div className="bg-white rounded-lg p-4 mb-4">
            <div className="flex items-center justify-center h-32 bg-gray-100 rounded-lg mb-3">
              <div className="text-center">
                <FileText className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-500">Infografía educativa</p>
              </div>
            </div>
          </div>
          
          <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2">
            <ExternalLink className="w-4 h-4" />
            Ver Infografía Completa
          </button>
        </div>

        <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg p-6 border border-red-200">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-red-800 mb-2">Video Educativo</h3>
              <p className="text-red-700 text-sm mb-4">Cómo identificar síntomas tempranos</p>
            </div>
            <Play className="w-8 h-8 text-red-600 ml-4" />
          </div>
          
          <div className="bg-white rounded-lg p-4 mb-4">
            <div className="relative bg-black rounded-lg overflow-hidden">
              <iframe 
                className="w-full h-32"
                src="https://www.youtube.com/embed/Q5oM5B3G8MI"
                title="Video Autocuidado"
                allowFullScreen
              />
            </div>
          </div>
          
          <button className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2">
            <Play className="w-4 h-4" />
            Ver en YouTube
          </button>
        </div>
      </div>

      <div className="mt-8">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Consejos Diarios</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center mb-3">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">1</span>
              </div>
              <h4 className="ml-3 font-medium text-green-800">Inspección Diaria</h4>
            </div>
            <p className="text-green-700 text-sm">Revisa tus pies todos los días en busca de heridas, ampollas o cambios de color.</p>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center mb-3">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">2</span>
              </div>
              <h4 className="ml-3 font-medium text-blue-800">Calzado Adecuado</h4>
            </div>
            <p className="text-blue-700 text-sm">Usa zapatos cómodos y bien ajustados. Evita caminar descalzo.</p>
          </div>

          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <div className="flex items-center mb-3">
              <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">3</span>
              </div>
              <h4 className="ml-3 font-medium text-purple-800">Control Glucémico</h4>
            </div>
            <p className="text-purple-700 text-sm">Mantén tus niveles de azúcar en sangre dentro del rango recomendado.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AutocareSection;