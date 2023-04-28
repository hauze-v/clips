import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore, AngularFirestoreCollection, DocumentReference } from '@angular/fire/compat/firestore';
import { of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import IClip from '../models/clip.model';

@Injectable({
  providedIn: 'root'
})
export class ClipService {
  public clipsCollection: AngularFirestoreCollection<IClip>;

  constructor(
    private firestoreService: AngularFirestore,
    private fireAuthService: AngularFireAuth
  ) {
    this.clipsCollection = firestoreService.collection('clips');
    this.firestoreService.firestore.settings({ experimentalForceLongPolling: true });
  }

  public createClip(data: IClip): Promise<DocumentReference<IClip>> {
    console.log('inside createClip');
   return this.clipsCollection.add(data);
  }

  // * Since we're going to allow users to sort their list of clips, returning an observable makes more sense here
  public getUserClips() {
    return this.fireAuthService.user.pipe(
      // We use switchMap here to subscribe to another observable (from user observable)
      switchMap(user => {
        // Check if user is null in which case return an empty array observable by casting it with 'of'
        if(!user) {
          return of([]);
        }

        // The where function helps us filter through the list of firebase documents
        console.log('uid:' + user.uid);

        const query = this.clipsCollection.ref.where(
          'uid', '==', user.uid
        );

        return query.get();
      })
    )
  }
}
