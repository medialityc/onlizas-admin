"use client";

import React, { useState, forwardRef, type CSSProperties } from "react";
import Image, { type ImageProps } from "next/image";

export type ProgressiveImageProps = ImageProps;

const ProgressiveImage = forwardRef<HTMLImageElement, ProgressiveImageProps>(
  ({ style, onLoad, ...rest }, ref) => {
    const [loaded, setLoaded] = useState(false);

    const handleLoad: React.ReactEventHandler<HTMLImageElement> = (event) => {
      setLoaded(true);
      if (typeof onLoad === "function") {
        onLoad(event);
      }
    };

    const hasCustomFilter = style && style.filter !== undefined;
    const hasCustomTransform = style && style.transform !== undefined;

    const finalStyle: CSSProperties = {
      ...(style || {}),
      ...(!hasCustomFilter && {
        filter: loaded ? "blur(0px)" : "blur(10px)",
      }),
      ...(!hasCustomTransform && {
        transform: loaded ? "scale(1)" : "scale(1.05)",
      }),
      transition:
        style?.transition ||
        "filter 0.5s ease-in-out, transform 0.5s ease-in-out",
    };

    return (
      <Image
        ref={ref as any}
        {...rest}
        style={finalStyle}
        onLoad={handleLoad}
      />
    );
  },
);

ProgressiveImage.displayName = "ProgressiveImage";

export default ProgressiveImage;
