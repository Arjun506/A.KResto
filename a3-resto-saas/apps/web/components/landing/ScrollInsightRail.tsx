'use client';

import { useEffect, useMemo, useState } from 'react';
import { Activity, Sparkles } from 'lucide-react';

const insights = [
  {
    id: 'hero',
    eyebrow: 'Command center',
    text: 'Operate every branch, role, order, payment, and customer moment from one clean workspace.'
  },
  {
    id: 'industries',
    eyebrow: 'Industry ready',
    text: 'Start with the workflow your business already needs, then expand without rebuilding.'
  },
  {
    id: 'features',
    eyebrow: 'One platform',
    text: 'Replace scattered tools with a single login, shared data, and real-time operational control.'
  },
  {
    id: 'journey',
    eyebrow: 'Fast launch',
    text: 'Create the workspace, configure modules, invite the team, and start selling in minutes.'
  },
  {
    id: 'features-platform',
    eyebrow: 'Growth engine',
    text: 'Add customer apps, marketplace plugins, and AI automation as the business scales.'
  },
  {
    id: 'customers',
    eyebrow: 'Proof',
    text: 'Teams choose AK Business OS to save time, protect margins, and build dependable growth.'
  },
  {
    id: 'pricing',
    eyebrow: 'Simple plans',
    text: 'Begin with a sandbox trial, then move into the tier that matches your operating scale.'
  },
  {
    id: 'faq',
    eyebrow: 'Clarity',
    text: 'No credit card for trial setup, no locked industry path, and no complex rollout.'
  }
];

export default function ScrollInsightRail() {
  const [activeId, setActiveId] = useState(insights[0].id);
  const [progress, setProgress] = useState(0);

  const activeInsight = useMemo(
    () => insights.find((insight) => insight.id === activeId) ?? insights[0],
    [activeId]
  );

  useEffect(() => {
    const update = () => {
      const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
      const nextProgress = documentHeight > 0 ? Math.min(100, Math.max(0, (window.scrollY / documentHeight) * 100)) : 0;
      setProgress(nextProgress);

      const current = insights
        .map((insight) => {
          const element = document.getElementById(insight.id);
          if (!element) return { id: insight.id, distance: Number.POSITIVE_INFINITY };

          const rect = element.getBoundingClientRect();
          return {
            id: insight.id,
            distance: Math.abs(rect.top - window.innerHeight * 0.35)
          };
        })
        .sort((a, b) => a.distance - b.distance)[0];

      if (current?.id) setActiveId(current.id);
    };

    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, []);

  return (
    <aside className="landing-scroll-insight" aria-live="polite">
      <div key={activeInsight.id} className="landing-scroll-insight-card p-4">
        <div className="flex items-start gap-3">
          <span className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-blue-600 text-white shadow-lg shadow-blue-600/25">
            <Sparkles size={16} />
          </span>
          <div className="min-w-0">
            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.18em] text-blue-500">
              <Activity size={11} />
              {activeInsight.eyebrow}
            </div>
            <p className="mt-1 text-sm font-bold leading-relaxed text-[color:var(--landing-text)]">
              {activeInsight.text}
            </p>
          </div>
        </div>
        <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-blue-500/10">
          <div
            className="h-full rounded-full bg-gradient-to-r from-blue-600 via-cyan-400 to-violet-600 transition-[width] duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </aside>
  );
}
