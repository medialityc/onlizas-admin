import Badge from "@/components/badge/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/cards/card";
import { CodeBracketIcon as Code } from "@heroicons/react/24/solid";
import type { EditorStats } from "./types";

interface CodeEditorProps {
  htmlContent: string;
  onContentChange: (content: string) => void;
  stats: EditorStats;
}

export default function CodeEditor({
  htmlContent,
  onContentChange,
  stats,
}: CodeEditorProps) {
  return (
    <Card className="bg-white/95 dark:bg-black backdrop-blur-sm border-0 shadow-2xl">
      <CardHeader>
        <div className="flex items-center justify-between dark:bg-black">
          <CardTitle className="text-xl flex items-center gap-2 ">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Code className="h-5 w-5 text-blue-600" />
            </div>
            Editor de Código HTML
          </CardTitle>
          <div className="flex gap-4 text-sm text-black">
            <Badge
              variant="outline-primary"
              className="bg-white dark:bg-black text-black"
            >
              📝 {stats.lineCount} líneas
            </Badge>
            <Badge
              variant="outline-primary"
              className="bg-white dark:bg-black text-black"
            >
              🔤 {stats.charCount} caracteres
            </Badge>
            <Badge
              variant="outline-primary"
              className="bg-white dark:bg-black text-black"
            >
              📖 {stats.wordCount} palabras
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <textarea
          value={htmlContent}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
            onContentChange(e.target.value)
          }
          placeholder="✨ Escribe tu código HTML aquí... ¡Deja volar tu creatividad!"
          className="w-full min-h-[600px] font-mono text-sm border-0  resize-none focus:ring-0 bg-white dark:bg-black focus:border-white focus:border rounded-2xl p-4 outline-none"
        />
      </CardContent>
    </Card>
  );
}
