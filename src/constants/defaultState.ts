import type { State } from '@/types/state';

export const defaultState: State = {
  lastUpdate: 0,
  lastResult: null,
  lastErrorMessage: null,
  isUpdating: false,
  nextScheduledUpdate: 0,
};
