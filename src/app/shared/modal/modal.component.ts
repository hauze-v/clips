import { Component, Input, OnInit, ElementRef } from '@angular/core';
import { ModalService } from 'src/app/services/modal.service';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css'],
  // providers: [ModalService]
})
export class ModalComponent implements OnInit {
  @Input() modalId: string = '';

  constructor(public modalService: ModalService, public el: ElementRef) {  }

  ngOnInit(): void {
    /** Portal this element outside of it's current location, to the root body element so CSS isn't applied */
    document.body.appendChild(this.el.nativeElement);
  }

  public closeModal(): void {
    this.modalService.toggleModal(this.modalId);
  }
}
