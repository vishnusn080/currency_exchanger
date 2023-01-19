import {
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  AfterViewInit,
} from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { ChartService } from './chart.service';
import { State, StoreService } from '../../store/store.service';
import * as moment from 'moment';
import {
  HISTORICAL_DATA_API_RESPONSE,
  ERROR_RESPONSE,
} from '../../constants/Types';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss'],
})
export class ChartComponent implements OnInit, AfterViewInit {
  @ViewChild('chartCanvas') myChart!: ElementRef;
  base: string = '';
  target: string = '';
  chart!: Chart;
  horizontalLabels: string[] = [];
  graphData: number[] = [];

  constructor(
    private chartService: ChartService,
    private store: StoreService,
    private snackbar: MatSnackBar
  ) {
    Chart.register(...registerables);
  }
  ngAfterViewInit(): void {
    this.chart = new Chart(this.myChart.nativeElement.getContext('2d'), {
      type: 'line',
      data: {
        labels: this.horizontalLabels,
        datasets: [
          {
            label: 'Historical Rate Change Data',
            backgroundColor: 'lightblue',
            borderColor: 'royalblue',
            data: this.graphData,
          },
        ],
      },

      options: {
        plugins: {
          legend: {
            labels: {
              color: 'white',
            },
          },
        },
        backgroundColor: 'white',
        color: 'white',

        scales: {
          y: {
            display: true,
            ticks: {
              color: 'white',
            },
            title: {
              display: true,
              text: 'Rates',
              color: 'white',
            },
          },
          x: {
            display: true,
            ticks: {
              color: 'white',
            },
            title: {
              display: true,
              text: 'Months',
              color: 'white',
            },
          },
        },
      },
    });
  }

  updateChart = () => {
    this.chart.data.labels = this.horizontalLabels;
    this.chart.data.datasets[0].data = this.graphData;
    this.chart.update();
  };

  ngOnInit(): void {
    this.chartService.getLastDayOfEveryMonthOfPastYear();
    this.store.getState().subscribe((state: State) => {
      this.base = state.from;
      this.target = state.to;
      if (this.base.length && this.target.length) this.getGraphData();
    });
  }

  getGraphData = () => {
    this.chartService.getHistoricalData(this.base, this.target).subscribe(
      (data: HISTORICAL_DATA_API_RESPONSE) => {
        if (data.success) {
          this.horizontalLabels = [];
          this.graphData = [];
          const datesToFetchDataFor: string[] = this.chartService
            .getLastDayOfEveryMonthOfPastYear()
            .reverse();
          datesToFetchDataFor.forEach((date: string) => {
            const rate = data.rates[date][this.target];
            const currentLabel = `${moment(date).format('MMM')} ${moment(
              date
            ).format('YYYY')}`;
            this.graphData.push(rate);
            this.horizontalLabels.push(currentLabel);
          });
          this.updateChart();
        }
      },
      (error: ERROR_RESPONSE) => {
        this.snackbar.open(error['error']['message'], 'okay', {
          duration: 5000,
          verticalPosition: 'top',
          horizontalPosition: 'center',
          panelClass: ['red-snackbar'],
        });
      }
    );
  };
}
