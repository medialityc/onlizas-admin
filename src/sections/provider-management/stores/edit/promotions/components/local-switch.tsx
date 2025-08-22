import React from "react";

export default function LocalSwitch({ checked, onChange, ariaLabel }: { checked: boolean; onChange: (v: boolean) => void; ariaLabel?: string }) {
  return (
    <label className="w-12 h-6 relative">
      <input
        type="checkbox"
        className="absolute w-full h-full opacity-0 z-10 cursor-pointer peer"
        aria-label={ariaLabel}
        checked={checked}
        onChange={(e) => onChange(e.currentTarget.checked)}
      />
      <span className="bg-[#ebedf2] block h-full rounded-full overflow-hidden before:absolute before:left-1 before:bg-white before:bottom-1 before:w-4 before:h-4 before:rounded-full peer-checked:before:left-7 peer-checked:bg-gradient-to-r peer-checked:from-secondary peer-checked:to-indigo-600 before:transition-all before:duration-300" />
    </label>
  );
}
