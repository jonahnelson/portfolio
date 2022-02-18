import { useState, useEffect } from 'react';
import Switch from '@material-ui/core/Switch';
import { CheckCircleIcon, EyeIcon, EyeOffIcon, PencilAltIcon, XCircleIcon } from '@heroicons/react/outline';

// Not used yet. Might use it sometime
const Settings = ({user, database, setUser}) => {
    
    useEffect(updateUser, []);

    const [newPassword, setNewPassword] = useState('');
    const [requirePasswordChecked, setRequirePasswordChecked] = useState(user.settings.requirePassword);
    const [isEditingPassword, setIsEditingPassword] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    function updateUser(){
        database.ref(`/citizens/${user.citizenID}`).get().then(citizenSnapshot => {
            setUser(citizenSnapshot.val());
            setRequirePasswordChecked(citizenSnapshot.val().settings.requirePassword);
            localStorage.setItem('user', JSON.stringify(citizenSnapshot.val()));
        })
    }

    function isNewPasswordValid(){
        return newPassword != undefined && newPassword != '';
    }

    function stringToArrayBuffer(str) {
        var buf = new ArrayBuffer(str.length*2); // 2 bytes for each char
        var bufView = new Uint16Array(buf);
        for (var i=0, strLen=str.length; i < strLen; i++) {
          bufView[i] = str.charCodeAt(i);
        }
        return buf;
      }
      
    return(
        <div className='mx-1 lg:mx-10 my-1 lg:my-5'>
            <div className='py-2'>
                <p className='text-4xl text-black font-bold'>Settings</p>
            </div>
            <div className='my-4 p-2 border-2 border-gray-500 shadow'>
                <div className='flow-root bg-gray-100 border border-gray-500 rounded shadow p-2'>
                <div className='float-left w-2/3'>
                    <p className='text-xl font-bold pt-1'>Censor my Citizen ID</p>
                </div>
                <div className='float-right'>
                <Switch
                    checked={user.settings.censorCitizenID}
                    onChange={() => {
                        database.ref(`/citizens/${user.citizenID}/settings/censorCitizenID`).set(!user.settings.censorCitizenID);
                        updateUser();
                    }}
                    color='primary'
                />
                </div>
                </div>
                <div className='pt-2'>
                    <p className='p-1 font-semibold text-lg'>To be able to screenshot, show my screen to others, etc. without them seeing my full Citizen ID</p>
                </div>
            </div>
            <div className='my-4 p-2 border-2 border-gray-500 shadow'>
                <div className='bg-gray-100 border border-gray-500 rounded shadow p-2'>
                    <div className='flow-root'>
                <div className='float-left w-2/3'>
                    <p className='text-xl font-bold pt-1'>Require password to sign in</p>
                </div>
                <div className='float-right'>
                <Switch
                    checked={requirePasswordChecked}
                    onChange={() => {
                        /* database.ref(`/citizens/${user.citizenID}/settings/requirePassword`).set(!user.settings.requirePassword);
                        updateUser(); */
                        if(requirePasswordChecked == true){
                            database.ref(`/citizens/${user.citizenID}/settings/requirePassword`).set(false);
                            setIsEditingPassword(false);
                            setNewPassword('');
                            setShowPassword(false);
                        }
                        if(!requirePasswordChecked){
                            if(user.password != undefined){
                                database.ref(`/citizens/${user.citizenID}/settings/requirePassword`).set(true);
                            } else {
                                setIsEditingPassword(true);
                            }
                        }
                        setRequirePasswordChecked(!requirePasswordChecked);
                    }}
                    color='primary'
                />
                </div>
                </div>
                {requirePasswordChecked && isEditingPassword &&
                <div className='flex justify-center my-2'>
                    
                    <div className=''>
                <input className='border-2 border-gray-500 focus:outline-none focus:border-gray-700 focus:ring-1 focus:ring-gray-700 p-1'
                    value={newPassword}
                    type={showPassword? '' : 'password'}
                    placeholder='Set password...'
                    onChange={event => {
                        setNewPassword(event.target.value);
                        setIsEditingPassword(true);
                    }}
                ></input>
                {isNewPasswordValid() &&
                <div className='flow-root w-full'>
                <button className='float-left py-1 px-2 mt-2 font-semibold bg-yellow-300 hover:bg-yellow-400 shadow rounded flex'
                    onClick={() => {
                        setShowPassword(!showPassword);
                    }}
                >
                    {showPassword ?
                        <EyeOffIcon className='h-6 w-6'/> :
                        <EyeIcon className='h-6 w-6'/>
                    }
                    {showPassword ? 'HIDE' : 'SHOW'}
                </button>
                <button className='float-right py-1 px-2 mt-2 font-semibold bg-yellow-300 hover:bg-yellow-400 shadow rounded flex'
                    onClick={() => {
                        database.ref(`/citizens/${user.citizenID}/settings/requirePassword`).set(true);
                        /* sha256(newPassword).then(hashedPassword => {
                            console.log(hashedPassword);
                        }) */
                        window.crypto.subtle.digest("SHA-256", stringToArrayBuffer(newPassword)).then(result => {
                            //database.ref(`/citizens/${user.citizenID}/password`).set();
                            console.log(result);
                            const hashArray = Array.from(new Uint8Array(result));                     // convert buffer to byte array
                            const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
                            console.log(hashHex);
                            database.ref(`/citizens/${user.citizenID}/password`).set(hashHex);
                            setIsEditingPassword(false);
                            setNewPassword('');
                            setShowPassword(false);
                            updateUser();
                        })
                        
                    }}
                >
                    
                    <CheckCircleIcon className='h-6 w-6'/>
                    SAVE
                </button>
                </div>}
                <button className='mt-2 w-full rounded bg-yellow-300 hover:bg-yellow-400 shadow px-2 py-1 font-semibold flex justify-center'
                    onClick={() => {
                        setIsEditingPassword(false);
                        setNewPassword('');
                        if(user.password == undefined){
                            setRequirePasswordChecked(false);
                        }
                        setShowPassword(false);
                    }}>
                        <XCircleIcon className='h-6 w-6'/>
                        CANCEL</button>
                </div>
                </div>}
                {requirePasswordChecked && !isEditingPassword &&
                <div className='flex justify-center my-2'>
                    <button className='rounded bg-yellow-300 hover:bg-yellow-400 shadow px-2 py-1 font-semibold text-lg flex justify-center'
                        onClick={() => {
                            setIsEditingPassword(true);
                        }}
                    >
                        <PencilAltIcon className='h-7 w-7'/>
                        CHANGE PASSWORD
                    </button>
                </div>
                }
                
                </div>
                <div className='pt-2'>
                    <p className='p-1 font-semibold text-lg'>If my Citizen ID is leaked, someone will still need a password to sign in</p>
                </div>
            </div>
        </div>
    )
}

export default Settings;