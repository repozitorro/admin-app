import {AfterViewInit, Component, ElementRef, OnDestroy, ViewChild} from '@angular/core';
import {AnalyticsService} from '../shared/services/analytics.service';
import {AnalyticsPage} from '../shared/interfaces';
import {Subscription} from 'rxjs';
import {Chart} from 'chart.js';

@Component({
  selector: 'app-analytics-page',
  templateUrl: './analytics-page.component.html',
  styleUrls: ['./analytics-page.component.scss']
})
export class AnalyticsPageComponent implements OnDestroy, AfterViewInit {
  @ViewChild('gain') gainRef: ElementRef;
  @ViewChild('order') orderRef: ElementRef;

  aSub: Subscription;
  average: number;
  pending = true;

  constructor(
    private service: AnalyticsService
  ) {
  }

  ngOnDestroy(): void {
    if (this.aSub) {
      this.aSub.unsubscribe();
    }
  }

  ngAfterViewInit(): void {
    const gainConfig: any = {
      label: 'Выручка',
      color: 'rgb(255, 99, 132)'
    };
    const orderConfig: any = {
      label: 'Заказы',
      color: 'rgb(82, 97, 174)'
    };

    this.aSub = this.service.getAnalytics().subscribe(
      (data: AnalyticsPage) => {
        this.average = data.average;

        gainConfig.labels = data.chart.map(item => item.label);
        gainConfig.data = data.chart.map(item => item.gain);

        orderConfig.labels = data.chart.map(item => item.label);
        orderConfig.data = data.chart.map(item => item.order);

        const gainCtx = this.gainRef.nativeElement.getContext('2d');
        gainCtx.canvas.height = '300px';

        const orderCtx = this.orderRef.nativeElement.getContext('2d');
        orderCtx.canvas.height = '300px';

        // tslint:disable-next-line:no-unused-expression
        new Chart(gainCtx, createChartConfig(gainConfig));
        new Chart(orderCtx, createChartConfig(orderConfig));

        this.pending = false;
      }
    );
  }
}

function createChartConfig({labels, data, label, color}): any {
  return {
    type: 'line',
    options: {
      responsive: true
    },
    data: {
      labels,
      datasets: [
        {
          label, data,
          borderColor: color,
          steppedLine: false,
          fill: false
        }
      ]
    }
  };
}

