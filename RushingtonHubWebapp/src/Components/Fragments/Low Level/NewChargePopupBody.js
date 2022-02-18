import CitizenGovernmentDropboxMenu from './CitizenGovernmentDropboxMenu'
import React, {useEffect, useState} from 'react'

const NewChargePopupBody = ({database, getTime, getDate, getYear, selectedCitizen, setSelectedCitizen, setNewChargePopupOpen, setValues}) => {
    const [citizens, setCitizens] = useState([]);
    const [filteredCitizens, setFilteredCitizens] = useState([]);
    const [selectedDefendant, setSelectedDefendant] = useState(selectedCitizen);
    const [selectedProsecutor, setSelectedProsecutor] = useState();
    const [allegedCrime, setAllegedCrime] = useState('');
    const [reasonForVerdict, setReasonForVerdict] = useState('');
    const [punishment, setPunishment] = useState('');
    const [citizenGuilty, setCitizenGuilty] = useState(true);
    const rushingtonEpoch = 1522648800;

    useEffect(()=>{addCitizens();
        console.log('Called useeffect')
    }, []);
    function classNames(...classes) {
        return classes.filter(Boolean).join(" ");
      }
    function addCitizens(){
    database.ref('/citizens').get().then(citizensObjects => {
        setCitizens(Object.values(citizensObjects.val()));
        setFilteredCitizens(Object.values(citizensObjects.val()));
        //setSelectedCitizen(Object.values(citizensObjects.val())[0]);
        console.log(Object.values(citizensObjects.val())[0])
    })}

    function onClickAddChargeButton(){
        database.ref(`/citizens/${selectedCitizen.citizenID}`).get().then(
            citizenSnapshot => {
                var editedSelectedCitizen = citizenSnapshot.val();
                var newCharge = {};
                const newChargeID = generateChargeID();
                if(citizenGuilty){
                    newCharge = {
                        date: `${getDate()}, ${getYear()}`,
                        time: `${getTime()}`,
                        ssre: Math.round(((new Date()).getTime()/1000)-rushingtonEpoch),
                        chargeID: newChargeID,
                        defendant: {name: selectedDefendant.name, citizenID: selectedDefendant.citizenID},
                        prosecutor: {name: selectedProsecutor.name, citizenID: selectedProsecutor.citizenID},
                        crime: allegedCrime,
                        verdict: "Guilty",
                        reasonForVerdict: reasonForVerdict,
                        punishment: punishment} 
                } else {
                    newCharge = {
                        date: `${getDate()}, ${getYear()}`,
                        time: `${getTime()}`,
                        ssre: Math.round(((new Date()).getTime()/1000)-rushingtonEpoch),
                        chargeID: newChargeID,
                        defendant: {name: selectedDefendant.name, citizenID: selectedDefendant.citizenID},
                        prosecutor: {name: selectedProsecutor.name, citizenID: selectedProsecutor.citizenID},
                        allegedCrime: allegedCrime,
                        verdict: "Not Guilty",
                        reasonForVerdict: reasonForVerdict
                    };
                } 
                database.ref(`/citizens/${selectedCitizen.citizenID}/charges/${newChargeID}`).set(newCharge);
                database.ref(`/criminalCharges/${newChargeID}`).set(newCharge);
                console.log("Charges", selectedCitizen.charges)
                editedSelectedCitizen.charges = editedSelectedCitizen.charges != undefined ? JSON.parse(JSON.stringify([...Object.values(editedSelectedCitizen.charges), newCharge])) : JSON.parse(JSON.stringify([newCharge]));
                setValues();
                setSelectedCitizen(editedSelectedCitizen);
                setNewChargePopupOpen(false);
            }
        )
    }

    function generateChargeID(){
        var chargeID = 'CC-'
        for(var i = 0; i < 5; i++){
            chargeID = chargeID + String(Math.floor(Math.random()*10));
        }
        return(chargeID);
    }
    return(
        <div className='w-full justify-center '>
            <div className='pb-4'>
            <div className='p-5 bg-blue-200 rounded shadow'>
                <div className='flow-root w-full pb-5'>
                <div className='float-left w-1/2'>
                <p className='text-sm font-bold'>PROSECUTOR</p>
                <CitizenGovernmentDropboxMenu
                    filteredCitizens={filteredCitizens}
                    setFilteredCitizens={setFilteredCitizens}
                    citizens={citizens}
                    selectedCitizen={selectedProsecutor}
                    setSelectedCitizen={setSelectedProsecutor}
                    className='pb-2'
                />
                </div>
                <div className='float-right w-1/2'>
                <p className='text-sm font-bold'>DEFENDANT</p>
                <p>{selectedCitizen.name}</p>
                </div>
                </div>
                <div className='w-full'>
                    <p className='text-sm font-bold'>ALLEGED CRIME</p>
                    <textarea className='w-full focus:outline-none p-2' placeholder="" onChange={event=>{setAllegedCrime(event.target.value)}}></textarea>
                </div>
                <div className='w-full flex justify-center pt-2'>
                    <button className={classNames(citizenGuilty ? 'text-black bg-yellow-300' : 'text-gray-400 bg-yellow-100 hover:bg-yellow-200',
                        'w-1/3 rounded-l py-1 px-2 font-semibold text-sm')}
                        onClick={()=>{setCitizenGuilty(true)}}>GUILTY</button>
                    <button className={classNames(!citizenGuilty ? 'text-black bg-yellow-300' : 'text-gray-400 bg-yellow-100 hover:bg-yellow-200',
                        'w-1/3 rounded-r py-1 px-2 font-semibold text-sm')}
                        onClick={()=>{setCitizenGuilty(false)}}>NOT GUILTY</button>
                </div>
                <div className='w-full pt-2'>
                    <p className='text-sm font-bold'>REASON</p>
                    <textarea className='w-full focus:outline-none p-2' placeholder="" onChange={event=>{setReasonForVerdict(event.target.value)}}></textarea>
                </div>
                {citizenGuilty &&
                <div className='w-full pt-2'>
                    <p className='text-sm font-bold'>PUNISHMENT</p>
                    <textarea className='w-full focus:outline-none p-2' placeholder="" onChange={event=>{setPunishment(event.target.value)}}></textarea>
                </div>
                }
            </div>
            </div>
            <button className={classNames(
                selectedDefendant != undefined &&  selectedProsecutor != undefined ? 'text-black bg-yellow-300 hover:bg-yellow-400' : 'text-gray-400 bg-yellow-100',
                'w-1/3 rounded py-1 px-2 font-semibold')}
                onClick={onClickAddChargeButton}
            >Add</button>
        </div>
    )
}

export default React.memo(NewChargePopupBody)