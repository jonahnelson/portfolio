import { Menu, Transition } from "@headlessui/react"
import { Fragment, useState } from "react"

const CitizenGovernmentDropboxMenu = ({className, citizens, user, selectedCitizen, setSelectedCitizen, filteredCitizens, setFilteredCitizens}) => {
    const [searchCitizensInput, setSearchCitizensInput] = useState('')
    
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

    return(
        <Menu as="div" className={classNames("flex-shrink-0 justify-center", className)}>
                  {({ open }) => (
                    <>
                      <div className='flex justify-center'>
                        <Menu.Button className="bg-white justify-center flex rounded-lg flex px-2 py-1 text-sm ring-2 ring-gray ring-opacity-20 focus:outline-none focus:ring-opacity-100">
                            <p className='text-center'>
                              {selectedCitizen != undefined ? selectedCitizen.name : "Select Citizen..."}
                            </p>
                            <UpOrDownArrow open={open}/>
                        </Menu.Button>
                      </div>
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
                          className="z-50 absolute justify-center h-auto w-56 rounded-md shadow-lg py-1 bg-white ring-1 ring-green ring-opacity-5 focus:outline-none"
                        >
                          <div className='px-1'>
                        <input className='w-full focus:outline-none bg-gray-100 border-2 px-1 border-gray-500 focus:border-gray-700' defaultValue={searchCitizensInput} placeholder='Search'
                              onChange={event => {
                                setSearchCitizensInput(event.target.value);
                                setFilteredCitizens(citizens.filter(citizen => {
                                  console.log(filteredCitizens)
                                  return citizen.name.toUpperCase().includes(event.target.value.toUpperCase());
                                }))
                              }}></input>
                        </div>
                          <div className='max-h-40 overflow-y-scroll'>
                          {filteredCitizens.map(citizen => {
                            return(
                              <Menu.Item>
                            {({ active }) => (
                               <button
                               onClick={()=>{setSelectedCitizen(citizen)}}
                               className={classNames(
                                 active ? "bg-gray-100" : "",
                                 "block w-full text-left px-2 py-2 text-sm text-green"
                               )}
                             >
                               <div className='w-full flow-root'>
                                  <p className='float-left font-semibold'>{citizen.name}</p>
                                  <p className='float-right'>{citizen.citizenID}</p>
                               </div>
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
    )
}

export default CitizenGovernmentDropboxMenu