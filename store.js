import { createStore, combineReducers } from 'redux';
import sizeReducer from './app/reducers/sizeReducer';

const rootReducer = combineReducers({
  sizeReducer: sizeReducer
});

const configureStore = () => {
  return createStore(rootReducer);
}

export default configureStore;