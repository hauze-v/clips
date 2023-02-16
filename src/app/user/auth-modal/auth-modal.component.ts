import { Component, OnDestroy, OnInit } from '@angular/core';
import { ModalService } from 'src/app/services/modal.service';

@Component({
  selector: 'app-auth-modal',
  templateUrl: './auth-modal.component.html',
  styleUrls: ['./auth-modal.component.css']
})
export class AuthModalComponent implements OnInit, OnDestroy {

  constructor(public modalService: ModalService) { }

  public ngOnInit(): void {
    this.modalService.register('auth');
  }

  public ngOnDestroy(): void {
    this.modalService.unregister('auth');
  }
}
