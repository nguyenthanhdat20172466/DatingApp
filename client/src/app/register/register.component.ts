// Importing required dependencies and modules
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AccountService } from '../_services/account.service';
import {ToastrService} from 'ngx-toastr';
// Declaring component metadata
@Component({
  selector: 'app-register', // Element selector used in HTML templates
  templateUrl: './register.component.html', // URL to component's HTML template
  styleUrls: ['./register.component.css'] // Array of URLs to component's CSS stylesheets
})
export class RegisterComponent implements OnInit {
  // Declaring properties that can be bound to this component from parent component

  @Output() cancelRegister = new EventEmitter(); // Event emitter for cancel button

  // Declaring variables for form data
  model: any = {};

  // Constructor method
  constructor(private accountService: AccountService, private toastr: ToastrService){}

  // ngOnInit method of the Angular component lifecycle hook
  ngOnInit(): void {}

  // Method for registering the user
  register(){
    this.accountService.register(this.model).subscribe(response => {
      console.log(response);
      this.cancel();
    }, error => {
      console.log(error);
      this.toastr.error(error.error, 'Error', {
        //closeButton: true,
       // positionClass: 'toast-top-right',
        progressBar: true,
        timeOut: 2000,
        extendedTimeOut: 2000,
        toastClass: 'my-error-class'
      });
    })
  }

  // Method for canceling the registration process
  cancel(){
    this.cancelRegister.emit(false); // Emit the event to parent component
  }
}
