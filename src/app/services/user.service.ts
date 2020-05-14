import { Injectable } from '@angular/core';
import { Observable, of, from } from 'rxjs';
import { map, tap, catchError, switchMap, mergeMap, combineLatest, skipUntil, take, flatMap, filter, first } from 'rxjs/operators';
import { User } from 'app/models/user';
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth/';
import { FirestoreService } from 'app/services/firestore.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  
  private userCollection: AngularFirestoreCollection<User>;
  private users$: Observable<User[]>;
  private userDoc: AngularFirestoreDocument<User>;

  constructor(
    private db: FirestoreService,
    private afs: AngularFirestore,
    private afa: AngularFireAuth
  ){
    this.userCollection = afs.collection<User>('users');
  }

  getAll() {
    return this.afs.collection('users').valueChanges()
  }

  register(displayName, email, password) {
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
  
  add(user: User) {
    console.log(user)
    this.register(user.displayName, user.email, user.password);
    let newUser: AngularFirestoreCollection<User> = this.afs.collection('users');
    this.db.set('users', user)
    .then(res => {
      console.log(res);
      // newUser = this.afs.collection('users', ref => ref.where('id', '==', res. ))
    });
    return newUser.valueChanges();
  }

  update(user: User) {
    this.userDoc = this.afs.doc<User>(`users/${user.uid}`);
    this.userDoc.set({...user});  
    return this.userDoc.valueChanges();
  }

  delete(id: string) {
    console.log(id)
    this.userDoc = this.afs.doc<User>(`users/${id}`);
    this.userDoc.delete();
    this.userDoc.valueChanges().subscribe(e => console.log(e))
    return of(id);
  }
}
