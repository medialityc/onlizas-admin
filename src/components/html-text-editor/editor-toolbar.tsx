import { useRef } from "react";
import { Button } from "@/components/button/button";
import { Card, CardContent } from "@/components/cards/card";
import {
  ArrowUpTrayIcon as Upload,
  ArrowDownTrayIcon as Download,
  DocumentDuplicateIcon as Copy,
  TrashIcon as Trash2,
  // BoltIcon as Zap,
  // SwatchIcon as Palette,
} from "@heroicons/react/24/solid";

interface EditorToolbarProps {
  onFileImport: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onExport: () => void;
  onCopyCode: () => void;
  onClear: () => void;
  onInsertTemplate: (template: string, name: string) => void;
  modernTemplate: string;
  portfolioTemplate: string;
  onlyPreview?: boolean;
}

export default function EditorToolbar({
  onFileImport,
  onExport,
  onCopyCode,
  onClear,
  onlyPreview,
  // onInsertTemplate,
  // modernTemplate,
  // portfolioTemplate,
}: EditorToolbarProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <Card className="mb-6 bg-white/95 dark:bg-black backdrop-blur-sm border-0 shadow-2xl">
      <CardContent className="p-6">
        <div className="flex flex-wrap gap-3">
          {/* Grupo de archivos */}
          <div className="flex gap-2  rounded-xl">
            {!onlyPreview && (
              <Button
                onClick={() => fileInputRef.current?.click()}
                className="bg-primary hover:from-blue-600 hover:to-blue-700 text-white shadow-lg"
              >
                <Upload className="h-4 w-4 mr-2" />
                Importar
              </Button>
            )}
            <Button
              onClick={onExport}
              className="bg-secondary hover:from-indigo-600 hover:to-indigo-700 text-white shadow-lg"
            >
              <Download className="h-4 w-4 mr-2" />
              Exportar
            </Button>
          </div>

          {/* Grupo de edición */}
          <div className="flex gap-2  rounded-xl">
            <Button
              onClick={onCopyCode}
              className="bg-transparent text-primary hover:bg-primary hover:text-white  shadow-lg"
            >
              <Copy className="h-4 w-4 mr-2" />
              Copiar
            </Button>
            {!onlyPreview && (
              <Button
                onClick={onClear}
                variant="secondary"
                outline={true}
                className="border-slate-200 text-slate-600 hover:bg-slate-50 bg-transparent"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Limpiar
              </Button>
            )}
          </div>

          {/* Grupo de plantillas
          <div className="flex gap-2  rounded-xl">
            <Button
              onClick={() => onInsertTemplate(modernTemplate, "Moderna")}
              className="bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white shadow-lg"
            >
              <Zap className="h-4 w-4 mr-2" />
              Moderna
            </Button>
            <Button
              onClick={() => onInsertTemplate(portfolioTemplate, "Portfolio")}
              className="bg-gradient-to-r from-violet-500 to-violet-600 hover:from-violet-600 hover:to-violet-700 text-white shadow-lg"
            >
              <Palette className="h-4 w-4 mr-2" />
              Portfolio
            </Button>
          </div> */}
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept=".html,.htm"
          onChange={onFileImport}
          className="hidden"
        />
      </CardContent>
    </Card>
  );
}
