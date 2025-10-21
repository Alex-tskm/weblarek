import { ensureElement } from '../../utils/utils';
import { IEvents } from '../base/Events';
import { FormOrder } from './FormOrder';
import { AppEvents } from '../../utils/constants';

export class FormOrderContact extends FormOrder {
  private emailInput: HTMLInputElement;
  private phoneInput: HTMLInputElement;
  private buttonPay: HTMLButtonElement;

  constructor(container: HTMLElement, events: IEvents) {
    super(container);
    this.emailInput = ensureElement<HTMLInputElement>(
      'input[name="email"]',
      this.container
    );
    this.phoneInput = ensureElement<HTMLInputElement>(
      'input[name="phone"]',
      this.container
    );
    this.buttonPay = ensureElement<HTMLButtonElement>(
      'button[type="submit"]',
      this.container
    );

    this.emailInput.addEventListener('input', () => {
      events.emit(AppEvents.order_emailChange, this.container);
    });

    this.phoneInput.addEventListener('input', () => {
      events.emit(AppEvents.order_phoneChange, this.container);
    });

    this.buttonPay.addEventListener('click', (event) => {
      event.preventDefault();
      events.emit(AppEvents.order_pay, this.container);
    });
  }

  get email(): string {
    return this.emailInput.value;
  }

  get phone(): string {
    return this.phoneInput.value;
  }

  set Valid(error: string) {
    this.errorsContainer.textContent = error;
  }

  statusButtonPay(value: boolean): void {
    this.buttonPay.disabled = value;
  }

  clear(): void {
    this.emailInput.value = '';
    this.phoneInput.value = '';
    this.statusButtonPay(true);
  }
}
