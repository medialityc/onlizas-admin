import { Card, CardContent, CardHeader, CardTitle } from "@/components/cards/card"
import {
    Cog6ToothIcon as Settings,
    BoltIcon as Zap,
    EyeIcon as Eye,
    SparklesIcon as Sparkles,
} from "@heroicons/react/24/solid";

export default function HelpGuide() {
  return (
    <Card className="mt-6 bg-gradient-to-br from-white/90 to-blue-50/90 backdrop-blur-sm border-0 shadow-2xl">
      <CardHeader>
        <CardTitle className="text-xl flex items-center gap-2">
          <div className="p-2 bg-purple-100 rounded-lg">
            <Settings className="h-5 w-5 text-purple-600" />
          </div>
          Guía de Uso Rápida
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="p-4 bg-white/70 rounded-xl border border-blue-100">
            <h3 className="font-semibold mb-3 text-blue-800 flex items-center gap-2">
              <Zap className="h-4 w-4" />
              Funciones Principales
            </h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
                Editor con contador de estadísticas
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-indigo-400 rounded-full"></span>
                Vista previa responsive
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-purple-400 rounded-full"></span>
                Plantillas modernas incluidas
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-violet-400 rounded-full"></span>
                Importación/exportación rápida
              </li>
            </ul>
          </div>

          <div className="p-4 bg-white/70 rounded-xl border border-indigo-100">
            <h3 className="font-semibold mb-3 text-indigo-800 flex items-center gap-2">
              <Eye className="h-4 w-4" />
              Vista Previa
            </h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
                Actualización en tiempo real
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-indigo-400 rounded-full"></span>
                Simulación de dispositivos
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-purple-400 rounded-full"></span>
                Entorno seguro (sandbox)
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-violet-400 rounded-full"></span>
                Responsive design testing
              </li>
            </ul>
          </div>

          <div className="p-4 bg-white/70 rounded-xl border border-purple-100">
            <h3 className="font-semibold mb-3 text-purple-800 flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              Consejos Pro
            </h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
                Usa Ctrl+A para seleccionar todo
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-indigo-400 rounded-full"></span>
                Prueba en diferentes dispositivos
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-purple-400 rounded-full"></span>
                Guarda tu trabajo frecuentemente
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-violet-400 rounded-full"></span>
                Experimenta con las plantillas
              </li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
