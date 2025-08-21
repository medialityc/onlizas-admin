import { Store } from '@/types/stores';
import { BuildingStorefrontIcon, EnvelopeIcon, MapPinIcon, PhoneIcon } from '@heroicons/react/24/solid';
import React from 'react';

function StoreEditHeader({ store }: { store: Store }) {
  return (
    <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm shadow rounded-2xl border border-gray-200/50 dark:border-gray-700/50 p-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 bg-gradient-to-br from-secondary to-indigo-600 rounded-lg flex items-center justify-center shadow">
            <BuildingStorefrontIcon className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-2xl mb-1 font-semibold">{store.name}</h1>
            <p className="text-sm text-gray-500">{store.description}</p>
            <div className="mt-2 flex gap-4 text-sm text-gray-600">
              <span className="flex items-center gap-2"><EnvelopeIcon className="w-4 h-4"/> {store.email}</span>
              <span className="flex items-center gap-2"><PhoneIcon className="w-4 h-4"/> {store.phoneNumber}</span>
              <span className="flex items-center gap-2"><MapPinIcon className="w-4 h-4"/> {store.address}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StoreEditHeader;
