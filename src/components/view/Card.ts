import { Component } from "../base/Component";
import { ensureElement } from "../../utils/utils";

export interface ICard {
  price: number | null;
  title: string;  
}

export class Card extends Component<ICard> {
  priceCard: HTMLElement;
  titleCard: HTMLElement;  

  constructor(container: HTMLElement) {
    super(container);

    this.priceCard = ensureElement<HTMLElement>(".card__price", this.container);
    this.titleCard = ensureElement<HTMLElement>(".card__title", this.container);
  }

  set title(value: string) {
    this.titleCard.textContent = value;
  }

  set price(value: number | null) {
    if (value) {
      this.priceCard.textContent = `${value} синапсов`;
    } else {
      this.priceCard.textContent = `Бесценно`;
    }
  }
}
