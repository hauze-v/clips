import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { delay, filter, map, Observable, of, switchMap } from 'rxjs';
import IUser from '../models/user.model';
import { ActivatedRoute, NavigationEnd } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public isAuthenticated$: Observable<boolean>;
  public isAuthenticatedWithDelay$: Observable<boolean>;

  /** Reference to our firestore user collection */
  private usersCollection: AngularFirestoreCollection<IUser>

  /** Reference for whether we should redirect user on logout */
  private redirect = false;

  constructor(
    private fireAuthService: AngularFireAuth,
    private firestoreService: AngularFirestore,
    private router: Router,
    private route: ActivatedRoute
  ) {
    // Initialize the usersCollection property after service is injected
    this.usersCollection = this.firestoreService.collection('users');

    // Subscribe to the currently signed-in user from the the fireAuthService user observable
    this.isAuthenticated$ = this.fireAuthService.user.pipe(
      // Typescasts the user argument into a boolean value that we can subscribe to from our components
      map(user => !!user)
    );

    this.isAuthenticatedWithDelay$ = this.isAuthenticated$.pipe(
      delay(1000)
    );

    /**
     * * The router does not readily provide us with data from the route because our service is outside of the router-outlet directive (it's a gotcha)
     * * The events obv will emit several events that we're not interested in. We can use operators to help us filter
     * * The activatedRoutes will return an entire tree of routes that we can grab firstChild of to see the route data
     * * The switchMap operator will subscribe to an observable and its value will be pushed on to the next operator or subscribtion.
     * * it also completes the previous observable. It will also subscribe to the new observable so we avoid memory leaks.
     * * We also use the nullish coelesing operator here and pass along an empty observable if the data is null
     */
    this.router.events.pipe(
      filter(e => e instanceof NavigationEnd),
      map(e => this.route.firstChild),
      switchMap(route => route?.data ?? of({}))
    ).subscribe(data => {
      // If we can't retreive the data, set to false
      this.redirect = data.authOnly ?? false;
    })
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

  public async logout($event?: Event) {
    /** Prevent basic anchor tag functionality (refreshing page) when user clicks */
    if ($event) {
      $event.preventDefault();
    }

    // Signs the current user out
    await this.fireAuthService.signOut();

    // Redirect user back to Homepage if we've determined a redirect is necessary
    if (this.redirect) {
      await this.router.navigateByUrl('/');
    }
  }
}
