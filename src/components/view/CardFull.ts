import { ensureElement } from "../../utils/utils";
import { Card } from "./Card";
//import { IEvents } from "../base/Events";
import { categoryMap, CDN_URL } from "../../utils/constants";

interface ICardAction {
  onClick?: (event: MouseEvent) => void;
}

export interface ICardFull {
  category: string;
  description: string;
  image: string;
}

export class CardFull extends Card {
  protected buttonBuy: HTMLButtonElement;
  categoryCard: HTMLElement;
  imageElement: HTMLImageElement;
  descriptionCard: HTMLElement;

  constructor(container: HTMLElement, action?: ICardAction) {
    super(container);

    this.buttonBuy = ensureElement<HTMLButtonElement>(
      ".card__button",
      this.container
    );
    this.categoryCard = ensureElement<HTMLElement>(
      ".card__category",
      this.container
    );
    this.imageElement = ensureElement<HTMLImageElement>(
      ".card__image",
      this.container
    );
    this.descriptionCard = ensureElement<HTMLElement>(
      ".card__text",
      this.container
    );

    if (action?.onClick) {
      this.buttonBuy.addEventListener("click", action.onClick);    
    }
  }

  set category(value: string) {
    this.categoryCard.className = "";
    this.categoryCard.className = `card__category ${
      categoryMap[value as keyof typeof categoryMap]
    }`;
    this.categoryCard.textContent = value;
  }

  set image(value: string) {
    this.setImage(this.imageElement, CDN_URL + value, this.title);
  }

  set description(value: string) {
    this.descriptionCard.textContent = value;
  }

  deactivationBtn(): void {
    this.buttonBuy.toggleAttribute("disabled");
    this.buttonBuy.textContent = "Недоступно";
  }

  set nameButton(value: string) {
    this.buttonBuy.textContent = value;
  }
}
