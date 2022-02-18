import DropboxMenu from './CitizenUserDropboxMenu'
import React, {useEffect, useState} from 'react'

const AddCitizenPopupBody = ({database, setAddCitizenPopupOpen, citizens, setCitizens, getTime, getDate, getYear}) => {
    const [name, setName] = useState('');
    const [citizenID, setCitizenID] = useState('');
    const [initialMeldas, setInitialMeldas] = useState(0);
    
    function classNames(...classes) {
        return classes.filter(Boolean).join(" ");
      }
    
    function onClickAddCitizenButton(){
        const newCitizenID = generateCitizenID();
        if(name){
            const addedCitizen = {
                citizenID: citizenID ? citizenID : newCitizenID,
                name: name,
                meldas: initialMeldas,
                dateAdded: `${getDate()}, ${getYear()}`
            }
            database.ref('/citizens/' + (citizenID ? citizenID : newCitizenID)).set(addedCitizen);
            const editedCitizens = [...citizens];
            editedCitizens.push(addedCitizen);
            setCitizens(editedCitizens);
            setAddCitizenPopupOpen(false);
        }
    }

    function generateCitizenID(){
        var citizenID = 'CI-'
        for(var i = 0; i < 5; i++){
            citizenID = citizenID + String(Math.floor(Math.random()*10));
        }
        return(citizenID);
    }
    return(
        <div className='w-full justify-center '>
            <div className='pb-4'>
            <div className='p-5 bg-blue-200 rounded shadow'>
                
                <div className=''>
                <p className='text-sm font-bold'>NAME</p>
                <input className='p-1 focus:outline-none'
                    onChange={event => {setName(event.target.value)}}
                ></input>
                </div>
                <div className='pt-2'>
                <p className='text-sm font-bold'>CITIZEN ID</p>
                
                <input className='p-1 focus:outline-none'
                    placeholder='Generated if no input'
                    onChange={event => {setCitizenID(event.target.value)}}
                ></input>
                </div>
                <div className='pt-2'>
                <p className='text-sm font-bold'>INITIAL MELDAS</p>
                
                <input type='Number' defaultValue='0' className='p-1 focus:outline-none'></input>
                </div>
                
            </div>
            </div>
            <button className={classNames(
                name ? 'text-black bg-yellow-300 hover:bg-yellow-400' : 'text-gray-400 bg-yellow-100',
                'w-1/3 rounded py-1 px-2 font-semibold')}
                onClick={onClickAddCitizenButton}
            >Add</button>
        </div>
    )
}

export default React.memo(AddCitizenPopupBody)