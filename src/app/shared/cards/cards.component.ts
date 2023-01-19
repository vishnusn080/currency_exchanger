import { Component, OnInit } from '@angular/core';
import { CardService } from './cards.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CurrencyDetail, TOP_CURRENCY_CONVERSION_PRICE_RESPONSE, ERROR_RESPONSE } from '../../constants/Types';

import {
  StoreService,
  State,
} from 'src/app/store/store.service';

@Component({
  selector: 'app-cards',
  templateUrl: './cards.component.html',
  styleUrls: ['./cards.component.scss'],
})
export class CardsComponent implements OnInit {
  popularCurrencyConversions: any[] = [];
  curAmount: number = 0;
  currencies: CurrencyDetail[] = [];
  disabled: boolean = false;
  currentRates: any = {}

  constructor(
    private store: StoreService,
    private cardService: CardService,
    private snackbar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.store.getState().subscribe((state: State) => {
      this.curAmount = state.amount ?? 0;
      this.currencies = state.currencies ?? [];
      this.disabled = !state.isCurrAmountValid;
      this.currentRates = state.currentFromCurrencyRates
      if (state.isCurrAmountValid) this.getCurrencyConversions();
    });
  }

  getCurrencyConversions = () => {
    this.popularCurrencyConversions = []
    this.cardService
      .fetchTopCurrencyConversions(
        this.currentRates,
        this.curAmount
      )
      .subscribe(
        (responses: TOP_CURRENCY_CONVERSION_PRICE_RESPONSE[]) => {
          this.popularCurrencyConversions = []
          responses.forEach((res: any) => {
            const { from, to, result }  = res;
            const rate = {
              from,
              to,
              result: result,
            };
            this.popularCurrencyConversions.push(rate);
          });
        },
        (error: ERROR_RESPONSE) => {
          console.log(error);
          this.snackbar.open(
            error["error"]["message"],
            'okay',
            {
              duration: 5000,
              verticalPosition: 'top',
              horizontalPosition: 'center',
              panelClass: ['red-snackbar'],
            }
          );
        }
      );
  };
}
