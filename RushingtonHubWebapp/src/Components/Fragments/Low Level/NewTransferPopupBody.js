import CitizenUserDropboxMenu from './CitizenUserDropboxMenu'
import React, {useEffect, useState} from 'react'
import { ArrowCircleUpIcon } from '@heroicons/react/outline';

const NewTransferPopupBody = ({database, user, setMeldas, meldas, getTime, getDate, getYear, setTransfers, setNewTransferPopupOpen}) => {
    const [citizens, setCitizens] = useState([]);
    const [filteredCitizens, setFilteredCitizens] = useState([]);
    const [selectedCitizen, setSelectedCitizen] = useState();
    const [transferAmount, setTransferAmount] = useState(0);
    const [transferReason, setTransferReason] = useState('');
    const [salesTaxRate, setSalesTaxRate] = useState(0);
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
        database.ref('/government/salesTaxRate').get().then(salesTaxRateSnapshot => {
            setSalesTaxRate(salesTaxRateSnapshot.val());
        })
    })}

    function onClickSendTransfer(){
        var receiverResultingBalance = 0;
        var senderResultingBalance = 0;
        if(isTransferAmountValid()){
        database.ref(`/citizens/${selectedCitizen.citizenID}/meldas`).get().then(
            meldasSnapshot => {
                const amountTaxed = Math.round(Number(transferAmount) * salesTaxRate);
                receiverResultingBalance = (Number(meldasSnapshot.val()) + Number(transferAmount)) - amountTaxed;
                database.ref(`/citizens/${selectedCitizen.citizenID}/meldas`).set(receiverResultingBalance);
                database.ref(`/citizens/${user.citizenID}/meldas`).get().then(
                    meldasSnapshot => {
                        senderResultingBalance = Number(meldasSnapshot.val()) - Number(transferAmount)
                        database.ref(`/citizens/${user.citizenID}/meldas`).set(senderResultingBalance);
                        user.meldas = senderResultingBalance;
                        const transferID = generateTransferID();
                        database.ref(`/citizens/${user.citizenID}/transfers/${transferID}`).set(
                        {
                            transferID: transferID,
                            date: `${getDate()}, ${getYear()}`,
                            time: getTime(),
                            ssre: Math.round(((new Date()).getTime()/1000)-rushingtonEpoch),
                            amount: transferAmount,
                            receiverID: selectedCitizen.citizenID,
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
                            amount: transferAmount - amountTaxed,
                            senderID: user.citizenID,
                            senderName: user.name,
                            type: "Incoming",
                            reason: transferReason.length != 0 ? transferReason : 'None given',
                            resultingBalance: receiverResultingBalance
                        }
                        
                    );
                    if(amountTaxed > 0){
                    const taxTransferID = generateTransferID();
                    database.ref('/government').get().then(governmentSnapshot => {
                        var governmentFunds = governmentSnapshot.val().meldas;
                        const newGovernmentFunds = governmentFunds + amountTaxed;
                        database.ref('/government/meldas').set(newGovernmentFunds);
                        database.ref(`/government/transfers/${taxTransferID}`).set(
                            {
                                transferID: taxTransferID,
                                date: `${getDate()}, ${getYear()}`,
                                time: getTime(),
                                ssre: Math.round(((new Date()).getTime()/1000)-rushingtonEpoch),
                                amount: amountTaxed,
                                senderID: user.citizenID,
                                senderName: user.name,
                                type: "Incoming",
                                reason: `${salesTaxRate * 100}% tax of ${transferID}`,
                                resultingBalance: newGovernmentFunds
                            }
                        )
                    })
                }
                    database.ref(`/citizens/${user.citizenID}/transfers`).get().then(
                        transfersSnapshot => {
                            console.log("Transfers", transfersSnapshot.val())
                            user.transfers = Object.values(transfersSnapshot.val()).sort((transfer1, transfer2) => {
                                return transfer2.ssre - transfer1.ssre
                            });
                            localStorage.setItem('user', JSON.stringify(user));
                            setNewTransferPopupOpen(false);
                        }
                    )
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
                && (Number(user.meldas) - Number(transferAmount) >= 0) && transferAmount != 0;
    }

    return(
        <div className='w-full justify-center '>
            <div className='pb-4'>
            <div className='p-5 bg-blue-200 rounded shadow'>
                <div className=''>
                <div className='w-full pb-2'>
                <p className='text-sm font-bold'>TO</p>
                <CitizenUserDropboxMenu
                    filteredCitizens={filteredCitizens}
                    setFilteredCitizens={setFilteredCitizens}
                    citizens={citizens}
                    selectedCitizen={selectedCitizen}
                    setSelectedCitizen={setSelectedCitizen}
                    className='pb-2'
                    user={user}
                />
                </div>
                <div className='w-full pb-2'>
                <p className='text-sm font-bold'>AMOUNT</p>
                <div className='flex w-full justify-center'>
                <input type='Number' placeholder='' min={0} max={user.meldas} defaultValue={transferAmount} onChange={event => {setTransferAmount(Number(event.target.value))}} className='rounded appearance-textfield flex justify-center w-full focus:outline-none border-2 border-gray-500 focus:border-gray-700 focus:ring-1 focus:ring-gray-700 p-1'></input>
                <p className='font-semibold pl-1 text-xl'>[M]</p>
                </div>
                </div>
                </div>
                <div className='pb-2'>
                <p className='text-sm font-bold'>REASON</p>
                <div className='flex justify-center'>
                <textarea placeholder='' onChange={event => {setTransferReason(event.target.value)}} className='rounded w-full bg-white h-20 flex justify-center resize-none focus:outline-none border-2 border-gray-500 focus:border-gray-700 focus:ring-1 focus:ring-gray-700 p-2'></textarea>
                </div>
                </div>
                {isTransferAmountValid() &&
                <div>
                <div className='pb-2'>
                    
                    <p className='text-sm font-bold'>RESULTING BALANCE</p>
                    
                    <p className='p-1 font-semibold shadow bg-white '>{Number(user.meldas) - Number(transferAmount)} {'[M]'}</p>
                </div>
                <div className='pb-2'>
                    
                <p className='text-sm font-bold'>AMOUNT TAXED</p>
                
                <p className='p-1 font-semibold shadow bg-white '>{Math.round(Number(transferAmount) * Number(salesTaxRate))} [M]</p>
            </div>
            </div>
                }
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

export default React.memo(NewTransferPopupBody)