'use client';

import dynamic from 'next/dynamic';

const EventosClient = dynamic(() => import('./EventosClient'));

export default function EventosPage() {
  return <EventosClient />;
}
