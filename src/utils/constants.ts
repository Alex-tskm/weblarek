/* Константа для получения полного пути для сервера. Для выполнения запроса 
необходимо к API_URL добавить только ендпоинт. */
export const API_URL = `${import.meta.env.VITE_API_ORIGIN}/api/weblarek`; 

/* Константа для формирования полного пути к изображениям карточек. 
Для получения полной ссылки на картинку необходимо к CDN_URL добавить только название файла изображения,
которое хранится в объекте товара. */
export const CDN_URL = `${import.meta.env.VITE_API_ORIGIN}/content/weblarek`;

/* Константа соответствий категорий товара модификаторам, используемым для отображения фона категории. */
export const categoryMap = {
  'софт-скил': 'card__category_soft',
  'хард-скил': 'card__category_hard',
  'кнопка': 'card__category_button',
  'дополнительное': 'card__category_additional',
  'другое': 'card__category_other',
};

/*
`products:changed` - изменение каталога товаров
`card:select` - изменение выбранного для просмотра товара
`basket:changed` - изменение содержимого корзины
`buyer:changed` - изменение данных покупателя

#### События в Представлениях
выбор карточки для просмотра
нажатие кнопки покупки товара
нажатие кнопки удаления товара из корзины
`modalBasket:open` - нажатие кнопки открытия корзины
нажатие кнопки оформления заказа
нажатие кнопки перехода ко второй форме оформления заказа
нажатие кнопки оплаты/завершения оформления заказа
изменение данных в формах
*/

export enum AppEvents {
  // События в Моделях данных
  products_changed = 'products:changed', // изменение каталога товаров
  card_select = 'card:select', // изменение выбранного для просмотра товара
  basket_changed = 'basket:changed', // изменение содержимого корзины
  buyer_changed = 'buyer:changed', // изменение данных покупателя

  // События в Представлениях
  basket_open = 'basket:open', // нажатие кнопки открытия корзины
  modal_close = 'modal:close', // закрыли модальное окно
  basket_addProduct = 'basket:addProduct', // добавили товар в корзину
  basket_removeProduct = 'basket:removeProduct', // удалили товар из корзины  
  modalBasket_open = 'modalBasket:open', // нажали кнопку оформить товары
  order_selectPayMethod = 'order:selectPayMethod', // изменился способ оплаты
  order_addressChange = 'order:addressChange',  // изменился адрес покупателя
  modalContact_open = 'modalContact:open', // открыть форму для ввода контакта покупателя
  order_emailChange = 'order:emailChange', // изменился email покупателя
  order_phoneChange = 'order:phoneChange', // изменился телефон покупателя
  order_pay = 'order:pay', // нажали кнопку Оплатить
  product_select = 'product:select', // выбрали для просмотра товар
};

export const settings = {

};

