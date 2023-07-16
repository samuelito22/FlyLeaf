import {useDispatch as _useDispatch} from 'react-redux';
import {ThunkDispatch} from 'redux-thunk';
import {TYPES} from '../../constants';

export default function useDispatch() {
  return _useDispatch<ThunkDispatch<TYPES.AppState, null, TYPES.AppAction>>();
}
