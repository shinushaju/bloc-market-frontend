import firebase from 'firebase';

var firebaseConfig = {
  apiKey: "AIzaSyDOwgMajyNm7Gsw_8O8crtME9CDEWnh7qM",
  authDomain: "bloc-market.firebaseapp.com",
  projectId: "bloc-market",
  storageBucket: "bloc-market.appspot.com",
  messagingSenderId: "7632942180",
  appId: "1:7632942180:web:3c2c6e9cb7f92a4ee3db71"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export const auth = firebase.auth();
export const googleAuthProvider = new firebase.auth.GoogleAuthProvider();