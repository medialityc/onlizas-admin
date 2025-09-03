'use client';
import { RootState } from '@/store';
import React from 'react';
import { useSelector } from 'react-redux';
import Overlay from './overlay';

const MainContainer = ({ children }: { children: React.ReactNode }) => {
    const themeConfig = useSelector((state: RootState) => state.themeConfig);
    return (
        <>
            <Overlay />
            <div className={`${themeConfig.navbar} main-container min-h-screen text-black dark:text-white-dark`}>
                {children}
            </div>
        </>
    );
};

export default MainContainer;
