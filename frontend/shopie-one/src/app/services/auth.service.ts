import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserLogin, UserRegister, token_details } from '../interfaces/users';
import { LocalstorageService } from './localstorage.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient, private localstorageService: LocalstorageService) {}
  registerUser(userdetails: UserRegister) {
    return this.http.post('http://localhost:5700/users/register', userdetails);
  }
  loginUser(userdetails: UserLogin) {
    return this.http.post('http://localhost:5700/users/login', userdetails);
  }

  checkDetails(token: string) {
    return this.http.get<token_details>(
      'http://localhost:5700/users/checkdetails',
      {
        headers: {
          token: token,
        },
      }
    );
  }

  getToken(): string | null {
    return this.localstorageService.getItem('token');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }
}
