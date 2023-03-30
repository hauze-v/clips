import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AuthService } from '../services/auth.service';
import { ModalService } from '../services/modal.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {
  // * Not needed now that we're subscribing directly to the observable from the template
  // public isAuthenticated = false;

  constructor(
    public modalService: ModalService,
    public authService: AuthService,
  ) {
    // * Not needed now that we're subscribing directly to the observable from the template
    // Subscribe to the isAuthenticated$ observable in AuthService and update the local property when it changes
    // this.authService.isAuthenticated$.subscribe(status => {
    //   this.isAuthenticated = status
    // });
  }

  public ngOnInit(): void {

  }

  public openModal($event: Event) {
    /** Prevents basic anchor tag functionality when user clicks */
    $event.preventDefault();

    this.modalService.toggleModal('auth');
  }
}
