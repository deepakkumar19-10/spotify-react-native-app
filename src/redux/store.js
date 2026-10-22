import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import authReducer from './slices/authSlice';
import playerReducer from './slices/playerSlice';
import libraryReducer from './slices/librarySlice';
import uiReducer from './slices/uiSlice';

const persistConfig = {
  key: 'spotify-rn-root',
  storage: AsyncStorage,
  whitelist: ['auth', 'library', 'player'],
};

const rootReducer = combineReducers({
  auth: authReducer,
  player: playerReducer,
  library: libraryReducer,
  ui: uiReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);

export default store;
