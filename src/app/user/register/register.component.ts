import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import IUser from '../../models/user.model';
import { RegisterValidators } from '../validators/register-validators';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  /* ------------------------------ Form Controls ----------------------------- */
  public name = new FormControl('', [Validators.required, Validators.minLength(3)]);
  public email = new FormControl('', [Validators.required, Validators.email]);
  public age = new FormControl<number | null>(null, [Validators.required, Validators.min(18), Validators.max(120)]);
  public password = new FormControl('', [Validators.required, Validators.pattern(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/gm)]);
  public confirm_password = new FormControl('', [Validators.required]);
  public phoneNumber = new FormControl('', [Validators.required, Validators.minLength(14), Validators.maxLength(14)]);

  /* ---------------------------- Public Properties --------------------------- */
  public showAlert: boolean = false;
  public alertMsg: string = 'Please wait! Your account is being created.';
  public alertColor: string = 'blue';
  public inSubmission = false;


  // Form Group Object
  public registerForm = new FormGroup({
    name: this.name,
    email: this.email,
    age: this.age,
    password: this.password,
    confirm_password: this.confirm_password,
    phoneNumber: this.phoneNumber
  }, [RegisterValidators.match('password', 'confirm_password')]);

  constructor (
    private authService: AuthService
  ) { };

  /* --------------------------------- Methods -------------------------------- */
  public async registerUser(): Promise<void> {
    this.showAlert = true;
    this.alertMsg = 'Please wait! Your account is being created.';
    this.alertColor = 'blue';
    this.inSubmission = true;

    try {
      await this.authService.createUser(this.registerForm.value as IUser);
    } catch(err) {
      console.error(err);
      this.alertMsg = 'An unexpected error occurred. Please try again later';
      this.alertColor = 'red';
      this.inSubmission = false;
      // This return statements stops the function from executing further.
      return 
    }

    // Update alert message
    this.alertMsg = 'Success! Your account has been created.';
    this.alertColor = 'green';
  }
}
