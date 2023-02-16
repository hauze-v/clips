import { Component, OnInit } from '@angular/core';
import { ModalService } from '../services/modal.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {

  constructor(public modalService: ModalService) { }

  public ngOnInit(): void {

  }

  public openModal($event: Event) {
    /** Prevents basic anchor tag functionality when user clicks */
    $event.preventDefault();

    this.modalService.toggleModal('auth');
  }

}
