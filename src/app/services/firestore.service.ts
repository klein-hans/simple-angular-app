import { Injectable } from '@angular/core';
import { 
  AngularFirestore, 
  AngularFirestoreDocument, 
  AngularFirestoreCollection 
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import * as firebase from 'firebase/app';

type ColPredicate<T> = string | AngularFirestoreCollection<T>;
type DocPredicate<T> = string | AngularFirestoreDocument<T>;

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {

  constructor(private afs: AngularFirestore) {
  
  }

  col<T>(ref: ColPredicate<T>, queryFn?): AngularFirestoreCollection<T>{
    return typeof ref === 'string' ? this.afs.collection<T>(ref, queryFn) : ref;
  }

  doc<T>(ref: DocPredicate<T>, queryFn?): AngularFirestoreDocument<T>{
    return typeof ref === 'string' ? this.afs.doc<T>(ref) : ref;
  }

  /**
   * Get Data
   */
  doc$<T>(ref : DocPredicate<T>): Observable<T> {
    return this.doc(ref).snapshotChanges().pipe(
      map(doc => { return doc.payload.data() as T }),
      catchError(err => { throw err})
    )
  }

  col$<T>(ref: ColPredicate<T>, queryFn?): Observable<T[]> {
    return this.col(ref, queryFn).snapshotChanges().pipe(
      map(docs => { return docs.map(a => a.payload.doc.data()) as T[] }),
      catchError(err => { throw err })
    ) 
  }

  colWithIds$<T>(ref: ColPredicate<T>, queryFn?): Observable<any[]> {
    return this.col(ref, queryFn).snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return { id, ...data };
        })
      })
    )
  }

  /**
   * Firebase Serve Timestamp
   */
  get timestamp() {
      return firebase.firestore.FieldValue.serverTimestamp()
  }

  set<T>(ref: DocPredicate<T>, data: any) {
      const timestamp = this.timestamp
      return this.doc(ref).set({
          ...data,
          updatedAt: timestamp,
          createdAt: timestamp
      })
  }
}
