import { Component, OnInit, ViewChild } from '@angular/core';
import { CurrencyExchangerService } from './currency-exchanger.service';
import { State, StoreService } from '../../store/store.service';
import { TYPE } from 'src/app/constants/constants';
import { ActivatedRoute, Router } from '@angular/router';
import { DropdownComponent } from '../../shared/dropdown/dropdown.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SYMBOL_API_RESPONSE, ONE_UNIT_FROM_TO_API_RESPONSE, CurrencyDetail, ERROR_RESPONSE } from '../../constants/Types';

@Component({
  selector: 'app-currency-exchanger',
  templateUrl: './currency-exchanger.component.html',
  styleUrls: ['./currency-exchanger.component.scss'],
})
export class CurrencyExchangerComponent implements OnInit {
  @ViewChild('fromDropDown') fromDropDownEl!: DropdownComponent;
  @ViewChild('toDropDown') toDropDownEl!: DropdownComponent;
  fromOption: string = 'EUR';
  toOption: string = 'USD';
  isCorrectAmountEntered: boolean = false;
  amount: number = 0;
  currencies: CurrencyDetail[] = [];
  convertedResult: string = '';
  isConverting: boolean = false;
  isHomePage: boolean = false;
  singleUnitCurrencyRate: string = '';
  currentFromCurrencyUnitPriceRates: any = {};

  constructor(
    private currencyExchangerService: CurrencyExchangerService,
    private store: StoreService,
    private route: ActivatedRoute,
    private router: Router,
    private snackbar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe((query: any) => {
      const { from, to } = query;
      if (from && to) {
        this.fromOption = from;
        this.toOption = to;
        this.setDropdownValue('from', this.fromOption);
        this.setDropdownValue('to', this.toOption);
      }
    });

    this.store.getState().subscribe((state: State) => {

      this.isHomePage = state.pageName === 'home';
      this.amount = state.amount;
      this.isCorrectAmountEntered = state.isCurrAmountValid;
    });

    this.getSymbols();
    this.getOneUnitPrice();
    this.getOneUnitRate();
    this.store.dispatch(TYPE.AMOUNT, this.amount);
  }

  swap = () => {
    const prevTo = this.toOption;
    this.toOption = this.fromOption;
    this.fromOption = prevTo;
    this.setDropdownValue('from', this.fromOption);
    this.setDropdownValue('to', this.toOption);
  };

  getSymbols = () => {
    this.currencyExchangerService.fetchAvailableSymbols().subscribe(
      (data: SYMBOL_API_RESPONSE) => {

        if (data.success) {
          this.currencies = [];
          let names = Object.keys(data.symbols);
          for (let i = 0; i < names.length; i++) {
            let curCurr = {
              name: names[i],
              fullName: data.symbols[names[i]],
            };
            this.currencies.push(curCurr);
          }
          this.store.dispatch(TYPE.AMOUNT, this.amount);
          this.store.dispatch(TYPE.CURRENCIES, this.currencies);
        } else {
        }
      },
      (error: ERROR_RESPONSE) => {
        this.snackbar.open(
          error["error"]["message"],
          'okay',
          {
            duration: 3000,
            verticalPosition: 'top',
            horizontalPosition: 'center',
            panelClass: ['red-snackbar'],
          }
        );
      }
    );
  };

  setAmount = (e: any) => {
    const isValueValid: boolean = this.currencyExchangerService.validateAmount(
      e.target.value
    );
    this.isCorrectAmountEntered = isValueValid;
    this.store.dispatch(TYPE.IS_CUR_AMOUNT_VALID, this.isCorrectAmountEntered);
    if (!isValueValid) return;
    this.amount = e.target.value;
    if (isValueValid) {
      this.store.dispatch(TYPE.AMOUNT, e.target.value);
    }
  };

  convertCurrencyValue = () => {
    this.isConverting = true;
    if (Object.keys(this.currentFromCurrencyUnitPriceRates).length) {
      const convertedValue =
        this.currentFromCurrencyUnitPriceRates[this.toOption] * this.amount;
      this.convertedResult = `${convertedValue} ${this.toOption}`;
      this.isConverting = false;

    } else {
      this.isConverting = false;
      this.snackbar.open('API LIMIT REACHED', 'okay', {
        duration: 5000,
        verticalPosition: 'top',
        horizontalPosition: 'center',
        panelClass: ['red-snackbar'],
      });
    }
  };

  getOneUnitRate = () => {
    this.singleUnitCurrencyRate = '';
    const oneUnit = `${1 + ' ' + this.fromOption} = ${this.currentFromCurrencyUnitPriceRates[this.toOption] ?? '...'
      } ${this.toOption}`;
    this.singleUnitCurrencyRate = oneUnit;
  };

  getOneUnitPrice = () => {
    this.currencyExchangerService.getOneUnitValue(this.fromOption).subscribe(
      (data: ONE_UNIT_FROM_TO_API_RESPONSE) => {

        if (data.success) {
          const rates = data.rates;
          this.currentFromCurrencyUnitPriceRates = rates;
          this.store.dispatch(TYPE.CURR_FROM_CURRENCY_RATES, {
            from: data.base,
            rates: this.currentFromCurrencyUnitPriceRates,
          });
          this.getOneUnitRate();
        } else {
          this.snackbar.open('Sorry API KEY EXPIRED', 'okay', {
            duration: 5000,
            verticalPosition: 'top',
            horizontalPosition: 'center',
            panelClass: ['red-snackbar'],
          });
        }
      },
      (error: ERROR_RESPONSE) => {
        console.log(error);
        this.snackbar.open(error["error"]["message"], 'okay', {
          duration: 5000,
          verticalPosition: 'top',
          horizontalPosition: 'center',
          panelClass: ['red-snackbar'],
        });
      }
    );
  };

  setDropdownValue = (type: string, value: string) => {
    if (type === 'from') {
      this.fromOption = value;
      this.fromDropDownEl.setOptions(this.fromOption);
    }
    if (type === 'to') {
      this.toOption = value;
      this.toDropDownEl.setOptions(this.toOption);
    }
    this.getOneUnitRate();
    this.getOneUnitPrice();
    this.store.dispatch(TYPE.FROM, this.fromOption);
    this.store.dispatch(TYPE.TO, this.toOption);
    this.convertedResult = '';
  };

  getBtnText = (): string => {
    return this.isConverting ? 'Converting..' : 'Convert';
  };

  getFullName = (): string => {
    const val = this.currencies.find(
      (curr: CurrencyDetail) => curr.name == this.fromOption
    );
    if (val) return `${val.name} - ${val.fullName}`;
    else return '';
  };

  goToDetails = () => {
    this.router.navigate([`details/${this.fromOption}/${this.toOption}`]);
  };
}
