"use client"

import { CodeBracketIcon as Code, EyeIcon as Eye } from "@heroicons/react/24/outline"
import EditorHeader from "./editor-header"
import EditorToolbar from "./editor-toolbar"
import CodeEditor from "./code-editor"
import PreviewPanel from "./preview-panel"
import HelpGuide from "./help-guide"
import { useHTMLEditor } from "./useHTMLEditor"
import { modernTemplate, portfolioTemplate } from "./templates"

export default function HTMLEditor() {
  const {
    htmlContent,
    setHtmlContent,
    activeTab,
    setActiveTab,
    previewDevice,
    setPreviewDevice,
    stats,
    handleFileImport,
    handleExport,
    handleCopyCode,
    handleClear,
    insertTemplate,
  } = useHTMLEditor()

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <EditorHeader />

      <div className="max-w-7xl mx-auto p-6">
        <EditorToolbar
          onFileImport={handleFileImport}
          onExport={handleExport}
          onCopyCode={handleCopyCode}
          onClear={handleClear}
          onInsertTemplate={insertTemplate}
          modernTemplate={modernTemplate}
          portfolioTemplate={portfolioTemplate}
        />

        {/* Custom Tabs */}
        <div className="w-full">
          <div className="grid w-full grid-cols-2 bg-white/90 backdrop-blur-sm p-1 h-14 rounded-lg mb-6">
            <button
              onClick={() => setActiveTab("editor")}
              className={`flex items-center justify-center gap-2 text-lg font-medium rounded-md transition-all ${
                activeTab === "editor"
                  ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg"
                  : "text-slate-600 hover:bg-white/50"
              }`}
            >
              <Code className="h-5 w-5" />
              Editor de Código
            </button>
            <button
              onClick={() => setActiveTab("preview")}
              className={`flex items-center justify-center gap-2 text-lg font-medium rounded-md transition-all ${
                activeTab === "preview"
                  ? "bg-gradient-to-r from-indigo-500 to-blue-500 text-white shadow-lg"
                  : "text-slate-600 hover:bg-white/50"
              }`}
            >
              <Eye className="h-5 w-5" />
              Vista Previa
            </button>
          </div>

          {activeTab === "editor" && (
            <div className="mt-6">
              <CodeEditor
                htmlContent={htmlContent}
                onContentChange={setHtmlContent}
                stats={stats}
              />
            </div>
          )}

          {activeTab === "preview" && (
            <div className="mt-6">
              <PreviewPanel
                htmlContent={htmlContent}
                previewDevice={previewDevice}
                onDeviceChange={setPreviewDevice}
              />
            </div>
          )}
        </div>

        <HelpGuide />
      </div>
    </div>
  )
}
