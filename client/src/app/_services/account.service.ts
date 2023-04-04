import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from '../_model/user';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class AccountService {
  baseUrl = environment.apiUrl; // API base URL
  private currenrusserSource = new ReplaySubject<User>(1);
  currentUser$ = this.currenrusserSource.asObservable();

  constructor(private http: HttpClient) { }

  // Login function takes in a model of any type
  login(model: any){
    // Sends a POST request to the login endpoint with the model data,
    // maps the response to JSON format, and checks if a user exists
    return this.http.post(this.baseUrl + 'account/login', model).pipe(
      map((response: User) =>{
        const user = response; // Assigns the response to a user variable
        if(user){ // If a user exists in the response
          localStorage.setItem('user', JSON.stringify(user)); // Stores the user data in local storage
          this.currenrusserSource.next(user);
        }
      })
    );
  }

register(model: any){
  return this.http.post(this.baseUrl +'account/register', model).pipe(
    map((user: User) =>{

      if(user){ // If a user exists in the response
        localStorage.setItem('user', JSON.stringify(user)); // Stores the user data in local storage
        this.currenrusserSource.next(user);
      }

    })
  );
}

setCurrentUser(user: User){
  this.currenrusserSource.next(user);
}

  // Logout function removes the user data from local storage
  logout(){
    localStorage.removeItem('user');
    this.currenrusserSource.next(null);
  }
}
