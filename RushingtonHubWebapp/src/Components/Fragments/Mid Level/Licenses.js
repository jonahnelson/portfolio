import { useState, useEffect } from "react";
import { CheckCircleIcon } from "@heroicons/react/outline";

const Licenses = ({user, setUser, database, getDate, getYear, getTime}) => {

    const rushingtonEpoch = 1522648800;

    const [licenses, setLicenses] = useState([]);

    useEffect(setValues, []);

    function setValues(){
        database.ref('/licenses').get().then(licensesSnapshot => {
            if(licensesSnapshot.val() != undefined){
                setLicenses(Object.values(licensesSnapshot.val()));
            }
        });
        database.ref(`/citizens/${user.citizenID}`).get().then(userSnapshot => {
            console.log('user retrieved', userSnapshot.val());
            if(userSnapshot.val() != undefined){
                setUser(userSnapshot.val());
            }
        })
    }

    function onClickBuyLicense(license){
        const addedLicense = JSON.parse(JSON.stringify(license));
        addedLicense.datePurchased = `${getDate()}, ${getYear()}`
        if(Number(user.meldas) >= Number(license.price)){
            database.ref(`/citizens/${user.citizenID}/licenses/${license.licenseID}`).set(addedLicense);
            database.ref(`/licenses/${license.licenseID}/owners/${user.citizenID}`).set({
                citizenID: user.citizenID,
                datePurchased: `${getDate()}, ${getYear()}`,
            })
            const userResultingBalance = Number(user.meldas) - Number(license.price);
            const transferID = generateID('MT');
            database.ref(`/government/meldas`).get().then(meldasSnapshot => {
                const governmentMeldas = Number(meldasSnapshot.val());
                const governmentResultingBalance = Number(governmentMeldas) + Number(license.price);
                database.ref('/government/meldas').set(governmentResultingBalance);
                database.ref(`/citizens/${user.citizenID}/meldas`).set(Number(userResultingBalance));
            database.ref(`/citizens/${user.citizenID}/transfers/${transferID}`).set(
                {
                    transferID: transferID,
                    date: `${getDate()}, ${getYear()}`,
                    time: getTime(),
                    ssre: Math.round(((new Date()).getTime()/1000)-rushingtonEpoch),
                    amount: Number(license.price),
                    receiverName: 'Rushington Government',
                    type: "Outgoing",
                    reason: `Purchased ${license.title} ${license.licenseID}`,
                    resultingBalance: userResultingBalance
                }
            );
            database.ref(`/government/transfers/${transferID}`).set(
                {
                    transferID: transferID,
                    date: `${getDate()}, ${getYear()}`,
                    time: getTime(),
                    ssre: Math.round(((new Date()).getTime()/1000)-rushingtonEpoch),
                    amount: Number(license.price),
                    senderName: user.name,
                    senderCitizenID: user.citizenID,
                    type: "Incoming",
                    reason: `Purchased ${license.title} ${license.licenseID}`,
                    resultingBalance: governmentResultingBalance
                }
            );
            setValues();
            }
            )
        }
    }

    function generateID(prefix){
        var id = `${prefix}-`;
        for(var i = 0; i < 5; i++){
            id = id + String(Math.floor(Math.random()*10));
        }
        return(id);
    }

    function userOwnsLicense(license){
        userOwnsLicense = false;
        if(user.licenses != undefined){
            Object.values(user.licenses).forEach(userLicense => {
                if(userLicense.licenseID == license.licenseID){
                    userOwnsLicense = true;
                }
            });
            return userOwnsLicense;
        } else {
            return false;
        }
    }

    function classNames(...classes) {
        return classes.filter(Boolean).join(" ");
    }

    return(
        <div className='mx-1 lg:mx-10 my-1 lg:my-5'>
            <div className='py-2 w-full flow-root'>
                <p className='float-left text-4xl font-bold'>Licenses</p>
                <div className='float-right'>
                <p className='font-semibold text-right text-xl'>Current Balance</p>
                <p className='text-right text-xl font-bold'>{user.meldas} [M]</p>
                </div>
            </div>
            <div className='px-2 py-1 lg:px-6 lg:py-3 rounded bg-gray-100'>
                {licenses.map(license => {
                    return(
                        <div className='lg:py-3 py-1'>
                            <License license={license}/>
                        </div>
                    )
                })}
            </div>
        </div>
    )

    function License({license}){
        return(
            <div className='border-2 border-gray-500 bg-white shadow p-2'>
                <div className='flow-root'>
                    <div className='float-left'>
                        <p className='text-lg font-semibold'>{license.title}</p>
                        <p className='font-semibold text-gray-700'>{license.licenseID}</p>
                    </div>
                    <p className='float-right font-bold text-xl'>{license.price} [M]</p>
                </div>
                <div className='lg:flow-root'>
                    <p className='pt-2 pr-2 font-semibold lg:float-left'>{license.permissions}</p>
                    {user.licenses != undefined && Object.keys(user.licenses).includes(license.licenseID) ?
                    <div className='flex lg:float-right'>
                        <CheckCircleIcon className='w-7 h-7'/>
                    <p className='lg:float-right font-bold px-1 text-lg'>Purchased {(user.licenses[license.licenseID]).datePurchased}</p>
                    </div>
                    :
                    <button className={classNames(
                        Number(user.meldas) < Number(license.price) ? 'bg-yellow-200 text-gray-400' : 'bg-yellow-300 hover:bg-yellow-400',
                        'font-semibold shadow rounded p-2 lg:float-right w-full mt-2 lg:mt-0 lg:w-52 text-lg')}
                        onClick={()=>{onClickBuyLicense(license)}}
                    >
                        {user.meldas < license.price ? "CAN'T AFFORD THIS" : 'BUY'}
                    </button>
                    }
                    
                </div>
            </div>
        )
    }
}

export default Licenses;