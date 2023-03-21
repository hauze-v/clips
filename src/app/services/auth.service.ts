import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { map, Observable } from 'rxjs';
import IUser from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public isAuthenticated$: Observable<boolean>;

  /** Reference to our firestore user collection */
  private usersCollection: AngularFirestoreCollection<IUser>

  constructor(
    private fireAuthService: AngularFireAuth,
    private firestoreService: AngularFirestore 
  ) {
    // Initialize the usersCollection property after service is injected
    this.usersCollection = this.firestoreService.collection('users');

    // Subscribe to the currently signed-in user from the the fireAuthService user observable
    this.isAuthenticated$ = this.fireAuthService.user.pipe(
      // Typescasts the user argument into a boolean value that we can subscribe to from our components
      map(user => !!user)
    );
  }

  public async createUser(userData: IUser) {
    // Check for whether a password was entered as it's needed for the authentication call
    if (!userData.password) {
      throw new Error('Password not provided!');
    }

    // Create user credentials with fireBase authentication service
    const userCred = await this.fireAuthService.createUserWithEmailAndPassword(userData.email as string, userData.password as string);

    // Overwrite this setting to fix recurring API call/looping error in browser
    this.firestoreService.firestore.settings({ experimentalForceLongPolling: true });

    if (!userCred.user) {
      throw new Error("User can't be found");
    }

    // Add the user-entered data from the form and assign the userID generated from fireAuthService
    await this.usersCollection.doc(userCred.user?.uid).set({
      name: userData.name,
      email: userData.email,
      age: userData.age,
      phoneNumber: userData.phoneNumber
    });

    // Update displayName property in the fireAuthService
    await userCred.user.updateProfile({
      displayName: userData.name
    });
  }
}
