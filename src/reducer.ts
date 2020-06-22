export interface RootState {
  epic: number;
  saga: number;
}

export function reducer(state: RootState = { epic: 0, saga: 0 }, action: any) {
  if (action.type === 'PUT_EPIC') {
    return { ...state, epic: action.payload };
  } else if (action.type === 'PUT_SAGA') {
    return { ...state, saga: action.payload };
  } else {
    return state;
  }
}
