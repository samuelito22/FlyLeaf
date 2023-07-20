import {createStore, combineReducers, applyMiddleware} from 'redux';
import thunk from 'redux-thunk';
import {registerReducer, appStatusReducer, userReducer} from './reducers';
import {persistStore, persistReducer, PURGE} from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';

const rootReducer = combineReducers({
  registerReducer,
  appStatusReducer,
  userReducer,
});

const persistConfig = {
  type: PURGE,
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['registerReducer'],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const Store = createStore(persistedReducer, applyMiddleware(thunk));
export const Persistor = persistStore(Store);
