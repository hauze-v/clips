import { ValidationErrors, AbstractControl, ValidatorFn } from "@angular/forms";

/**
 * * Clases are Blueprints for objects. Whenever we want to invoke a method or access a property, we need to create an instance out of the class
 * * Let's say the match() method didn't have the static keyword. We'd need to create a 'new RegisterValidators.match()'
 * * But with the static keyword, we can simply do: 'RegisterValidators.match()'
 */

/**
 * * Factory functions are a design pattern for returning a new object/function. 
 */

export class RegisterValidators {

  // Static methods don't have access to a class's methods or properties. They have limited scope. In this method, we return null if there are no errors
  public static match(controlName: string, matchingControlName: string): ValidatorFn {

    // Let's turn this into a factory function so it's more customizable (can take in arguments for specific form controls)
    return (formGroup: AbstractControl): ValidationErrors | null => {
      const control = formGroup.get(controlName);
      const matchingControl = formGroup.get(matchingControlName);

      // Before comparing values, ensure the controls exist
      if (!control || !matchingControl) {
        console.error('Form controls cannot be found in the form group.');
        return { controlNotFound: false }
      }

      const error = control.value === matchingControl.value ?
        null :
        { noMatch: true };

      // Since this error and ValidatorFn are being applied to the formGroup istelf, the individual controls aren't aware of it.
      // This line fixes that.
      matchingControl.setErrors(error);

      return error
    }
  }
}
