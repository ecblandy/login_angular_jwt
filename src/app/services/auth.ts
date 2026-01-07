import { jwtDecode, JwtPayload } from 'jwt-decode';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

export const USER_STORAGE_KEY = 'AUTH_KEY';

interface UserData {
  token: string;
  id: string;
}

@Injectable({
  providedIn: 'root',
})
export class Auth {
  private user: BehaviorSubject<UserData | null | undefined> = new BehaviorSubject<
    UserData | null | undefined
  >(undefined);

  constructor(private http: HttpClient) {
    this.loadUser();
  }

  loadUser() {
    const token = localStorage.getItem(USER_STORAGE_KEY);

    if (token) {
      const decoded = jwtDecode<JwtPayload>(token);
      console.log(decoded);
      const userData: UserData = {
        token: token,
        id: decoded.sub!,
      };

      this.user.next(userData);
    } else {
      this.user.next(null);
    }
  }

  login(email: string, password: string) {
    return this.http.post('https://api.developbetterapps.com/auth', { email, password }).pipe(
      map((res: any) => {
        console.log(res);
        localStorage.setItem(USER_STORAGE_KEY, res.token);
        const decoded = jwtDecode<JwtPayload>(res.token);
        console.log(decoded);
        const userData: UserData = {
          token: res.token,
          id: decoded.sub!,
        };

        this.user.next(userData);
        return userData;
      })
    );
  }

  register(email: string, password: string) {
    return this.http.post('https://api.developbetterapps.com/users', { email, password });
  }

  signOut() {
    localStorage.removeItem(USER_STORAGE_KEY);
    this.user.next(null);
  }

  getCurrentUser() {
    return this.user.asObservable();
  }

  getCurrentUserId() {
    this.user.getValue()!.id;
  }
}
