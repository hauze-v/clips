import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, DocumentReference } from '@angular/fire/compat/firestore';
import IClip from '../models/clip.model';

@Injectable({
  providedIn: 'root'
})
export class ClipService {
  public clipsCollection: AngularFirestoreCollection<IClip>;

  constructor(
    private firestoreService: AngularFirestore
  ) {
    this.clipsCollection = firestoreService.collection('clips');
    this.firestoreService.firestore.settings({ experimentalForceLongPolling: true });
  }

  public createClip(data: IClip): Promise<DocumentReference<IClip>> {
    console.log('inside createClip');
   return this.clipsCollection.add(data);
  }
}
