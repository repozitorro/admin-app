import {AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MaterialInstance, MaterialService} from '../shared/material.service';
import {OrdersService} from '../shared/services/orders.service';
import {Filter, Order} from '../shared/interfaces';
import {Subscription} from 'rxjs';

const STEP = 5;

@Component({
  selector: 'app-history-page',
  templateUrl: './history-page.component.html',
  styleUrls: ['./history-page.component.scss']
})
export class HistoryPageComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('tooltip') tooltipRef: ElementRef;
  isFilterVisible: boolean;
  tooltip: MaterialInstance;
  oSub: Subscription;
  orders: Order[] = [];
  filter: Filter = {};
  loading = false;
  reloading = false;
  noMoreOrders = false;
  offset = 0;
  limit = STEP;

  constructor(
    private ordersService: OrdersService
  ) {
  }

  ngOnInit(): void {
    this.reloading = true;
    this.fetch();
  }

  ngOnDestroy(): void {
    this.tooltip.destroy();
    if (this.oSub) {
      this.oSub.unsubscribe();
    }
  }

  loadMore() {
    this.offset += STEP;
    this.loading = true;
    this.fetch();
  }


  private fetch() {
    const params = Object.assign({}, this.filter, {
      offset: this.offset,
      limit: this.limit
    });

    this.oSub = this.ordersService.fetch(params).subscribe(orders => {
      this.orders = this.orders.concat(orders);
      this.noMoreOrders = orders.length < STEP;
      this.loading = false;
      this.reloading = false;
    });
  }

  ngAfterViewInit(): void {
    this.tooltip = MaterialService.iniTooltip(this.tooltipRef);
  }

  applyFilter(filter: Filter) {
    this.orders = [];
    this.offset = 0;
    this.filter = filter;
    this.reloading = true;
    this.fetch();
  }

  isFiltered(): boolean {
    return Object.keys(this.filter).length !== 0;
  }
}
