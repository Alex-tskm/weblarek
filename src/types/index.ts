export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

export interface IApi {
    get<T extends object>(uri: string): Promise<T>;
    post<T extends object>(uri: string, data: object, method?: ApiPostMethods): Promise<T>;
}

export type TPayment = 'card' | 'cash' | '';

// Интерфейс товара
export interface IProduct {
    id: string;
    description: string;
    image: string;
    title: string;
    category: string;
    price: number | null;
}

// Интерфейс покупателя
export interface IBuyer {
    payment: TPayment;
    email: string;
    phone: string;
    address: string;
}

// Интерфейс для ошибок валидации
export interface IValidationErrors {
    payment?: string;
    email?: string;
    phone?: string;
    address?: string;
}

// Тип для get запроса на получение списка карточек
export type TProductsResponse = {
    total: number;
    items: IProduct[];
}

// Тип для post запросов
export type TOrder = {
    payment: TPayment;
    email: string;
    phone: string;
    address: string;
    total: number;
    items: string[]; // массив id товаров
    id?: string;
}
