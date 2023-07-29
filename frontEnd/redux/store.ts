import {createStore, applyMiddleware} from 'redux';
import thunk from 'redux-thunk';
import {persistStore, persistReducer, PURGE} from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import combineReducer from "./reducers"

const rootReducer = combineReducer

const persistConfig = {
  type: PURGE,
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['registerReducer'],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const Store = createStore(persistedReducer, applyMiddleware(thunk));
export const Persistor = persistStore(Store);
