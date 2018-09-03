export const environment = {
  production: true,
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
