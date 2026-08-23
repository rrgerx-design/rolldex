import { FutureBjjPlan } from '../types';

// Get today's local YYYY-MM-DD string
const getTodayDateString = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const DEFAULT_FUTURE_PLAN: FutureBjjPlan = {
  targetBelt: 'Blue Belt (Faixa Azul)',
  targetDate: getTodayDateString(),
  targetClassCount: 150,
  focusAreas: 'Guard Retention, Clean Knee-Cut Passing, Side Control Escapes & Consistent Mat Time',
  milestones: [],
  customGoalNotes: 'Stay injury-free, tap early, and focus on technique over brute strength. Work on breathing rhythm during 6-minute rounds.',
  coachFeedback: '',
  updatedAt: Date.now()
};
