import { ensureElement } from '../../utils/utils';
import { Component } from '../base/Component';
import { IEvents } from '../base/Events';
import { AppEvents } from '../../utils/constants';

export interface IOrderSuccess {
  totalCost: number;
}

export class OrderSuccess extends Component<IOrderSuccess> {
  protected buttonClose: HTMLButtonElement;
  protected cost: HTMLElement;

  constructor(protected events: IEvents, container: HTMLElement) {
    super(container);

    this.buttonClose = ensureElement<HTMLButtonElement>(
      '.order-success__close',
      this.container
    );
    this.cost = ensureElement<HTMLElement>(
      '.order-success__description',
      this.container
    );

    this.buttonClose.addEventListener('click', () => {
      this.events.emit(AppEvents.modal_close);
    });
  }

  set totalCost(value: number) {
    this.cost.textContent = `Списано ${String(value)} синапсов`;
  }
}
