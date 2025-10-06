import { create } from 'zustand';
import { ROUTE_WIZARD_QUESTIONS, WizardField } from '../constants/questions';

const createInitialAnswers = () => {
  const answers: Record<WizardField, string> = {
    start_time: '',
    duration: '',
    walk_type: '',
    start_point: '',
    budget: '',
    preferences: '',
    activities: '',
    food: '',
    transport: '',
    limitations: '',
  };
  return answers;
};

interface WizardState {
  stepIndex: number;
  answers: Record<WizardField, string>;
  setAnswer: (field: WizardField, value: string) => void;
  next: () => void;
  prev: () => void;
  reset: () => void;
}

export const useWizardStore = create<WizardState>((set, get) => ({
  stepIndex: 0,
  answers: createInitialAnswers(),
  setAnswer: (field, value) => {
    set((state) => ({
      answers: { ...state.answers, [field]: value },
    }));
  },
  next: () => {
    set((state) => ({
      stepIndex: Math.min(state.stepIndex + 1, ROUTE_WIZARD_QUESTIONS.length - 1),
    }));
  },
  prev: () => {
    set((state) => ({
      stepIndex: Math.max(state.stepIndex - 1, 0),
    }));
  },
  reset: () => set({ stepIndex: 0, answers: createInitialAnswers() }),
}));

export const wizardHelpers = {
  isLastStep: () => {
    const { stepIndex } = useWizardStore.getState();
    return stepIndex === ROUTE_WIZARD_QUESTIONS.length - 1;
  },
  answersReady: () => {
    const { answers } = useWizardStore.getState();
    return Object.values(answers).every((value) => value.trim().length > 0);
  },
};
