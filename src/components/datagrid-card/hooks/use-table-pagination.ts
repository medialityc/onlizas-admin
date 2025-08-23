'use client'
import { useCallback } from 'react';
import { useSearchParams } from 'next/navigation';

export const useTablePagination = () => {
  const searchParams = useSearchParams();

  const page = Number(searchParams.get('page') ?? 1);
  const pageSize = Number(searchParams.get('pageSize') ?? 10);

  const onPageChange = useCallback(
    (newPage: number) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set('page', newPage.toString());
      window.history.replaceState(null, '', `?${params.toString()}`);
    },
    [searchParams]
  );

  const onLimitChange = useCallback(
    (value: string) => {
      const pageSize = parseInt(value, 10).toString();
      const params = new URLSearchParams(searchParams.toString());
      params.set('pageSize', pageSize);
      params.set('page', '1');
      window.history.replaceState(null, '', `?${params.toString()}`);
    },
    [searchParams]
  );

  return {
    page,
    pageSize,
    onPageChange,
    onLimitChange,
  };
};
