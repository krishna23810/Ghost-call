'use client';

import { GhostIcon } from './Icons';

export default function LoadingScreen() {
  return (
    <main className="flex min-h-dvh items-center justify-center bg-[#f7f8fc] px-4">
      <div className="text-center">
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-lg shadow-indigo-600/25">
          <GhostIcon className="h-8 w-8 animate-pulse" />
        </div>

        <p className="text-lg font-bold text-slate-950">Connecting Ghost Call</p>
        <p className="mt-1 text-xs font-medium text-slate-500">
          Securing your media connection...
        </p>

        <div className="mx-auto mt-5 h-1.5 w-40 overflow-hidden rounded-full bg-slate-200">
          <div className="h-full w-1/3 animate-[loading_1.3s_ease-in-out_infinite] rounded-full bg-indigo-600" />
        </div>
      </div>
    </main>
  );
}
