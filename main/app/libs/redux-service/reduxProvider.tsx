'use client';

import store from './store';
import { Provider } from 'react-redux';
import React, { ReactNode } from 'react';

const RedProv = ({ children }: { children: ReactNode }) => {
    return <Provider store={store}>{children}</Provider>
}

export default RedProv;