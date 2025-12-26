export interface UpdateLog {
  timestamp: number;
  result: 'success' | 'failure';
  message?: string;
}

export interface State {
  lastUpdate: number;
  lastResult: 'success' | 'failure' | null;
  lastErrorMessage: string | null;
  isUpdating: boolean;
  nextScheduledUpdate: number;
  history: UpdateLog[];
}
