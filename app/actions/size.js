import { ADD_SIZE } from './types';

export const addSize = Name => {
  return {
    type: ADD_SIZE,
    payload: Name
  }
}