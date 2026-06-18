import type { Metadata } from 'next';
import WorkLogClient from './WorkLogClient';

export const metadata: Metadata = { title: 'Work Log' };

export default function WorkLogPage() {
  return <WorkLogClient />;
}
