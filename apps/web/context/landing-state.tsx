'use client';

import React, { createContext, useContext, useState } from 'react';

type LandingStateContextType = {
  selectedIndustry: string;
  setSelectedIndustry: (industry: string) => void;
};

const LandingStateContext = createContext<LandingStateContextType | undefined>(undefined);

export function LandingStateProvider({ children }: { children: React.ReactNode }) {
  const [selectedIndustry, setSelectedIndustry] = useState('RESTAURANT');

  return (
    <LandingStateContext.Provider value={{ selectedIndustry, setSelectedIndustry }}>
      {children}
    </LandingStateContext.Provider>
  );
}

export function useLandingState() {
  const context = useContext(LandingStateContext);
  if (!context) {
    throw new Error('useLandingState must be used within a LandingStateProvider');
  }
  return context;
}
