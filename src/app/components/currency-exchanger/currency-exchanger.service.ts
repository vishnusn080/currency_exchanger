import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SYMBOL_API_RESPONSE, ONE_UNIT_FROM_TO_API_RESPONSE } from '../../constants/Types';
const { BASE_URL, KEY } = environment;

@Injectable({
  providedIn: 'root',
})
export class CurrencyExchangerService {
  constructor(private http: HttpClient) {}

  validateAmount = (val: any): boolean => {
    if (val <= 0 || isNaN(val)) {
      return false;
    }
    return true;
  };

  fetchAvailableSymbols = (): Observable<SYMBOL_API_RESPONSE> => {
    return this.http.get<SYMBOL_API_RESPONSE>(`${BASE_URL}/symbols`);
  };

  getOneUnitValue = (base: string = 'EUR'): Observable<ONE_UNIT_FROM_TO_API_RESPONSE> => {
    return this.http.get<ONE_UNIT_FROM_TO_API_RESPONSE>(
      `${BASE_URL}/latest?symbols=&base=${base}`
    );
  };
}
