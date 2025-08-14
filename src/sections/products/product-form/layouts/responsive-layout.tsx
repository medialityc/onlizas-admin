'use client';

import { useEffect, useState } from 'react';
import LeftColumn from './left-column';
import RightColumn from './right-column';

function ResponsiveLayout() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 1280); // xl breakpoint
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  if (isMobile) {
    return (
      <div className="space-y-6">
        {/* En móvil: Todo en una columna */}
        <LeftColumn />
        <RightColumn />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8">
      {/* Columna Izquierda - 2/3 del ancho en pantallas grandes */}
      <div className="xl:col-span-2">
        <LeftColumn />
      </div>

      {/* Columna Derecha - 1/3 del ancho en pantallas grandes */}
      <div className="xl:col-span-1">
        <RightColumn />
      </div>    </div>
  );
}

export default ResponsiveLayout;
