import { TPayment } from '../../types';
import { ensureAllElements, ensureElement } from '../../utils/utils';
import { IEvents } from '../base/Events';
import { FormOrder } from './FormOrder';
import { AppEvents } from '../../utils/constants';

export interface PayMethodObj {
  method: TPayment;
}

export class FormOrderSalary extends FormOrder {
  private paymentButtons: HTMLButtonElement[];
  private addressInput: HTMLInputElement;
  private buttonNext: HTMLButtonElement;

  constructor(container: HTMLElement, events: IEvents) {
    super(container);
    this.paymentButtons = ensureAllElements<HTMLButtonElement>(
      '.button_alt',
      this.container
    );
    this.addressInput = ensureElement<HTMLInputElement>(
      'input[name="address"]',
      this.container
    );
    this.buttonNext = ensureElement<HTMLButtonElement>(
      'button[type="submit"]',
      this.container
    );

    this.paymentButtons.forEach((button) => {
      {
        button.addEventListener('click', (event: Event) => {
          const element = event.currentTarget as HTMLElement;
          const methodObj: PayMethodObj = {
            method: element.getAttribute('name') as TPayment,
          };
          events.emit(AppEvents.order_selectPayMethod, methodObj);
        });
      }
    });

    this.addressInput.addEventListener('input', () => {
      events.emit(AppEvents.order_addressChange, this.container);
    });

    this.buttonNext.addEventListener('click', (event) => {
      event?.preventDefault();
      events.emit(AppEvents.modalContact_open, this.container);
    });
  }

  set selectedPayment(method: string) {
    this.paymentButtons.forEach((button) => {
      if (button.name === method) {
        button.classList.add('button_alt-active');
        button.classList.remove('button_alt');
      } else {
        button.classList.remove('button_alt-active');
        button.classList.add('button_alt');
      }
    });
  }

  get addresOrder(): string {
    return this.addressInput.value;
  }

  set addressValid(error: string) {
    this.errorsContainer.textContent = error;
  }

  statusDisabledBtnNext(value: boolean): void {
    this.buttonNext.disabled = value;
  }

  clear(): void {
    this.paymentButtons.forEach((button) => {
      button.classList.remove('button_alt-active');
      button.classList.add('button_alt');
    });
    this.addressInput.value = '';
    this.statusDisabledBtnNext(true);
  }
}
