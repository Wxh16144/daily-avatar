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

export const useStore = function <T>(selector?: (state: AppStore) => T) {
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

  return state as T;
} as {
  (): AppStore;
  <T>(selector: (state: AppStore) => T): T;
  getState: typeof store.getState;
  setState: typeof store.setState;
  subscribe: typeof store.subscribe;
};

useStore.getState = store.getState;
useStore.setState = store.setState;
useStore.subscribe = store.subscribe;