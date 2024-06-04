import { initializeApp } from 'firebase/app'
import { getStorage } from 'firebase/storage'
// Import the functions you need from the SDKs you need
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyDdiCDxqmVN-v_1DKKxdUPyVzvLwPPdsDs',
  authDomain: 'clothes-store-d35c4.firebaseapp.com',
  projectId: 'clothes-store-d35c4',
  storageBucket: 'clothes-store-d35c4.appspot.com',
  messagingSenderId: '136992083540',
  appId: '1:136992083540:web:3da73e02ef1192dcc367c1',
  measurementId: 'G-CWVDPK6VQV',
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)

// Firebase storage reference
const storage = getStorage(app)
export default storage
