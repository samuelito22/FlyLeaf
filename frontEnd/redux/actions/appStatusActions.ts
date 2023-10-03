import {TYPES} from '../../constants';
export const SET_CURRENT_SCREEN = 'appStatus/SET_CURRENT_SCREEN' as const;
export const SET_IS_BLOCKED = 'appStatus/SET_IS_BLOCKED' as const;
export const SET_IS_ONLINE = 'appStatus/SET_IS_ONLINE' as const;


interface setIsBlockedAction {
  type: typeof SET_IS_BLOCKED;
  payload: boolean;
}

interface setIsOnlineAction {
  type: typeof SET_IS_ONLINE;
  payload: boolean;
}

interface setCurrentScreenAction {
  type: typeof SET_CURRENT_SCREEN;
  payload: keyof TYPES.RootStackParamList;
}

export type AppStatusActionTypes =
  setIsBlockedAction |
  setIsOnlineAction |
  setCurrentScreenAction;

export const setIsBlocked =
  (isBlocked: boolean) => (dispatch: (action: setIsBlockedAction) => void) => {
    dispatch({
      type: SET_IS_BLOCKED,
      payload: isBlocked,
    });
  };

  export const setIsOnline =
  (isOnline: boolean) => (dispatch: (action: setIsOnlineAction) => void) => {
    dispatch({
      type: SET_IS_ONLINE,
      payload: isOnline,
    });
  };


export const setCurrentScreen = 
  (currentScreen: keyof TYPES.RootStackParamList) => (dispatch: (action: setCurrentScreenAction) => void) => {
    dispatch({
      type: SET_CURRENT_SCREEN,
      payload: currentScreen
    })
  }
