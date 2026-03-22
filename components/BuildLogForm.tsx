'use client';

import { useState, useTransition } from 'react';
import { supabase } from '@/lib/supabase';

export default function BuildLogForm() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [projectLink, setProjectLink] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const trimmedName = name.trim();
    const trimmedDescription = description.trim();
    const trimmedLink = projectLink.trim();

    if (!trimmedName || !trimmedDescription) {
      setError('Name and description are required.');
      return;
    }

    startTransition(async () => {
      const { error: insertError } = await supabase.from('build_logs').insert({
        name: trimmedName,
        description: trimmedDescription,
        project_link: trimmedLink || null,
      });

      if (insertError) {
        setError('Failed to submit. Please try again.');
        console.error(insertError.message);
        return;
      }

      setName('');
      setDescription('');
      setProjectLink('');
    });
  };

  const inputClass =
    'w-full bg-zinc-100 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-lg px-3 py-2 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-600 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:opacity-50 transition';

  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-5">
      <h2 className="text-sm font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-4">
        Log a ship
      </h2>
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label htmlFor="name" className="block text-sm text-zinc-600 dark:text-zinc-400 mb-1">
            Your name
          </label>
          <input
            id="name"
            type="text"
            placeholder="Ada Lovelace"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={isPending}
            className={inputClass}
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm text-zinc-600 dark:text-zinc-400 mb-1">
            What did you ship?
          </label>
          <textarea
            id="description"
            placeholder="Launched the new onboarding flow..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={isPending}
            rows={3}
            className={`${inputClass} resize-none`}
          />
        </div>

        <div>
          <label htmlFor="projectLink" className="block text-sm text-zinc-600 dark:text-zinc-400 mb-1">
            Project link{' '}
            <span className="text-zinc-400 dark:text-zinc-600 font-normal">(optional)</span>
          </label>
          <input
            id="projectLink"
            type="url"
            placeholder="https://your-project.com"
            value={projectLink}
            onChange={(e) => setProjectLink(e.target.value)}
            disabled={isPending}
            className={inputClass}
          />
        </div>

        {error && <p className="text-sm text-red-500 dark:text-red-400">{error}</p>}

        <button
          type="submit"
          disabled={isPending}
          className="w-full bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white font-semibold text-sm rounded-lg py-2.5 px-4 transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-zinc-900"
        >
          {isPending ? 'Shipping...' : 'Ship it'}
        </button>
      </form>
    </div>
  );
}
