import type { StateCreator } from 'zustand';
import { devtools, subscribeWithSelector } from 'zustand/middleware';
import { create } from 'zustand';

import { createActions, type AppActions } from './actions'
import { initialState, type AppState } from './initialState'

export type AppStore = AppState & AppActions;

const createStore: StateCreator<
  AppStore,
  [
    ['zustand/subscribeWithSelector', never],
    ['zustand/devtools', never],
  ]
> = (...parameters) => ({
  ...initialState,
  ...createActions(...parameters),
});

export const useStore = create<AppStore>()(
  subscribeWithSelector(devtools(createStore, { name: 'daily_avatar_UI' })),
);