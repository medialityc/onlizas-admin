import { cn } from "@/lib/utils";
import { ChevronDownIcon, ShoppingBagIcon } from "lucide-react";
import React, { useState } from "react";
import AnimateHeight from "react-animate-height";

type StoreAccordionProps = React.PropsWithChildren & {
  title: string;
};
export const StoreAccordion = ({ children, title }: StoreAccordionProps) => {
  const [active, setActive] = useState(true);
  return (
    <div className="flex flex-col gap-2">
      <button
        type="button"
        className={`px-4 py-3 bg-gray-100 rounded-md w-full flex items-center justify-between dark:bg-slate-800`}
        onClick={() => setActive(!active)}
      >
        <div className="flex flex-row gap-2 items-center">
          <div className="p-2 rounded-lg bg-primary/10 text-primary dark:text-white dark:bg-gray-600">
            <ShoppingBagIcon
              className={"h-4 w-4 transition-opacity "}
              aria-hidden="true"
            />
          </div>

          <h3 className="text-lg font-bold dark:text-white">{title}</h3>
        </div>

        <div className="flex flex-row gap-4 items-center">
          <ChevronDownIcon
            className={cn("h-5 w-5  duration-150", active ? "rotate-180" : "")}
          />
        </div>
      </button>
      <AnimateHeight duration={300} height={active ? "auto" : 0}>
        {children}
      </AnimateHeight>
    </div>
  );
};
