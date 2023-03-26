import { Injectable } from "@angular/core";
import { AngularFireAuth } from "@angular/fire/compat/auth";
import { AbstractControl, AsyncValidator, ValidationErrors } from "@angular/forms";

/**
 * * By default, classes cannnot be injected with services (like ng components). We need to tell ng a class can be injected.
 * * Use the @Injectable() decorator to accomplish this. This also allows us to inject this class into other components. It works both ways
 * * but you need to tell it WHERE it can be injected (providedIn: root)
 */

@Injectable({
  providedIn: 'root'
})
export class EmailTaken implements AsyncValidator {
  constructor(private fireAuthService: AngularFireAuth) { };

  // ! Asynchronous validator functions need to be arrow functions to allow for proper context/reference in the FormControl constructor argument
  public validate = async (control: AbstractControl): Promise<ValidationErrors | null> => {
    // The fetchSignInMethodsForEmail function lets us know if the email does not exist in firebase
    // We apply a .then here because this method returns a string[] promise and we need to convert it to a ValidationError | null
    const response = await this.fireAuthService.fetchSignInMethodsForEmail(control.value);
    return response.length ? { emailTaken: true } : null;
  }
}
