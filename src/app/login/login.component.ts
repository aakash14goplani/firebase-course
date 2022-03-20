import { Component, OnDestroy, OnInit } from '@angular/core';
import * as firebaseui from 'firebaseui';
import 'firebaseui/dist/firebaseui.css';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import firebase from 'firebase/compat/app';
import EmailAuthProvider = firebase.auth.EmailAuthProvider;
import GoogleAuthProvider = firebase.auth.GoogleAuthProvider;

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {

  ui!: firebaseui.auth.AuthUI;

  constructor(
    private afAuth: AngularFireAuth
  ) { }

  ngOnInit() {
    this.afAuth.app.then((app) => {
      const uiConfig = {
        signInOptions: [
          EmailAuthProvider.PROVIDER_ID,
          GoogleAuthProvider.PROVIDER_ID
        ],
        signInSuccessUrl: 'courses',
        callbacks: {
          signInSuccessWithAuthResult: this.onLoginSuccessful.bind(this)
        }
      };

      this.ui = new firebaseui.auth.AuthUI(app.auth());
      this.ui.start('#firebaseui-auth-container', uiConfig);
      this.ui.disableAutoSignIn();
    });
  }

  onLoginSuccessful(result: { user: any; }): boolean {
    return !!result.user;
  }

  ngOnDestroy() {
    this.ui.delete();
  }
}

