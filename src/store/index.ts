import { createStore } from 'zustand/vanilla';
import type { StateCreator } from 'zustand';
import { devtools, subscribeWithSelector } from 'zustand/middleware';
import { useEffect, useState } from 'preact/hooks';

import { createActions, type AppActions } from './actions'
import { initialState, type AppState } from './initialState'

export type AppStore = AppState & AppActions;

const storeCreator: StateCreator<
  AppStore,
  [
    ['zustand/subscribeWithSelector', never],
    ['zustand/devtools', never],
  ]
> = (...parameters) => ({
  ...initialState,
  ...createActions(...parameters),
});

export const store = createStore<AppStore>()(
  subscribeWithSelector(devtools(storeCreator, { name: 'daily_avatar_UI' })),
);

export function useStore(): AppStore;
export function useStore<T>(selector: (state: AppStore) => T): T;
export function useStore<T>(selector?: (state: AppStore) => T) {
  const [state, setState] = useState(() => 
    selector ? selector(store.getState()) : store.getState()
  );

  useEffect(() => {
    const unsubscribe = store.subscribe((newState) => {
      const nextState = selector ? selector(newState) : newState;
      setState(prev => {
        if (prev === nextState) return prev;
        return nextState;
      });
    });
    return unsubscribe;
  }, [selector]);

  return state;
}

(useStore as any).getState = store.getState;
(useStore as any).setState = store.setState;
(useStore as any).subscribe = store.subscribe;