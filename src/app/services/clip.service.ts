import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore, AngularFirestoreCollection, DocumentReference, QuerySnapshot } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { BehaviorSubject, combineLatest, of } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';
import IClip from '../models/clip.model';
import { Resolve, RouterStateSnapshot, Router, ActivatedRouteSnapshot } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ClipService implements Resolve<IClip | null>{
  public clipsCollection: AngularFirestoreCollection<IClip>;
  pageClips: IClip[] = [];
  pendingReq: boolean = false;

  constructor(
    private firestoreService: AngularFirestore,
    private fireAuthService: AngularFireAuth,
    private storage: AngularFireStorage,
    private router: Router
  ) {
    this.clipsCollection = firestoreService.collection('clips');
    this.firestoreService.firestore.settings({ experimentalForceLongPolling: true });
  }

  public createClip(data: IClip): Promise<DocumentReference<IClip>> {
    console.log('inside createClip');
    return this.clipsCollection.add(data);
  }

  // * Since we're going to allow users to sort their list of clips, returning an observable makes more sense here
  // * The combineLatest operator allows us to subscribe to multiple observables at once
  public getUserClips(sort$: BehaviorSubject<string>) {
    return combineLatest([
      this.fireAuthService.user,
      sort$
    ]).pipe(
      // We use switchMap here to subscribe to another observable (from user observable)
      switchMap(values => {
        const [user, sort] = values;

        // Check if user is null in which case return an empty array observable by casting it with 'of'
        if(!user) {
          return of([]);
        }

        // The where function helps us filter through the list of firebase documents
        const query = this.clipsCollection.ref.where(
          'uid', '==', user.uid
        ).orderBy(
          'timestamp',
          sort === '1' ? 'desc' : 'asc'
        );

        return query.get();
      }),
      map(snapshot => (snapshot as QuerySnapshot<IClip>).docs)
    )
  }

  updateClip(id: string, title: string) {
    return this.clipsCollection.doc(id).update({
      title
    })
  }

  async deleteClip(clip: IClip) {
    // Create a reference to the file
    const clipRef = this.storage.ref(`clips/${clip.fileName}`);
    const screenshotRef = this.storage.ref(
      `screenshots/${clip.screenshotFileName}`
    )
    
    await clipRef.delete();
    await screenshotRef.delete();

    // Select the document
    await this.clipsCollection.doc(clip.docID).delete();
  }

  public async getClips() {

    if (this.pendingReq) {
      return;
    }

    this.pendingReq = true;

    let query = this.clipsCollection.ref.orderBy(
      'timestamp', 'desc'
    ).limit(6)

    const { length } = this.pageClips;

    if (length) {
      const lastDocID = this.pageClips[length - 1].docID;
      const lastDoc = await this.clipsCollection.doc(lastDocID)
        .get()
        .toPromise()

      query = query.startAfter(lastDoc);
    }

    const snapshot = await query.get();

    snapshot.forEach(doc => {
      this.pageClips.push({
        docID: doc.id,
        ...doc.data()
      })
    })

    this.pendingReq = false;
    
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.clipsCollection.doc(route.params.id)
      .get()
      .pipe(
        map(snapshot => {
          const data = snapshot.data();
 
          if (!data) {
            this.router.navigate(['/']);
            return null;
          }

          return data;
        })
      )
  }
}
