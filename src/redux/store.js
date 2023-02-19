import { combineReducers, configureStore } from "@reduxjs/toolkit";

import { baseApiSlice } from "services/baseApiSlice";

import storage from "redux-persist/lib/storage";

import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";

import authReducer from "./auth/authSlice";

const persistConfig = {
  key: "root",
  storage,
  blacklist: [baseApiSlice.reducerPath],
};

const reducers = combineReducers({
  [baseApiSlice.reducerPath]: baseApiSlice.reducer,
  auth: authReducer,
});

const persistedReducer = persistReducer(persistConfig, reducers);

export const makeStore = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(baseApiSlice.middleware),
});

export const persistor = persistStore(makeStore);
