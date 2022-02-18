import { useEffect, useState } from "react";
import { PlusCircleIcon, CreditCardIcon } from "@heroicons/react/outline";
import AddNewBusinessPopupBody from '../Low Level/AddNewBusinessPopupBody';
import Popup from '../Low Level/Popup'

const Businesses = ({database, user, setUser, getTime, getDate, getYear}) => {
    const [businesses, setBusinesses] = useState([]);
    const [userBusinesses, setUserBusinesses] = useState([]);
    const [filteredBusinesses, setFilteredBusinesses] = useState([]);
    const [selectedSection, setSelectedSection] = useState('All');
    const [addNewBusinessPopupOpen, setAddNewBusinessPopupOpen] = useState(false);

    const userHasBAOLicense = user.licenses != undefined ? () => {
        var found = false;
        Object.values(user.licenses).forEach(license => {
            if(license.licenseID == 'LI-67981'){
                found = true;
            }
        })
        return found;
    } : false;

    useEffect(updateBusinesses, []);

    function updateBusinesses(){
        database.ref('/businesses').get().then(businessesSnapshot => {
            if(businessesSnapshot.val()){
                setBusinesses(Object.values(businessesSnapshot.val()));
                setFilteredBusinesses(Object.values(businessesSnapshot.val()).sort((business1, business2) => {
                    return business1.name.localeCompare(business2.name);
                  }));
                setUserBusinesses(Object.values(businessesSnapshot.val()).filter(business => {
                    return checkUserIsOwner(business);
                }))
            }
        })
    }

    function checkUserIsOwner(business){
        var userIsOwner = false;
        Object.values(business.owners).forEach(owner => {
            if(owner.citizenID == user.citizenID) userIsOwner = true;
        });
        return userIsOwner;
    }

    function classNames(...classes) {
        return classes.filter(Boolean).join(" ");
    }

    return(
        <div className='mx-1 lg:mx-10 my-1 lg:my-5'>
            <div className='py-2 w-full'>
                <p className='text-4xl font-bold border-b border-gray-500 pb-4'>Businesses</p>
            </div>
            <div className='pt-4 border-b border-gray-500'>
                <button className={classNames(
                    selectedSection == 'All' ? 'border-b-4 border-yellow-300 font-bold hover:bg-gray-100 rounded-t' : 'text-gray-400 hover:text-gray-500 hover:bg-gray-100 rounded',
                    'w-1/3 py-1 px-1')}
                    onClick={() => {
                        setSelectedSection('All');
                    }}
                    >ALL BUSINESSES</button>
                <button className={classNames(
                    selectedSection == 'Purchases' ? 'border-b-4 border-yellow-300 font-bold hover:bg-gray-100 rounded-t' : 'text-gray-400 hover:text-gray-500 hover:bg-gray-100 rounded',
                    'w-1/3 py-1 px-1')}
                    onClick={() => {
                        setSelectedSection('Purchases');
                    }}
                    >MY PURCHASES</button>
                <button className={classNames(
                    selectedSection == 'My' ? 'border-b-4 border-yellow-300 font-bold hover:bg-gray-100 rounded-t' : 'text-gray-400 hover:text-gray-500 hover:bg-gray-100 rounded',
                    'w-1/3 py-1 px-1')}
                    onClick={() => {
                        setSelectedSection('My');
                    }}
                    >MY BUSINESSES</button>
            </div>
            <div className='px-2 py-1 lg:px-6 lg:py-3 rounded-b bg-gray-200'>
                {selectedSection == 'All' &&
                    <div>
                <input className='rounded w-full border-2 border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-700 focus:border-gray-700 p-2 mt-3 mb-6'
                    placeholder='Search businesses...'
                    onChange={event => {
                        setFilteredBusinesses(businesses.filter(business => {
                            return business.name.toUpperCase().includes(event.target.value.toUpperCase());
                          }).sort((business1, business2) => {
                            return business1.name.localeCompare(business2.name);
                          }))
                    }}
                    ></input>
            {filteredBusinesses.map(filteredBusiness => {
                return(
                    <div className='lg:py-3 py-1'>
                        <Business business={filteredBusiness}/>
                    </div>
                )
            })}
            </div>
            }
            {selectedSection == 'Purchases' &&
            <div>
                {user.businessPurchases != undefined &&
                    <div>
                        {Object.values(user.businessPurchases).sort((purchase1, purchase2) => {
                            return(purchase2.ssre - purchase1.ssre);
                        }).map(purchase => {
                            return(
                            <div className='py-2'>
                                <Purchase purchase={purchase}/>
                            </div>)
                        })}
                    </div>
                }
                {user.businessPurchases == undefined &&
                    <p className='text-gray-700 font-semibold text-center py-2'>NO PURCHASES YET</p>
                }
            </div>
            }
            {selectedSection == 'My' && userHasBAOLicense &&
            <div>
                <div className='flex justify-center py-3 lg:py-0'>
                <button className='bg-yellow-300 hover:bg-yellow-400 font-semibold py-1 px-2 flex rounded shadow justify-center'
                    onClick={() => {
                        setAddNewBusinessPopupOpen(true);
                    }}
                >
                    
                    <PlusCircleIcon className='w-6 h-6'/>
                    ADD NEW BUSINESS
                    <Popup
                        open={addNewBusinessPopupOpen}
                        setOpen={setAddNewBusinessPopupOpen}
                        header='New Business'
                        additionalComponent={() => {return(<AddNewBusinessPopupBody
                            setAddNewBusinessPopupOpen={setAddNewBusinessPopupOpen}
                            updateBusinesses={updateBusinesses}
                            getTime={getTime} getDate={getDate} getYear={getYear}
                            user={user} database={database}
                        />)}}
                    />
                </button>
                </div>
                {userBusinesses.length == 0 ?
                    <p className='text-center text-gray-700 font-semibold pt-4'>NONE YET</p>
                    :
                    <div className=''>
                        {userBusinesses.map(business => {
                            return(
                                <div className='lg:py-3 py-1'>
                                    <Business business={business}/>
                                </div>
                            )
                        })}
                    </div>
                }
            </div>
            }
            {selectedSection == 'My' && !userHasBAOLicense &&
            <div>
                <p className='text-center text-gray-700 font-semibold pt-4'>YOU DON'T HAVE A BUSINESS AND ORGANIZATION LICENSE</p>
                <div className='flex justify-center py-2'>
                <a 
                    href='/licenses'
                    className='bg-yellow-300 py-1 px-2 flex hover:bg-yellow-400 font-semibold rounded shadow'>
                    <CreditCardIcon className='w-6 h-6'/>
                    GO TO LICENSES</a>
                </div>
            </div>
            }
            </div>
        </div>
    )

function Purchase({purchase}){
    return(
        <div className='rounded bg-white border border-gray-400 shadow'>
            <div className='bg-gray-100 border-b border-gray-400 rounded-t p-2 lg:grid-cols-none lg:flow-root grid grid-cols-2 gap-2'>
                    <div className='lg:float-left'>
                    
                    <p className='text-gray-700 text-sm'>{purchase.type == 'Buy' ? 'BOUGHT' : 'ORDERED'}</p>
                    <p className='text-lg text-gray-700 font-semibold'>
                        {purchase.datePurchased}, {purchase.yearPurchased}</p>
                    </div>
                    <div className='lg:float-left lg:pl-4'>
                    <p className='text-gray-700 text-sm'>TOTAL</p>
                    <p className='text-lg text-gray-700 font-semibold'>{purchase.total} [M]</p>
                    </div>
                    <div className='lg:float-left lg:pl-4'>
                    <p className='text-gray-700 text-sm'>BUSINESS</p>
                    <p className='text-lg text-gray-700 font-semibold'>
                        {purchase.business.name}</p>
                    
                    </div>
                    <div className='lg:float-right'>
                        <p className='text-gray-700 text-sm'>PURCHASE ID</p>
                        <p className='text-lg text-gray-700 font-semibold lg:text-right'>{purchase.purchaseID}</p>
                    </div>
                </div>
            <div className='p-2'>
                <p className='text-2xl font-semibold'>{purchase.product.name} ({purchase.quantity})</p>
                <p className='text-blue-900 text-lg uppercase font-semibold'>{purchase.type == 'Buy' ? purchase.product.buyingPrice : purchase.product.orderingPrice} [M] each</p>
            </div>
            {purchase.type == 'Order' &&
            <div className='p-2 border-t border-gray-400'>
                {purchase.delivered ?
                    <p className='text-green-700 font-semibold text-lg'>Delivered {purchase.dateDelivered}, {purchase.yearDelivered} at {purchase.timeDelivered}</p>
                     :
                    <p className='font-semibold text-red-700 text-lg'>Not delivered</p>
                }
            </div>
            }
        </div>
    )
}
function Business({business}){
    return(
        <button className={classNames('w-full')}
            onClick={(event) => {
                event.preventDefault();
                database.ref(`/businesses/${business.businessID}`).get().then(businessSnapshot => {
                    localStorage.setItem('selectedBusiness', JSON.stringify(businessSnapshot.val()));
                    window.location.href = '/business';
                })
            }}
        >
            <div className='w-full bg-white border-2 shadow border-gray-500'>
                <div className='p-2 flow-root w-full'>
                    <p className='float-left text-xl font-bold'>{business.name}</p>
                    <p className='float-right text-xl'>{business.founder.name}</p>
                </div>
            </div>
        </button>
    )
}
}

export default Businesses;