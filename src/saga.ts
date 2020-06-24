import { put, call, takeLatest } from 'redux-saga/effects';
import { wait } from './wait';

let i = 0;
function requestPromise() {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (i <= 10) {
        console.log(`requestPromise promise ${i} resolved`);
        resolve(i);
        i++;
      } else {
        resolve(undefined);
      }
    }, 1000);
  });
}

function* requestPoint() {
  let shouldContinue = true;

  do {
    try {
      const value = yield call(requestPromise);
      if (value === undefined) {
        shouldContinue = false;
      } else {
        console.log('SAGA: INCOMING VALUE', value);
        yield call(() => wait(1000)); // Some hard calculations here
        console.log('SAGA: DONE PROCESSING VALUE', value);
        yield put({
          type: 'PUT_SAGA',
          payload: value,
        });
      }
    } catch (error) {
      throw new Error(error);
    }
  } while (shouldContinue);
  console.log('SAGA: DONE PROCESSING ALL VALUES');
}

export function* saga() {
  yield takeLatest('TAKE_SAGA', requestPoint);
}
