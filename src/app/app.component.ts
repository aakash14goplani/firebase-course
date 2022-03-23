import { Component } from '@angular/core';
import { AuthTokenService } from './services/auth-token.service';
import { UserService } from './services/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  constructor(
    public user: UserService,
    private token: AuthTokenService
  ) {
    /**
     * This is a hack to get the token from the auth service. We need token as soon as app bootstraps.
     * This token is used by interceptor to add the token to the request. By injecting the token here,
     * we can get the token before the app boots.
     */
  }

  logout(): void {
    this.user.logout();
  }

}
