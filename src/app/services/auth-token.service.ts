import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Injectable({ providedIn: 'root' })
export class AuthTokenService {

  authJwtToken: string | null = null;

  constructor(
    private afAuth: AngularFireAuth
  ) {
    this.afAuth.idToken.subscribe(token => this.authJwtToken = token);
  }

}
