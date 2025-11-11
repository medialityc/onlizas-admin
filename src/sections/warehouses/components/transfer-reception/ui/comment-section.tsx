import React from "react";
import { Button } from "@/components/button/button";
import RHFInputWithLabel from "@/components/react-hook-form/rhf-input";

interface Comment {
  id: string;
  type: "general" | "discrepancy";
  message: string;
  author: string;
  createdAt: string;
  discrepancyId?: string;
}

interface CommentSectionProps {
  comments: Comment[];
  newComment: string;
  isSendingComment: boolean;
  onSendComment: () => void;
  receptionId?: string;
  isLoadingComments?: boolean;
}

export function CommentSection({
  comments,
  newComment,
  isSendingComment,
  onSendComment,
  receptionId,
  isLoadingComments = false,
}: CommentSectionProps) {
  return (
    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
      <div className="flex items-center space-x-3 mb-4">
        <div className="w-8 h-8 bg-blue-100 dark:bg-blue-800 rounded-lg flex items-center justify-center">
          <svg className="w-5 h-5 text-blue-600 dark:text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        </div>
        <div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            Comunicación
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Comunícate con el almacén origen sobre cualquier incidencia
          </p>
        </div>
      </div>

      {/* Lista de comentarios */}
      <div className="mb-4 max-h-60 overflow-y-auto">
        {isLoadingComments ? (
          <div className="text-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-sm text-gray-500 mt-2">Cargando comentarios...</p>
          </div>
        ) : comments.length > 0 ? (
          <div className="space-y-3">
            {comments.map((comment) => (
              <div
                key={comment.id}
                className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-700"
              >
                <div className="flex items-start justify-between mb-2">
                  <span className="font-medium text-gray-900 dark:text-white text-sm">
                    {comment.author}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {new Date(comment.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  {comment.message}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-4">
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              No hay comentarios aún
            </p>
          </div>
        )}
      </div>

      {/* Nuevo comentario */}
      <div className="border-t border-blue-200 dark:border-blue-800 pt-4">
        <div className="flex space-x-3">
          <div className="flex-1">
            <RHFInputWithLabel
              name="newComment"
              placeholder="Escribe un comentario..."
              showError={false}
              onKeyPress={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  onSendComment();
                }
              }}
            />
          </div>
          <Button
            type="button"
            variant="primary"
            onClick={onSendComment}
            disabled={isSendingComment || !newComment.trim()}
          >
            {isSendingComment ? "Enviando..." : "Enviar"}
          </Button>
        </div>
      </div>
    </div>
  );
}