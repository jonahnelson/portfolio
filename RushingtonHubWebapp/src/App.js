import "./App.css";
import React, { useState, useEffect } from "react";
import SignIn from "./Components/Pages/SignIn";
import Main from "./Components/Pages/Main"
import './App.css';
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';

const firebaseInstance = firebase.initializeApp({
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_DATABASE_URL,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_APP_ID,
});

const database =  firebaseInstance.database();

const rushingtonEpoch = 1522648800;


function App() {
  const [citizens, setCitizens] = useState();
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));
  const [isAdmin, setIsAdmin] = useState(booleanify(localStorage.getItem('isAdmin')));
  const [signedIn, setSignedIn] = useState(booleanify(localStorage.getItem("signedIn")));
  const [currentYear, setCurrentYear] = useState(getYear());
  const [currentDate, setCurrentDate] = useState(getDate());
  const [currentTime, setCurrentTime] = useState(getTime());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(getTime());
      setCurrentDate(getDate());
      setCurrentYear(getYear());
    }, 1000);
    return () => clearInterval(interval);
  });

  useEffect(updateCitizens, []);

  function updateCitizens(){
    database.ref('citizens').get().then(
      citizensSnapshot => {
        setCitizens(citizensSnapshot.val());
        if(user != undefined){
          setUser(citizensSnapshot.val()[user.citizenID]);
          localStorage.setItem('user', JSON.stringify(citizensSnapshot.val()[user.citizenID]));
        }
      }
    );
  }

  // Show the signed in content if user is signed in. Handling it this way here is a nice, easy way to do it
  if (signedIn === true) {
    return (
      <Main
        signedIn={signedIn}
        setSignedIn={setSignedIn}
        setIsAdmin={setIsAdmin}
        isAdmin={isAdmin}
        citizens={citizens}
        setUser={setUser}
        user={user}
        database={database}
        currentTime={currentTime}
        currentDate={currentDate}
        currentYear={currentYear}
        getTime={getTime}
        getDate={getDate}
        getYear={getYear}
      />
    );

    // Show sign in screen if user isn't signed in
  } else {
    return (
      <SignIn
        signedIn={signedIn}
        setSignedIn={setSignedIn}
        setIsAdmin={setIsAdmin}
        citizens={citizens}
        setUser={setUser}
        database={database}
      />
    );
  }
}

// Local storage only stores strings, so to actually be able to use the signedIn local storage info, it has to be
// converted into a boolean
function booleanify(s) {
  if (s === "true" || s === true) {
    return true;
  } else {
    return false;
  }
}

const months = [
  {number: 1, name: 'Igmo'},
  {number: 2, name: 'Bostiod'},
  {number: 3, name: 'Walin'},
  {number: 4, name: 'Sabetata'},
  {number: 5, name: 'Carton'},
  {number: 6, name: 'Wayu'},
  {number: 7, name: 'Wildder'},
  {number: 8, name: 'Wekenbarg'},
  {number: 9, name: 'Pape'},
  {number: 10, name: 'Fortis'},
  {number: 11, name: 'Callidus'},
  {number: 12, name: 'Fastis'}
];

// Converts the total number of seconds since April 2018 (when we started the Minecraft world, basically the epoch)
// to a time based on year, month, day, and "hour" sizes that I chose
function getTime(){
  var currentTotalSeconds, year, month, day, hour, seconds;
  const currentDate = new Date();
  currentTotalSeconds = Math.round((currentDate.getTime()/1000)-rushingtonEpoch);
  year = toFixed(currentTotalSeconds/345600, 0);
  month = toFixed((currentTotalSeconds - (345600 * year))/28800, 0);
  day = toFixed(((currentTotalSeconds - (345600 * year) - (28800 * month)))/1200, 0);
  hour = toFixed(((currentTotalSeconds - (345600 * year) - (28800 * month) - (1200 * day))/60), 0);
  seconds = toFixed(currentTotalSeconds - (345600 * year) - (28800 * month) - (1200 * day) - (60 * hour), 0);
  hour++;
  if(String(seconds).length > 1){
    seconds = String(seconds);
  } else {
    seconds = `0${seconds}`;
  }
  return(`${hour}:${seconds}`);
}

// Converts seconds since "Rushington epoch" to a date and returns a formatted string
function getDate(){
  var currentTotalSeconds, year, month, day;
  const currentDate = new Date();
  currentTotalSeconds = Math.round((currentDate.getTime()/1000)-rushingtonEpoch);
  year = toFixed(currentTotalSeconds/345600, 0);
  month = toFixed((currentTotalSeconds - (345600 * year))/28800, 0);
  day = toFixed(((currentTotalSeconds - (345600 * year) - (28800 * month)))/1200 + 1, 0);
  var monthString = '';
  months.forEach(monthItem => {
    if(monthItem.number === Number(month) + 1){
      monthString = monthItem.name;
    }
  });
  var dayString = String(day);
  if(dayString.endsWith('0') ||
     dayString.endsWith('4') ||
     dayString.endsWith('5') ||
     dayString.endsWith('6') ||
     dayString.endsWith('7') ||
     dayString.endsWith('8') ||
     dayString.endsWith('9')){
       dayString = dayString.concat('th');
     } else if(dayString.endsWith('1')){
       dayString = dayString == '11' ? dayString.concat('th') : dayString.concat('st');
     } else if(dayString.endsWith('2')){
       dayString = dayString == '12' ? dayString.concat('th') : dayString.concat('nd');
     } else if(dayString.endsWith('3')){
       dayString = dayString == '13' ? dayString.concat('th') : dayString.concat('rd');
     }
  return(`${monthString} ${dayString}`);
}

// Converts seconds since Rushington epoch to years
function getYear(){
  var currentTotalSeconds, year;
  const currentDate = new Date();
  currentTotalSeconds = Math.round((currentDate.getTime()/1000)-rushingtonEpoch);
  year = toFixed(currentTotalSeconds/345600, 0);
  return(`${year}`);
}

// Function I found online that helps me cut off decimals because by their nature dates and times only
// switch when it hits the above unit. Rounding doesn't do the job
function toFixed(num, fixed) {
  var re = new RegExp('^-?\\d+(?:\.\\d{0,' + (fixed || -1) + '})?');
  return num.toString().match(re)[0];
}

export default App;