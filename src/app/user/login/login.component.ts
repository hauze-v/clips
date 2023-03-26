import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';

export type Credentials = {
  email: string,
  password: string
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  /* ---------------------------- Public Properties --------------------------- */
  public showAlert: boolean = false;
  public alertMsg: string = "Please wait! We're attempting to log you in.";
  public alertColor: string = 'blue';
  public inSubmission = false;
  public credentials: Credentials = {
    email: '',
    password: ''
  }

  constructor(private fireAuthService: AngularFireAuth) { }

  /* --------------------------------- Methods -------------------------------- */
  public async login() {
    /** 
     * Provide feedback to the user. We reset these properties to initial values
     * in case the user clicks the button multiple times while on the dialog.
     */
    this.showAlert = true;
    this.alertMsg = 'Please wait! Your account is being created.';
    this.alertColor = 'blue';
    this.inSubmission = true;

    try {
      await this.fireAuthService.signInWithEmailAndPassword(
        this.credentials.email, this.credentials.password
      )
    } catch (error) {
      console.error(error);
      this.alertMsg = 'An unexpected error occurred. Please try again later';
      this.alertColor = 'red';
      this.inSubmission = false;
      // This return statements stops the function from executing further.
      return 
    }

    // If we've made it this far, it's a succes, so: Update alert message
    this.alertMsg = "Success! You are now logged in.";
    this.alertColor = 'green';
  }
}
