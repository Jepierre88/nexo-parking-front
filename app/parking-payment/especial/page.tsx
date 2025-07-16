'use client';

import dynamic from 'next/dynamic';

const SpecialRateClient = dynamic(() => import('./SpecialRateClient'));

export default function SpecialRatePage() {
  return <SpecialRateClient />;
}
