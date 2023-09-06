import {TYPES} from '../../constants';
export const SET_CURRENT_SCREEN = 'SET_CURRENT_SCREEN' as const;
export const SET_IS_BLOCKED = 'SET_IS_BLOCKED' as const;


export const setIsBlocked =
  (isBlocked: boolean) => (dispatch: (action: TYPES.AppAction) => void) => {
    dispatch({
      type: SET_IS_BLOCKED,
      payload: isBlocked,
    });
  };


export const setCurrentScreen = 
  (currentScreen: keyof TYPES.RootStackParamList) => (dispatch: (action: TYPES.AppAction) => void) => {
    dispatch({
      type: SET_CURRENT_SCREEN,
      payload: currentScreen
    })
  }
