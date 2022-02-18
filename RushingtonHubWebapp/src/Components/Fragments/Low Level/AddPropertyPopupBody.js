import { Menu, Transition } from "@headlessui/react"
import { Fragment, useState } from "react"

const AddPropertyPopupBody = ({database, getTime, getDate, getYear, properties, setProperties, setAddPropertyPopupOpen}) => {
  const [selectedPropertyType, setSelectedPropertyType] = useState();
  const [address, setAddress] = useState('');
  const [width, setWidth] = useState();
  const [length, setLength] = useState();
  const [price, setPrice] = useState();
  const propertyTypeOptions = ['Residential', 'Business'];
  const rushingtonEpoch = 1522648800;

  function UpOrDownArrow(props){
    if(props.open){
        return <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7" />
          </svg>} else {
        return <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
          </svg>
      }
    }

    function classNames(...classes) {
      return classes.filter(Boolean).join(" ");
    }

    function onClickAddPropertyButton(){
      if(selectedPropertyType != undefined && length != undefined && width != undefined && address != undefined && price != undefined){
        const propertyID = generatePropertyID();
        const newProperty = {
          propertyID: propertyID,
          address: address,
          type: selectedPropertyType,
          price: Number(price),
          width: Number(width),
          length: Number(length),
          size: length * width,
          ssre: Math.round(((new Date()).getTime()/1000)-rushingtonEpoch),
          dateAdded: `${getDate()}, ${getYear()}`,
          timeAdded: getTime()
        }
        database.ref(`/properties/${propertyID}`).set(newProperty);
        const editedProperties = [...properties];
        editedProperties.push(newProperty);
        setProperties(editedProperties);
        setAddPropertyPopupOpen(false);
      }
    }

    function generatePropertyID(){
      var propertyID = 'PR-'
      for(var i = 0; i < 5; i++){
          propertyID = propertyID + String(Math.floor(Math.random()*10));
      }
      return(propertyID);
    }
    return(
    <div>
      <div className='pb-4'>
        <div className='p-5 bg-blue-200 rounded shadow'>
        <div className='w-full flex gap-4 justify-center items-center pb-4'>
          <div>
        <div className='align-center'>
                    <p className='text-sm font-bold'>PROPERTY TYPE</p>
                    
        <Menu as="div" className={classNames("flex-shrink-0 align-center w-full")}>
                  {({ open }) => (
                    <>
                      
                        <Menu.Button className="bg-white w-full justify-center rounded-lg flex align-center p-2 text-sm ring-2 ring-gray ring-opacity-20 focus:outline-none focus:ring-opacity-100">
                            <p className='text-center'>
                              {selectedPropertyType != undefined ? selectedPropertyType : 'Select Property Type...'}
                            </p>
                            <UpOrDownArrow open={open}/>
                        </Menu.Button>
                      <Transition
                        show={open}
                        as={Fragment}
                        enter="transition ease-out duration-75"
                        enterFrom="transform opacity-0 scale-95"
                        enterTo="transform opacity-100 scale-100"
                        leave="transition ease-in duration-75"
                        leaveFrom="transform opacity-100 scale-100"
                        leaveTo="transform opacity-0 scale-95"
                      >
                        <div className='flex justify-center'>
                          
                        <Menu.Items
                          static
                          className="z-40 absolute justify-center h-auto w-56 rounded-md shadow-lg py-1 bg-white ring-1 ring-green ring-opacity-5 focus:outline-none"
                        >
                        

                          <div className='max-h-40'>
                          {propertyTypeOptions.map(propertyTypeOption => {
                            return(
                              <Menu.Item>
                            {({ active }) => (
                               <button
                               onClick={()=>{setSelectedPropertyType(propertyTypeOption)}}
                               className={classNames(
                                 active ? "bg-gray-100" : "",
                                 "block w-full text-left px-4 py-2 text-sm text-green"
                               )}
                             >
                              {propertyTypeOption}
                             </button>
                            )}
                          </Menu.Item>
                            )
                          })}
                          </div>
                        </Menu.Items>
                        </div>
                      </Transition>
                    </>
                  )}
                </Menu>
                </div>
                    </div>
                  
                </div>
                <div className='align-center'>
                    <p className='text-sm font-bold'>ADDRESS</p>
                    <div className='flex justify-center'>
                    <input placeholder='' onChange={event => {setAddress(event.target.value)}} className='flex justify-center border-2 border-gray-500 focus:border-gray-700 focus:outline-none bg-white p-1 w-full'></input>
                    </div>
                    </div>
                <div className='flex gap-3 justify-center pt-4'>
                      <div className='w-full'>
                        <p className='text-sm font-bold'>WIDTH</p>
                        <input className='focus:outline-none bg-white w-full p-1 border-2 border-gray-500 focus:border-gray-700'
                          onChange={event => {setWidth(event.target.value)}}
                        ></input>
                      </div>
                      <div className='w-full'>
                        <p className='text-sm font-bold'
                        >LENGTH</p>
                        <input className='focus:outline-none bg-white p-1 w-full border-2 border-gray-500 focus:border-gray-700'
                          onChange={event => {setLength(event.target.value)}}
                        ></input>
                      </div>
                      {length && width &&
                      <div className='w-full'>
                        <p className='text-sm font-bold'>SIZE</p>
                        <p className='p-1 bg-white w-full shadow border-2 border-white break-none'>{length * width} Blocks</p>
                      </div>
                      }
                </div>
                
                <div className='pt-4'>
                  <p className='text-sm font-bold'>PRICE</p>
                  <div className='flex gap-1 justify-center'>
                    <input className='focus:outline-none bg-white p-1 w-32 border-2 border-gray-500 focus:border-gray-700'
                      onChange={event => {setPrice(event.target.value)}}
                    ></input>
                    <p className='font-semibold text-lg'>[M]</p>
                  </div>
                </div>
                <div></div>
          </div>
          
          </div>
          <div className='flex justify-center'>
            <button className={classNames(
                selectedPropertyType != undefined && length != undefined && width != undefined && address != undefined && price != undefined ? 'text-black bg-yellow-300 hover:bg-yellow-400' : 'text-gray-400 bg-yellow-100',
                'w-1/3 rounded py-1 px-2 font-semibold shadow')}
                onClick={onClickAddPropertyButton}
            >ADD</button>
            </div>
    </div>
    )
}

export default AddPropertyPopupBody;