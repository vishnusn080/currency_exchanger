import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable} from 'rxjs';
import * as moment from 'moment';
import { HISTORICAL_DATA_API_RESPONSE } from '../../constants/Types';
const { BASE_URL } = environment;

@Injectable({
  providedIn: 'root',
})
export class ChartService {
  constructor(private http: HttpClient) { }

  getHistoricalData = (from: string, to: string): Observable<HISTORICAL_DATA_API_RESPONSE> => {
    const endDate = moment(new Date()).format("YYYY-MM-DD")
    const startDate = moment(new Date()).subtract(1, 'year').format("YYYY-MM-DD")
    return this.http.get<HISTORICAL_DATA_API_RESPONSE>(
      `${BASE_URL}/timeseries?base=${from}&symbols=${to}&start_date=${startDate}&end_date=${endDate}`
    );
  }

  getLastDayOfEveryMonthOfPastYear = (): string[] => {
    const dates: string[] = [];
    for (let i = 1; i <= 12; i++) {
      const lastDay = moment(new Date()).subtract(i, 'months').endOf('month').format("YYYY-MM-DD")
      dates.push(lastDay);
    }
    return dates;
  }
}
