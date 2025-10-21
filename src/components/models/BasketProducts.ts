import { IProduct } from '../../types/index';
import { IEvents } from '../base/Events';
import { AppEvents } from '../../utils/constants';

export class BasketProducts {
  private items: IProduct[] = [];

  // Получение массива товаров, находящихся в корзине
  getItems(): IProduct[] {
    return this.items;
  }

  // Добавление товара в корзину
  addItem(product: IProduct): void {
    this.items.push(product);
  }

  // Удаление товара из корзины
  removeItem(productId: string): void {
    this.items = this.items.filter((item) => item.id !== productId);
  }

  // Очистка корзины
  clearBasket(): void {
    this.items = [];
  }

  // Получение общей стоимости товаров в корзине
  getTotalPrice(): number {
    return this.items.reduce((total, item) => {
      return total + (item.price || 0);
    }, 0);
  }

  // Получение количества товаров в корзине
  getItemsCount(): number {
    return this.items.length;
  }

  // Проверка наличия товаров в корзине по id
  hasItem(productId: string): boolean {
    return this.items.some((item) => item.id === productId);
  }
}

export class EventsBasketProducts extends BasketProducts {
  constructor(private events: IEvents) {
    super();
  }

  // Добавление товара в корзину и отправка сообщения
  addItem(product: IProduct): void {
    super.addItem(product);
    this.events.emit(AppEvents.basket_changed);
  }

  // Очистка корзины и отправка сообщения
  clearBasket(): void {
    super.clearBasket();
    this.events.emit(AppEvents.basket_changed);
  }

  // Удаление товара из корзины и отправка сообщения
  deleteProductFromBasket(product: IProduct): void {
    super.removeItem(product.id);
    this.events.emit(AppEvents.basket_changed);
  }
}
