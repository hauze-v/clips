import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  /* ------------------------------ Form Controls ----------------------------- */
  public name = new FormControl('', [Validators.required, Validators.minLength(3)]);
  public email = new FormControl('', [Validators.required, Validators.email]);
  public age = new FormControl('', [Validators.required, Validators.min(18), Validators.max(120)]);
  public password = new FormControl('', [Validators.required, Validators.pattern(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/gm)]);
  public confirm_password = new FormControl('', [Validators.required]);
  public phoneNumber = new FormControl('', [Validators.required, Validators.minLength(14), Validators.maxLength(14)]);

  /* ---------------------------- Public Properties --------------------------- */
  public showAlert: boolean = false;
  public alertMsg: string = 'Please wait! Your account is being created.';
  public alertColor: string = 'blue';
  public inSubmission = false;


  // From Group Object
  public registerForm = new FormGroup({
    name: this.name,
    email: this.email,
    age: this.age,
    password: this.password,
    confirm_password: this.confirm_password,
    phoneNumber: this.phoneNumber
  });

  constructor (
    private fireAuthService: AngularFireAuth,
    private firestoreService: AngularFirestore 
  ) { };

  public async registerUser(): Promise<void> {
    this.showAlert = true;
    this.alertMsg = 'Please wait! Your account is being created.';
    this.alertColor = 'blue';
    this.inSubmission = true;

    // Destructure formValues
    const { email, password } = this.registerForm.value;

    try {
      // Create user credentials with fireBase API
      const userCred = await this.fireAuthService.createUserWithEmailAndPassword(email as string, password as string);

      // Grab collection from firestore db (or create one if it doesn't exist already);
      await this.firestoreService.collection('users').add({
        name: this.name.value,
        email: this.email.value,
        age: this.age.value,
        phoneNumber: this.phoneNumber.value
      });
      
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
