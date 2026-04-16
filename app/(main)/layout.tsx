import Sidebar from '@/components/layout/Sidebar';
import RightSidebar from '@/components/layout/RightSidebar';
import AmigoFAB from '@/components/ai/AmigoFAB';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-slate-950">
      {/* Left sidebar */}
      <aside className="fixed inset-y-0 left-0 z-30 w-64 border-r border-slate-800 bg-slate-950/90 backdrop-blur-sm">
        <Sidebar />
      </aside>

      {/* Main content */}
      <div className="ml-64 mr-80 flex-1">
        <main className="mx-auto max-w-2xl px-6 py-8">{children}</main>
      </div>

      {/* Right sidebar */}
      <aside className="fixed inset-y-0 right-0 z-30 w-80 overflow-y-auto border-l border-slate-800 bg-slate-950/90 backdrop-blur-sm">
        <RightSidebar />
      </aside>

      <AmigoFAB />
    </div>
  );
}
