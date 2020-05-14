import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User } from 'app/models/user';
import { AuthService } from 'app/services/auth.service';
 
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  hide: boolean = true;
  loginForm: FormGroup;
  @Input() error: string;
  @Output() login = new EventEmitter<User>();

  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }

  constructor(private fb: FormBuilder, private auth: AuthService) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    })
  }

  ngOnInit() {
  }

  ngOnChanges() {
    this.error ? this.loginForm.reset() : "";
  }

  onLogin() {
    this.login.emit(this.loginForm.value);
  }

  onFacebookLogin(){
    this.auth.facebookLogin();
  }

  onGithubLogin(){
    this.auth.githubLogin();
  }

  onGoogleLogin(){
    this.auth.googleLogin();
  }

} 
