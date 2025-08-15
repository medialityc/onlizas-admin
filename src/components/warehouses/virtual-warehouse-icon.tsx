import React from 'react';
import { ComponentType } from 'react';

interface VirtualWarehouseIconProps {
  IconComponent: ComponentType<{ className?: string }>;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const sizeClasses = {
  sm: 'w-4 h-4',
  md: 'w-5 h-5',
  lg: 'w-6 h-6'
};

export const VirtualWarehouseIcon: React.FC<VirtualWarehouseIconProps> = ({
  IconComponent,
  className = '',
  size = 'md'
}) => {
  const sizeClass = sizeClasses[size];

  return (
    <IconComponent
      className={`${sizeClass} ${className}`.trim()}
    />
  );
};

export default VirtualWarehouseIcon;
