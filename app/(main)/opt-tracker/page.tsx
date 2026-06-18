import type { Metadata } from 'next';
import OPTTrackerClient from './OPTTrackerClient';

export const metadata: Metadata = { title: 'OPT Tracker — Amigo' };

export default function OPTTrackerPage() {
  return <OPTTrackerClient />;
}
