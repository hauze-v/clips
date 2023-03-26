import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

// Import and initialize firebase manually (without Angular Fire Module)
import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

if (environment.production) {
  enableProdMode();
}

// This line initializes firebase
initializeApp(environment.firebase);

// Declare the firebase authentication object for passing along to onAuthStateChanged
const auth = getAuth();

// Reference for whether we've initialized Angular yet
let appInit = false;

onAuthStateChanged(auth, user => {
  // If we haven't initialized angular, do so
  if (!appInit) {
    // This is the bootstrap function that initializes Angular
    platformBrowserDynamic().bootstrapModule(AppModule)
    .catch(err => console.error(err));
  }
  
  appInit = true;
});


