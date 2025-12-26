export interface State {
  lastUpdate: number;
  lastResult: 'success' | 'failure' | null;
  lastErrorMessage: string | null;
  isUpdating: boolean;
  nextScheduledUpdate: number;
}
