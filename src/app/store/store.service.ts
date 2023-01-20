import { Injectable, Type } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { TYPE } from '../constants/constants';
import { CurrencyDetail } from '../constants/Types';

export interface State {
  pageName: string;
  currencies: CurrencyDetail[];
  amount: number;
  isCurrAmountValid: boolean;
  currentFromCurrencyRates: any;
  from: string;
  to: string;
}

@Injectable({
  providedIn: 'root',
})
export class StoreService {
  private state = new BehaviorSubject<State>({
    pageName: '',
    currencies: [],
    amount: 0,
    isCurrAmountValid: false,
    currentFromCurrencyRates: {},
    from: 'EUR',
    to: 'USD',
  });

  constructor() {}

  public getState = (): Observable<State> => {
    return this.state;
  };

  public dispatch = (type: string, value: any) => {
    switch (type) {
      case TYPE.PAGE_NAME:
        this.state.next({
          ...this.state.value,
          pageName: value,
        });
        break;
      case TYPE.AMOUNT:
        this.state.next({
          ...this.state.value,
          amount: value,
        });
        break;
      case TYPE.CURRENCIES:
        this.state.next({
          ...this.state.value,
          currencies: value,
        });
        break;
      case TYPE.IS_CUR_AMOUNT_VALID:
        this.state.next({
          ...this.state.value,
          isCurrAmountValid: value,
        });
        break;
      case TYPE.CURR_FROM_CURRENCY_RATES:
        this.state.next({
          ...this.state.value,
          currentFromCurrencyRates: value,
        });
        break;
      case TYPE.FROM:
        this.state.next({
          ...this.state.value,
          from: value,
        });
        break;
      case TYPE.TO:
        this.state.next({
          ...this.state.value,
          to: value,
        });
        break;
      default:
        break;
    }
  };
}
