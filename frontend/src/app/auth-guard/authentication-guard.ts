import { Injectable } from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import { Observable } from 'rxjs';
import {AuthenticationService} from '../service/authentication.service';

@Injectable({
    providedIn: 'root'
})

export class AuthenticationGuard implements CanActivate {
    constructor(private authService: AuthenticationService,
                private router: Router) { }
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean |
        UrlTree | Observable<boolean |
        UrlTree> | Promise<boolean | UrlTree> {
        if ( this.authService.isUserLoggedIn() ) {
            console.log('ben hier geweest');
            return true;
        }
        this.router.navigate(['/login']);
        return false;
    }

}
