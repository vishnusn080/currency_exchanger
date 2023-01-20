### Few assumptions/calculations done to bypass api limitations.

- we are calculating the conversion basis the exchange rate per unit currency.

- The list of currencies are coming via the api and the most popular currencies are assumed.

- Basically we are fetching the 1 unit price of the particular from currency and then calculating the conversions of the amount entered.

- We are showing the chart of the historical price changes via the api according to the last date of the month as mentioned in the requirement doc.

- We are calculating the 3*3 grid data by calculation from the unit prices we get from the api.
