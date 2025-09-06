"use client";

import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";
import React, { Fragment, useEffect, useState, ReactNode } from "react";
import { ExclamationCircleIcon } from "@heroicons/react/24/outline";

type TabItem = {
  label: string;
  icon?: ReactNode;
  content: ReactNode;
  disabled?: boolean;
  hasErrors?: boolean;
  errorCount?: number;
};

type TabsWithIconsProps = {
  tabs: TabItem[];
  activeColorClass?: string;
  handleChange?: (index: number) => void;
  readonly?: boolean;
  selectedIndex?: number;
  onChange?: (index: number) => void;
};

const TabsWithErrorIndicators: React.FC<TabsWithIconsProps> = ({
  tabs,
  activeColorClass = "bg-primary text-white",
  handleChange,
  readonly = false,
  selectedIndex,
  onChange,
}) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <div className="mb-5">
      <TabGroup
        selectedIndex={selectedIndex}
        onChange={(index) => {
          onChange?.(index);
          handleChange?.(index);
        }}
      >
        <TabList className="mt-3 flex flex-wrap gap-2">
          {tabs.map((tab, index) =>
            tab.disabled ? (
              <Tab
                key={index}
                className="pointer-events-none -mb-[1px] flex items-center p-3.5 py-2 text-gray-400 dark:text-gray-500 opacity-60"
              >
                {tab.icon && tab.icon}
                {tab.label}
              </Tab>
            ) : (
              <Tab as={Fragment} key={index}>
                {({ selected }) => (
                  <button
                    className={`${
                      selected
                        ? `${activeColorClass} !outline-none text-white`
                        : tab.hasErrors && !readonly
                          ? "border border-red-300 text-red-700 dark:border-rose-600 dark:text-rose-300 bg-transparent"
                          : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 bg-transparent"
                    } -mb-[1px] flex items-center rounded p-3.5 py-2 transition-colors duration-200 relative`}
                  >
                    <span className="ltr:mr-2 rtl:ml-2">{tab.icon}</span>
                    {tab.label}
                    {tab.hasErrors && !readonly && (
                      <div className="flex items-center ml-2 gap-1">
                        <ExclamationCircleIcon className="h-4 w-4 text-red-500 dark:text-rose-300" />
                        {tab.errorCount && tab.errorCount > 0 && (
                          <span className="bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5 min-w-[20px] h-5 flex items-center justify-center">
                            {tab.errorCount}
                          </span>
                        )}
                      </div>
                    )}
                  </button>
                )}
              </Tab>
            )
          )}
        </TabList>
        <TabPanels>
          {tabs.map((tab, index) => (
            <TabPanel key={index}>
              <div className="pt-5">{tab.content}</div>
            </TabPanel>
          ))}
        </TabPanels>
      </TabGroup>
    </div>
  );
};

export default TabsWithErrorIndicators;
