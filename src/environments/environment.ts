// This file can be replaced during build by using the `fileReplacements` array.
// `ng build ---prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  firebaseConfig : {
    apiKey: "AIzaSyDdt-SEWZAJFGPLN4Tx8pCOfG5PmqOPi7c",
    authDomain: "alquimia-160618.firebaseapp.com",
    databaseURL: "https://alquimia-160618.firebaseio.com",
    projectId: "alquimia-160618",
    storageBucket: "alquimia-160618.appspot.com",
    messagingSenderId: "191083339631"
  }
};


import * as firebase from 'firebase';
import * as firebaseui from 'firebaseui';


export const firebaseUiAuthConfig: firebaseui.auth.Config = {
  signInFlow: 'popup',
  signInOptions: [
    {
      provider: firebase.auth.GoogleAuthProvider.PROVIDER_ID,
      scopes: [
        'https://www.googleapis.com/auth/plus.login'
      ],
      customParameters: {
        prompt: 'select_account'
      }
    },
    {
      scopes: [
        'public_profile',
        'email'
      ],
      customParameters: {
        'auth_type': 'reauthenticate'
      },
      provider: firebase.auth.FacebookAuthProvider.PROVIDER_ID
    },
    firebase.auth.EmailAuthProvider.PROVIDER_ID
    // -- Importante! estudiar lo usuario anonimo
    //firebaseui.auth.AnonymousAuthProvider.PROVIDER_ID
  ],
  tosUrl: '/serviceconditions',
  privacyPolicyUrl: '/policyprivacy',
  credentialHelper: firebaseui.auth.CredentialHelper.ACCOUNT_CHOOSER_COM
};

/*
 * In development mode, for easier debugging, you can ignore zone related error
 * stack frames such as `zone.run`/`zoneDelegate.invokeTask` by importing the
 * below file. Don't forget to comment it out in production mode
 * because it will have a performance impact when errors are thrown
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
