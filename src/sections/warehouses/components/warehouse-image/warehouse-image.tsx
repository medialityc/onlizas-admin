import { cn } from "@/lib/utils";
import Image from "next/image";
import React from "react";

type Props = {
  src: string;
  alt: string;
  className?: string;
};
const WarehouseImage = ({ src, alt, className }: Props) => {
  return (
    <div
      className={cn(
        "object-contain w-14 h-14 flex-shrink-0  bg-slate-100 border dark:border-slate-700 dark:bg-slate-700 rounded-md overflow-hidden relative",
        className
      )}
    >
      <Image
        src={src || "/assets/images/placeholder-product.webp"}
        alt={alt}
        fill
      />
    </div>
  );
};

export default WarehouseImage;
