import { ensureElement } from '../../utils/utils';
import { Component } from '../base/Component';
import { IEvents } from '../base/Events';
import { AppEvents } from '../../utils/constants';

export interface IModal {
  content: HTMLElement;
}

export class Modal extends Component<IModal> {
  protected modalContent: HTMLElement;
  protected buttonClose: HTMLButtonElement;

  constructor(protected events: IEvents, container: HTMLElement) {
    super(container);

    this.modalContent = ensureElement<HTMLElement>(
      '.modal__content',
      this.container
    );
    this.buttonClose = ensureElement<HTMLButtonElement>(
      '.modal__close',
      this.container
    );

    this.buttonClose.addEventListener('click', () => {
      this.events.emit(AppEvents.modal_close);
    });

    this.container.addEventListener('click', (event: MouseEvent) => {
      if (event.target === this.container) {
        this.events.emit(AppEvents.modal_close);
      }
    });
  }
  set content(item: HTMLElement) {
    this.modalContent.append(item);
  }

  clear(): void {
    this.modalContent.innerHTML = '';
  }

  open(): void {
    this.container.classList.add('modal_active');
  }

  close(): void {
    this.container.classList.remove('modal_active');
  }
}
