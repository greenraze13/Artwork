import { ADD_SIZE } from '../actions/types';

const initialState = {
  sizes: [],
};

const sizeReducer = (state = initialState, action) => {
//   console.log(JSON.stringify(state));

  switch(action.type) {
    case ADD_SIZE:
      return {
        ...state,
        sizes: state.sizes.concat({
          name: action.payload
        })
      };
    default:
      return state;
  }
}

export default sizeReducer;
