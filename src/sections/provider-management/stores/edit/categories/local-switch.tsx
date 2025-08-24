import React from "react";

type Props = {
  checked: boolean;
  onChange: (checked: boolean) => void;
  ariaLabel?: string;
};

export default function LocalSwitch({ checked, onChange, ariaLabel }: Props) {
  return (
    <label className="w-12 h-6 relative inline-block align-middle">
      <input
        type="checkbox"
        className="absolute w-full h-full opacity-0 z-10 cursor-pointer peer"
        aria-label={ariaLabel}
        checked={checked}
        onChange={(e) => onChange(e.currentTarget.checked)}
      />
      <span
        className="bg-[#ebedf2] dark:bg-dark block h-full rounded-full overflow-hidden
        before:absolute before:left-1 before:bg-white dark:before:bg-white-dark 
        dark:peer-checked:before:bg-white before:bottom-1 before:w-4 before:h-4 
        before:rounded-full peer-checked:before:left-7 
        peer-checked:bg-gradient-to-r peer-checked:from-secondary peer-checked:to-indigo-600
        before:transition-all before:duration-300"
      />
    </label>
  );
}
