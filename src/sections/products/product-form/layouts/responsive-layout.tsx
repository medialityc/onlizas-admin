'use client';

import LeftColumn from './left-column';
import RightColumn from './right-column';

function ResponsiveLayout () {
  return (
    <div className="flex flex-col gap-6 lg:gap-8">
      {/* Columna Izquierda - 2/3 del ancho en pantallas grandes */}
        <LeftColumn />

      {/* Columna Derecha - 1/3 del ancho en pantallas grandes */}
        <RightColumn />
    </div>
  );
}

export default ResponsiveLayout;
