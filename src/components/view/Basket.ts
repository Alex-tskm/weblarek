import { createElement, ensureElement } from '../../utils/utils';
import { Component } from '../base/Component';
import { IEvents } from '../base/Events';
import { AppEvents } from '../../utils/constants';

export interface IBasket {
  contentItems: HTMLElement;
  totalCost: string;
}

export class Basket extends Component<IBasket> {
  protected buttonExecute: HTMLButtonElement;
  protected cost: HTMLElement;
  protected itemsBasket: HTMLElement;
  protected clearBasket: HTMLElement;

  constructor(protected events: IEvents, container: HTMLElement) {
    super(container);

    this.buttonExecute = ensureElement<HTMLButtonElement>(
      '.basket__button',
      this.container
    );
    this.cost = ensureElement<HTMLElement>('.basket__price', this.container);
    this.itemsBasket = ensureElement<HTMLElement>(
      '.basket__list',
      this.container
    );

    this.itemsBasket.style.overflow = 'auto';
    this.itemsBasket.style.maxHeight = '40vh';

    this.clearBasket = createElement('p');
    this.clearBasket.innerHTML = 'корзина пуста';

    this.buttonExecute.addEventListener('click', () => {
      this.events.emit(AppEvents.modalBasket_open);
    });
  }

  set totalCost(value: number) {
    this.cost.textContent = `${value} синапсов`;
  }

  set contentItems(item: HTMLElement) {
    this.itemsBasket.append(item);
  }

  clear() {
    this.itemsBasket.innerHTML = '';
  }

  set deactivationBtn(value: boolean) {
    if (value) {
      this.buttonExecute.disabled = true;
    } else {
      this.buttonExecute.disabled = false;
    }
  }

  getEmptyBasket(): HTMLElement {
    return this.clearBasket;
  }
}
