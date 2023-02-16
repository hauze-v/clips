import { Injectable } from '@angular/core';

interface IModal {
  id: string;
  visible: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  private modals: IModal[] = []

  constructor() { }

  public register(id: string) {
    this.modals.push({
      id,
      visible: false
    });
  }

  public unregister(id: string) {
    this.modals = this.modals.filter(modal => modal.id !== id);
  }

  public isModalOpen(id: string): boolean {
    /** The double negative exclamation points here turn an undefined value to boolean */
    return !!this.modals.find(element => element.id === id)?.visible;
  }

  public toggleModal(id: string) {
    const modal = this.modals.find(element => element.id === id);

    if (modal) {
      modal.visible = !modal.visible;
    }
  }
}
