'use client';

import LeftColumn from './left-column';
import RightColumn from './right-column';

function ResponsiveLayout () {
  return (
    <div className="grid grid-cols-1 gap-6 lg:gap-8">
      {/* Columna Izquierda - 2/3 del ancho en pantallas grandes */}
      <div className="xl:col-span-2">
        <LeftColumn />
      </div>

      {/* Columna Derecha - 1/3 del ancho en pantallas grandes */}
      <div className="xl:col-span-1">
        <RightColumn />
      </div>
    </div>
  );
}

export default ResponsiveLayout;
