import React, { useState } from 'react';
import RushingtonAtNight from '../../RushingtonAtNight.png'

const Join = ({setSignedIn, citizens, setIsAdmin, setUser}) => {

  const [citizenIDInput, setCitizenIDInput] = useState(localStorage.getItem('citizenID') != undefined ? localStorage.getItem('citizenID') : '');
  const [errorMessage, setErrorMessage] = useState('');

  function onClickSignIn(){
    if(isCitizenIDValid(citizenIDInput, false, true) && citizens != undefined){
      const citizensObjects = Object.values(citizens);
      var foundCitizenIDMatch = false;
    citizensObjects.forEach(citizenObject => {
      if(citizenObject.citizenID == citizenIDInput){
        foundCitizenIDMatch = true;        
          setUser(citizenObject);
          setIsAdmin(citizenIDInput == process.env.REACT_APP_JONAH_CITIZEN_ID);
          localStorage.setItem('signedIn', 'true');
          localStorage.setItem('user', JSON.stringify(citizenObject));
          localStorage.setItem('isAdmin', citizenIDInput == process.env.REACT_APP_JONAH_CITIZEN_ID);
          setSignedIn(true);
        
      }
    });
    setErrorMessage(foundCitizenIDMatch ? '' : 'Citizen ID has a valid format, but found no matches. Try refreshing')
    }
  }

  function isCitizenIDValid(citizenID, duringTyping, changeErrorMessage){
    if((citizenID.length == 1 && !citizenID.startsWith('C')) ||
       (citizenID.length == 2 && !citizenID.startsWith('CI')) ||
       (citizenID.length >= 3 && !citizenID.startsWith('CI-'))){
      if(citizenID.length < 8){
        if(citizenID.length == 0){
          if(changeErrorMessage)setErrorMessage(duringTyping ? '' : 'Enter Citizen ID to sign in');
          return duringTyping ? true : false;
        } else {
        if(changeErrorMessage)setErrorMessage("Invalid format. Citizen ID must begin with 'CI-'");
        return false;
        }
      } else {
        if(changeErrorMessage)setErrorMessage("Invalid format. Citizen ID must begin with 'CI-' and be followed by 5 numbers");
        return false;
      }
    } else {
      if(citizenID.length == 0){
        if(changeErrorMessage)setErrorMessage(duringTyping ? '' : 'Enter Citizen ID to sign in');
        return duringTyping ? true : false;
      } else {
        if(citizenID.length < 8){
          if(changeErrorMessage)setErrorMessage(duringTyping ? '' : "Invalid format. Citizen ID is too short. 5 numbers must follow 'CI-'");
          return duringTyping ? true : false;
        } else {
          if(citizenID.length > 8){
            if(changeErrorMessage)setErrorMessage("Invalid format. Citizen ID is too dang long! At most 5 numbers must follow 'CI-'");
            return false;
          } else {
            //console.log('checking if numbers', Number(citizenID.substring(3, 9)) !== NaN, Number(citizenID.substring(3, 9)))
            if(!Number(citizenID.substring(3, 9))){
              if(changeErrorMessage)setErrorMessage("Invalid format. 5 numbers must follow 'CI-'");
              return false;
            } else {
              console.log('nu', Number(citizenID.substring(3, 9)))
              if(changeErrorMessage)setErrorMessage('');
              return true;
            }
            
          }
        }
      }
    }
    
  }

  function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
  }

    return(

      <div className="min-h-screen justify-center py-12"
      style={{ 
        backgroundImage: `url(${RushingtonAtNight})`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: "cover",
      }}
      >
        <div className='mx-6 lg:mx-0'>
        <div className='sm:mx-auto  sm:w-full sm:max-w-md '>
        <div className='flex justify-center bg-gray-200 py-8 px-4 shadow rounded-t-lg sm:px-10'>
        <div className="shadow bg-white border-l-2 border-b-2 border-blue-300 border-b-blue-200">
                <a href="#">
                  <span className="sr-only">Workflow</span>
                  <p className='text-3xl font-bold text-gray-700 p-1 border-r-2 border-t-2 border-yellow-300'>Rushington Hub</p>
                </a>
              </div>
          </div>
    </div>

  <div className="sm:mx-auto  sm:w-full sm:max-w-md">
    <div className="bg-blue-200 py-8 px-4 shadow rounded-b-lg sm:px-10">

      
        
        <div className="w-full">
          <p className='font-semibold text-center'>Enter Citizen ID to Continue</p>
        <input placeholder='e.g. CI-49893, CI-28492...'
          value={citizenIDInput}
          onInput={event => {setCitizenIDInput(event.target.value);
          isCitizenIDValid(event.target.value, true, true);  
      }} 
          onKeyDown={event => {
            if(event.code === 'Enter'){
              onClickSignIn();
            }
          }}
          className={
            classNames(isCitizenIDValid(citizenIDInput, true, false) ? '' : 'text-red-500 font-semibold',
            'w-full type-password focus:outline-none border-2 border-gray-500 focus:border-gray-700 focus:ring-1 focus:ring-gray-700 p-1 rounded')}></input>
        <div className='w-full flex justify-center py-6'>
        <button className={classNames(citizens != undefined && isCitizenIDValid(citizenIDInput, false, false) ?  'bg-yellow-300 text-gray-800 hover:bg-yellow-400' : 'bg-yellow-200 text-gray-400',
          'flex justify-center w-1/3 py-2 shadow font-semibold rounded')} onClick={onClickSignIn}>SIGN IN</button>
        </div>
        {errorMessage &&
        <p className='text-center text-red-500 bg-white shadow p-1 font-semibold'>{errorMessage}</p>
        }
      </div>
    </div>
  </div>
  </div>
</div>
    )
}

export default React.memo(Join);
