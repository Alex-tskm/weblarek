import { EventsProductCatalog } from '../src/components/models/ProductCatalog';
import {
  IProduct,
  IValidationErrors,
  TOrder,
  TPayment,
} from '../src/types/index';
import { Api } from './components/base/Api';
import { EventEmitter } from './components/base/Events';
import { ApiClient } from './components/models/ApiClient';
import { EventsBasketProducts } from './components/models/BasketProducts';
import { EventsBuyer } from './components/models/Buyer';
import { Basket } from './components/view/Basket';
import { CardBasket } from './components/view/CardBasket';
import { CardFull } from './components/view/CardFull';
import { FormOrderContact } from './components/view/FormOrderContact';
import {
  FormOrderSalary,
  PayMethodObj,
} from './components/view/FormOrderSalary';
import { Gallery } from './components/view/Gallery';
import { GalleryCard } from './components/view/GalleryCard';
import { Header } from './components/view/Header';
import { Modal } from './components/view/Modal';
import { OrderSuccess } from './components/view/OrderSuccess';
import './scss/styles.scss';
import { API_URL, AppEvents } from './utils/constants';
import { cloneTemplate, ensureElement } from './utils/utils';

/*
// Тестируем класс ProductCatalog
const idProduct = 'c101ab44-ed99-4a54-990d-47aa2bb4e7d9';
const productsModel = new ProductCatalog();
// Сохранение массива товаров
productsModel.setProducts(apiProducts.items);
console.log('Массив товаров из каталога: ', productsModel.getProducts());
console.log(
  'Товар из каталога по ID: ',
  productsModel.getProductById(idProduct)
);
// Сохранение товара для подробного отображения
productsModel.setSelectedProduct(apiProducts.items[0]);
console.log('Товар для подробного отображения: ',productsModel.getSelectedProduct());
// Очистка выбранного товара
productsModel.clearSelectedProduct()
console.log('Товар для подробного отображения(после очистки): ',productsModel.getSelectedProduct());

// Тестируем класс Buyer
const buyer = new Buyer();
buyer.setPayment('card');
//buyer.setEmail('a@gmail.com');
buyer.setAddress('Москва');
//buyer.setPhone('89997776655');
console.log('Покупатель: ', buyer.getData());
console.log('Результат валидации: ', buyer.validate());

// Тестируем класс BasketProducts
const basket = new BasketProducts();
const product: IProduct | undefined = productsModel.getProductById(
  idProduct
);

function isProduct(obj: any): obj is IProduct {
    return typeof obj.id === 'string';
}

if (isProduct(product)) {
	basket.addItem(product!);
	basket.addItem(product!);
}
basket.addItem(apiProducts.items[0]);
const idProd = '854cef69-976d-4c2a-a18c-2aa45046c390';
console.log('Стоимость в корзине: ', basket.getTotalPrice());
console.log('Товаров в корзине: ', basket.getItemsCount());
console.log('Товар в : ', basket.hasItem(idProduct));
console.log('Товар в : ', basket.hasItem(idProd));
console.log('Товары, находящихся в корзине(добавил)', basket.getItems());

if (isProduct(product)) {
    basket.removeItem(product.id);
}
console.log('Товары, находящихся в корзине(удалил)', basket.getItems());
// Очистка корзины
basket.clearBasket();
console.log('Товары, находящихся в корзине(очистил)', basket.getItems());

// Вывод массива товаров с сервера
const api = new Api(API_URL);
const apiClient = new ApiClient(api);
//const catalog = new ProductCatalog();
console.log('Запрашиваем список товаров с сервера...');
const products: IProduct[] = await apiClient.getProductList();
console.log('Сохраняем товары в модель каталога...');
//catalog
productsModel.setProducts(products);
console.log('Проверяем сохраненные данные: ');
const savedProducts = productsModel.getProducts();
console.log('Количество товаров в каталоге: ', savedProducts.length);
console.log('Товары в каталоге: ', savedProducts);

// Тестирование метода getProductById
console.log('Тестируем методы каталога с реальными данными:');
if (savedProducts.length > 0) {
    const firstProduct = savedProducts[0];
    console.log('Первый товар: ', firstProduct);
// Тестируем получение товара по ID
    const productByIdApi = productsModel.getProductById(firstProduct.id);
    console.log('Товар по ID: ', productByIdApi);
// Тестируем работу с выбранным товаром
    productsModel.setSelectedProduct(firstProduct);
    console.log('Выбранный товар: ', productsModel.getSelectedProduct());
}
*/

const events = new EventEmitter();
const api = new Api(API_URL);
const productsModel = new EventsProductCatalog(events);
const apiClient = new ApiClient(api);

