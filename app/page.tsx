import { supabase } from '@/lib/supabase';
import BuildLogForm from '@/components/BuildLogForm';
import BuildLogFeed from '@/components/BuildLogFeed';
import ThemeToggle from '@/components/ThemeToggle';
import type { BuildLog } from '@/types';

async function getInitialLogs(): Promise<BuildLog[]> {
  const { data, error } = await supabase
    .from('build_logs')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(50);

  if (error) {
    console.error('Error fetching build logs:', error.message);
    return [];
  }

  return data ?? [];
}

export default async function Home() {
  const initialLogs = await getInitialLogs();

  return (
    <main className="min-h-screen bg-zinc-100 dark:bg-zinc-950 transition-colors duration-200">
      <header className="border-b border-zinc-200 dark:border-zinc-800 sticky top-0 z-10 backdrop-blur-sm bg-zinc-100/90 dark:bg-zinc-950/90 transition-colors duration-200">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">
              Build Log
            </h1>
            <p className="text-sm text-zinc-500 mt-0.5">What did you ship today?</p>
          </div>
          <ThemeToggle />
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        <BuildLogForm />
        <BuildLogFeed initialLogs={initialLogs} />
      </div>
    </main>
  );
}
