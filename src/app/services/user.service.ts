import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { map, Observable, tap } from 'rxjs';
import { UserRoles } from '../model/user-roles';

@Injectable({ providedIn: 'root' })
export class UserService {

  isLoggedIn$: Observable<boolean>;
  isLoggedOut$: Observable<boolean>;
  pictureUrl$: Observable<string>;
  usersRole$: Observable<UserRoles>;

  constructor(
    private afAuth: AngularFireAuth,
    private router: Router
  ) {
    /* this.afAuth.idToken.subscribe(token => console.log('JWT TOKEN: ', token));
    this.afAuth.authState.subscribe(auth => console.log('AUTH: ', auth)); */

    this.isLoggedIn$ = this.afAuth.authState.pipe(map(user => !!user));
    this.isLoggedOut$ = this.isLoggedIn$.pipe(map(loggedIn => !loggedIn));
    this.pictureUrl$ = this.afAuth.authState.pipe(map(user => user?.photoURL ?? ''));
    this.usersRole$ = this.afAuth.idTokenResult.pipe(map(token => (token?.claims as UserRoles) ?? { admin: false }));
    // this.afAuth.idTokenResult.pipe(tap(token => console.log('JWT TOKEN: ', token))).subscribe();
  }

  logout(): void {
    this.afAuth.signOut();
    this.router.navigate(['/login']);
  }
}
