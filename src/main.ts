import { Api } from './components/base/Api';
import { ApiClient } from './components/models/ApiClient';
import { BasketProducts } from '../src/components/models/BasketProducts';
import { Buyer } from '../src/components/models/Buyer';
import { ProductCatalog } from '../src/components/models/ProductCatalog';
import { IProduct } from '../src/types/index';
import { apiProducts } from '../src/utils/data';
import './scss/styles.scss';
import { API_URL } from './utils/constants';

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

