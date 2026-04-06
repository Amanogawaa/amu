'use client';

import * as React from 'react';
import { Loading } from './Loading';

export default function GeneralLoadingPage() {
  return (
    <div className="flex items-center justify-center h-96">
      <Loading />
    </div>
  );
}
