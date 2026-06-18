import type { Metadata } from 'next';
import ProfileForm from '@/components/profile/ProfileForm';

export const metadata: Metadata = { title: 'My Profile — Amigo' };

export default function ProfilePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-lg font-bold text-neutral-900">
          My <span className="neon-text">Profile</span>
        </h1>
        <p className="text-xs text-neutral-500 font-medium">
          Your student identity — saved locally on this device
        </p>
      </div>
      <ProfileForm />
    </div>
  );
}
