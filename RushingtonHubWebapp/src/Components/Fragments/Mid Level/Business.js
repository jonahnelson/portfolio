import { useState, useEffect } from "react"
import { CollectionIcon, LibraryIcon, BriefcaseIcon, PlusCircleIcon, ArrowCircleLeftIcon, TruckIcon, PencilAltIcon, XCircleIcon, CheckCircleIcon, ArrowCircleUpIcon, ArrowCircleDownIcon } from "@heroicons/react/outline";
import Popup from "../Low Level/Popup";
import Switch from '@material-ui/core/Switch';
import CitizenUserDropboxMenu from "../Low Level/CitizenUserDropboxMenu";
import NewTransferPopupBody from "../Low Level/NewTransferPopupBody";
import NewBusinessTransferPopupBody from "../Low Level/NewBusinessTransferPopupBody";


const Business = ({database, user, setUser, getTime, getDate, getYear}) => {
    const [selectedBusiness, setSelectedBusiness] = useState(JSON.parse(localStorage.getItem('selectedBusiness')));
    const [selectedSection, setSelectedSection] = useState('Items');
    const [addItemPopupOpen, setAddItemPopupOpen] = useState(false);
    const [editItemPopupOpen, setEditItemPopupOpen] = useState(false);
    const [productBeingEdited, setProductBeingEdited] = useState();
    const [citizens, setCitizens] = useState([]);
    const [searchInput, setSearchInput] = useState('');
    const [filteredCitizens, setFilteredCitizens] = useState([]);
    const [transferDropboxCitizens, setTransferDropboxCitizens] = useState([]);
    const [filteredTransferDropboxCitizens, setFilteredTransferDropboxCitizens] = useState([])
    const [selectedCitizen, setSelectedCitizen] = useState();
    const [newTransferPopupOpen, setNewTransferPopupOpen] = useState(false);
    const [newBusinessName, setNewBusinessName] = useState(JSON.parse(localStorage.getItem('selectedBusiness')).name);
    const [newBusinessDescription, setNewBusinessDescription] = useState(JSON.parse(localStorage.getItem('selectedBusiness')).description);
    const [salesTaxRate, setSalesTaxRate] = useState(0);

    const rushingtonEpoch = 1522648800;

    useEffect(updateCitizens, []);

    function updateCitizens(){
    database.ref('/citizens').get().then(citizensObjects => {
        const citizens = Object.values(citizensObjects.val()).filter(citizen => {
            var citizenIsNotInList = true;
            Object.values(selectedBusiness.owners).forEach(owner => {
                if(owner.citizenID == citizen.citizenID) citizenIsNotInList = false;
            })
            return citizenIsNotInList;
        });
        setCitizens(citizens);
        setFilteredCitizens(citizens);
        database.ref('/government/salesTaxRate').get().then(salesTaxRateSnapshot => {
            setSalesTaxRate(salesTaxRateSnapshot.val());
        })
    })}

    const navigationSections = selectedBusiness.founder.citizenID == user.citizenID ? [
        {sectionName: 'Items', sectionSelected: selectedSection == 'Items', icon: CollectionIcon},
        {sectionName: 'Bank Account', sectionSelected: selectedSection == 'Bank Account', icon: LibraryIcon},
        {sectionName: 'Orders', sectionSelected: selectedSection == 'Orders', icon: TruckIcon},
        {sectionName: 'Manage', sectionSelected: selectedSection == 'Manage', icon: BriefcaseIcon}
    ] : 
    [
        {sectionName: 'Items', sectionSelected: selectedSection == 'Items', icon: CollectionIcon},
        {sectionName: 'Bank Account', sectionSelected: selectedSection == 'Bank Account', icon: LibraryIcon},
        {sectionName: 'Orders', sectionSelected: selectedSection == 'Orders', icon: TruckIcon}
    ]

    const userIsOwner = checkUserIsOwner();

    function checkUserIsOwner(){
        var userIsOwner = false;
        Object.values(selectedBusiness.owners).forEach(owner => {
            if(owner.citizenID == user.citizenID) userIsOwner = true;
        });
        return userIsOwner;
    }

    console.log('userIsOwner', userIsOwner);

    useEffect(updateBusiness, []);

    function updateBusiness(){
        database.ref(`/businesses/${selectedBusiness.businessID}`).get().then(business => {
            setSelectedBusiness(business.val());
            localStorage.setItem('selectedBusiness', JSON.stringify(business.val()));
        })
    }

    function censor(id){
        return(id.startsWith('CI-') && user.citizenID != id ? `CI-***${id.substring(6, 8)}` : id);
    }

    function generateID(prefix){
        var transferID = `${prefix}-`
        for(var i = 0; i < 5; i++){
            transferID = transferID + String(Math.floor(Math.random()*10));
        }
        return(transferID);
    }

    function classNames(...classes) {
        return classes.filter(Boolean).join(" ");
    }

    return(
        <div>
            {userIsOwner &&
                <div className='grid grid-cols-5 gap-5'>
                    <div className='col-span-5 lg:col-span-1 lg:h-40 lg:sticky lg:top-6'>
                    
                    {navigationSections.map(navigationSection => {
                        const Icon = navigationSection.icon;
                        return(
                        
                        <div className='flex-auto lg:flex-none'>
                        <button
                            onClick={()=>{setSelectedSection(navigationSection.sectionName);
                            }}
                            className={classNames(navigationSection.sectionSelected ? 'bg-gray-200' : 'bg-white hover:bg-gray-100',
                                'rounded p-2 w-full text-center lg:text-left'
                            )}
                        >
                            <div className='flex gap-2 justify-center lg:justify-start'>
                                <Icon className='h-6 w-6'
                                    fill='white'
                                />
                            <p className='text-gray-800 font-semibold'>{navigationSection.sectionName}</p>
                            </div>
                            </button>
                        </div>
                        )
                    })}
                    
                </div>
                <div className='col-span-5 lg:col-span-4 bg-gray-100 rounded'>
                    {selectedSection == 'Items' &&
                        <div>
                            <Popup
                            header='Edit Product'
                            additionalComponent={() => {return <EditProductPopupBody/>}}
                            open={editItemPopupOpen}
                            setOpen={setEditItemPopupOpen}
                        />
                            <div className='gap-y-2 border-b border-gray-500'>
                            <a className='rounded bg-yellow-300 w-56 py-1 px-2 m-2 font-semibold hover:bg-yellow-400 flex justify-center shadow'
                    href='/businesses'
                >
                                <ArrowCircleLeftIcon className='h-6 w-6'/>
                                BACK TO BUSINESSES
                </a>
            <div className='gap-y-2 py-2'>
                <div className='bg-white border-2 border-gray-700 p-2 m-2 shadow'>
                <p className='text-center text-3xl font-bold'>{selectedBusiness.name}</p>
                <p className='text-center text-lg'>{selectedBusiness.description}</p>
                </div>
            </div>
                        </div>
                            <div className='flow-root px-2'>
                            <div className='float-left py-2'>
                            <button className='bg-yellow-300 hover:bg-yellow-400 font-semibold rounded shadow flex py-1 px-2'
                                onClick={() => {
                                    setAddItemPopupOpen(true);
                                }}
                            >
                                <Popup
                                    header='New Product'
                                    additionalComponent={() => {return <AddItemPopupBody/>}}
                                    open={addItemPopupOpen}
                                    setOpen={setAddItemPopupOpen}
                                />
                                <PlusCircleIcon className='w-6 h-6'/>
                                ADD ITEM
                            </button>
                            </div>
                            <div className='float-right'>
                                <p className='font-bold text-center'>Personal Balance</p>
                                <p className='text-center border-2 border-gray-500 font-semibold bg-white'>{user.meldas} [M]</p>
                            </div>
                            <input className='rounded w-full border-2 border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-700 focus:border-gray-700 p-2 mt-8 mb-3'
                    placeholder='Search products...'
                    onChange={event => {
                        setSearchInput(event.target.value);
                    }}
                    ></input>
                            </div>
                            <div className=''>
                                {selectedBusiness.products != undefined &&
                                    <div className='lg:grid lg:grid-cols-4 gap-2 m-2'>
                                        {Object.values(selectedBusiness.products).sort((product1, product2) => {
                                            return(product1.name.localeCompare(product2.name))
                                        }).filter(product => {
                                            if(searchInput != ''){
                                                return product.name.toUpperCase().includes(searchInput.toUpperCase());
                                            } else {
                                                return true;
                                            }
                                        }).map(product => {
                                            return(
                                                <div className='pt-2'>
                                                <Product product={product}/>
                                                </div>
                                            )
                                        })}
                                    </div>
                                }
                                {selectedBusiness.products == undefined &&
                                    <p className='font-semibold text-center text-gray-700 pt-3 pb-6'>
                                        NO PRODUCTS YET
                                    </p>
                                }
                            </div>
                        </div>
                    }
                    {selectedSection == 'Bank Account' &&
                        <div className='mx-1 lg:mx-2 my-1 lg:my-2'>
                        <div className='flow-root p-2'>
                            <div className='float-left'>
                        <p className='text-3xl text-black font-bold'>Bank</p>
                        
                        </div>
                        
                        <div className='float-right'>
                            <button className='rounded bg-yellow-300 p-2 font-semibold hover:bg-yellow-400 flex shadow'
                                onClick={()=>{setNewTransferPopupOpen(true)}}
                            ><PlusCircleIcon className='w-6 h-6'/><p className='pl-1'>NEW TRANSFER</p>
                            <Popup
                                open={newTransferPopupOpen}
                                setOpen={setNewTransferPopupOpen}
                                header='New Transfer'
                                onClickSave={()=>{}}
                                inputs={[]}
            
                                saveText={'Send'}
                                additionalComponent={()=>{return <NewBusinessTransferPopupBody database={database} user={user}
                                    business={selectedBusiness} updateBusiness={updateBusiness} setUser={setUser}
                                    getTime={getTime} getDate={getDate} getYear={getYear} setNewBusinessTransferPopupOpen={setNewTransferPopupOpen}/>}}
                            />
                            </button>
                        </div>
                        </div>
                        <div className='p-2 group bg-gray-100 rounded'>
                        <div className='lg:flow-root w-full  p-1 shadow bg-white border-4 border-gray-500 text-bottom'>
                            <div className='lg:float-left text-bottom bg-white'>
                            <p className='text-2xl font-semibold pl-1 text-gray-700'>Current Balance</p>
                            
                            
                            </div>
                        <div className='flex justify-center text-2xl font-bold lg:float-right px-1 border-2 border-gray-500 bg-white'>
                            <p className='pr-1'>{selectedBusiness.meldas}</p>
                            <p>[M]</p>
                        </div>
                        </div>
                        
                        <div className='w-full border-gray-500 border-b-4 border-r-4 border-l-4 bg-white'>
                            
                            <p className='font-semibold text-gray-700 px-2 pt-2 text-2xl'>Transaction History</p>
                            {selectedBusiness.transfers != undefined && Object.values(selectedBusiness.transfers).length != 0 ?
                            <div className='lg:p-2 p-1 bg-gray-200'>
                            {Object.values(selectedBusiness.transfers).sort((transfer1, transfer2) => {
                                return transfer2.ssre - transfer1.ssre;
                            }).map(transfer => {
                                return(
                                    <div className='p-1'>
                                        <Transfer transfer={transfer}/>
                                    </div>
                                )
                            })}
                            </div> :
                            <div className='p-2 bg-gray-100'>
                            <p className='font-semibold text-2xl'>Nothing yet</p>
                            </div>
                        }
                            
                        </div>
                        </div>
                        
                        
                        
                        
                    </div>
                    }
                    {selectedSection == 'Orders' &&
                    <div className='m-4'>
                        <div className=''>
                            <p className='text-3xl text-black font-bold'>Orders</p>
                        </div>
                        {selectedBusiness.orders != undefined ?
                        <div>
                        {Object.values(selectedBusiness.orders).sort((order1, order2) => {
                            return(order2.ssre - order1.ssre);
                        }).map(order => {
                            return(
                            <div className='py-2'>
                                <Order order={order}/>
                            </div>)
                        })}
                    </div> : 
                    <p className='text-center text-gray-700 py-4 font-semibold'>NONE YET</p>
                    }
                    </div>
                    }
                    {selectedSection == 'Manage' &&
                        <div>
                            <div className='p-4'>
                        <p className='text-3xl text-black font-bold'>Manage</p>
                        
                        </div>
                            <div className='py-4 rounded bg-white mx-4 my-2 shadow'>
                                <p className='font-bold text-sm text-center'>ADD OWNER</p>
                            <CitizenUserDropboxMenu
                                citizens={citizens}
                                filteredCitizens={filteredCitizens}
                                setFilteredCitizens={setFilteredCitizens}
                                user={user}
                                selectedCitizen={selectedCitizen}
                                setSelectedCitizen={setSelectedCitizen}
                            />
                            <div className='flex justify-center pt-2'>
                            <button className={classNames(
                                selectedCitizen != undefined ? 'bg-yellow-300 hover:bg-yellow-400' : 'bg-yellow-200 text-gray-400',
                                'font-semibold rounded shadow px-2 py-1 flex')}
                                onClick={() => {
                                    const ownersList = Object.values(selectedBusiness.owners);
                                    ownersList.push(
                                        {
                                            citizenID: selectedCitizen.citizenID,
                                            name: selectedCitizen.name
                                        }
                                    );
                                    database.ref(`/businesses/${selectedBusiness.businessID}/owners`).set(ownersList);
                                    updateBusiness();
                                }}
                                >
                                <PlusCircleIcon className='h-6 w-6'/>
                                ADD
                            </button>
                            </div>
                            </div>
                            <div className='p-4'>
                            {Object.values(selectedBusiness.owners).map(owner => {
                                return(
                                    <div className='py-2'>
                                    <div className='bg-white border-2 border-gray-700 shadow p-2'>
                                        <div className='flow-root'>
                                        <p className='float-left font-bold text-lg'>{owner.name}</p>
                                        <p className='float-right text-lg'>{censor(owner.citizenID)}</p>
                                        </div>
                                        {owner.citizenID != user.citizenID &&
                                            <div className='flex justify-center'>
                                            <button className='bg-yellow-300 hover:bg-yellow-400 rounded shadow px-2 py-1 flex font-semibold'
                                                onClick={() => {
                                                    const ownersList = Object.values(selectedBusiness.owners);
                                                    ownersList.splice(ownersList.indexOf(owner), 1);
                                                    database.ref(`/businesses/${selectedBusiness.businessID}/owners`).set(ownersList);
                                                    updateBusiness();
                                                }}
                                            >
                                                <XCircleIcon className='w-6 h-6'/>
                                                REMOVE OWNER
                                            </button>
                                            </div>
                                        }
                                    </div>
                                    </div>
                                )
                            })}
                            </div>
                            <div className='py-4 border-t border-gray-500'>
                                <div className='p-4'>
                            <input className='w-full rounded border-2 border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-700 focus:border-gray-700 p-2'
                                defaultValue={selectedBusiness.name}
                                placeholder='Business name'
                                onChange={event => {
                                    setNewBusinessName(event.target.value);
                                }}></input>
                            </div>
                            <div className='p-4'>
                            <textarea className='w-full resize-none rounded border-2 border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-700 focus:border-gray-700 p-2'
                                defaultValue={selectedBusiness.description}
                                placeholder='Business description'
                                onChange={event => {
                                    setNewBusinessDescription(event.target.value);
                                }}
                            >
                            </textarea>
                            </div>
                            {(newBusinessName != selectedBusiness.name || newBusinessDescription != selectedBusiness.description) &&
                                newBusinessName && newBusinessDescription &&
                            <div className='flex justify-center'>
                            <button className='bg-yellow-300 hover:bg-yellow-400 rounded shadow px-2 py-1 flex font-semibold'
                                onClick={() => {
                                    database.ref(`/businesses/${selectedBusiness.businessID}/name`).set(newBusinessName);
                                    database.ref(`/businesses/${selectedBusiness.businessID}/description`).set(newBusinessDescription);
                                    updateBusiness();
                                }}
                            >
                                <CheckCircleIcon className='h-6 w-6'/>
                                UPDATE NAME AND DESCRIPTION
                                </button>
                            </div>}
                            </div>
                            <div className='flex justify-center py-4 border-t border-gray-500'>
                            <button className='bg-yellow-300 hover:bg-yellow-400 rounded shadow px-2 py-1 flex font-semibold'
                                onClick={() => {
                                    database.ref(`/businesses/${selectedBusiness.businessID}`).set(null);
                                    window.location.href = '/businesses'
                                }}>
                                    <XCircleIcon className='w-6 h-6'/>
                                    DELETE BUSINESS
                                </button>
                            </div>
                        </div>
                    }
                </div>
                </div>
            }
            {!userIsOwner &&
            <div className='bg-gray-100 rounded p-2'>
                
                <a className='rounded bg-yellow-300 w-56 py-1 px-2 font-semibold hover:bg-yellow-400 flex justify-center shadow'
                    href='/businesses'
                >
                                <ArrowCircleLeftIcon className='h-6 w-6'/>
                                BACK TO BUSINESSES
                </a>
            <div className='gap-y-2 py-6 border-b border-gray-500'>
                <div className='bg-white border-2 border-gray-700 py-2 shadow'>
                <p className='text-center text-3xl font-bold'>{selectedBusiness.name}</p>
                <p className='text-center text-lg'>{selectedBusiness.description}</p>
                </div>
            </div>
            <div className='flow-root px-2'>
            <div className='float-right'>
                <p className='font-bold text-center'>Personal Balance</p>
                <p className='text-center border-2 border-gray-500 font-semibold bg-white'>{user.meldas} [M]</p>
            </div>
            <input className='rounded w-full border-2 border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-700 focus:border-gray-700 p-2 mt-8 mb-3'
                    placeholder='Search products...'
                    onChange={event => {
                        setSearchInput(event.target.value);
                    }}
                    ></input>
            </div>
            <div className=''>
                {selectedBusiness.products != undefined &&
                    <div className='lg:grid lg:grid-cols-4 gap-2 lg:m-2 m-1'>
                        {Object.values(selectedBusiness.products).sort((product1, product2) => {
                            return(product1.name.localeCompare(product2.name))
                        }).filter(product => {
                            if(searchInput != ''){
                                return product.name.toUpperCase().includes(searchInput.toUpperCase());
                            } else {
                                return true;
                            }
                        }).map(product => {
                            return(
                                <div className='pt-2'>
                                <Product product={product}/>
                                </div>
                            )
                        })}
                    </div>
                }
                {selectedBusiness.products == undefined &&
                    <p className='font-semibold text-center text-gray-700 pt-3 pb-6'>
                        NO PRODUCTS YET
                    </p>
                }
            </div>
        </div>
            }
        </div>
    );

    function Product({product}){
        const [quantity, setQuantity] = useState(1);
        return(
            <div className='bg-white shadow rounded place-content-end'>
                
                <p className='text-center font-bold p-2 text-xl'>{product.name}</p>
                <p className='text-sm font-bold text-center text-gray-700'>NUMBER</p>
                <div className='px-4 pb-2'>
                <input type='Number' defaultValue={1} min={1}
                    onChange={event => {
                        if(event.target.value > 0){
                        setQuantity(event.target.value);
                        }
                    }}
                    className='border-2 border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-700 focus:border-gray-700 w-full p-1'></input>
                </div>
                <div className='flex'>
                {product.buyable &&
                    <div className={classNames(product.orderable ? 'pr-1' : 'pr-2', 'pl-2 py-2 flex-1')}>
                    <button className={classNames((product.buyingPrice * quantity) <= user.meldas ? 'bg-yellow-300 hover:bg-yellow-400' : 'bg-yellow-200 text-gray-400', 'w-full shadow rounded font-semibold py-1 px-2')}
                        onClick={() => {
                            var businessResultingBalance = 0;
        var senderResultingBalance = 0;
        if((product.buyingPrice * quantity) <= user.meldas){
            const transferAmount = Number(quantity * product.buyingPrice);
        database.ref(`/businesses/${selectedBusiness.businessID}/meldas`).get().then(
            meldasSnapshot => {
                const amountTaxed = Math.round(Number(transferAmount) * salesTaxRate);
                businessResultingBalance = Number(meldasSnapshot.val()) + transferAmount - amountTaxed;
                database.ref(`/businesses/${selectedBusiness.businessID}/meldas`).set(businessResultingBalance);
                database.ref(`/citizens/${user.citizenID}/meldas`).get().then(
                    meldasSnapshot => {
                        senderResultingBalance = Number(meldasSnapshot.val()) - transferAmount
                        database.ref(`/citizens/${user.citizenID}/meldas`).set(senderResultingBalance);
                        user.meldas = senderResultingBalance;
                        const transferID = generateID('MT');
                        database.ref(`/citizens/${user.citizenID}/transfers/${transferID}`).set(
                        {
                            transferID: transferID,
                            date: `${getDate()}, ${getYear()}`,
                            time: getTime(),
                            ssre: Math.round(((new Date()).getTime()/1000)-rushingtonEpoch),
                            amount: transferAmount,
                            receiverID: selectedBusiness.businessID,
                            receiverName: selectedBusiness.name,
                            type: "Outgoing",
                            reason: `Bought ${quantity} of '${product.name}'`,
                            resultingBalance: senderResultingBalance,
                            ssre: Math.round(((new Date()).getTime()/1000)-rushingtonEpoch),
                        }
                        
                    );
                    database.ref(`/businesses/${selectedBusiness.businessID}/transfers/${transferID}`).set(
                        {
                            transferID: transferID,
                            date: `${getDate()}, ${getYear()}`,
                            time: getTime(),
                            ssre: Math.round(((new Date()).getTime()/1000)-rushingtonEpoch),
                            amount: transferAmount - amountTaxed,
                            senderID: user.citizenID,
                            senderName: user.name,
                            type: "Incoming",
                            reason: `Bought ${quantity} of '${product.name}'`,
                            resultingBalance: businessResultingBalance,
                            ssre: Math.round(((new Date()).getTime()/1000)-rushingtonEpoch),
                        }
                        
                    );
                    const purchaseID = generateID('PU');
                    database.ref(`/citizens/${user.citizenID}/businessPurchases/${purchaseID}`).set(
                        {
                            purchaseID: purchaseID,
                            type: 'Buy',
                            product: {
                                name: product.name,
                                productID: product.productID,
                                buyingPrice: product.buyingPrice
                            },
                            business: {
                                businessID: selectedBusiness.businessID,
                                name: selectedBusiness.name,
                                description: selectedBusiness.description
                            },
                            quantity: quantity,
                            total: transferAmount,
                            timePurchased: getTime(),
                            datePurchased: getDate(),
                            yearPurchased: getYear(),
                            ssre: Math.round(((new Date()).getTime()/1000)-rushingtonEpoch)
                        }
                    );
                    if(amountTaxed > 0){
                        const taxTransferID = generateID('MT');
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
                    setUser(user);
                    localStorage.setItem('user', JSON.stringify(user));
                    updateBusiness();
                    }
                    
                )
            }
        );
        }
                        }}
                    >
                        <div className='flex justify-center'>
                            BUY
                        </div>
                        <p>{quantity * product.buyingPrice} [M]</p>
                    </button>
                    </div>
                }
                {product.orderable &&
                    <div className={classNames(product.orderable ? 'pl-1' : 'pl-2', 'pr-2 py-2 flex-1')}>
                    <button className={classNames((product.orderingPrice * quantity) <= user.meldas ? 'bg-yellow-300 hover:bg-yellow-400' : 'bg-yellow-200 text-gray-400', 'w-full shadow rounded font-semibold py-1 px-2')}
                        onClick={() => {
                            var businessResultingBalance = 0;
        var senderResultingBalance = 0;
        if((product.orderingPrice * quantity) <= user.meldas){
            const transferAmount = Number(quantity * product.orderingPrice);
        database.ref(`/businesses/${selectedBusiness.businessID}/meldas`).get().then(
            meldasSnapshot => {
                const amountTaxed = Math.round(Number(transferAmount) * salesTaxRate);
                businessResultingBalance = Number(meldasSnapshot.val()) + transferAmount - amountTaxed;
                database.ref(`/businesses/${selectedBusiness.businessID}/meldas`).set(businessResultingBalance);
                database.ref(`/citizens/${user.citizenID}/meldas`).get().then(
                    meldasSnapshot => {
                        senderResultingBalance = Number(meldasSnapshot.val()) - transferAmount;
                        database.ref(`/citizens/${user.citizenID}/meldas`).set(senderResultingBalance);
                        user.meldas = senderResultingBalance;
                        const transferID = generateID('MT');
                        database.ref(`/citizens/${user.citizenID}/transfers/${transferID}`).set(
                        {
                            transferID: transferID,
                            date: `${getDate()}, ${getYear()}`,
                            time: getTime(),
                            ssre: Math.round(((new Date()).getTime()/1000)-rushingtonEpoch),
                            amount: transferAmount,
                            receiverID: selectedBusiness.businessID,
                            receiverName: selectedBusiness.name,
                            type: "Outgoing",
                            reason: `Ordered ${quantity} of '${product.name}'`,
                            resultingBalance: senderResultingBalance,
                            ssre: Math.round(((new Date()).getTime()/1000)-rushingtonEpoch),
                        }
                        
                    );
                    database.ref(`/businesses/${selectedBusiness.businessID}/transfers/${transferID}`).set(
                        {
                            transferID: transferID,
                            date: `${getDate()}, ${getYear()}`,
                            time: getTime(),
                            ssre: Math.round(((new Date()).getTime()/1000)-rushingtonEpoch),
                            amount: transferAmount - amountTaxed,
                            senderID: user.citizenID,
                            senderName: user.name,
                            type: "Incoming",
                            reason: `Ordered ${quantity} of '${product.name}'`,
                            resultingBalance: businessResultingBalance,
                            ssre: Math.round(((new Date()).getTime()/1000)-rushingtonEpoch),
                        }
                        
                    );
                    const purchaseID = generateID('PU');
                    database.ref(`/citizens/${user.citizenID}/businessPurchases/${purchaseID}`).set(
                        {
                            purchaseID: purchaseID,
                            type: 'Order',
                            delivered: false,
                            product: {
                                name: product.name,
                                productID: product.productID,
                                orderingPrice: product.orderingPrice
                            },
                            business: {
                                businessID: selectedBusiness.businessID,
                                name: selectedBusiness.name,
                                description: selectedBusiness.description
                            },
                            quantity: quantity,
                            total: transferAmount,
                            timePurchased: getTime(),
                            datePurchased: getDate(),
                            yearPurchased: getYear(),
                            ssre: Math.round(((new Date()).getTime()/1000)-rushingtonEpoch)
                        }
                    );
                    database.ref(`/businesses/${selectedBusiness.businessID}/orders/${purchaseID}`).set(
                        {
                            purchaseID: purchaseID,
                            delivered: false,
                            product: {
                                name: product.name,
                                productID: product.productID,
                                orderingPrice: product.orderingPrice
                            },
                            business: {
                                businessID: selectedBusiness.businessID,
                                name: selectedBusiness.name,
                                description: selectedBusiness.description
                            },
                            customer: {
                                citizenID: user.citizenID,
                                name: user.name
                            },
                            quantity: quantity,
                            total: transferAmount - amountTaxed,
                            timePurchased: getTime(),
                            datePurchased: getDate(),
                            yearPurchased: getYear(),
                            ssre: Math.round(((new Date()).getTime()/1000)-rushingtonEpoch)
                        }
                    );
                    if(amountTaxed > 0){
                        const taxTransferID = generateID('MT');
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
                    setUser(user);
                    localStorage.setItem('user', JSON.stringify(user));
                    updateBusiness();
                    }
                    
                )
            }
        );
        }
                        }}
                    >
                        <div className='flex justify-center'>
                            ORDER
                        </div>
                        <p>{quantity * product.orderingPrice} [M]</p>
                    </button>
                    </div>
                }
                </div>
                {userIsOwner &&
                    <div className='grid grid-cols-2 p-2 gap-2'>
                        
                        <button className='shadow rounded font-semibold py-1 px-2 bg-yellow-300 hover:bg-yellow-400'>
                        <div className='flex justify-center'
                            onClick={() => {
                                setProductBeingEdited(product);
                                setEditItemPopupOpen(true);
                            }}
                        >
                            <PencilAltIcon className='w-6 h-6'/>
                            EDIT
                            
                        </div>
                        
                        </button>
                        <button className='shadow rounded font-semibold py-1 px-2 bg-yellow-300 hover:bg-yellow-400'>
                        <div className='flex justify-center'
                            onClick={() => {
                                database.ref(`/businesses/${selectedBusiness.businessID}/products/${product.productID}`).set(null);
                                updateBusiness();
                            }}
                        >
                            <XCircleIcon className='w-6 h-6'/>
                            DELETE
                        </div>
                        </button>
                    </div>
                }
            </div>
        )
    }

    function Transfer({transfer}){
    
        return(
            <div className='rounded bg-white shadow'>
                <div className='w-full lg:flow-root'>
                <p className='lg:float-left pl-2 pt-2 font-semibold text-gray-700'>{transfer.date} at {transfer.time}</p>
                <p className='lg:float-right lg:pl-0 pl-2 pr-2 pt-2 font-semibold text-gray-700'>{transfer.transferID} {transfer.ssre}</p>
                </div>
                <div className='grid grid-cols-4 lg:gap-3 gap-y-3 p-2'>
                {transfer.type == "Incoming" ?
                <div className='col-span-4 lg:col-span-2 grid grid-cols-2'>
                            <div className='col-span-1'>
                                <p className='font-semibold'>Amount</p>
                                <p className='text-green-700'>+{transfer.amount} [M]</p>
                            </div>
                            <div className='col-span-1'>
                                <p className='font-semibold'>Sender</p>
                                <p className=''>{transfer.senderName}</p>
                                <p className=''>{transfer.senderName != 'Rushington Government' && transfer.senderName != 'Rushington Bank' ? 
                                    censor(transfer.senderID) : ''}</p>
                            </div>
                            </div>
                :    
                <div className='col-span-4 lg:col-span-2 grid grid-cols-2'>
                <div className='col-span-1'>
                    <p className='font-semibold'>Amount</p>
                    <p className='text-red-700'>-{transfer.amount} [M]</p>
                </div>
                <div className='col-span-1'>
                    <p className='font-semibold'>Receiver</p>
                    <p className=''>{transfer.receiverName}</p>
                    <p className=''>{transfer.receiverName != 'Rushington Government' && transfer.receiverName != 'Rushington Bank' ? 
                                    censor(transfer.receiverID) : ''}</p>
                </div>
                </div>
                        }
                <div className='col-span-2 lg:col-span-1'>
                                <p className='font-semibold'>Reason</p>
                                <p className=''>{transfer.reason}</p>
                            </div>
                <div className='col-span-2 lg:col-span-1'>
                                <p className='font-semibold'>Resulting Balance</p>
                                <p className=''>{transfer.resultingBalance} [M]</p>
                            </div>
                        </div>
                </div>
        )
    
}

    function AddItemPopupBody({}){
        const [newItemBuyingPrice, setNewItemBuyingPrice] = useState(null);
        const [newItemOrderingPrice, setNewItemOrderingPrice] = useState(null);
        const [newItemName, setNewItemName] = useState('');
        const [newItemBuyable, setNewItemBuyable] = useState(true);
        const [newItemOrderable, setNewItemOrderable] = useState(false);

        function generateProductID(){
            var productID = 'PR-'
            for(var i = 0; i < 5; i++){
                productID = productID + String(Math.floor(Math.random()*10));
            }
            return(productID);
        }

        function onClickAddItemButton(){
            if(newItemName && (newItemBuyable ? newItemBuyingPrice > 0 : true) && (newItemOrderable ? newItemOrderingPrice > 0 : true) && (newItemOrderable || newItemBuyable)){
                const newProductID = generateProductID();
                database.ref(`/businesses/${selectedBusiness.businessID}/products/${newProductID}`).set(
                    {
                        productID: newProductID,
                        name: newItemName,
                        buyingPrice: newItemBuyingPrice,
                        orderingPrice: newItemOrderingPrice,
                        buyable: newItemBuyable,
                        orderable: newItemOrderable
                    }
                );
                updateBusiness();
                setAddItemPopupOpen(false);
            }
        }
        return(
            <div className='w-full justify-center '>
            <div className='pb-4'>
            <div className='p-5 bg-blue-200 rounded shadow'>
                
                <div className=''>
                <p className='text-sm font-bold'>PRODUCT NAME</p>
                <input className='rounded p-1 w-full border-2 border-gray-500 focus:border-gray-700 focus:ring-1 focus:ring-gray-700 focus:outline-none'
                    onChange={event => {setNewItemName(event.target.value)}}
                ></input>
                </div>
                <div className='bg-white shadow rounded'>
                <div className='mt-4 flow-root'>
                    <p className='float-left pt-2 font-bold pl-2'>Buyable</p>
                    <Switch
                    className='float-right'
                    checked={newItemBuyable}
                    onChange={() => {
                        if(newItemBuyable){
                            setNewItemBuyingPrice(null);
                        }
                        setNewItemBuyable(!newItemBuyable)
                    }}
                    color='primary'
                />
                </div>
                <p className='text-center text-gray-700 text-sm font-semibold w-full p-2'>
                    With this option selected, people will click buy when they take it from your store, and money will just be transferred
                </p>
                {newItemBuyable &&
                <div className='px-4 pb-4 pt-1'>
                <p className='text-sm font-bold'>BUYING PRICE</p>
                <div className='flex w-full justify-center'>
                <input type='Number' placeholder='' min={0} onChange={event => {setNewItemBuyingPrice(event.target.value)}} className='rounded appearance-textfield flex justify-center w-full focus:outline-none border-2 border-gray-500 focus:border-gray-700 focus:ring-1 focus:ring-gray-700 p-1'></input>
                <p className='font-semibold pl-1 text-xl'>[M]</p>
                </div>
                </div>}
                </div>
                <div className='bg-white shadow rounded'>
                <div className='mt-4 flow-root'>
                    <p className='float-left pt-2 font-bold pl-2'>Orderable</p>
                    <Switch
                    className='float-right'
                    checked={newItemOrderable}
                    onChange={() => {
                        if(newItemOrderable){
                            setNewItemOrderingPrice(null);
                        }
                        setNewItemOrderable(!newItemOrderable)
                    }}
                    color='primary'
                />
                    
                </div>
                <p className='text-center text-gray-700 text-sm font-semibold w-full p-2'>
                    With this option selected, people will click order, money will be transferred, and the order will be added to an order queue that your business is expected to fulfill
                </p>
                {newItemOrderable &&
                <div className='px-4 pb-4 pt-1'>
                <p className='text-sm font-bold'>ORDERING PRICE</p>
                <div className='flex w-full justify-center'>
                <input type='Number' placeholder='' min={0} onChange={event => {setNewItemOrderingPrice(event.target.value)}} className='rounded appearance-textfield flex justify-center w-full focus:outline-none border-2 border-gray-500 focus:border-gray-700 focus:ring-1 focus:ring-gray-700 p-1'></input>
                <p className='font-semibold pl-1 text-xl'>[M]</p>
                </div>
                </div>}
                </div>
                
            </div>
            </div>
            <div className='flex justify-center'>
            <button className={classNames(
                newItemName && (newItemBuyable ? newItemBuyingPrice > 0 : true) && (newItemOrderable ? newItemOrderingPrice > 0 : true) && (newItemOrderable || newItemBuyable) ? 'text-black bg-yellow-300 hover:bg-yellow-400' : 'text-gray-400 bg-yellow-100',
                'rounded py-1 px-2 font-semibold flex shadow')}
                onClick={onClickAddItemButton}
            >
                <PlusCircleIcon className='w-6 h-6'/>
                ADD</button>
            </div>
        </div>
        )
    }

function EditProductPopupBody({}){
        const [itemBuyingPrice, setItemBuyingPrice] = useState(productBeingEdited.buyingPrice ? productBeingEdited.buyingPrice : null);
        const [itemOrderingPrice, setItemOrderingPrice] = useState(productBeingEdited.orderingPrice ? productBeingEdited.orderingPrice : null);
        const [itemName, setItemName] = useState(productBeingEdited.name);
        const [itemBuyable, setItemBuyable] = useState(productBeingEdited.buyable ? true : null);
        const [itemOrderable, setItemOrderable] = useState(productBeingEdited.orderable ? true : null);

        function onClickSaveItemButton(){
            if(itemName && (itemBuyable ? itemBuyingPrice > 0 : true) && (itemOrderable ? itemOrderingPrice > 0 : true) && (itemOrderable || itemBuyable)){
                database.ref(`/businesses/${selectedBusiness.businessID}/products/${productBeingEdited.productID}`).set(
                    {
                        productID: productBeingEdited.productID,
                        name: itemName,
                        buyingPrice: itemBuyingPrice,
                        orderingPrice: itemOrderingPrice,
                        buyable: itemBuyable,
                        orderable: itemOrderable
                    }
                );
                updateBusiness();
                setEditItemPopupOpen(false);
            }
        }
        return(
            <div className='w-full justify-center '>
            <div className='pb-4'>
            <div className='p-5 bg-blue-200 rounded shadow'>
                
                <div className=''>
                <p className='text-sm font-bold'>PRODUCT NAME</p>
                <input className='p-1 w-full border-2 border-gray-500 focus:border-gray-700 focus:ring-1 focus:ring-gray-700 focus:outline-none'
                    value={itemName}
                    onChange={event => {setItemName(event.target.value)}}
                ></input>
                </div>
                <div className='bg-white shadow rounded'>
                <div className='mt-4 flow-root'>
                    <p className='float-left pt-2 font-bold pl-2'>Buyable</p>
                    <Switch
                    className='float-right'
                    checked={itemBuyable}
                    onChange={() => {
                        if(itemBuyable){
                            setItemBuyingPrice(null);
                        }
                        setItemBuyable(!itemBuyable)
                    }}
                    color='primary'
                />
                </div>
                <p className='text-center text-gray-700 text-sm font-semibold w-full p-2'>
                    With this option selected, people will click buy when they take it from your store, and money will just be transferred
                </p>
                {itemBuyable &&
                <div className='px-4 pb-4 pt-1'>
                <p className='text-sm font-bold'>BUYING PRICE</p>
                <div className='flex w-full justify-center'>
                <input type='Number' placeholder='' defaultValue={itemBuyingPrice} min={0} onChange={event => {setItemBuyingPrice(event.target.value)}} className='appearance-textfield flex justify-center w-full focus:outline-none border-2 border-gray-500 focus:border-gray-700 focus:ring-1 focus:ring-gray-700 p-1'></input>
                <p className='font-semibold pl-1 text-xl'>[M]</p>
                </div>
                </div>}
                </div>
                <div className='bg-white shadow rounded'>
                <div className='mt-4 flow-root'>
                    <p className='float-left pt-2 font-bold pl-2'>Orderable</p>
                    <Switch
                    className='float-right'
                    checked={itemOrderable}
                    onChange={() => {
                        if(itemOrderable){
                            setItemOrderingPrice(null);
                        }
                        setItemOrderable(!itemOrderable)
                    }}
                    color='primary'
                />
                    
                </div>
                <p className='text-center text-gray-700 text-sm font-semibold w-full p-2'>
                    With this option selected, people will click order, money will be transferred, and the order will be added to an order queue that your business is expected to fulfill
                </p>
                {itemOrderable &&
                <div className='px-4 pb-4 pt-1'>
                <p className='text-sm font-bold'>ORDERING PRICE</p>
                <div className='flex w-full justify-center'>
                <input type='Number' placeholder='' defaultValue={itemOrderingPrice} min={0} onChange={event => {setItemOrderingPrice(event.target.value)}} className='appearance-textfield flex justify-center w-full focus:outline-none border-2 border-gray-500 focus:border-gray-700 focus:ring-1 focus:ring-gray-700 p-1'></input>
                <p className='font-semibold pl-1 text-xl'>[M]</p>
                </div>
                </div>}
                </div>
                
            </div>
            </div>
            <div className='flex justify-center'>
            <button className={classNames(
                itemName && (itemBuyable ? itemBuyingPrice > 0 : true) && (itemOrderable ? itemOrderingPrice > 0 : true) && (itemOrderable || itemBuyable) ? 'text-black bg-yellow-300 hover:bg-yellow-400' : 'text-gray-400 bg-yellow-100',
                'rounded py-1 px-2 font-semibold flex shadow')}
                onClick={onClickSaveItemButton}
            >
                <CheckCircleIcon className='w-6 h-6'/>
                SAVE</button>
            </div>
        </div>
        )
    }

    function Order({order}){
        return(
            <div className='rounded bg-white border border-gray-400 shadow'>
                <div className='bg-gray-100 border-b border-gray-400 rounded-t p-2 lg:grid-cols-none lg:flow-root grid grid-cols-2 gap-2'>
                    <div className='lg:float-left'>
                    
                    <p className='text-gray-700 text-sm'>ORDERED</p>
                    <p className='text-lg text-gray-700 font-semibold'>
                        {order.datePurchased}, {order.yearPurchased}</p>
                    </div>
                    <div className='lg:float-left lg:pl-4'>
                    <p className='text-gray-700 text-sm'>TOTAL</p>
                    <p className='text-lg text-gray-700 font-semibold'>{order.total} [M]</p>
                    </div>
                    <div className='lg:float-left lg:pl-4'>
                    <p className='text-gray-700 text-sm'>CUSTOMER</p>
                    <p className='text-lg text-gray-700 font-semibold'>
                        {order.customer.name}</p>
                    </div>
                    <div className='lg:float-right'>
                        <p className='text-gray-700 text-sm'>PURCHASE ID</p>
                        <p className='text-lg text-gray-700 font-semibold lg:text-right'>{order.purchaseID}</p>
                    </div>
                </div>
                <div className='p-2'>
                <p className='text-2xl font-semibold'>{order.product.name} ({order.quantity})</p>
                <p className='text-blue-900 text-lg uppercase font-semibold'>{order.product.orderingPrice} [M] each</p>
            </div>
                <div className='p-2 border-t border-gray-400'>
                    {order.delivered ?
                     <p className='text-green-700 font-semibold text-lg'>Delivered {order.dateDelivered}, {order.yearDelivered} at {order.timeDelivered}</p>
                     :
                     <div>
                     <p className='font-semibold text-red-700 text-lg'>Not delivered</p>
                     <div className='flex justify-center'>
                     <button className='shadow flex rounded font-semibold py-1 px-2 bg-yellow-300 hover:bg-yellow-400'
                         onClick={() => {
                             const businessOrderReference = `/businesses/${selectedBusiness.businessID}/orders/${order.purchaseID}`;
                             database.ref(`${businessOrderReference}/delivered`).set(true);
                             database.ref(`${businessOrderReference}/timeDelivered`).set(getTime());
                             database.ref(`${businessOrderReference}/dateDelivered`).set(getDate());
                             database.ref(`${businessOrderReference}/yearDelivered`).set(getYear());
                             updateBusiness();

                             const citizenPurchaseReference = `/citizens/${order.customer.citizenID}/businessPurchases/${order.purchaseID}`;
                             database.ref(`${citizenPurchaseReference}/delivered`).set(true);
                             database.ref(`${citizenPurchaseReference}/timeDelivered`).set(getTime());
                             database.ref(`${citizenPurchaseReference}/dateDelivered`).set(getDate());
                             database.ref(`${citizenPurchaseReference}/yearDelivered`).set(getYear());
                             if(order.customer.citizenID == user.citizenID){
                             database.ref(`/citizens/${order.customer.citizenID}`).get().then(citizen => {
                                 setUser(citizen.val());
                                 localStorage.setItem('user', JSON.stringify(citizen.val()));
                             })
                            }
                         }}
                     >
                     <CheckCircleIcon className='h-6 w-6'/>
                     SET AS DELIVERED
                     </button>
                     </div>
                     </div>
                        }
                </div>
                
            </div>
        )
    }
}

export default Business;