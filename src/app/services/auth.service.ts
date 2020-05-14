import { Injectable } from '@angular/core';
import { Observable, of, throwError, from } from 'rxjs';
import { User } from 'app/models/user';
import { AngularFireAuth } from '@angular/fire/auth/';
import { auth } from 'firebase/app';
import { map, tap, catchError } from 'rxjs/operators';
import { AngularFirestoreCollection, AngularFirestore } from '@angular/fire/firestore';
import { MatDialog } from '@angular/material';
import { LogoutConfirmationDialogComponent } from 'app/components/logout-confirmation-dialog/logout-confirmation-dialog.component';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private userCollection: AngularFirestoreCollection<User>;
  private users: Observable<User[]>;
  
  constructor(
    private afa: AngularFireAuth,
    private afs: AngularFirestore,
    private dialog: MatDialog,
    private router: Router,
  ) {
    this.userCollection = this.afs.collection<User>('users');
    this.users = this.userCollection.valueChanges();
  }  
  
  register(displayName, email, password) {
    // const credential = firebase.auth.EmailAuthProvider.credential( email, password );
    return from(
      this.afa.auth.createUserWithEmailAndPassword(email, password)
    ).pipe(
      tap(credential => {
        credential.user.updateProfile({ displayName, photoURL: "" });
      }),
      map(credential => credential.user),
      catchError(err => { throw err })
    );
  }

  login(email, password) {
    console.log(email, password)
    return from(
      this.afa.auth.signInWithEmailAndPassword(email, password)
    ).pipe(
      map(credential => {
        this.router.navigate(['/dashboard']);
        let user = {
          uid: credential.user.uid,
          email: credential.user.email,
          displayName: credential.user.displayName,
          phoneNumber: credential.user.phoneNumber,
          photoURL: credential.user.photoURL,
          signInMethod: "Regular Signin",

        }
        let dbUser = this.afs.collection('user', ref => ref.where('id', '==', credential.user.uid))
        dbUser.valueChanges().subscribe(e => {
          console.log(e)
          if(e === undefined || e.length == 0){
            this.addUser(user);
          }
        });
        return user;
      }),
      catchError(err => { throw err })
    );
  }

  facebookLogin() {
    return from(this.afa.auth.signInWithPopup(
      new auth.FacebookAuthProvider()
    )).pipe(
      map(credential => {
        this.router.navigate(['/dashboard']);
        let user = {
          uid: credential.user.uid,
          email: credential.user.email,
          displayName: credential.user.displayName,
          phoneNumber: credential.user.phoneNumber,
          photoURL: credential.user.photoURL,
          signInMethod: "Facebook",
        }
        
        this.afs.collection('user', ref => ref.where('id', '==', credential.user.uid))
        .valueChanges().subscribe(e => {
          console.log(e)
          if(e === undefined || e.length == 0){
            this.addUser(user);
          }
        });
        return user;
      }),
      catchError((err, obs) => { 
        console.error('Facebook Login failed. Error: ', err);
        return obs;
      })
    );
  }

  githubLogin() {
    return from(this.afa.auth.signInWithPopup(
      new auth.GithubAuthProvider()
    )).pipe(
      map(credential => {
        this.router.navigate(['/dashboard']);
        let user = {
          uid: credential.user.uid,
          email: credential.user.email,
          displayName: credential.user.displayName,
          phoneNumber: credential.user.phoneNumber,
          photoURL: credential.user.photoURL,
          signInMethod: "Github",
        }
        this.afs.collection('user', ref => ref.where('id', '==', credential.user.uid))
        .valueChanges().subscribe(e => {
          console.log(e)
          if(e === undefined || e.length == 0){
            this.addUser(user);
          }
        });
        return user;
      }),
      catchError((err, obs) => { 
        console.error('Github Login failed. Error: ', err);
        return obs;
      })
    );
  }

  googleLogin() {
    return from(this.afa.auth.signInWithPopup(
      new auth.GoogleAuthProvider()
    )).pipe(
      map(credential => {
        this.router.navigate(['/dashboard']);
        let user = {
          uid: credential.user.uid,
          email: credential.user.email,
          displayName: credential.user.displayName,
          phoneNumber: credential.user.phoneNumber,
          photoURL: credential.user.photoURL,
          signInMethod: "Google",
        }
        this.afs.collection('user', ref => ref.where('id', '==', credential.user.uid))
        .valueChanges().subscribe(e => {
          console.log(e)
          if(e === undefined || e.length == 0){
            this.addUser(user);
          }
        });

        return user;
      }),
      catchError((err, obs) => { 
        console.error('Google Login failed. Error: ', err);
        return obs;
      })
    );
  }
  
  logout() {
    const dialogRef = this.dialog.open<
      LogoutConfirmationDialogComponent,
      undefined,
      boolean
    >(LogoutConfirmationDialogComponent);
    dialogRef.afterClosed().subscribe(res => {
      if(res){
        this.afa.auth.signOut();
        this.router.navigate(['/login']);
      }  
    }); 
  }

  addUser(user) {
    console.log(user);
    let id = user.uid;
    this.afs.collection<User>('users').doc(id).set({...user});
  }


}