const gallery = ensureElement<HTMLElement>('.gallery');
const pageGallery = new Gallery(gallery);
const cardGalleryTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');

const headerElement = ensureElement<HTMLElement>('.header');
const header = new Header(events, headerElement);

// Изменение каталога товаров
events.on(AppEvents.products_changed, () => {
  pageGallery.clear();
  productsModel.getProducts().forEach((item) => {
    const cardTemplateClone = cloneTemplate(cardGalleryTemplate);
    const cardGallery = new GalleryCard(cardTemplateClone, {
      onClick: () => {
        productsModel.setSelectedProduct(item);
      },
    });
    pageGallery.addItem(cardGallery.render(item));
  });
});

const modalContainer = ensureElement<HTMLElement>('#modal-container');
const modal = new Modal(events, modalContainer);

const containerFormOrderSalary = ensureElement<HTMLTemplateElement>('#order');
const containerFormOrderSalaryClone = cloneTemplate(containerFormOrderSalary);
const formOrderSalary = new FormOrderSalary(
  containerFormOrderSalaryClone,
  events
);

const basketModel = new EventsBasketProducts(events);
const fullCardContainer = ensureElement<HTMLTemplateElement>('#card-preview');

// выделили карточку товара
events.on(AppEvents.card_select, (item) => {
  modal.clear();
  const activeProduct = productsModel.getSelectedProduct();
  if (!activeProduct) return;
  const isInBasket: boolean = basketModel.hasItem(activeProduct.id);
  const isAvailable = activeProduct.price !== null;
  const fullCardTemplate = cloneTemplate(fullCardContainer);
  const fullCard = new CardFull(fullCardTemplate, {
    onClick: () => {
      if (isAvailable) {
        if (!isInBasket) {
          events.emit(AppEvents.basket_addProduct, activeProduct);
          events.emit(AppEvents.modal_close);
        } else {
          events.emit(AppEvents.basket_removeProduct, activeProduct);
          events.emit(AppEvents.modal_close);
        }
      }
    },
  });
  fullCard.nameButton = !isInBasket ? 'Купить' : 'Удалить из корзины';
  if (!isAvailable) fullCard.deactivationBtn();
  modal.open();
  modal.content = fullCard.render(item);
});

// Закрыли модальное окно
events.on(AppEvents.modal_close, () => {
  modal.clear();
  modal.close();
});

// Добавили товар в корзину
events.on(AppEvents.basket_addProduct, (item) => {
  basketModel.addItem(item as IProduct);
});

// Удалили товар из корзины
events.on(AppEvents.basket_removeProduct, (item) => {
  basketModel.deleteProductFromBasket(item as IProduct);
});

const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const basketTemplateClone = cloneTemplate(basketTemplate);
const basket = new Basket(events, basketTemplateClone);
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');

// Изменились товары в корзине
events.on(AppEvents.basket_changed, () => {
  basket.clear();
  basket.totalCost = basketModel.getTotalPrice();
  if (basketModel.getItemsCount() === 0) {
    basket.contentItems = basket.getEmptyBasket();
    basket.deactivationBtn = true;
  } else {
    basketModel.getItems().map((item, indexProduct) => {
      const cardBasketTemplateClone = cloneTemplate(cardBasketTemplate);
      const cardBasket = new CardBasket(cardBasketTemplateClone, {
        onClick: () => {
          events.emit(AppEvents.basket_removeProduct, item);
        },
      });
      cardBasket.updateCardIndex = indexProduct + 1;
      basket.contentItems = cardBasket.render(item);
    });
    basket.deactivationBtn = false;
  }
  header.counter = basketModel.getItemsCount();
});

// Кликнули на корзину
events.on(AppEvents.basket_open, () => {
  modal.clear();
  if (basketModel.getItemsCount() === 0) {
    basket.contentItems = basket.getEmptyBasket();
    basket.deactivationBtn = true;
  }
  modal.open();
  modal.content = basket.render();
});

// Нажали кнопку оформить товары
events.on(AppEvents.modalBasket_open, () => {
  modal.clear();
  const validationResult = buyer.validate();
  let errors = '';
  if (validationResult.errors.payment !== undefined) {
    errors = validationResult.errors.payment;
  }
  if (validationResult.errors.address !== undefined) {
    if (errors !== '') {
      errors = errors + ' ' + validationResult.errors.address;
    } else errors = validationResult.errors.address;
  }
  if (errors !== '') {
    formOrderSalary.errors = errors;
    formOrderSalary.statusDisabledBtnNext(true);
  }
  modal.open();
  modal.content = formOrderSalary.render();
});

