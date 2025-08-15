import React from 'react';
import { ComponentType } from 'react';

interface VirtualWarehouseIconProps {
  IconComponent: ComponentType<{ className?: string }>;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const sizeClasses = {
  sm: 'w-3 h-3',
  md: 'w-4 h-4',
  lg: 'w-6 h-6'
};

export const VirtualWarehouseIcon: React.FC<VirtualWarehouseIconProps> = ({
  IconComponent,
  className = '',
  size = 'md'
}) => {
  const sizeClass = sizeClasses[size];
  const combinedClassName = `${sizeClass} ${className}`.trim();

  return <IconComponent className={combinedClassName} />;
};

export default VirtualWarehouseIcon;
