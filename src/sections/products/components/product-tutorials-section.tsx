"use client";
import { useFieldArray, useFormContext } from "react-hook-form";
import { Button } from "@/components/button/button";
import RHFInputWithLabel from "@/components/react-hook-form/rhf-input";
import IconPlus from "@/components/icon/icon-plus";
import IconTrash from "@/components/icon/icon-trash";
import IconVideo from "@/components/icon/icon-video"; // assume exists; fallback to IconInfoCircle if not
import { AlertBox } from "@/components/alert/alert-box";
import { useMemo } from "react";
import { getYoutubeEmbedUrl } from "@/utils/video";
import YoutubePreviewCard from "./youtube-preview-card";

function ProductTutorialsSection() {
  const { control, watch, formState } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    name: "tutorials",
    control,
  });
  const tutorialsWatch = watch("tutorials");
  const tutorials: string[] = useMemo(
    () => tutorialsWatch || [],
    [tutorialsWatch],
  );
  const previews = useMemo(
    () => tutorials.map(getYoutubeEmbedUrl),
    [tutorials],
  );

  return (
    <div className="bg-blur-card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
          <IconVideo className="mr-2 w-5 h-5" /> Tutoriales (YouTube)
        </h3>
        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={() => append("")}
          disabled={fields.length >= 10}
          className="flex items-center gap-2"
        >
          <IconPlus className="w-4 h-4" /> Agregar
        </Button>
      </div>
      {formState?.errors?.tutorials?.root?.message && (
        <AlertBox
          variant="danger"
          message={formState.errors.tutorials.root.message as string}
          title="Error"
        />
      )}
      <div className="space-y-3">
        {fields.map((field, index) => {
          const url = tutorials[index];
          const embed = url ? getYoutubeEmbedUrl(url) : null;
          const hasValue = !!url?.trim();
          return (
            <div key={field.id} className="flex flex-col gap-2">
              <div className="flex items-center gap-3">
                <div className="flex-1">
                  <RHFInputWithLabel
                    name={`tutorials.${index}`}
                    placeholder="https://www.youtube.com/watch?v=XXXXXXXXXXX"
                  />
                </div>
                <Button
                  type="button"
                  size="sm"
                  variant="destructive"
                  onClick={() => remove(index)}
                >
                  <IconTrash className="w-4 h-4" />
                </Button>
              </div>
              {hasValue && (
                <div className="mt-1">
                  {embed ? (
                    <YoutubePreviewCard url={url} index={index} compact />
                  ) : (
                    <div className="text-xs text-red-600 dark:text-red-400">
                      La URL no parece ser válida de YouTube.
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
      {fields.length > 0 && (
        <div className="mt-3 text-xs text-gray-500 dark:text-gray-400">
          Máximo 10 tutoriales.
        </div>
      )}
    </div>
  );
}

export default ProductTutorialsSection;
