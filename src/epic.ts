import { ofType } from 'redux-observable';
import { switchMap, map, tap, delay } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';

export class IteratorBehaviorSubject<T> extends BehaviorSubject<T | undefined> {
  constructor(private iterator: any) {
    super(undefined);

    this.iterator = iterator;
    this.push(undefined);
  }

  public push = async (pushValue: T | undefined): Promise<void> => {
    const { done, value } = await this.iterator.next(pushValue);

    if (done && value === undefined) {
      this.complete();
    } else {
      this.next(await value);
    }
  };
}

async function* asyncGenerator() {
  for (let i = 0; i <= 10; i++) {
    yield new Promise((resolve) => {
      setTimeout(() => {
        resolve(i);
      }, 1000);
    });
  }
}

const iterator$ = new IteratorBehaviorSubject(asyncGenerator());

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
