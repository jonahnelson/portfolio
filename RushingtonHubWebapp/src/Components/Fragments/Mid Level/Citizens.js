import { useEffect, useState } from "react";

const Citizens = ({database, user}) => {

    const [citizens, setCitizens] = useState([]);
    const [filteredCitizens, setFilteredCitizens] = useState([]);

    useEffect(updateCitizens, []);

    function updateCitizens(){
        database.ref('/citizens').get().then(citizensSnapshot => {
            if(citizensSnapshot.val() != undefined){
                setCitizens(Object.values(citizensSnapshot.val()));
                setFilteredCitizens(Object.values(citizensSnapshot.val()).sort((citizen1, citizen2) => {
                    return citizen1.name.localeCompare(citizen2.name);
                }));
            }
        })
    }

    function censor(citizenID){
        return(user.citizenID != citizenID ? `CI-***${citizenID.substring(6, 8)}` : citizenID);
    }

    function classNames(...classes) {
        return classes.filter(Boolean).join(" ");
    }

    return(
        <div className='mx-1 lg:mx-10 my-1 lg:my-5'>
            <div className='py-2 w-full'>
                <p className='text-4xl font-bold'>Citizens</p>
            </div>
            <div className='px-2 py-1 lg:px-6 lg:py-3 rounded bg-gray-100'>
                <input className='rounded w-full border-2 border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-700 focus:border-gray-700 p-2 mt-3 mb-6'
                    placeholder='Search'
                    onChange={event => {
                        setFilteredCitizens(citizens.filter(citizen => {
                            return citizen.name.toUpperCase().includes(event.target.value.toUpperCase());
                          }).sort((citizen1, citizen2) => {
                            return citizen1.name.localeCompare(citizen2.name);
                          }))
                    }}
                    ></input>
            {filteredCitizens.map(citizen => {
                return(
                    <div className='lg:py-3 py-1'>
                        <Citizen citizen={citizen}/>
                    </div>
                )
            })}
            </div>
        </div>
    )

    function Citizen({citizen}){
        return(
            <button className={classNames('w-full')}
                onClick={(event) => {
                    event.preventDefault();
                    database.ref(`/citizens/${citizen.citizenID}`).get().then(citizenSnapshot => {
                        localStorage.setItem('selectedCitizen', JSON.stringify(citizenSnapshot.val()));
                        window.location.href = '/profile';
                    })
                }}
            >
                <div className='w-full bg-white border-2 shadow border-gray-500'>
                    <div className='p-2 flow-root w-full'>
                        <p className='float-left text-xl font-bold'>{citizen.name}</p>
                        <p className='float-right text-xl'>{censor(citizen.citizenID)}</p>
                    </div>
                </div>
            </button>
        )
    }
}

export default Citizens;