import React, { createContext, useContext, useState, ReactNode } from 'react';

type StepContextType = {
  unlockedSteps: number[];
  unlockStep: (step: number) => void;
};

const StepGuardContext = createContext<StepContextType | undefined>(undefined);

type StepGuardProviderProps = {
  children: ReactNode;
};

export const StepGuardProvider = ({ children }: StepGuardProviderProps) => {
  const [unlockedSteps, setUnlockedSteps] = useState<number[]>([1]); // step 1 always unlocked

  const unlockStep = (step: number) => {
    setUnlockedSteps((prev) => Array.from(new Set([...prev, step])));
  };

  return (
    <StepGuardContext.Provider value={{ unlockedSteps, unlockStep }}>
      {children}
    </StepGuardContext.Provider>
  );
};

export const useStepGuard = () => {
  const context = useContext(StepGuardContext);
  if (!context) throw new Error('useStepGuard must be used within StepGuardProvider');
  return context;
};
