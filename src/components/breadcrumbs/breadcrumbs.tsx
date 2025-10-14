import React from "react";

export interface BreadcrumbItem {
  label: string;
  href?: string;
  onClick?: () => void;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ items, className }) => {
  return (
    <ol
      className={`flex text-gray-500 font-semibold dark:text-white-dark ${className || ""}`}
    >
      {items.map((item, index) => (
        <li
          key={index}
          className={index !== 0 ? "before:content-['/'] before:px-1.5" : ""}
        >
          <button
            type="button"
            onClick={item.onClick}
            className={`${
              index !== 0
                ? "text-black dark:text-white-light hover:text-black/70 dark:hover:text-white-light/70"
                : ""
            }`}
          >
            {item.label}
          </button>
        </li>
      ))}
    </ol>
  );
};

export default Breadcrumb;
