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
  className,
  footer,
}: Props) => {
  return (
    <div className="mb-5">
      <Transition appear show={open} as={Fragment}>
        <Dialog
          as="div"
          open={open}
          onClose={() => {}} // desactivado
          static
        >
          <TransitionChild
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0" />
          </TransitionChild>
          <div className="fixed inset-0 z-[60] overflow-hidden bg-[black]/60">
            <div className="flex min-h-screen items-start justify-center px-4">
              <TransitionChild
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <DialogPanel
                  as="div"
                  className={cn(
                    "panel my-8 w-full max-w-lg rounded-md border-0 p-0 max-h-[90vh] overflow-hidden",
                    className,
                  )}
                >
                  {/* Header sticky */}
                  <div className="sticky top-0 z-10 bg-white dark:bg-[#121c2c]">
                    <div className="flex items-center justify-between px-5 py-3">
                      {title && (
                        <div className="text-lg font-bold dark:text-white-light ">
                          {title}
                        </div>
                      )}
                      <button
                        type="button"
                        className="text-white-dark hover:text-dark ml-auto"
                        onClick={onClose}
                      >
                        <IconX />
                      </button>
                    </div>
                    {subtitle && (
                      <div className="text-sm font-medium text-white-dark px-5 pb-2">
                        {subtitle}
                      </div>
                    )}
                  </div>

                  {/* Content scrollable */}
                  <div className="px-5 py-3 overflow-auto max-h-[calc(90vh-8rem)] pb-4">
                    {loading ? (
                      <div className="w-full, h-96 flex justify-center items-center">
                        <div className="flex gap-2 items-center text-primary animate-pulse duration-1000 ease-in-out">
                          Cargando... <Loader color="primary" type="spinner" />
                        </div>
                      </div>
                    ) : (
                      children
                    )}
                  </div>

                  {/* Footer sticky */}
                  {footer && (
                    <div className="sticky bottom-0 z-10 bg-white dark:bg-[#121c2c] border-t border-gray-500">
                      <div className="px-5 py-3">{footer}</div>
                    </div>
                  )}
                </DialogPanel>
              </TransitionChild>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
};

export default SimpleModal;
