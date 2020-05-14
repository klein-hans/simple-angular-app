import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ValidationErrors } from '@angular/forms';
import { AuthFormValidators } from 'app/validators/auth-form-validators';
import { AuthService } from 'app/services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  hide: boolean = true;
  isFormHasNoError: boolean = true;
  registerForm: FormGroup;
  error: string;
  
  constructor(private fb: FormBuilder, private auth: AuthService) {
    this.registerForm = this.fb.group({
      displayName: ['', [Validators.required]],
      email: ['', [
        Validators.required,
        Validators.email 
      ]],
      password: ['', [
        Validators.required,
        AuthFormValidators.patternValidator(/\d/, {
          hasNumber: true
        }),
        AuthFormValidators.patternValidator(/[A-Z]/, {
          hasCapitalCase: true
        }),
        AuthFormValidators.patternValidator(/[a-z]/, {
          hasSmallCase: true
        }),
        AuthFormValidators.patternValidator(
          /[ !@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/,
          {
            hasSpecialCharacters: true
          }
        ),
        Validators.minLength(8)
      ]],
      confirmPassword: ['', Validators.required],
    },
    {
      validator: AuthFormValidators.passwordMatchValidator
    });
  }

  get name(){
    return this.registerForm.get('displayName');
  }

  get email(){
    return this.registerForm.get('email');
  }

  get password(){
    return this.registerForm.get('password');
  }

  get confirmPassword(){
    return this.registerForm.get('confirmPassword');
  }

  ngOnInit() {
  }

  ngOnChanges() {
    this.error ? this.registerForm.reset() : "";
  }

  onRegister() {
    Object.keys(this.registerForm.controls).forEach(key => {
      const controlErrors: ValidationErrors = this.registerForm.get(key).errors;
      this.isFormHasNoError = controlErrors ? false : true;
    }); 
    
    if(this.isFormHasNoError)
      this.auth.register(this.name, this.email, this.password);

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
