import { HttpInterceptorFn } from "@angular/common/http";
import { inject } from "@angular/core";
import { StorageService } from "../data/storage.service";


export const authInterceptor: HttpInterceptorFn = (req,next) => {
    const token = inject(StorageService).get('accessToken');
    req = req.clone({
        setHeaders: {
            Authorization: token ? `Token ${token}` : '',
        }
    })
    return next(req);
}