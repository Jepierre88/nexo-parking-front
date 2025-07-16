'use client';

import dynamic from 'next/dynamic';

const MonthlyRegistrationClient = dynamic(() => import('./MonthlyRegistrationClient'));

export default function MonthlyRegistrationPage() {
  return <MonthlyRegistrationClient />;
}
