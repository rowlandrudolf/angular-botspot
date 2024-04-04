import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'plural',
  standalone: true
})
export class PluralPipe implements PipeTransform {
  transform(word: string, count: number, pluralForm: string = 's'): string {
    let pluralized;
    if (pluralForm === 'ies') {
        pluralized = count != 1 ? word.replace(/.$/, pluralForm) : word;
    } else {
        pluralized = count === 1 ? word : word + pluralForm;
    }
    return pluralized;
  }
}
