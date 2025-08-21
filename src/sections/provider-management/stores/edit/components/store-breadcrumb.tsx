"use client";
import Breadcrumb from '@/components/breadcrumbs/breadcrumbs';
import { Store } from '@/types/stores';
import React from 'react';

export default function StoreBreadcrumb({ store }: { store: Store }) {
  return (
    <Breadcrumb
      items={[
        { label: 'Volver a Tiendas', onClick: () => (window.location.href = '/provider/stores') },
        { label: store.name },
      ]}
      className="mb-4"
    />
  );
}
