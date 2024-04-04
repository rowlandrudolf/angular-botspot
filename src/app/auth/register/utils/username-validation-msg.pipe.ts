import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
    name: 'usernameMessage',
    standalone: true,
})
export class UsernameValidationMsgPipe implements PipeTransform {
    
    transform(value: any) {
        const msg = {
            'INVALID': '❌ Username unavailable',
            'PENDING': 'Checking username availability...',
            'VALID': '✅ Username available'
        }[value as string]
        return msg
    }
}