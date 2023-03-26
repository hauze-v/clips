import { ValidationErrors, AbstractControl } from "@angular/forms";

export class RegisterValidators {
  // Static methods don't have access to a class's methods or properties. They have limited scope. In this method, we return null if there are no errors
  public static match(formGroup: AbstractControl): ValidationErrors | null {
    const control = formGroup.get('password');
    const matchingControl = formGroup.get('confirm_password');

    // Before comparing values, ensure the controls exist
    if (!control || !matchingControl) {
      return { controlNotFound: false }
    }

    const error = control.value === matchingControl.value ?
      null :
      { noMatch: true };

    return error
  } 

  // Clases are Blueprints for objects. Whenever we want to invoke a method or access a property, we need to create an instance out of the class
  // Let's say the match() method didn't have the static keyword. We'd need to create a 'new RegisterValidators.match()'
  // But with the static keyword, we can simply do: 'RegisterValidators.match()'
}
