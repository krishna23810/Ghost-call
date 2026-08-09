'use client';

import React from 'react';

interface DockButtonProps {
  active?: boolean;
  danger?: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}

export default function DockButton({
  active,
  danger,
  onClick,
  icon,
  label,
}: DockButtonProps) {
  const base =
    'flex items-center gap-2 rounded-full px-3.5 py-2.5 text-xs font-bold transition-all active:scale-95 sm:px-4';

  const style = danger
    ? 'bg-red-50 text-red-600 border border-red-200 hover:bg-red-100'
    : active
      ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-500/25 hover:bg-indigo-700'
      : 'bg-slate-100 text-slate-700 border border-slate-200 hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200';

  return (
    <button type="button" onClick={onClick} className={`${base} ${style}`}>
      {icon}
      <span className="hidden sm:inline">{label}</span>
    </button>
  );
}
