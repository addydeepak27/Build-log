'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import BuildLogCard from './BuildLogCard';
import type { BuildLog } from '@/types';

interface BuildLogFeedProps {
  initialLogs: BuildLog[];
}

export default function BuildLogFeed({ initialLogs }: BuildLogFeedProps) {
  const [logs, setLogs] = useState<BuildLog[]>(initialLogs);

  useEffect(() => {
    const channel = supabase
      .channel('build_logs_feed')
      .on<BuildLog>(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'build_logs' },
        (payload) => {
          setLogs((prev) => {
            if (prev.some((log) => log.id === payload.new.id)) return prev;
            return [payload.new, ...prev];
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  if (logs.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-zinc-600 text-sm">
          No ships yet. Be the first to log one above.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {logs.map((log) => (
        <BuildLogCard key={log.id} log={log} />
      ))}
    </div>
  );
}
