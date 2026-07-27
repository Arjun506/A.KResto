'use client';

import { useEffect, useState } from 'react';
import { HelpCircle, X, ChevronRight, ChevronLeft, Sparkles, Award } from 'lucide-react';

interface TourStep {
  target: string;
  title: string;
  description: string;
  position: 'bottom' | 'top' | 'left' | 'right' | 'center';
}

export default function ProductTour() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const steps: TourStep[] = [
    {
      target: 'body',
      title: 'Welcome to AK Business OS! 🚀',
      description: 'Let us take you on a quick 1-minute tour of your new premium workspace environment.',
      position: 'center'
    },
    {
      target: '[href="/dashboard/launch-center"]',
      title: 'Business Launch Center 🏆',
      description: 'Your step-by-step progress guide. Complete these checklist tasks to get your workspace fully operational.',
      position: 'bottom'
    },
    {
      target: 'button kbd',
      title: 'Universal Search Palette ⌘K',
      description: 'Press Ctrl+K or click here to open the Command Palette. Search anything across pages, products, orders, or trigger actions.',
      position: 'bottom'
    },
    {
      target: 'aside',
      title: 'Navigation & Favorites ⭐',
      description: 'Toggle through your active business modules. You can star frequently used pages to pin them as Favorites.',
      position: 'right'
    },
    {
      target: 'button[title*="Hide header"], button[title*="Show Header"]',
      title: 'Focus Layout Toggle 👁️',
      description: 'Minimize menus and headers when you need a distraction-free POS billing terminal or kitchen view.',
      position: 'bottom'
    }
  ];

  useEffect(() => {
    // Check if user has already taken the tour
    const tourTaken = localStorage.getItem('bwe-product-tour-completed');
    if (!tourTaken) {
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 2000); // Trigger after 2 seconds
      return () => clearTimeout(timer);
    }

    // Listen for manual trigger event
    const handleStartTour = () => {
      setCurrentStep(0);
      setIsOpen(true);
    };
    window.addEventListener('start-product-tour', handleStartTour);
    return () => window.removeEventListener('start-product-tour', handleStartTour);
  }, []);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      handleComplete();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleComplete = () => {
    setIsOpen(false);
    localStorage.setItem('bwe-product-tour-completed', 'true');
  };

  if (!isOpen) return null;

  const step = steps[currentStep];

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-slate-950/20 backdrop-blur-xs select-none">
      <div className="w-full max-w-sm bg-white dark:bg-[#11131c]/95 border border-slate-200/50 dark:border-slate-800/40 rounded-2xl shadow-2xl p-5 glass relative animate-cc-panel-in">
        
        {/* Close Button */}
        <button
          onClick={handleComplete}
          className="absolute top-4 right-4 p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-400 hover:text-slate-600 transition"
        >
          <X size={15} />
        </button>

        {/* Step Index Badge */}
        <div className="flex items-center justify-between mb-3">
          <span className="text-[10px] font-black text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950 px-2 py-0.5 rounded-full uppercase tracking-wider">
            Step {currentStep + 1} of {steps.length}
          </span>
          <div className="flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
            <span className="text-[9px] font-bold text-slate-400 uppercase">Product Tour</span>
          </div>
        </div>

        {/* Title & Body */}
        <div className="space-y-2 text-left">
          <h3 className="text-sm font-black text-slate-850 dark:text-slate-100 flex items-center gap-1.5">
            {step.title}
          </h3>
          <p className="text-xs text-slate-450 dark:text-slate-400 leading-normal">
            {step.description}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between mt-5 pt-3 border-t border-slate-100 dark:border-slate-850/40">
          <button
            onClick={handleBack}
            disabled={currentStep === 0}
            className={`flex items-center gap-1 text-[10px] font-black uppercase tracking-wider transition ${
              currentStep === 0
                ? 'text-slate-300 dark:text-slate-700 cursor-not-allowed'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <ChevronLeft size={14} />
            <span>Back</span>
          </button>

          <div className="flex items-center gap-1">
            {steps.map((_, i) => (
              <span
                key={i}
                className={`h-1.5 rounded-full transition-all duration-305 ${
                  i === currentStep ? 'w-4 bg-indigo-500' : 'w-1.5 bg-slate-200 dark:bg-slate-800'
                }`}
              />
            ))}
          </div>

          <button
            onClick={handleNext}
            className="flex items-center gap-1 text-[10px] font-black uppercase tracking-wider text-indigo-600 hover:text-indigo-800 dark:text-indigo-400"
          >
            <span>{currentStep === steps.length - 1 ? 'Finish' : 'Next'}</span>
            <ChevronRight size={14} />
          </button>
        </div>

      </div>
    </div>
  );
}

