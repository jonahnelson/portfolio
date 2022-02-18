import React, {useEffect, useState} from 'react'
import { ArrowCircleUpIcon } from '@heroicons/react/outline';

const NewGovernmentTransferPopupBody = ({database, user, getTime, getDate, getYear, setNewGovernmentTransferPopupOpen, selectedCitizen, setValues, governmentFunds}) => {
    const [citizens, setCitizens] = useState([]);
    const [filteredCitizens, setFilteredCitizens] = useState([]);
    const [transferAmount, setTransferAmount] = useState(0);
    const [transferReason, setTransferReason] = useState('');
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

    function onClickSendTransfer(){
        var receiverResultingBalance = 0;
        var senderResultingBalance = 0;
        if(isTransferAmountValid()){
        database.ref(`/citizens/${selectedCitizen.citizenID}/meldas`).get().then(
            meldasSnapshot => {
                receiverResultingBalance = Number(meldasSnapshot.val()) + Number(transferAmount)
                database.ref(`/citizens/${selectedCitizen.citizenID}/meldas`).set(receiverResultingBalance);
                database.ref(`/government/meldas`).get().then(
                    meldasSnapshot => {
                        senderResultingBalance = Number(meldasSnapshot.val()) - Number(transferAmount)
                        database.ref(`/government/meldas`).set(senderResultingBalance);
                        const transferID = generateTransferID();
                        database.ref(`/government/transfers/${transferID}`).set(
                        {
                            transferID: transferID,
                            date: `${getDate()}, ${getYear()}`,
                            time: getTime(),
                            ssre: Math.round(((new Date()).getTime()/1000)-rushingtonEpoch),
                            amount: transferAmount,
                            receiverCitizenID: selectedCitizen.citizenID,
                            receiverName: selectedCitizen.name,
                            type: "Outgoing",
                            reason: transferReason.length != 0 ? transferReason : 'None given',
                            resultingBalance: senderResultingBalance
                        }
                        
                    );
                    database.ref(`/citizens/${selectedCitizen.citizenID}/transfers/${transferID}`).set(
                        {
                            transferID: transferID,
                            date: `${getDate()}, ${getYear()}`,
                            time: getTime(),
                            ssre: Math.round(((new Date()).getTime()/1000)-rushingtonEpoch),
                            amount: transferAmount,
                            senderCitizenID: 'CI-78614',
                            senderName: 'Rushington Government',
                            type: "Incoming",
                            reason: transferReason.length != 0 ? transferReason : 'None given',
                            resultingBalance: receiverResultingBalance
                        }
                        
                    );
                    setValues();
                    setNewGovernmentTransferPopupOpen(false);
                    }
                    
                )
            }
        );
        }
    }

    function generateTransferID(){
        var transferID = 'MT-'
        for(var i = 0; i < 5; i++){
            transferID = transferID + String(Math.floor(Math.random()*10));
        }
        return(transferID);
    }

    function isTransferAmountValid(){
        return selectedCitizen != undefined && String(transferAmount).length != 0 && !String(transferAmount).startsWith('-') 
                && (Number(governmentFunds) - Number(transferAmount) >= 0) && transferAmount != 0;
    }

    return(
        <div className='w-full justify-center '>
            <div className='pb-4'>
            <div className='p-5 bg-blue-200 rounded shadow'>
                <div className=''>
                <div className='w-full pb-2'>
                <p className='text-sm font-bold'>TO</p>
                <div className='bg-white shadow p-1'>
                    <p>{selectedCitizen.name}</p>
                    <p>{selectedCitizen.citizenID}</p>
                </div>
                </div>
                <div className='w-full pb-2'>
                <p className='text-sm font-bold'>AMOUNT</p>
                <div className='flex w-full justify-center'>
                <input type='Number' placeholder='' min={0} max={governmentFunds} defaultValue={transferAmount} onChange={event => {setTransferAmount(Number(event.target.value))}} className='appearance-textfield flex justify-center w-full focus:outline-none border-2 border-gray-500 focus:border-gray-700 focus:ring-1 focus:ring-gray-700 p-1'></input>
                <p className='font-semibold pl-1 text-xl'>[M]</p>
                </div>
                </div>
                </div>
                <div className='pb-2'>
                <p className='text-sm font-bold'>REASON</p>
                <div className='flex justify-center'>
                <textarea placeholder='' onChange={event => {setTransferReason(event.target.value)}} className='w-full bg-white h-20 flex justify-center resize-none focus:outline-none border-2 border-gray-500 focus:border-gray-700 focus:ring-1 focus:ring-gray-700 p-2'></textarea>
                </div>
                </div>
                {isTransferAmountValid() &&
                <div className='pb-2'>
                    
                    <p className='text-sm font-bold'>RESULTING BALANCE</p>
                    
                    <p className='p-1 font-semibold shadow bg-white '>{Number(governmentFunds) - Number(transferAmount)} {'[M]'}</p>
                </div>}
            </div>
            </div>
            <button className={classNames(
                isTransferAmountValid()
                ? 'text-black bg-yellow-300 hover:bg-yellow-400' : 'text-gray-400 bg-yellow-100',
                'w-1/3 rounded py-1 px-2 font-semibold shadow')}
                onClick={onClickSendTransfer}
            >
                <div className='flex justify-center'>
                <ArrowCircleUpIcon className='h-6 w-6'/>
                SEND
                </div>
                </button>
                
        </div>
    )
}

export default React.memo(NewGovernmentTransferPopupBody)