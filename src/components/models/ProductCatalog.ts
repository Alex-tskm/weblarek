import { IProduct } from '../../types/index';
import { IEvents } from '../base/Events';
import { AppEvents } from '../../utils/constants';

export class ProductCatalog {
  protected products: IProduct[] = [];
  protected selectedProduct: IProduct | null = null;

  // Сохранение массива товаров
  setProducts(products: IProduct[]): void {
    this.products = products;
    console.log('Сохраняем товары в модель каталога...');
  }

  // Получение массива товаров
  getProducts(): IProduct[] {
    return this.products;
  }

  // Получение товара по id
  getProductById(id: string): IProduct | undefined {
    return this.products.find((product) => product.id === id);
  }

  // Сохранение товара для подробного отображения
  setSelectedProduct(product: IProduct): void {
    this.selectedProduct = product;
  }

  // Получение товара для подробного отображения
  getSelectedProduct(): IProduct | null {
    return this.selectedProduct;
  }

  // Очистка выбранного товара
  clearSelectedProduct(): void {
    this.selectedProduct = null;
  }
}

export class EventsProductCatalog extends ProductCatalog {
  constructor(private events: IEvents) {
    super();
  }

  // Сохранение массива товаров и отправка сообщения
  setProducts(products: IProduct[]): void {
    super.setProducts(products);
    this.events.emit(AppEvents.products_changed, this.products);
  }

  // Сохранение товара для подробного отображения и отправка сообщения
  setSelectedProduct(product: IProduct): void {
    super.setSelectedProduct(product);
    this.events.emit(AppEvents.card_select, product);
  }
}
