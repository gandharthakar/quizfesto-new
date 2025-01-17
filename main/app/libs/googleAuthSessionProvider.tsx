'use client';

import React from 'react';
import { SessionProvider } from 'next-auth/react';

function GoogleAuthSessionProvider({ children }: { children: React.ReactNode }) {
    return (
        <SessionProvider>{children}</SessionProvider>
    )
}

export default GoogleAuthSessionProvider;