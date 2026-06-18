import Sidebar from '@/components/layout/Sidebar';
import RightSidebar from '@/components/layout/RightSidebar';
import AmigoFAB from '@/components/ai/AmigoFAB';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-neutral-50 dark:bg-neutral-950">
      {/* Left sidebar */}
      <aside className="fixed inset-y-0 left-0 z-30 w-64 border-r border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900">
        <Sidebar />
      </aside>

      {/* Main content */}
      <div className="ml-64 mr-80 flex-1">
        <main className="px-8 py-8">{children}</main>
      </div>

      {/* Right sidebar */}
      <aside className="fixed inset-y-0 right-0 z-30 w-80 overflow-y-auto border-l border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900">
        <RightSidebar />
      </aside>

      <AmigoFAB />
    </div>
  );
}
