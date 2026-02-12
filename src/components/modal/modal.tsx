"use client";
import IconX from "@/components/icon/icon-x";
import {
  Transition,
  Dialog,
  DialogPanel,
  TransitionChild,
} from "@headlessui/react";
import React, { Fragment } from "react";
import Loader from "../loaders/loader";
import { cn } from "@/lib/utils";

interface Props {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string | React.ReactNode;
  subtitle?: string | React.ReactNode;
  loading?: boolean;
  className?: string;
  footer?: React.ReactNode;
}

const SimpleModal = ({
  open,
  onClose,
  children,
  title,
  loading,
  subtitle,
  // className,
  footer,
}: Props) => {
  if (!open) return null;

  return (
    <Transition appear show={open} as={Fragment}>
      <Dialog as="div" open={open} onClose={() => {}} static>
        <div
          className={cn(
            "font-display animate-in fade-in fixed inset-0 z-100 flex items-center justify-center bg-black/50 backdrop-blur-[1px] duration-200",
          )}
        >
          <DialogPanel
            as="div"
            className="w-full max-w-[650px] animate-in zoom-in-95 m-4 flex max-h-[95vh] flex-col overflow-hidden rounded-xl bg-white shadow-2xl transition-all duration-200 dark:bg-[#1a1c23]"
          >
            {/* Header */}
            <div className="flex shrink-0 items-center justify-between border-b border-gray-100 bg-white px-6 py-4 dark:border-gray-800 dark:bg-[#1a1c23]">
              <div className="flex flex-col">
                {title && (
                  <h2 className="text-lg font-bold text-[#111818] dark:text-white">
                    {title}
                  </h2>
                )}
                {subtitle && (
                  <p className="mt-1 text-sm font-medium text-gray-500 dark:text-gray-400">
                    {subtitle}
                  </p>
                )}
              </div>
              <button
                type="button"
                className="ml-4 rounded-full p-1 text-gray-400 transition-colors hover:text-red-500"
                onClick={onClose}
              >
                <IconX />
              </button>
            </div>

            {/* Content */}
            <div className="custom-scrollbar max-h-[85vh] flex-1 overflow-y-auto bg-white px-6 py-4 dark:bg-[#1a1c23]">
              {loading ? (
                <div className="flex h-72 w-full items-center justify-center">
                  <div className="flex items-center gap-2 text-primary animate-pulse duration-1000 ease-in-out">
                    Cargando... <Loader color="primary" type="spinner" />
                  </div>
                </div>
              ) : (
                children
              )}
            </div>

            {/* Footer */}
            {footer && (
              <div className="flex shrink-0 items-center justify-between border-t border-gray-100 bg-gray-50 px-6 py-4 dark:border-gray-700 dark:bg-[#232830]">
                <div className="w-full">{footer}</div>
              </div>
            )}
          </DialogPanel>
        </div>
      </Dialog>
    </Transition>
  );
};

export default SimpleModal;
