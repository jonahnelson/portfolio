import { useEffect, useState } from "react";

const Properties = ({database}) => {

    const [properties, setProperties] = useState([]);
    const [filteredProperties, setFilteredProperties] = useState([]);

    useEffect(updateProperties, []);

    function updateProperties(){
        database.ref('/properties').get().then(propertiesSnapshot => {
            setProperties(Object.values(propertiesSnapshot.val()).sort((property1, property2) => {
                return property1.address.localeCompare(property2.address);
            }));
            setFilteredProperties(Object.values(propertiesSnapshot.val()).sort((property1, property2) => {
                return property1.address.localeCompare(property2.address);
            }));
        })
    }

    function classNames(...classes) {
        return classes.filter(Boolean).join(" ");
    }

    return(
        <div className='mx-1 lg:mx-10 my-1 lg:my-5'>
            <div className='py-2 w-full'>
                <p className='text-4xl font-bold'>Properties</p>
            </div>
            <div className='px-2 py-1 lg:px-6 lg:py-3 rounded bg-gray-100'>
                <input className='w-full border-2 border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-700 focus:border-gray-700 p-2 mt-3 mb-6'
                    placeholder='Search'
                    onChange={event => {
                        setFilteredProperties(properties.filter(property => {
                            return property.address.toUpperCase().includes(event.target.value.toUpperCase());
                          }))
                    }}
                    ></input>
            {filteredProperties.map(property => {
                return(
                    <div className='lg:py-3 py-1'>
                        <Property property={property}/>
                    </div>
                )
            })}
            </div>
        </div>
    );

    function Property({property}){
        return(
            <div className={classNames('')}>
                                            <div className='w-full bg-white border-2 shadow border-gray-500 grid grid-cols-3'>
                                                <div className='col-span-3 p-2 flow-root'>
                                                    <div className='float-left'>
                                                    <p className={classNames('text-xl', 'font-bold')}>{property.address}</p>
                                                    <p className={classNames('text-sm', 'uppercase font-semibold')}>{property.type}</p>
                                                    </div>
                                                </div>
                                                <div className='col-span-1 p-2'>
                                                    <p className='font-semibold'>Property ID</p>
                                                    <p>{property.propertyID}</p>
                                                </div>
                                                <div className='col-span-1 p-2'>
                                                    <p className='font-semibold'>Date Property Added</p>
                                                    <p>{property.dateAdded}</p>
                                                </div>
                                                <div className='col-span-1 p-2'>
                                                    <p className='font-semibold'>Owner</p>
                                                    <p>{property.owner != undefined ? property.owner.name : 'Available'}</p>
                                                </div>
                                                {property.type == 'Business' &&
                                                <div className='col-span-3 p-2'>
                                                    <div>
                                                        <p className='font-semibold'>Business Name</p>
                                                        <p>{property.business != undefined ? property.business.name : 'None yet'}</p>
                                                    </div>
                                                    <div>
                                                        <p className='font-semibold pt-3'>Business Description</p>
                                                        <p>{property.business != undefined ? property.business.description : 'None yet'}</p>
                                                    </div>
                                                </div>
                                                }
                                            </div>
                                            </div>
        )
    }
}

export default Properties;