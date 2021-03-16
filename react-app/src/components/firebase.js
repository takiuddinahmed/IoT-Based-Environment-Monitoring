import firebase from 'firebase';


const firebaseConfig = {
  apiKey: "AIzaSyCA49lZohD0_RlrPu3g3czHFT8OQxhZGxY",
  authDomain: "iot-env-monitoring-system.firebaseapp.com",
  databaseURL: "https://iot-env-monitoring-system-default-rtdb.firebaseio.com",
  projectId: "iot-env-monitoring-system",
  storageBucket: "iot-env-monitoring-system.appspot.com",
  messagingSenderId: "413586591058",
  appId: "1:413586591058:web:7261dd87ee73c9cb34be8b",
  measurementId: "G-GLDFCZ4S4S"
};


firebase.initializeApp(firebaseConfig);
const database = firebase.database();

export default database;