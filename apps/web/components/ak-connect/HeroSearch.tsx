"use client";

import { Mic, Search } from 'lucide-react';
import { useMemo, useState } from 'react';


export default function HeroSearch({
  value,
  onChange,
  onSearch,
  loading,
  suggestions,
}: {
  value: string;
  onChange: (v: string) => void;
  onSearch: () => void;
  loading?: boolean;
  suggestions?: string[];
}) {
  const [open, setOpen] = useState(false);

  const hasSuggestions = Boolean(suggestions?.length);
  const list = useMemo(() => suggestions || [], [suggestions]);

  // Avoid setting state inside effect; derive visibility from value.
  const shouldShow = hasSuggestions && open && value.trim().length > 0;


  return (
    <div className="relative w-full">
      <div className="mx-auto mt-4 flex w-full max-w-3xl flex-col gap-3">
        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-[1px] backdrop-blur-2xl">
          <div className="flex items-center gap-3 rounded-3xl bg-[#0b1220]/60 px-4 py-3">
            <Search className="h-5 w-5 text-[#00ffcc]" />
            <input
              value={value}
              onChange={(e) => onChange(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') onSearch();
              }}
              onFocus={() => hasSuggestions && setOpen(true)}
              onBlur={() => {
                window.setTimeout(() => setOpen(false), 120);
              }}
              placeholder="Search businesses, categories, offers"
              className="w-full bg-transparent text-sm font-semibold text-white placeholder:text-white/40 outline-none"
              aria-label="Search"
            />

            <button
              onClick={onSearch}
              disabled={loading}
              className="rounded-2xl bg-[#00ffcc] px-4 py-2 text-sm font-black text-[#06120f] transition hover:brightness-110 disabled:opacity-60"
            >
              {loading ? 'Searching...' : 'Search'}
            </button>

            <button
              onClick={() => {
                // voice placeholder
              }}
              className="rounded-2xl border border-white/10 bg-white/5 p-2 text-white/80 transition hover:bg-white/10"
              aria-label="Voice search"
              type="button"
            >
              <Mic size={16} />
            </button>
          </div>

          {shouldShow ? (

            <div className="absolute left-0 right-0 top-full mt-2 overflow-hidden rounded-3xl border border-white/10 bg-[#0b1220]/85 backdrop-blur-2xl shadow-[0_40px_120px_rgba(0,0,0,0.45)]">
              <div className="max-h-64 overflow-auto p-2">
                {list.map((s) => (
                  <button
                    key={s}
                    className="w-full rounded-2xl px-3 py-2 text-left text-sm font-semibold text-white/80 transition hover:bg-white/10"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => onChange(s)}
                  >
                    {s}
                  </button>
                ))}
                {!list.length ? (
                  <div className="px-3 py-3 text-sm font-semibold text-white/60">No suggestions</div>
                ) : null}
              </div>
            </div>
          ) : null}
        </div>

        <p className="text-center text-xs font-semibold text-white/60">
          Premium discovery powered by AK Connect.
        </p>
      </div>
    </div>
  );
}

