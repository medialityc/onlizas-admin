import React from "react";
import { InformationCircleIcon } from "@heroicons/react/24/outline";

interface TemplateVariablesInfoProps {
  title: string;
  description: string;
  variables: Array<{
    name: string;
    description: string;
  }>;
}

export default function TemplateVariablesInfo({ 
  title, 
  description, 
  variables 
}: TemplateVariablesInfoProps) {
  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
      <div className="flex items-start gap-3">
        <InformationCircleIcon className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <h4 className="text-blue-800 font-semibold text-sm mb-1">
            {title}
          </h4>
          <p className="text-blue-700 text-sm mb-3">
            {description}
          </p>
          <div className="space-y-3">
            <p className="text-blue-800 text-sm font-medium">
              Variables obligatorias:
            </p>
            <div className="grid grid-cols-1 gap-2">
              {variables.map((variable) => (
                <div
                  key={variable.name}
                  className="flex items-start gap-3 p-2 bg-blue-100 rounded border"
                >
                  <span className="inline-flex items-center px-2 py-1 bg-blue-200 text-blue-800 text-xs font-mono rounded border flex-shrink-0">
                    {variable.name}
                  </span>
                  <p className="text-blue-700 text-xs leading-relaxed">
                    {variable.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
