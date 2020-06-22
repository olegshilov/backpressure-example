import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from './reducer';

export function App() {
  const epicCount = useSelector<RootState, number>((state) => state.epic);
  const sagaCount = useSelector<RootState, number>((state) => state.saga);
  const dispatch = useDispatch();

  return (
    <div>
      epicCount: {epicCount}
      <br />
      <button onClick={() => dispatch({ type: 'TAKE_EPIC' })}>
        Take new number
      </button>
      <hr />
      sagaCount: {sagaCount}
      <br />
      <button onClick={() => dispatch({ type: 'TAKE_SAGA' })}>
        Take new number
      </button>
    </div>
  );
}
