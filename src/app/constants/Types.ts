export interface SYMBOL_API_RESPONSE {
  success: string;
  symbols: {[key: string]: string}
}


export interface ONE_UNIT_FROM_TO_API_RESPONSE {
  base: string;
  date: string;
  rates: {[key:string]: number}
  success: boolean;
  timestamp: number;
}

export interface TOP_CURRENCY_CONVERSION_PRICE_RESPONSE {
  result: number;
  from: string;
  to: string;
  amount: number
}

export interface HISTORICAL_DATA_API_RESPONSE {
  success: boolean;
  timeseries: boolean;
  start_date: string;
  end_date: string;
  base: string;
  rates: {
    [key: string]: {
      [key: string]: number
    }
  }
}

export interface CurrencyDetail {
  name: string;
  fullName: string;
}

const ERROR = "error"

export interface ERROR_RESPONSE {
  ["error"]: {
    ["message"]: string
  }
}
