import Badge from "@/components/badge/badge"
import { CodeBracketIcon as Code, SparklesIcon as Sparkles } from "@heroicons/react/24/solid"

interface EditorHeaderProps {
  version?: string
}

export default function EditorHeader({ version = "v2.0" }: EditorHeaderProps) {
  return (
    <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 p-1">
      <div className="bg-white/10 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-xl">
                <Code className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">HTML Editor Pro</h1>
                <p className="text-blue-100 text-sm">Editor moderno y potente</p>
              </div>
            </div>
            <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
              <Sparkles className="h-3 w-3 mr-1" />
              {version}
            </Badge>
          </div>
        </div>
      </div>
    </div>
  )
}
