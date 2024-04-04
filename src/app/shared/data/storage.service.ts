import { JsonPipe } from "@angular/common";
import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root',
})
export class StorageService {

    set(key: string, data: unknown){
        try {
            localStorage.setItem(key, JSON.stringify(data))
        }catch(e){
            console.log('local storage error', e);
        }
    }

    get(key: string) {
        try{
            const item = localStorage.getItem(key)
            return item 
                ? JSON.parse(item)
                : null;
        }catch(e){
            console.log('local storage error', e);
            return null;
        }
    }

    remove(key: string){
        try {
            localStorage.removeItem(key)
        }catch(e){
            console.log('local storage error', e);
        }   
    }

}