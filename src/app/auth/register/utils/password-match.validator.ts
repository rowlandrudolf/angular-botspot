import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";


export const passwordMatchValidator: ValidatorFn = ( ctrl: AbstractControl): ValidationErrors | null => {
    const password = ctrl.get('password')?.value;
    const confirmation = ctrl.get('confirmPassword')?.value;
    return password && confirmation
        && password === confirmation 
        ?  null
        : { passwordMatch: true }
}
