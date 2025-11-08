import { ExternalReviewApprovalProcessResponse } from "@/services/external-review";
import { useState } from "react";
import {
  TagIcon,
  BuildingOffice2Icon,
  CheckCircleIcon,
  XCircleIcon,
  InformationCircleIcon,
} from "@heroicons/react/24/solid";

interface Props {
  title: string;
  categories: ExternalReviewApprovalProcessResponse["approvalProcess"]["pendingCategories"];
  empty: string;
}

export default function CategoriesSection({ title, categories, empty }: Props) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const headingId = `${title.replace(/\s+/g, "-").toLowerCase()}-heading`;

  if (!categories.length)
    return (
      <section aria-labelledby={headingId} className="space-y-2">
        <h3 id={headingId} className="font-semibold text-sm">
          {title}
        </h3>
        <div
          className="border rounded p-3 text-xs bg-gray-50 text-gray-500 flex items-center gap-2"
          role="status"
          aria-live="polite"
        >
          <InformationCircleIcon className="w-4 h-4 text-gray-400" />
          {empty}
        </div>
      </section>
    );

  return (
    <section aria-labelledby={headingId} className="space-y-3">
      <div className="flex items-center gap-2">
        <h3 id={headingId} className="font-semibold text-sm">
          {title}
        </h3>
        <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-600 border border-indigo-200">
          {categories.length}
        </span>
      </div>
      <ul
        className="grid md:grid-cols-3 sm:grid-cols-2 gap-3"
        role="list"
        aria-describedby={`${headingId}-count`}
      >
        {categories.map((c) => (
          <li
            key={c.id}
            role="listitem"
            tabIndex={0}
            onMouseEnter={() => setHoveredId(c.id)}
            onMouseLeave={() => setHoveredId(null)}
            onFocus={() => setHoveredId(c.id)}
            onBlur={() => setHoveredId(null)}
            className="group relative border rounded-xl p-3 text-xs space-y-2 bg-white dark:bg-gray-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition"
            aria-describedby={
              hoveredId === c.id ? `${headingId}-expanded` : undefined
            }
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <span
                  className="inline-flex items-center gap-1 text-[10px] font-medium px-1.5 py-0.5 rounded border bg-purple-50 text-purple-700 border-purple-200"
                  aria-label="Categoría"
                >
                  <TagIcon className="w-3.5 h-3.5" />
                </span>
                <p
                  className="font-medium text-[13px] leading-snug break-words max-w-full pr-1 transition-all"
                  title={c.name}
                  aria-label={`Nombre categoría: ${c.name}`}
                  aria-expanded={hoveredId === c.id}
                  style={
                    hoveredId === c.id
                      ? { overflow: "visible", display: "block" }
                      : {
                          WebkitLineClamp: 3,
                          display: "-webkit-box",
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                        }
                  }
                >
                  {c.name}
                </p>
              </div>
              <span
                className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-1 rounded-full border ${c.active ? "bg-green-50 text-green-700 border-green-200" : "bg-gray-100 text-gray-600 border-gray-200"}`}
                aria-label={`Estado ${c.active ? "activa" : "inactiva"}`}
              >
                {c.active ? (
                  <CheckCircleIcon className="w-3.5 h-3.5" />
                ) : (
                  <XCircleIcon className="w-3.5 h-3.5" />
                )}
                {c.active ? "Activa" : "Inactiva"}
              </span>
            </div>
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <p
                className="text-[11px] text-gray-500 flex items-center gap-1"
                aria-label={`Departamento ${c.departmentName || "Sin departamento"}`}
              >
                <BuildingOffice2Icon className="w-3.5 h-3.5" />
                <span className="font-medium">Dept:</span>
                <span>{c.departmentName || "—"}</span>
              </p>
              {c.description && (
                <p
                  className="text-[11px] text-gray-600 dark:text-gray-300 line-clamp-3 max-w-[200px]"
                  title={c.description}
                  aria-label={`Descripción: ${c.description}`}
                >
                  {c.description}
                </p>
              )}
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
