// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  firebaseConfig: {
    apiKey: 'AIzaSyBdQ8ZAAR4BZ56qb0VZteMT1xmu8fcKsYs',
    authDomain: 'save2date.firebaseapp.com',
    projectId: 'save2date',
    storageBucket: 'save2date.appspot.com',
    messagingSenderId: '718066279892',
    appId: '1:718066279892:web:6182b785b73f70710fe241',
    measurementId: 'G-9T14V9W4X0'
  }
};

export const BASE_NOMINATIM_URL = 'nominatim.openstreetmap.org';
export const DEFAULT_VIEW_BOX = 'viewbox=-25.0000%2C70.0000%2C50.0000%2C40.0000';

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
