import { useState } from "react";
import { DatabaseIcon, PlusCircleIcon } from "@heroicons/react/outline";

const AddNewBusinessPopupBody = ({setAddNewBusinessPopupOpen, user, database, updateBusinesses, getTime, getDate, getYear}) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');

    function generateBusinessID(){
        var postID = 'BU-'
        for(var i = 0; i < 5; i++){
            postID = postID + String(Math.floor(Math.random()*10));
        }
        return(postID);
    }

    function classNames(...classes) {
        return classes.filter(Boolean).join(" ");
    }

    return(
        <div className='w-full justify-center '>
            <div className='pb-4'>
            <div className='p-5 bg-blue-200 rounded shadow'>
                
                <div className=''>
                <p className='text-sm font-bold'>NAME</p>
                <input className='rounded p-1 w-full border-2 border-gray-500 focus:border-gray-700 focus:ring-1 focus:ring-gray-700 focus:outline-none'
                    onChange={event => {setName(event.target.value)}}
                ></input>
                </div>
                <div className='pt-2'>
                <p className='text-sm font-bold'>DESCRIPTION</p>
                
                <textarea className='rounded p-1 w-full border-2 border-gray-500 focus:border-gray-700 focus:ring-1 focus:ring-gray-700 resize-none focus:outline-none'
                    onChange={event => {setDescription(event.target.value)}}
                ></textarea>
                </div>

                
            </div>
            </div>
            <div className='flex justify-center'>
            <button className={classNames(
                name && description ? 'text-black bg-yellow-300 hover:bg-yellow-400' : 'text-gray-400 bg-yellow-100',
                'rounded py-1 px-2 font-semibold flex shadow')}
                onClick={onClickAddBusinessButton}
            >
                <PlusCircleIcon className='w-6 h-6'/>
                ADD</button>
            </div>
        </div>
    );

    function onClickAddBusinessButton(){
        if(name && description){
            const newBusinessID = generateBusinessID();
            database.ref(`/businesses/${newBusinessID}`).set(
                {
                    businessID: newBusinessID,
                    name: name,
                    description: description,
                    founder: {
                        citizenID: user.citizenID,
                        name: user.name
                    },
                    owners: {0: {
                        citizenID: user.citizenID,
                        name: user.name    
                    }},
                    timeAdded: getTime(),
                    dateAdded: getDate(),
                    yearAdded: getYear(),
                    meldas: 0
                }
            );
            updateBusinesses();
            setAddNewBusinessPopupOpen(false);
        }
    }
}

export default AddNewBusinessPopupBody;