import {Injectable} from '@angular/core';
import {OrderPosition, Positions} from '../shared/interfaces';

@Injectable()
export class OrderService {

  public list: OrderPosition[] = [];
  public price = 0;

  add(position: Positions) {
    const orderPosition: OrderPosition = Object.assign({}, {
      name: position.name,
      cost: position.cost,
      quantity: position.quantity,
      _id: position._id
    });

    const candidate = this.list.find(p => p._id === orderPosition._id);

    if (candidate) {
      // Изменяем кол-во
      candidate.quantity += orderPosition.quantity;
      candidate.cost += orderPosition.cost;
    } else {
      this.list.push(orderPosition);
    }

    this.computePrice();
  }

  remove(orderPosition: OrderPosition) {
    const idx = this.list.findIndex(p => p._id === orderPosition._id);
    this.list.splice(idx, 1);
    this.computePrice();
  }

  clear() {
    this.list = [];
    this.price = 0;
  }

  private computePrice() {
    this.price = this.list.reduce((total, item) => {
      return total += item.cost;
      // return total += item.quantity * item.cost;
    }, 0);
  }
}
