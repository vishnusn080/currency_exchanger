import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, of, delay } from 'rxjs';
import { MOST_POPULAR_CURR } from 'src/app/constants/constants';
import { TOP_CURRENCY_CONVERSION_PRICE_RESPONSE } from '../../constants/Types';
@Injectable({
  providedIn: 'root',
})
export class CardService {
  constructor(private http: HttpClient) {}

  fetchTopCurrencyConversions = (
    currRates:any,
    amount: number
  ): Observable<TOP_CURRENCY_CONVERSION_PRICE_RESPONSE[]> => {
    const subscriptions: Observable<TOP_CURRENCY_CONVERSION_PRICE_RESPONSE>[] = [];

    MOST_POPULAR_CURR.forEach(
      (name: string, index: number) => {
        const from = currRates.from;
        const to = name;
        if (from !== to) {
          if(currRates.rates[to]) {
            const request = of({
              result: currRates.rates[to] * amount,
              from: from,
              to: to,
              amount: amount,
            }).pipe(
              delay(2000)
            );
          subscriptions.push(request);
          }
        }
      }
    );

    return forkJoin(subscriptions);
  };
}
