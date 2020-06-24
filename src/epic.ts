import { ofType } from 'redux-observable';
import { switchMap, map, tap, delay } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';

export class IteratorBehaviorSubject<T> extends BehaviorSubject<T> {
  constructor(private iterator: any, value: T) {
    super(value);

    this.iterator = iterator;
  }

  async push(pushValue: T): Promise<void> {
    const { done, value } = await this.iterator.next(pushValue);

    if (done && value === undefined) {
      this.complete();
    } else {
      this.next(await value);
    }
  }
}

export async function* asyncGenerator() {
  for (let i = 0; i <= 10; i++) {
    yield new Promise((resolve) => {
      setTimeout(() => {
        resolve(i);
      }, 1000);
    });
  }
}

const iterator$ = new IteratorBehaviorSubject(asyncGenerator, undefined);

export function epic(action$: any): any {
  return action$.pipe(
    ofType('TAKE_EPIC'),
    switchMap(() => {
      return iterator$.pipe(
        tap((value) => console.log('EPIC: INCOMING VALUE', value)),
        delay(1000), // Some hard calculations here
        tap((value) => console.log('EPIC: DONE PROCESSING VALUE', value)),
        tap({
          next: iterator$.push,
          complete: () => {
            console.log('EPIC: DONE PROCESSING ALL VALUES');
          },
        })
      );
    }),
    map((value) => ({ type: 'PUT_EPIC', payload: value }))
  );
}
