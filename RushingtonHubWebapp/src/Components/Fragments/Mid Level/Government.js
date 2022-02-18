import { useEffect, useState } from "react";
import { PlusCircleIcon, PencilIcon, ArrowCircleUpIcon, ArrowCircleDownIcon, UserAddIcon, CreditCardIcon, CheckCircleIcon } from "@heroicons/react/outline";
import Popup from "../Low Level/Popup";
import NewChargePopupBody from "../Low Level/NewChargePopupBody";
import AddPropertyPopupBody from "../Low Level/AddPropertyPopupBody";
import AddCitizenPopupBody from "../Low Level/AddCitizenPopupBody";
import AddBusinessPopupBody from "../Low Level/AddBusinessPopupBody"
import CitizenGovernmentDropboxMenu from "../Low Level/CitizenGovernmentDropboxMenu";
import PropertyDropboxMenu from "../Low Level/PropertyDropboxMenu";
import NewGovernmentTransferPopupBody from "../Low Level/NewGovernmentTransferPopupBody";

const Government = ({database, getTime, getDate, getYear, user, setUser}) => {
    const [selectedSection, setSelectedSection] = useState('Citizens');
    const [citizens, setCitizens] = useState(localStorage.getItem('citizens') ? JSON.parse(localStorage.getItem('citizens')) : []);
    const [announcementText, setAnnouncementText] = useState('');
    const [filteredCitizens, setFilteredCitizens] = useState(localStorage.getItem('filteredCitizens') ? JSON.parse(localStorage.getItem('filteredCitizens')) : []);
    const [filteredDropboxCitizens, setFilteredDropboxCitizens] = useState(localStorage.getItem('filteredCitizens') ? JSON.parse(localStorage.getItem('filteredCitizens')) : []);
    const [announcements, setAnnouncements] = useState([]);
    const [searchCitizensInput, setSearchCitizensInput] = useState('');
    const [searchPropertiesInput, setSearchPropertiesInput] = useState('');
    const [businesses, setBusinesses] = useState([])
    const [governmentFunds, setGovernmentFunds] = useState(0);
    const [licenseTitle, setLicenseTitle] = useState('');
    const [licensePermissions, setLicensePermissions] = useState('');
    const [licensePrice, setLicensePrice] = useState(0);
    const [licenses, setLicenses] = useState([]);
    const [selectedDropdownProperty, setSelectedDropdownProperty] = useState();
    const [filteredProperties, setFilteredProperties] = useState([]);
    const [selectedCitizen, setSelectedCitizen] = useState(localStorage.getItem('selectedCitizen') ? JSON.parse(localStorage.getItem('selectedCitizen')) : undefined);
    const [interestRate, setInterestRate] = useState(0);
    const [taxRate, setTaxRate] = useState(0);
    const [salesTaxRate, setSalesTaxRate] = useState(0);
    const [selectedProperty, setSelectedProperty] = useState(localStorage.getItem('selectedProperty') ? JSON.parse(localStorage.getItem('selectedProperty')) : undefined);
    const [selectedNewPropertyOwner, setSelectedNewPropertyOwner] = useState();
    const [grantedMeldas, setGrantedMeldas] = useState(0);
    const [governmentGrantedMeldas, setGovernmentGrantedMeldas] = useState(0);
    const [governmentTransfers, setGovernmentTransfers] = useState([]);
    const [newChargePopupOpen, setNewChargePopupOpen] = useState(false);
    const [addChangeBusinessPopupOpen, setAddChangeBusinessPopupOpen] = useState(false);
    const [selectedPropertiesSection, setSelectedPropertiesSection] = useState('All');
    const [addPropertyPopupOpen, setAddPropertyPopupOpen] = useState(false);
    const [newGovernmentTransferPopupBodyOpen, setNewGovernmentTransferPopupOpen] = useState(false);
    const [addCitizenPopupOpen, setAddCitizenPopupOpen] = useState(false);
    const [properties, setProperties] = useState([]);
    const rushingtonEpoch = 1522648800;

    useEffect(setValues, []);
    const navigationSections = [
        {sectionName: 'Citizens', sectionSelected: selectedSection == 'Citizens'},
        {sectionName: 'Bank', sectionSelected: selectedSection == 'Bank'},
        {sectionName: 'Properties', sectionSelected: selectedSection == 'Properties'},
        {sectionName: 'Licenses', sectionSelected: selectedSection == 'Licenses'},
        {sectionName: 'Announcements', sectionSelected: selectedSection == 'Announcements'}
    ]

    function setValues(){
        database.ref('/citizens').get().then(
            citizensSnapshot => {
                setCitizens(Object.values(citizensSnapshot.val()).sort((citizen1, citizen2) => {
                    return citizen1.name.localeCompare(citizen2.name);
                }));
                setFilteredDropboxCitizens(Object.values(citizensSnapshot.val()).sort((citizen1, citizen2) => {
                    return citizen1.name.localeCompare(citizen2.name);
                }));
                setFilteredCitizens(Object.values(citizensSnapshot.val()).sort((citizen1, citizen2) => {
                    return citizen1.name.localeCompare(citizen2.name);
                }).filter(citizen => {
                      return citizen.name.toUpperCase().includes(searchCitizensInput.toUpperCase());
                    }));
                setSelectedCitizen(selectedCitizen != undefined ? citizensSnapshot.val()[selectedCitizen.citizenID] : undefined);
                if(selectedCitizen != undefined){
                    setSelectedCitizen(citizensSnapshot.val()[selectedCitizen.citizenID]);
                    localStorage.setItem('selectedCitizen', JSON.stringify(citizensSnapshot.val()[selectedCitizen.citizenID]));
                    if(user.citizenID == selectedCitizen.citizenID){
                        setUser(citizensSnapshot.val()[user.citizenID]);
                        localStorage.setItem('user', JSON.stringify(citizensSnapshot.val()[user.citizenID]))
                    }
                }
                localStorage.setItem('citizens', JSON.stringify(Object.values(citizensSnapshot.val()).sort((citizen1, citizen2) => {
                    return citizen1.name.localeCompare(citizen2.name);
                })));
                localStorage.setItem('filteredCitizens', JSON.stringify(Object.values(citizensSnapshot.val()).sort((citizen1, citizen2) => {
                    return citizen1.name.localeCompare(citizen2.name);
                })));
            }
        );
        database.ref('/properties').get().then(
            propertiesSnapshot => {
                console.log('properties', propertiesSnapshot)
                if(propertiesSnapshot.val() != undefined){
                    setProperties(Object.values(propertiesSnapshot.val()).sort((property1, property2) => {
                        return property1.address.localeCompare(property2.address);
                    }));
                    setFilteredProperties(Object.values(propertiesSnapshot.val()).sort((property1, property2) => {
                        return property1.address.localeCompare(property2.address);
                    }));
                    console.log(selectedProperty != undefined ? selectedProperty.propertyID : 'undfee')
                    setSelectedProperty(selectedProperty != undefined ? propertiesSnapshot.val()[selectedProperty.propertyID] : undefined)                
                }
            }
        );
        database.ref('/announcements').get().then(
            announcementsSnapshot => {
                if(announcementsSnapshot.val() != undefined){setAnnouncements(Object.values(announcementsSnapshot.val()).sort(
                    (announcement1, announcement2) => {
                        return announcement2.ssre - announcement1.ssre;
                    }
                ));}
            }
        );
        database.ref('/government').get().then(
            governmentSnapshot => {
                console.log('gover funds', governmentSnapshot.val().meldas)
                setGovernmentFunds(Number(governmentSnapshot.val().meldas));
                setSalesTaxRate(Number(governmentSnapshot.val().salesTaxRate) * 100);
                setGovernmentTransfers(Object.values(governmentSnapshot.val().transfers).sort((transfer1, transfer2) => {
                    return transfer2.ssre - transfer1.ssre;
                }));
            }
        );
        database.ref('/licenses').get().then(
            licensesSnapshot => {
                if(licensesSnapshot.val() != undefined){
                    setLicenses(Object.values(licensesSnapshot.val()));
                }
            }
        );
        database.ref('/businesses').get().then(
            businessesSnapshot => {
                if(businessesSnapshot.val() != undefined){
                    setBusinesses(Object.values(businessesSnapshot.val()));
                }
            }
        )
    }

    function onClickGrantMeldasButton(){
        database.ref(`/citizens/${selectedCitizen.citizenID}/meldas`).get().then(
            meldasSnapshot => {
                const resultingBalance = Number(meldasSnapshot.val()) + Number(grantedMeldas);
                
                database.ref(`/citizens/${selectedCitizen.citizenID}/meldas`).set(
                    resultingBalance
                );
                var editedSelectedCitizen = JSON.stringify(selectedCitizen);
                editedSelectedCitizen = JSON.parse(editedSelectedCitizen);
                editedSelectedCitizen.meldas = resultingBalance;
                
                const transferID = generateID('MT');
                const newTransfer = grantedMeldas >= 0 ? {
                    transferID: transferID,
                    date: `${getDate()}, ${getYear()}`,
                    time: getTime(),
                    ssre: Math.round(((new Date()).getTime()/1000)-rushingtonEpoch),
                    amount: grantedMeldas,
                    senderCitizenID: 'CI-78614',
                    senderName: 'Rushington Bank',
                    type: "Incoming",
                    reason: 'Deposit',
                    resultingBalance: resultingBalance
                } :
                {
                    transferID: transferID,
                    date: `${getDate()}, ${getYear()}`,
                    time: getTime(),
                    ssre: Math.round(((new Date()).getTime()/1000)-rushingtonEpoch),
                    amount: Math.abs(grantedMeldas),
                    receiverName: 'Real Currency',
                    receiverCitizenID: selectedCitizen.citizenID,
                    type: "Outgoing",
                    reason: 'Withdrawal',
                    resultingBalance: resultingBalance
                }
                database.ref(`/citizens/${selectedCitizen.citizenID}/transfers/${transferID}`).set(newTransfer);
                editedSelectedCitizen.transfers = editedSelectedCitizen.transfers != undefined ? [...Object.values(editedSelectedCitizen.transfers), newTransfer] :
                    [newTransfer];
                console.log("Transfers", Object.values(editedSelectedCitizen.transfers));
                setValues();
                if(editedSelectedCitizen.citizenID == user.citizenID){
                    setUser(editedSelectedCitizen);
                    localStorage.setItem('user', JSON.stringify(editedSelectedCitizen));
                }
                setSelectedCitizen(editedSelectedCitizen);
            }
        )
    }

    function onClickGrantGovernmentMeldas(){
        database.ref('/government/meldas').set(Number(governmentFunds) + Number(governmentGrantedMeldas));
        const transferID = generateID('MT');
        const newTransfer = governmentGrantedMeldas >= 0 ? {
            transferID: transferID,
            date: `${getDate()}, ${getYear()}`,
            time: getTime(),
            ssre: Math.round(((new Date()).getTime()/1000)-rushingtonEpoch),
            amount: Number(governmentGrantedMeldas),
            senderCitizenID: 'CI-78614',
            senderName: 'Rushington Bank',
            type: "Incoming",
            reason: 'Deposit',
            resultingBalance: Number(governmentFunds) + Number(governmentGrantedMeldas)
        } :
        {
            transferID: transferID,
            date: `${getDate()}, ${getYear()}`,
            time: getTime(),
            ssre: Math.round(((new Date()).getTime()/1000)-rushingtonEpoch),
            amount: Math.abs(governmentGrantedMeldas),
            receiverName: 'Real Currency',
            type: "Outgoing",
            reason: 'Withdrawal',
            resultingBalance: Number(governmentFunds) + Number(governmentGrantedMeldas)
        }
        database.ref(`/government/transfers/${transferID}`).set(newTransfer);
        setGovernmentGrantedMeldas(0);
        setValues();
    }

    function onClickGrantProperty(){
        console.log(selectedDropdownProperty)
        if(selectedDropdownProperty.owner != undefined){
            console.log(selectedDropdownProperty.propertyID)
            database.ref(`/citizens/${selectedDropdownProperty.owner.citizenID}/properties/${selectedDropdownProperty.propertyID}`).set(null);

        };
        var editedSelectedProperty = JSON.stringify(selectedDropdownProperty);
        editedSelectedProperty = JSON.parse(editedSelectedProperty);
        editedSelectedProperty.owner = {
                name: selectedCitizen.name,
                citizenID: selectedCitizen.citizenID,
                dateAdded: `${getDate()}, ${getYear()}`
        }
        console.log('edited sp', editedSelectedProperty)
        database.ref(`/properties/${selectedDropdownProperty.propertyID}/owner`).set(
            {
                name: selectedCitizen.name,
                citizenID: selectedCitizen.citizenID,
                dateAdded: `${getDate()}, ${getYear()}`
            }
        );
        
        database.ref(`/citizens/${selectedCitizen.citizenID}/properties/${selectedDropdownProperty.propertyID}`).set(
            editedSelectedProperty
        );
        setValues();
        /* setSelectedDropdownProperty(editedSelectedProperty);
        var editedSelectedCitizen = JSON.parse(JSON.stringify(selectedCitizen));
        const editedPropertyID = selectedDropdownProperty.propertyID;
        if(editedSelectedCitizen.properties == undefined){
            //console.log(JSON.stringify(properties))
            //console.log(`{"${editedPropertyID}": ${JSON.stringify(editedSelectedProperty)}}`);
            editedSelectedCitizen.properties = JSON.parse(`{"${editedPropertyID}": ${JSON.stringify(editedSelectedProperty)}}`);
        } else {
            console.log('edited prop id', editedSelectedCitizen.properties)
            editedSelectedCitizen.properties[editedPropertyID] = editedSelectedProperty;
        }
        setSelectedCitizen(editedSelectedCitizen);
        if(selectedProperty != undefined && selectedProperty.propertyID == selectedDropdownProperty.propertyID){
            setSelectedProperty(editedSelectedProperty);
            
        } */
    }

    function onClickPostAnnouncement(){
        const announcementID = generateID('GA');
        database.ref(`/announcements/${announcementID}`).set(
            {
                announcementID: announcementID,
                text: announcementText,
                datePosted: `${getDate()}, ${getYear()}`,
                timePosted: getTime(),
                ssre: Math.round(((new Date()).getTime()/1000)-rushingtonEpoch)
            }
        );
        setValues();
    }

    function onClickPayAsGovernmentButton(){
        setNewGovernmentTransferPopupOpen(true);
    }

    function onClickAddLicense(){
        const licenseID = generateID('LI');
        database.ref(`/licenses/${licenseID}`).set(
            {
                licenseID: licenseID,
                title: licenseTitle,
                permissions: licensePermissions,
                price: Number(licensePrice),
                dateAdded: `${getDate()}, ${getYear()}`
            }
        );
        setValues();
    }

    function onClickGrantInterest(){
        const editedCitizens = [...citizens];
        const newCitizensObject = {};
        var totalMeldasGranted = 0;
        editedCitizens.forEach(citizen => {
            const meldasGranted = Math.round(Number(citizen.meldas) * (0.01 * interestRate));
            if(meldasGranted != 0){
            citizen.meldas = Number(citizen.meldas) + Number(meldasGranted);
            totalMeldasGranted = totalMeldasGranted + meldasGranted;
            const transferID = generateID('MT');
            if(citizen.transfers == undefined)citizen.transfers = {}
            citizen.transfers[transferID] = {
                transferID: transferID,
                date: `${getDate()}, ${getYear()}`,
                time: getTime(),
                ssre: Math.round(((new Date()).getTime()/1000)-rushingtonEpoch),
                amount: meldasGranted,
                senderCitizenID: 'CI-78614',
                senderName: 'Rushington Bank',
                type: "Incoming",
                reason: `Accrued ${interestRate}% Interest`,
                resultingBalance: citizen.meldas
            }}
            newCitizensObject[citizen.citizenID] = citizen;
        });
        const transferID = generateID('MT');
        database.ref(`/government/transfers/${transferID}`).set(
            {
                transferID: transferID,
                date: `${getDate()}, ${getYear()}`,
                time: getTime(),
                ssre: Math.round(((new Date()).getTime()/1000)-rushingtonEpoch),
                amount: totalMeldasGranted,
                receiverName: 'All Citizens',
                type: "Outgoing",
                reason: `Accrued ${interestRate}% Interest`,
                resultingBalance: governmentFunds - Number(totalMeldasGranted)
            }
        )
        //console.log('edited citizens', editedCitizens);
        database.ref('/citizens').set(newCitizensObject);
        database.ref('/government/meldas').set(governmentFunds - Number(totalMeldasGranted));
        setInterestRate(0);
        setValues();
    }

    
    function onClickPullTaxes(){
        const editedCitizens = [...citizens];
        const newCitizensObject = {};
        var totalTaxRevenue = 0;
        editedCitizens.forEach(citizen => {
            const tax = Math.round(Number(citizen.meldas) * (0.01 * taxRate));
            if(tax != 0){
            citizen.meldas = Number(citizen.meldas) - Number(tax);
            totalTaxRevenue = totalTaxRevenue + tax;
            const transferID = generateID('MT');
            if(citizen.transfers == undefined)citizen.transfers = {}
            citizen.transfers[transferID] = {
                transferID: transferID,
                date: `${getDate()}, ${getYear()}`,
                time: getTime(),
                ssre: Math.round(((new Date()).getTime()/1000)-rushingtonEpoch),
                amount: tax,
                receiverCitizenID: 'CI-78614',
                receiverName: 'Rushington Government',
                type: "Outgoing",
                reason: `${taxRate}% Tax`,
                resultingBalance: citizen.meldas
            }}
            newCitizensObject[citizen.citizenID] = citizen;
        });
        const transferID = generateID('MT');
        database.ref(`/government/transfers/${transferID}`).set(
            {
                transferID: transferID,
                date: `${getDate()}, ${getYear()}`,
                time: getTime(),
                ssre: Math.round(((new Date()).getTime()/1000)-rushingtonEpoch),
                amount: totalTaxRevenue,
                senderName: 'All Citizens',
                type: "Incoming",
                reason: `${taxRate}% Tax`,
                resultingBalance: governmentFunds - Number(totalTaxRevenue)
            }
        )
        //console.log('edited citizens', editedCitizens);
        database.ref('/citizens').set(newCitizensObject);
        database.ref('/government/meldas').set(governmentFunds + Number(totalTaxRevenue));
        setTaxRate(0);
        setValues();
    }

    function getTotalMeldasInBank(){
        var totalMeldasInBank = 0;
        citizens.forEach(citizen => {
            totalMeldasInBank = totalMeldasInBank + Number(citizen.meldas);
        });
        businesses.forEach(business => {
            totalMeldasInBank = totalMeldasInBank + Number(business.meldas);
        });
        return totalMeldasInBank + governmentFunds;
    }

    function getResultingInterestPayout(){
        const editedCitizens = [...citizens];
        var totalMeldasGranted = 0;
        editedCitizens.forEach(citizen => {
            const meldasGranted = Math.round(Number(citizen.meldas) * (0.01 * interestRate));
            totalMeldasGranted = totalMeldasGranted + meldasGranted;
        });
        return totalMeldasGranted;
    }

    function getResultingTaxRevenue(){
        const editedCitizens = [...citizens];
        var totalTaxRevenue = 0;
        editedCitizens.forEach(citizen => {
            const tax = Math.round(Number(citizen.meldas) * (0.01 * taxRate));
            totalTaxRevenue = totalTaxRevenue + tax;
        });
        return totalTaxRevenue;
    }
    function onClickAddChargeButton(){
        /* database.ref(`/Users/${selectedCitizen["Citizen ID"]}/Charges`).get().then(
            chargesSnapshot => {
                var editedSelectedCitizen = JSON.stringify(selectedCitizen);
                editedSelectedCitizen = JSON.parse(editedSelectedCitizen);
                const chargeID = generateID('CC');
                const newCharge = {
                    "Transfer ID": transferID,
                    "Date": `${getDate()}, ${getYear()}`,
                    "Time": getTime(),
                    "SSRE": Math.round(((new Date()).getTime()/1000)-rushingtonEpoch),
                    "Amount": grantedMeldas,
                    "Sender Citizen ID": 'CI-78614',
                    "Sender Name": 'Rushington Bank',
                    "Type": "Incoming",
                    "Reason": 'Deposit',
                    "Resulting Balance": resultingBalance
                }
                database.ref(`/Users/${selectedCitizen["Citizen ID"]}/Transfers/${transferID}`).set(newTransfer);
                editedSelectedCitizen.Transfers = editedSelectedCitizen.Transfers != undefined ? [...Object.values(editedSelectedCitizen.Transfers), newTransfer] :
                    [newTransfer];
                console.log("Transfers", Object.values(editedSelectedCitizen.Transfers));
                setSelectedCitizen(editedSelectedCitizen);
            }
        ) */
    }

    function onClickAddChangeOwnerButton(){
        if(selectedProperty.owner != undefined){
            database.ref(`/citizens/${selectedProperty.owner.citizenID}/properties/${selectedProperty.propertyID}`).set(null);
        }
        var editedSelectedProperty = JSON.stringify(selectedProperty);
        editedSelectedProperty = JSON.parse(editedSelectedProperty);
        editedSelectedProperty.owner = {
                name: selectedNewPropertyOwner.name,
                citizenID: selectedNewPropertyOwner.citizenID,
                dateAdded: `${getDate()}, ${getYear()}`
        }
        console.log('edited sp', editedSelectedProperty)
        database.ref(`/properties/${selectedProperty.propertyID}/owner`).set(
            {
                name: selectedNewPropertyOwner.name,
                citizenID: selectedNewPropertyOwner.citizenID,
                dateAdded: `${getDate()}, ${getYear()}`
            }
        );
        database.ref(`/citizens/${selectedNewPropertyOwner.citizenID}/properties/${selectedProperty.propertyID}`).set(
            editedSelectedProperty
        );
        //setSelectedProperty(editedSelectedProperty);
        setValues();
        /* if(selectedCitizen != undefined && selectedNewPropertyOwner.citizenID == selectedCitizen.citizenID){
            var editedSelectedCitizen = JSON.parse(JSON.stringify(selectedCitizen));
        const editedPropertyID = selectedProperty.propertyID;
        if(editedSelectedCitizen.properties == undefined){
            //console.log(JSON.stringify(properties))
            //console.log(`{"${editedPropertyID}": ${JSON.stringify(editedSelectedProperty)}}`);
            editedSelectedCitizen.properties = JSON.parse(`{"${editedPropertyID}": ${JSON.stringify(editedSelectedProperty)}}`);
        } else {
            console.log('edited prop id', editedSelectedCitizen.properties)
            editedSelectedCitizen.properties[editedPropertyID] = editedSelectedProperty;
        }
        setSelectedCitizen(editedSelectedCitizen);
        } */
    }
    function generateID(prefix){
        var id = `${prefix}-`;
        for(var i = 0; i < 5; i++){
            id = id + String(Math.floor(Math.random()*10));
        }
        return(id);
    }

    function findPropertyByID(id){
        for(var i = 0; i < properties.length; i++){
            if(properties[i].propertyID == id){
                return properties[i];
            }
        }
    }

    function findCitizenByID(id){
        for(var i = 0; i < citizens.length; i++){
            if(citizens[i].citizenID == id){
                return citizens[i];
            }
        }
    }
    
    function classNames(...classes) {
        return classes.filter(Boolean).join(" ");
      }
    return(
        <div>
            <div className='lg:grid lg:grid-cols-6 lg:gap-5'>
                <div className='lg:col-span-1 pb-4 lg:pb-0'>
                    <div>
                    {navigationSections.map(navigationSection => {
                        return(
                        <div>
                            
                        <button
                            onClick={()=>{setSelectedSection(navigationSection.sectionName)}}
                            className={classNames(navigationSection.sectionSelected ? 'bg-gray-200' : 'bg-white hover:bg-gray-100',
                                'rounded p-2 w-full text-center lg:text-left'
                            )}
                        >
                            <p className='text-gray-800 font-semibold'>{navigationSection.sectionName}</p></button>
                        </div>
                        )
                    })}
                    </div>
                </div>
                <div className='lg:col-span-5 bg-gray-100 rounded'>
                    {selectedSection == 'Citizens' &&
                        <div className='lg:grid lg:grid-cols-3'>
                            <div className='col-span-2 p-2'>
                                {selectedCitizen == undefined &&
                                    <p className='text-gray-500 p-5 font-semibold text-center lg:text-left'>NO CITIZEN SELECTED</p>
                                }
                                {selectedCitizen != undefined &&
                                    <div className='bg-white rounded'>
                                        <div className='p-2'>
                                            
                                            <div className='grid grid-cols-3 border-2 border-gray-400'>
                                            <div className='col-span-1 p-2'>
                                                <p className='font-semibold'>Name</p>
                                                <p>{selectedCitizen.name}</p>
                                            </div>
                                            <div className='col-span-1 p-2'>
                                                <p className='font-semibold'>Citizen ID</p>
                                                <p>{selectedCitizen.citizenID}</p>
                                            </div>
                                            <div className='col-span-1 p-2'>
                                                <p className='font-semibold'>Date Added</p>
                                                <p>{selectedCitizen.dateAdded}</p>
                                            </div>
                                            </div>
                                        </div>
                                        <div className='p-2'>
                                            <div className='grid grid-cols-2'>
                                            <div className='col-span-2 p-2'>
                                                
                                                <div className='bg-white'>
                                                    
                                                    <div className='w-full flow-root p-2 bg-gray-200'>
                                                    <p className='font-semibold float-left'>BANK</p>
                                                    <div className='float-right flex gap-1'>
                                                        
                                                        <input type='Number' onChange={event => {setGrantedMeldas(event.target.value)}} className='px-2 border-2 border-gray-700 w-20 focus:outline-none'></input>
                                                        
                                                        
                                                        <button 
                                                            onClick={onClickGrantMeldasButton}
                                                            className='bg-yellow-300 py-1 px-2 mr-2 flex text-sm hover:bg-yellow-400 font-semibold rounded shadow'>
                                                            <PlusCircleIcon className='w-5 h-5'/>{grantedMeldas < 0 ? 'WITHDRAW' : 'DEPOSIT'}</button>
                                                            <button 
                                                            onClick={onClickPayAsGovernmentButton}
                                                            className='bg-yellow-300 py-1 px-2 flex text-sm hover:bg-yellow-400 font-semibold rounded shadow'>
                                                            <PlusCircleIcon className='w-5 h-5'/>
                                                                <Popup
                                                                    header='New Government Transfer'
                                                                    open={newGovernmentTransferPopupBodyOpen}
                                                                    setOpen={setNewGovernmentTransferPopupOpen}
                                                                    inputs={[]}
                                                                    additionalComponent={()=>{return <NewGovernmentTransferPopupBody
                                                                        database={database} getTime={getTime} getDate={getDate} getYear={getYear} setNewGovernmentTransferPopupOpen={setNewGovernmentTransferPopupOpen} setValues={setValues} selectedCitizen={selectedCitizen} governmentFunds={governmentFunds}
                                                                    />}}
                                                                />
                                                            NEW TRANSFER</button>
                                                    </div>
                                                    </div>
                                                    <div className='flow-root p-2 border-2 border-gray-400'>
                                                        <p className='float-left font-semibold text-gray-700'>Balance</p>
                                                        <p className='float-right'>{selectedCitizen.meldas} [M]</p>
                                                    </div>
                                                    <div className='p-2 border-b-2 border-r-2 border-l-2 border-gray-400'>
                                                        <p className='font-semibold text-gray-700'>Transfers</p>
                                                        {selectedCitizen.transfers != undefined &&
                                                        <div className='max-h-96 overflow-y-scroll bg-gray-100'>
                                                            
                                                            
                                                            
                                                        {Object.values(selectedCitizen.transfers).sort((transfer1, transfer2)=>{
                                                            return(transfer2.ssre - transfer1.ssre);
                                                        }).map(transfer => {
                                                            return(
                                                                <div className='p-1'>
                                                                <Transfer transfer={transfer}/>
                                                                </div>
                                                            )
                                                        })}
                                                        
                                                        
                                                        </div>}
                                                        {selectedCitizen.transfers == undefined &&
                                                        <div className=''>None yet</div>
                                                        }
                                                    </div>
                                                </div>
                                                
                                            </div>
                                            <div className='col-span-2 p-2'>
                                                
                                                <div className='bg-white'>
                                                <div className='p-2 flow-root w-full bg-gray-200'>
                                                <p className='font-semibold float-left'>CRIMINAL CHARGES</p>
                                                        <button 
                                                            onClick={()=>{setNewChargePopupOpen(true)}}
                                                            className='bg-yellow-300 float-right flex py-1 px-2 hover:bg-yellow-400 text-sm font-semibold rounded shadow'>
                                                            <PlusCircleIcon className='w-5 h-5'/>ADD CHARGE</button>
                                                            <Popup
                                                                open={newChargePopupOpen}
                                                                setOpen={setNewChargePopupOpen}
                                                                header='New Charge'
                                                                onClickSave={()=>{}}
                                                                inputs={[]}
                                                                saveText={'Add'}
                                                                additionalComponent={()=>{return <NewChargePopupBody database={database} getTime={getTime} getDate={getDate} getYear={getYear} setNewChargePopupOpen={setNewChargePopupOpen} selectedCitizen={selectedCitizen} setSelectedCitizen={setSelectedCitizen} setValues={setValues}/>}}
                                                            />
                                                    </div>
                                                    <div className='flow-root p-2 border-2 border-gray-400'>
                                                        <p className='float-left font-semibold text-gray-700'>Total</p>
                                                        <p className='float-right'>{selectedCitizen.charges ? Object.values(selectedCitizen.charges).length : 0}</p>
                                                    </div>
                                                    <div className='p-2 border-b-2 border-r-2 border-l-2 border-gray-400'>
                                                        {selectedCitizen.charges != undefined &&
                                                        <div className='max-h-96 overflow-y-scroll bg-gray-100'>
                                                            
                                                            
                                                            
                                                        {Object.values(selectedCitizen.charges).sort((charge1, charge2)=>{
                                                            return(charge2.ssre - charge1.ssre);
                                                        }).map(charge => {
                                                            return(
                                                                <div className='p-1'>
                                                                <CriminalCharge charge={charge}/>
                                                                </div>
                                                            )
                                                        })}
                                                        
                                                        
                                                        </div>}
                                                        {selectedCitizen.charges == undefined &&
                                                        <div className=''>None yet</div>
                                                        }
                                                    </div>
                                                </div>
                                                
                                            
                                            </div>
                                            <div className='col-span-2 p-2'>
                                                
                                                <div className='bg-white'>
                                                <div className='p-2 flow-root w-full bg-gray-200'>
                                                <p className='font-semibold float-left'>PROPERTIES</p>
                                                        <div className='flex gap-2 float-right'>
                                                            <PropertyDropboxMenu
                                                                properties={properties}
                                                                user={user}
                                                                selectedProperty={selectedDropdownProperty}
                                                                setSelectedProperty={setSelectedDropdownProperty}
                                                                filteredProperties={filteredProperties}
                                                                setFilteredProperties={setFilteredProperties}
                                                            />
                                                        <button 
                                                            onClick={onClickGrantProperty}
                                                            className='bg-yellow-300 flex py-1 px-2 hover:bg-yellow-400 text-sm font-semibold rounded shadow'>
                                                            <PlusCircleIcon className='w-5 h-5'/>GRANT PROPERTY</button>

                                                        </div>
                                                        
                                                            {/* <Popup
                                                                open={newChargePopupOpen}
                                                                setOpen={setNewChargePopupOpen}
                                                                header='New Charge'
                                                                onClickSave={()=>{}}
                                                                inputs={[]}
                                                                saveText={'Add'}
                                                                additionalComponent={()=>{return <NewChargePopupBody database={database} getTime={getTime} getDate={getDate} getYear={getYear} setNewChargePopupOpen={setNewChargePopupOpen} selectedCitizen={selectedCitizen} setSelectedCitizen={setSelectedCitizen}/>}}
                                                            /> */}
                                                    </div>
                                                    <div className='flow-root p-2 border-2 border-gray-400'>
                                                        <p className='float-left font-semibold text-gray-700'>Total</p>
                                                        <p className='float-right'>{selectedCitizen.properties ? Object.values(selectedCitizen.properties).length : 0}</p>
                                                    </div>
                                                    <div className='p-2 border-b-2 border-r-2 border-l-2 border-gray-400'>
                                                        {selectedCitizen.properties != undefined &&
                                                        <div className='max-h-96 overflow-y-scroll bg-gray-100'>
                                                            
                                                            
                                                            <div className='py-1'>
                                                        {Object.values(selectedCitizen.properties).sort((property1, property2)=>{
                                                            return(property2.ssre - property1.ssre);
                                                        }).map(property => {
                                                            return(
                                                                <button className='w-full text-left group'
                                                                    onClick={()=>{
                                                                        setSelectedProperty(findPropertyByID(property.propertyID));
                                                                        setSelectedSection('Properties');
                                                                    }}
                                                                >
                                                                    <div className='px-1'>
                                                                <Property property={property}/>
                                                                </div>
                                                                </button>
                                                            )
                                                        })}
                                                        </div>
                                                        </div>}
                                                        
                                                        {selectedCitizen.properties == undefined &&
                                                        <div className=''>None yet</div>
                                                        }
                                                    </div>
                                                </div>
                                                
                                            </div>
                                            <div className='col-span-2 p-2'>
                                                
                                                <div className='bg-white'>
                                                <div className='w-full flow-root p-2 bg-gray-200'>
                                                    <p className='font-semibold float-left'>LICENSES</p>
                                                    
                                                    </div>
                                                    <div className='flow-root p-2 border-2 border-gray-400'>
                                                        <p className='float-left font-semibold text-gray-700'>Total</p>
                                                        <p className='float-right'>{selectedCitizen.licenses ? Object.values(selectedCitizen.licenses).length : 0}</p>
                                                    </div>
                                                    <div className='p-2 border-b-2 border-r-2 border-l-2 border-gray-400'>
                                                        {selectedCitizen.licenses != undefined &&
                                                        <div className='max-h-96 overflow-y-scroll bg-gray-100'>
                                                            
                                                            
                                                            
                                                        {Object.values(selectedCitizen.licenses).sort((license1, license2)=>{
                                                            return(license1.title.localeCompare(license2.title));
                                                        }).map(license => {
                                                            return(
                                                                <div className='text-left group m-2'
                                                                    onClick={()=>{
                                                                        /* setSelectedProperty(findPropertyByID(property.propertyID));
                                                                        setSelectedSection('Properties'); */
                                                                    }}
                                                                >
                                                                <LicenseUser license={license}/>
                                                                </div>
                                                            )
                                                        })}
                                                        
                                                        
                                                        </div>}
                                                        {selectedCitizen.licenses == undefined &&
                                                        <div className=''>None yet</div>
                                                        }
                                                    </div>
                                                </div>
                                                
                                            </div>
                                            </div>
                                        </div>
                                        

                                    </div>
                                }
                            </div>
                            <div className='col-span-1 p-2'>
                                <div className='bg-white rounded'>
                                    <div className='p-2'>
                                        <button className='w-full bg-yellow-300 hover:bg-yellow-400 font-semibold text-sm py-2 justify-center text-center rounded shadow flex'
                                            onClick={()=>{setAddCitizenPopupOpen(true)}}>
                                            <PlusCircleIcon className='w-5 h-5'/>ADD CITIZEN</button>
                                            <Popup
                                                open={addCitizenPopupOpen}
                                                setOpen={setAddCitizenPopupOpen}
                                                header='New Citizen'
                                                onClickSave={()=>{}}
                                                inputs={[]}
                                                saveText={'Add'}
                                                additionalComponent={()=>{return <AddCitizenPopupBody database={database} getTime={getTime} getDate={getDate} getYear={getYear} citizens={citizens} setCitizens={setCitizens} setAddCitizenPopupOpen={setAddCitizenPopupOpen}/>}}
                                            />
                                    </div>
                                    <div className='p-2'>
                                    <input placeholder='Search' value={searchCitizensInput} className='w-full border-2 border-gray-500 p-2 bg-gray-100 focus:ring-1 focus:ring-gray-700 focus:border-gray-700 focus:outline-none'
                                        onChange={event => {
                                            setSearchCitizensInput(event.target.value);
                                            setFilteredCitizens(citizens.filter(citizen => {
                                              console.log(filteredCitizens)
                                              return citizen.name.toUpperCase().includes(event.target.value.toUpperCase());
                                            }))
                                          }}
                                    ></input>
                                    </div>
                                    <div className=''>
                                {filteredCitizens.map(citizen => {
                                    return(
                                        <div className='p-2'>
                                            <button 
                                                onClick={()=>{setSelectedCitizen(citizen);
                                                    localStorage.setItem('selectedCitizen', JSON.stringify(citizen));
                                                }}
                                                className={classNames(selectedCitizen != undefined && selectedCitizen.citizenID == citizen.citizenID ? 'border-2 border-blue-400 shadow-lg bg-yellow-400' : ' bg-yellow-300', 'w-full shadow rounded hover:bg-yellow-400 p-2 text-sm font-semibold')}>
                                                    <div>{citizen.name.toUpperCase()}</div>
                                                    <div className='text-gray-700'>{citizen.citizenID.toUpperCase()}</div>
                                                    </button>
                                        </div>
                                    )
                                })}
                                </div>
                                </div>
                            </div>
                        </div>
                    }
                    {selectedSection == 'Bank' &&
                        <div className='p-4'>
                            <div className='p-3 grid grid-cols-2 bg-white rounded shadow'>
                                <div>
                                    <p className='text-2xl font-bold'>Bank Vault</p>
                                    <p className='text-3xl'>{getTotalMeldasInBank()} [M]</p>
                                </div>
                                <div>
                                    <div className='flex gap-2'>
                                    <p className='text-2xl font-bold'>Government Funds</p>
                                    <div className='float-right flex gap-1'>
                                                        <input type='Number' value={governmentGrantedMeldas} onChange={event => {setGovernmentGrantedMeldas(event.target.value)}} className='px-2 border-2 border-gray-700 w-20 focus:outline-none'></input>
                                                        <button 
                                                            onClick={onClickGrantGovernmentMeldas}
                                                            className='bg-yellow-300 py-1 px-2 mr-2 flex hover:bg-yellow-400 font-semibold rounded shadow'>
                                                            <PlusCircleIcon className='w-6 h-6'/>{governmentGrantedMeldas < 0 ? 'WITHDRAW' : 'DEPOSIT'}</button>
                                                    </div>
                                    </div>
                                    <p className='text-3xl'>{governmentFunds} [M]</p>
                                    
                                </div>
                                <div className='col-span-2 pt-4'>
                                    <p className='text-2xl font-bold'>Transfers</p>
                                    <div className='bg-gray-200 border-2 border-gray-500 p-2 max-h-56 min-h-12 overflow-y-scroll'>
                                        {governmentTransfers.map(transfer => {
                                            return(
                                                <div className='p-1'>
                                                    <Transfer transfer={transfer}/>
                                                </div>
                                            )
                                        })}
                                    </div>
                                </div>
                            </div>
                            <div className='p-3 my-4 bg-white shadow rounded'>
                            <p className='text-2xl font-bold'>Sales Tax</p>
                            <div className=''>
                                <div className='flex justify-center'>
                            <div className='gap-1'>
                                <p className='text-xl font-semibold'>Rate</p>
                                <div className='flex gap-1'>
                            <input
                                className='p-1 bg-white border-2 border-gray-500 focus:outline-none'
                                type='Number'
                                value={salesTaxRate}
                                onChange={event => {setSalesTaxRate(Number(event.target.value))}}
                            ></input>
                            <p className='text-xl font-semibold'>%</p>
                            </div>
                            </div>
                            </div>
                            <button 
                                className='mt-4 p-2 col-span-3 rounded shadow flex w-full justify-center font-semibold bg-yellow-300 hover:bg-yellow-400 text-lg'
                                onClick={() => {
                                    database.ref('/government/salesTaxRate').set(0.01 * salesTaxRate);
                                }}
                                >
                                    <CheckCircleIcon className='h-7 w-7'/>
                                    UPDATE SALES TAX RATE</button>
                            </div>
                            </div>
                            <div className='p-3 my-4 bg-white shadow rounded'>
                            <p className='text-2xl font-bold'>Interest</p>
                            <div className='grid grid-cols-3'>
                            <div className='gap-1'>
                                <p className='text-xl font-semibold'>Rate</p>
                                <div className='flex gap-1'>
                            <input
                                className='p-1 bg-white border-2 border-gray-500 focus:outline-none'
                                type='Number'
                                value={interestRate}
                                onChange={event => {setInterestRate(Number(event.target.value))}}
                            ></input>
                            <p className='text-xl font-semibold'>%</p>
                            </div>
                            </div>
                            <div>
                            <p className='text-xl font-semibold'>Resulting Payout</p>
                            <p className={classNames(getResultingInterestPayout() > 0 ? 'text-red-700' : '', 'text-xl')}>{getResultingInterestPayout()} [M]</p>
                            </div>
                            <div>
                            <p className='text-xl font-semibold'>Resulting Government Funds</p>
                            <p className={classNames(getResultingInterestPayout() > 0 ? 'text-red-700' : '','text-xl')}>{governmentFunds - getResultingInterestPayout()} [M]</p>
                            </div>
                            <button 
                                className='mt-4 p-2 col-span-3 rounded shadow flex w-full justify-center font-semibold bg-yellow-300 hover:bg-yellow-400 text-lg'
                                onClick={onClickGrantInterest}
                                >
                                    <ArrowCircleUpIcon className='h-7 w-7'/>
                                    GRANT INTEREST</button>
                            </div>
                            </div>
                            <div className='p-3 bg-white shadow rounded'>
                            <p className='text-2xl font-bold'>Taxes</p>
                            <div className='grid grid-cols-3'>
                            <div className='gap-1'>
                                <p className='text-xl font-semibold'>Rate</p>
                                <div className='flex gap-1'>
                            <input
                                className='p-1 bg-white border-2 border-gray-500 focus:outline-none'
                                type='Number'
                                value={taxRate}
                                onChange={event => {setTaxRate(Number(event.target.value))}}
                            ></input>
                            <p className='text-xl font-semibold'>%</p>
                            </div>
                            </div>
                            <div>
                            <p className='text-xl font-semibold'>Resulting Revenue</p>
                            <p className={classNames(getResultingTaxRevenue() > 0 ? 'text-green-700' : '', 'text-xl')}>{getResultingTaxRevenue()} [M]</p>
                            </div>
                            <div>
                            <p className='text-xl font-semibold'>Resulting Government Funds</p>
                            <p className={classNames(getResultingTaxRevenue() > 0 ? 'text-green-700' : '', 'text-xl')}>{governmentFunds + getResultingTaxRevenue()} [M]</p>
                            </div>
                            <button 
                                className='mt-4 p-2 col-span-3 rounded shadow flex w-full justify-center font-semibold bg-yellow-300 hover:bg-yellow-400 text-lg'
                                onClick={onClickPullTaxes}
                                >
                                    <ArrowCircleDownIcon className='h-7 w-7'/>
                                    PULL TAXES</button>
                            </div>
                            </div>
                        </div>
                    }
                    {selectedSection == 'Licenses' &&
                        <div className=''>
                            <div className='m-4 bg-white rounded p-2 shadow'>
                            <div className=''>
                                <p className='font-semibold text-lg'>Title</p>
                                <input
                                    className='border-2 border-gray-500 w-full p-1 focus:outline-none'
                                    onChange={event => {setLicenseTitle(event.target.value)}}
                                ></input>
                            </div>
                            <div className='py-2'>
                                <p className='font-semibold text-lg'>Permissions</p>
                                <input
                                    className='border-2 border-gray-500 w-full p-1 focus:outline-none'
                                    onChange={event => {setLicensePermissions(event.target.value)}}
                                ></input>
                            </div>
                            <div className=''>
                                <p className='font-semibold text-lg'>Price</p>
                                <div className='flex gap-1 w-full'>
                                    <input
                                        className='border-2 border-gray-500 w-full p-1 focus:outline-none'
                                        onChange={event => {setLicensePrice(event.target.value)}}
                                    ></input>
                                    <p className='text-xl font-bold'>[M]</p>
                                </div>
                                
                            </div>
                            <div className='flex justify-center pt-2'>
                            <button className='font-semibold rounded shadow bg-yellow-300 hover:bg-yellow-400 py-1 px-2 flex justify-center'
                                onClick={onClickAddLicense}
                            >ADD LICENSE</button>
                            </div>
                            </div>
                            <div className='py-2 bg-gray-200 max-h-screen overflow-y-scroll'>
                                {licenses.map(license => {
                                    return(
                                        <div className='px-4 py-2'>
                                            <LicenseGovernment license={license}/>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    }
                    {selectedSection == 'Holidays' &&
                        <div>
                            Holidays
                        </div>
                    }
                    {selectedSection == 'Properties' &&
                        <div className='grid grid-cols-3'>
                        <div className='col-span-2 p-2'>
                            {selectedProperty == undefined &&
                                <p className='text-gray-500 p-5 font-semibold'>NO PROPERTY SELECTED</p>
                            }
                            {selectedProperty != undefined &&
                                <div className='bg-white rounded'>
                                    <div className='p-1'>
                                    <Property property={selectedProperty}/>
                                    </div>
                                    <div className='p-2 max-h-screen overflow-y-scroll'>
                                        <div className='grid grid-cols-2'>
                                        <div className='col-span-2 p-2'>
                                            
                                            <div className='bg-white'>
                                                
                                                <div className='w-full flow-root p-2 bg-gray-200'>
                                                <p className='font-semibold float-left'>OWNER</p>
                                                <div className='float-right flex gap-2'>
                                                    <CitizenGovernmentDropboxMenu
                                                        citizens={citizens}
                                                        selectedCitizen={selectedNewPropertyOwner}
                                                        setSelectedCitizen={setSelectedNewPropertyOwner}
                                                        filteredCitizens={filteredDropboxCitizens}
                                                        setFilteredCitizens={setFilteredDropboxCitizens}
                                                    />
                                                        <button 
                                                        onClick={onClickAddChangeOwnerButton}
                                                        className='bg-yellow-300 py-1 px-2 flex text-sm hover:bg-yellow-400 font-semibold rounded shadow'>
                                                        <PlusCircleIcon className='w-5 h-5'/>{selectedProperty.owner != undefined ? 'CHANGE OWNER' : 'ADD OWNER'}</button>
                                                </div>
                                                </div>
                                                <div className='flow-root p-2 border-2 border-gray-400'>
                                                    <p className='float-left font-semibold text-gray-700'>Current</p>
                                                    <p className='float-right'>{selectedProperty.owner ? `${selectedProperty.owner.name}, ${selectedProperty.owner.citizenID}` : 'None'}</p>
                                                </div>
                                                {selectedProperty.owner &&
                                                <div className='flow-root p-2 border-l-2 border-r-2 border-b-2 border-gray-400'>
                                                    <p className='float-left font-semibold text-gray-700'>Date Given</p>
                                                    <p className='float-right'>{selectedProperty.owner.dateAdded}</p>
                                                </div>
                                                }
                                                
                                            </div>
                                            
                                        </div>
                                        {selectedProperty.type == 'Business' &&
                                        <div className='col-span-2 p-2'>
                                            
                                            <div className='bg-white'>
                                                
                                                <div className='w-full flow-root p-2 bg-gray-200'>
                                                <p className='font-semibold float-left'>BUSINESS</p>
                                                <div className='float-right flex gap-2'>
                                                    
                                                        <button 
                                                        onClick={()=>{setAddChangeBusinessPopupOpen(true)}}
                                                        className='bg-yellow-300 py-1 px-2 flex text-sm hover:bg-yellow-400 font-semibold rounded shadow'>
                                                        <PlusCircleIcon className='w-5 h-5'/>{selectedProperty.business != undefined ? 'CHANGE BUSINESS' : 'ADD BUSINESS'}
                                                            <Popup
                                                                open={addChangeBusinessPopupOpen}
                                                                setOpen={setAddChangeBusinessPopupOpen}
                                                                header={selectedProperty.business != undefined ? 'Change Business' : 'Add Business'}
                                                                onClickSave={()=>{}}
                                                                inputs={[]}
                                                                saveText={selectedProperty.business != undefined ? 'Change' : 'Add'}
                                                                additionalComponent={()=>{return <AddBusinessPopupBody database={database} setValues={setValues} selectedProperty={selectedProperty} setSelectedProperty={setSelectedProperty} setAddChangeBusinessPopupOpen={setAddChangeBusinessPopupOpen}/>}}
                                                            />
                                                        </button>
                                                </div>
                                                </div>
                                                {selectedProperty.business != undefined ?
                                                    <div>
                                                    <div className='flow-root p-2 border-2 border-gray-400'>
                                                    <p className='float-left font-semibold text-gray-700'>Name</p>
                                                    <p className='float-right'>{selectedProperty.business.name}</p>
                                                    </div>
                                                    <div className='flow-root p-2 border-b-2 border-l-2 border-r-2 border-gray-400'>
                                                    <p className='float-left font-semibold text-gray-700'>Description</p>
                                                    <p className='float-right'>{selectedProperty.business.description}</p>
                                                    </div>
                                                    </div>
                                                    :
                                                    <div className='flow-root p-2 border-2 border-gray-400'>
                                                    <p className='float-left font-semibold text-gray-700'>None yet</p>
                                                    
                                                    </div>
                                                }
                                                
                                            </div>
                                            
                                        </div>
                                        }
                                        </div>
                                    </div>
                                    <p></p>
                                
                                </div>
                            }
                        </div>
                        <div className='col-span-1 p-2'>
                            <div className='bg-white rounded'>
                                <div className='p-2'>
                                    <button className='w-full bg-yellow-300 hover:bg-yellow-400 font-semibold text-sm py-2 justify-center text-center rounded shadow flex'
                                        onClick={()=>{setAddPropertyPopupOpen(true)}}>
                                        <PlusCircleIcon className='w-5 h-5'/>ADD PROPERTY</button>
                                        <Popup
                                            open={addPropertyPopupOpen}
                                            setOpen={setAddPropertyPopupOpen}
                                            header='Add Property'
                                            onClickSave={()=>{}}
                                            inputs={[]}
                                            saveText={'Add'}
                                            additionalComponent={()=>{return <AddPropertyPopupBody database={database} getTime={getTime} getDate={getDate} getYear={getYear} properties={properties} setProperties={setProperties} setAddPropertyPopupOpen={setAddPropertyPopupOpen}/>}}
                                        />
                                </div>
                                <div className='p-2'>
                                <input placeholder='Search' value={searchPropertiesInput} className='w-full border-2 border-gray-500 p-2 bg-gray-100 focus:ring-1 focus:ring-gray-700 focus:border-gray-700 focus:outline-none'
                                    onChange={event => {
                                        setSearchPropertiesInput(event.target.value);
                                        setFilteredProperties(properties.filter(property => {
                                          console.log(filteredProperties)
                                          return property.address.toUpperCase().includes(event.target.value.toUpperCase());
                                        }))
                                      }}
                                ></input>
                                </div>
                                <div className=''>
                            {filteredProperties.map(property => {
                                return(
                                    <div className='p-2'>
                                        <button 
                                            onClick={()=>{setSelectedProperty(property);
                                                localStorage.setItem('selectedProperty', JSON.stringify(property));
                                            }}
                                            className={classNames(selectedProperty != undefined && selectedProperty.propertyID == property.propertyID ? 'border-2 border-blue-400 shadow-lg bg-yellow-400' : ' bg-yellow-300', 'w-full shadow rounded hover:bg-yellow-400 p-2 text-sm font-semibold')}>
                                            <div>{property.address.toUpperCase()}</div>
                                                <div className='text-gray-700'>{property.propertyID.toUpperCase()}</div>
                                                </button>
                                    </div>
                                )
                            })}
                            </div>
                            </div>
                        </div>
                    </div>
                    }
                    {selectedSection == 'Announcements' &&
                                    <div>
                                        <div className='w-full'>
                                <div className='flow-root p-3 bg-white rounded shadow mx-2 my-2'>
                                <textarea className='p-2 w-full mb-2 border-2 focus:border-black bg-gray-100 shadow-sm focus:outline-none border-gray-500 resize-none'
                                    placeholder='Write announcement...'
                                    value={announcementText}
                                    onKeyDown={event => {
                                        if(event.code === 'Enter'){
                                            onClickPostAnnouncement();
                                        }
                                    }}
                                    
                                    onChange={event => {
                                                if(!event.target.value.includes('\n')){
                                                    setAnnouncementText(event.target.value);
                                                }
                                    }}
                                ></textarea>
                                <div className='w-full flex pb-2 justify-center'>
                                <button 
                                    onClick={onClickPostAnnouncement}
                                    className={classNames(
                                        announcementText != '' && announcementText != undefined ? 'bg-yellow-300 hover:bg-yellow-400' : 'bg-yellow-200 text-gray-400',
                                        'w-64 flex text-md justify-center py-1 font-semibold rounded shadow')}>
                                            <div className='flex justify-center'>
                                    <PlusCircleIcon className='w-6 h-6'/>POST ANNOUNCEMENT
                                    
                                    </div>
                                    </button>
                                    </div>
                                    </div>
                                    </div>
                                    <div className='mt-5 bg-gray-200 py-1 max-h-screen overflow-y-scroll'>
                                        {announcements.map(announcement => {
                                            return(
                                                <div className='px-2 py-1'>
                                                    <Announcement announcement={announcement}/>
                                                </div>
                                            )
                                        })}
                                    </div>
                                    </div>
                                }
                </div>
            </div>
        </div>
    )
    function Transfer({transfer}){
    
        return(
            <div className='rounded bg-white text-sm shadow'>
                <div className='w-full'>
                <p className='pl-2 pt-2 font-semibold text-gray-700'>{transfer.date} at {transfer.time}</p>
                <p className='pl-2 pt-2 font-semibold text-gray-700'>{transfer.transferID} {transfer.ssre}</p>
                </div>
                <div className='grid grid-cols-4 p-2 gap-2'>
                {transfer.type == "Incoming" ?
                <div className='col-span-2 grid grid-cols-2'>
                            <div className='col-span-1'>
                                <p className='font-semibold'>Amount</p>
                                <p className='text-green-700'>+{transfer.amount} [M]</p>
                            </div>
                            <div className='col-span-1'>
                                <p className='font-semibold'>From</p>
                                <p className=''>{transfer.senderName}</p>
                            </div>
                            </div>
                :    
                <div className='col-span-2 grid grid-cols-2'>
                <div className='col-span-1'>
                    <p className='font-semibold'>Amount</p>
                    <p className='text-red-700'>-{transfer.amount} [M]</p>
                </div>
                <div className='col-span-1'>
                    <p className='font-semibold'>To</p>
                    <p className=''>{transfer.receiverName}</p>
                </div>
                </div>
                        }
                <div className='col-span-1'>
                                <p className='font-semibold'>Reason</p>
                                <p className=''>{transfer.reason}</p>
                            </div>
                <div className='col-span-1'>
                                <p className='font-semibold'>Resulting Balance</p>
                                <p className=''>{transfer.resultingBalance} [M]</p>
                            </div>
                        </div>
                </div>
        )
    
}

function LicenseGovernment({license}){
    return(
        <div className='border-2 border-gray-500 bg-white shadow p-2'>
            <div className='flow-root'>
                <div className='float-left'>
                    <p className='text-lg font-semibold'>{license.title}</p>
                    <p className='font-semibold text-gray-700'>{license.licenseID}</p>
                </div>
                <p className='float-right font-bold text-xl'>{license.price} [M]</p>
            </div>
            
            <p className='pt-2 font-semibold'>{license.permissions}</p>
        </div>
    )
}

function LicenseUser({license}){
    return(
        <div className='border-2 border-gray-500 bg-white shadow p-2'>
            <div className='flow-root'>
                <div className='float-left'>
                    <p className='text-lg font-semibold'>{license.title}</p>
                    <p className='font-semibold text-gray-700'>{license.licenseID}</p>
                </div>
                <p className='float-right font-bold text-xl'>{license.price} [M]</p>
            </div>
            <div className='flow-root'>
                <p className='pt-2 pr-2 font-semibold float-left'>{license.permissions}</p>
                <div className='flex float-right'>
                    <CheckCircleIcon className='w-7 h-7'/>
                <p className='float-right font-bold px-1 text-lg'>Purchased {(selectedCitizen.licenses[license.licenseID]).datePurchased}</p>
                </div>
                
                
                
            </div>
        </div>
    )
}

function CriminalCharge({charge}){
    
    return(
        <div className='rounded bg-white shadow text-sm break-words'>
            <div className='w-full'>
            <p className='pl-2 pt-2 font-semibold text-gray-700'>{charge.date} at {charge.time}</p>
            <p className='pl-2 pt-2 font-semibold text-gray-700'>{charge.chargeID} {charge.ssre}</p>
            </div>
            
                {charge.verdict == "Guilty" ?
                <div className='grid grid-cols-3 p-2 gap-x-2 gap-y-2'>
                <div className='col-span-1'>
                <p className='font-semibold'>Prosecutor</p>
                <p className=''>{charge.prosecutor.name}</p>
                <p className=''>{charge.prosecutor.citizenID}</p>
            </div>
            <div className='col-span-1'>
                <p className='font-semibold'>Defendant</p>
                <p className=''>{charge.defendant.name}</p>
                <p className=''>{charge.defendant.citizenID}</p>
            </div>
            <div className='col-span-1'>
                        <p className='font-semibold'>Verdict</p>
                        <p className='text-red-700'>Guilty</p>
                        </div>
            <div className='col-span-1'>
                        <p className='font-semibold'>Crime</p>
                        <p className=''>{charge.crime}</p>
                        </div>

                        
                        <div className='col-span-1'>
                            <p className='font-semibold'>Reason for Verdict</p>
                            <p className=''>{charge.reasonForVerdict}</p>
                        </div>
                        <div className='col-span-1'>
                        <p className='font-semibold'>Punishment</p>
                        <p className=''>{charge.punishment}</p>
                        </div>
            </div> :
            <div className='grid grid-cols-3 p-2 gap-x-2 gap-y-2'>
            <div className='col-span-1'>
            <p className='font-semibold'>Prosecutor</p>
            <p className=''>{charge.prosecutor.name}</p>
            <p className=''>{charge.prosecutor.citizenID}</p>
        </div>
        <div className='col-span-1'>
            <p className='font-semibold'>Defendant</p>
            <p className=''>{charge.defendant.name}</p>
            <p className=''>{charge.defendant.citizenID}</p>
        </div>
        <div className='col-span-1'>
        <div className='col-span-1'>
                    <p className='font-semibold'>Verdict</p>
                    <p className='text-green-700'>Not Guilty</p>
                    </div>
                    <p className='font-semibold'>Alleged Crime</p>
                    <p className=''>{charge.allegedCrime}</p>
                    </div>
                    
                   
                   
                    <div className='col-span-2'>
                        <p className='font-semibold'>Reason for Verdict</p>
                        <p className=''>{charge.reasonForVerdict}</p>
                    </div>
                   
                    </div>
        
                }
    </div>
    )

}

    function Property({property}){
        return(
            <div className={classNames(selectedSection == 'Citizens' ? 'text-sm' : '', 'p-1')}>
                                            <div className='w-full bg-white group-hover:bg-gray-200 border-2 border-gray-500 grid grid-cols-4'>
                                                <div className='col-span-4 p-2 flow-root'>
                                                    <div className='float-left'>
                                                    <p className={classNames(selectedSection == 'Citizens' ? 'text-lg' : 'text-xl', 'font-bold')}>{property.address}</p>
                                                    <p className={classNames(selectedSection == 'Citizens' ? 'text-xs' : 'text-sm', 'uppercase font-semibold')}>{property.type}</p>
                                                    </div>
                                                    {/* <div className='float-right'>
                                                        <button className='rounded flex p-2 text-sm uppercase shadow font-semibold bg-yellow-300 hover:bg-yellow-400'>
                                                            <PencilIcon className='h-5 w-5'/>
                                                            Edit Property
                                                        </button>
                                                    </div> */}
                                                </div>
                                                
{/*                                                 <div className='col-span-3 px-2 uppercase font-bold'>Information</div>
 */}                                                
                                                <div className='col-span-1 p-2'>
                                                    <p className='font-semibold'>Property ID</p>
                                                    <p>{property.propertyID}</p>
                                                </div>
                                                <div className='col-span-1 p-2'>
                                                    <p className='font-semibold'>Price</p>
                                                    <p>{property.price} [M]</p>
                                                </div>
                                                
                                                <div className='col-span-1 p-2'>
                                                    <p className='font-semibold'>Dimensions</p>
                                                    <p>{property.length} by {property.width}</p>
                                                </div>
                                                {/* <div className='col-span-1 p-2'>
                                                    <p className='font-semibold'>Size</p>
                                                    <p>{property.size} Blocks</p>
                                                </div> */}
                                                <div className='col-span-1 p-2'>
                                                    <p className='font-semibold'>Date Added</p>
                                                    <p>{property.dateAdded}</p>
                                                </div>
                                            </div>
                                            </div>
        )
    }

    function Announcement({announcement}){
        return(
            <div className='bg-white rounded shadow p-2'>
                <p className='text-gray-700 font-semibold'>{announcement.datePosted} at {announcement.timePosted}</p>
                <div className='p-2'>
                        <p className='text-lg font-semibold py-2 px-2 border-2 border-gray-400 shadow-sm'>
                            {announcement.text}
                        </p>
                </div>
            </div>
        )
    }
}

export default Government;