// Изменились данные покупателя
events.on(AppEvents.buyer_changed, (validationParameter: IValidationErrors) => {
  const validationResult = buyer.validate();
  console.log(validationParameter);
  console.log(validationResult);
  let errors = '';
  formOrderSalary.errors = '';
  formOrderContact.errors = '';
  if (validationResult.errors.payment !== undefined) {
    errors = validationResult.errors.payment;
  }
  if (validationResult.errors.address !== undefined) {
    if (errors !== '') {
      errors = errors + ' ' + validationResult.errors.address;
    } else errors = validationResult.errors.address;
  }
  if (errors !== '') {
    formOrderSalary.errors = errors;
    formOrderSalary.statusDisabledBtnNext(true);
  } else {
    formOrderSalary.statusDisabledBtnNext(false);
    if (validationResult.errors.email !== undefined) {
      errors = validationResult.errors.email;
    }
    if (validationResult.errors.phone !== undefined) {
      if (errors !== '') {
        errors = errors + ' ' + validationResult.errors.phone;
      } else errors = validationResult.errors.phone;
    }
    if (errors !== '') {
      formOrderContact.errors = errors;
      formOrderContact.statusButtonPay(true);
    } else {
      formOrderContact.statusButtonPay(false);
    }
  }
});

// Изменился способ оплаты
events.on(AppEvents.order_selectPayMethod, (payMethod: PayMethodObj) => {
  formOrderSalary.selectedPayment = payMethod.method as string;
  buyer.setPayment(payMethod.method as TPayment);
  console.log(buyer.getData());
});

// Изменился адрес покупателя
events.on(AppEvents.order_addressChange, () => {
  buyer.setAddress(formOrderSalary.addresOrder);
});

const containerFormContact = ensureElement<HTMLTemplateElement>('#contacts');
const containerFormContactClone = cloneTemplate(containerFormContact);
const formOrderContact = new FormOrderContact(
  containerFormContactClone,
  events
);

// Открыть форму для ввода контакта покупателя
events.on(AppEvents.modalContact_open, () => {
  modal.clear();
  const validationResult = buyer.validate();
  console.log(validationResult);
  let errors = '';
  if (validationResult.errors.email !== undefined) {
    errors = validationResult.errors.email;
  }
  if (validationResult.errors.phone !== undefined) {
    if (errors !== '') {
      errors = errors + ' ' + validationResult.errors.phone;
    } else errors = validationResult.errors.phone;
  }
  if (errors !== '') {
    formOrderContact.errors = errors;
    formOrderContact.statusButtonPay(true);
  } else {
    formOrderContact.statusButtonPay(false);
  }

  modal.open();
  modal.content = formOrderContact.render();
});

const buyer = new EventsBuyer(events);

// Изменился email покупателя
events.on(AppEvents.order_emailChange, () => {
  buyer.setEmail(formOrderContact.email);
});

// Изменился телефон покупателя
events.on(AppEvents.order_phoneChange, () => {
  buyer.setPhone(formOrderContact.phone);
});

const successTemplate = ensureElement<HTMLTemplateElement>('#success');
const successElement = cloneTemplate(successTemplate);
const orderSuccess = new OrderSuccess(events, successElement);

// Нажали кнопку Оплатить
events.on(AppEvents.order_pay, async () => {
  const buyerData = buyer.getData();
  console.log(buyerData);
  try {
    if (buyerData !== undefined) {
      const orderData: TOrder = {
        payment: buyerData.payment!,
        email: buyerData.email!,
        phone: buyerData.phone!,
        address: buyerData.address!,
        total: basketModel.getTotalPrice(),
        items: basketModel.getItems().map((product) => product.id),
      };
      await apiClient.submitOrder(orderData).then((res) => {
        if (res) {
          orderSuccess.totalCost = res.total;
          basketModel.clearBasket();
          modal.clear();
          modal.open();
          modal.content = orderSuccess.render();
          buyer.clearData();
          formOrderContact.clear();
          formOrderSalary.clear();
        } else {
          throw new Error('Пустой ответ от сервера');
        }
      });
    }
  } catch (error) {
    console.error('Ошибка при оформлении заказа:', error);
  }
});

// Вывод массива товаров с сервера
const products: IProduct[] = await apiClient.getProductList();

productsModel.setProducts(products);
console.log('Проверяем сохраненные данные: ');
const savedProducts = productsModel.getProducts();
console.log('Количество товаров в каталоге: ', savedProducts.length);
console.log('Товары в каталоге: ', savedProducts);
