declare module "@origin-space/image-cropper" {
  import * as React from "react";

  export interface Area {
    x: number;
    y: number;
    width: number;
    height: number;
  }

  export interface CropperRootProps {
    image: string;
    aspectRatio?: number;
    onCropChange?: (area: Area | null) => void;
    className?: string;
    cropPadding?: number;
    minZoom?: number;
    maxZoom?: number;
    zoom?: number;
    zoomSensitivity?: number;
    keyboardStep?: number;
    children?: React.ReactNode; // permitir children
  }

  export const Cropper: {
    Root: React.FC<CropperRootProps>;
    Description: React.FC<{ className?: string }>;
    // Allow forwarding ref to the underlying img element and accept img attributes
    Image: React.ForwardRefExoticComponent<React.ImgHTMLAttributes<HTMLImageElement> & React.RefAttributes<HTMLImageElement>>;
    CropArea: React.FC<{ className?: string }>;
  };
}