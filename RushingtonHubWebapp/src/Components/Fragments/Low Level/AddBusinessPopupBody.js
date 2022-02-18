import { useState } from "react";

const AddBusinessPopupBody = ({database, setValues, selectedProperty, setSelectedProperty, setAddChangeBusinessPopupOpen}) => {
    const [name, setName] = useState();
    const [description, setDescription] = useState();

    function onClickAddBusinessButton(){
        const newBusiness = {
            name: name,
            description: description
        }
        database.ref(`/properties/${selectedProperty.propertyID}/business`).set(newBusiness);
        database.ref(`/citizens/${selectedProperty.owner.citizenID}/properties/${selectedProperty.propertyID}/business`).set(newBusiness);
        setValues();
        var editedSelectedProperty = JSON.parse(JSON.stringify(selectedProperty));
        editedSelectedProperty.business = newBusiness;
        setSelectedProperty(editedSelectedProperty);
        setAddChangeBusinessPopupOpen(false);
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
                <input className='p-1 w-full border-2 border-gray-500 focus:border-gray-700 focus:ring-1 focus:ring-gray-700 focus:outline-none'
                    defaultValue={selectedProperty.business != undefined ? selectedProperty.business.name : ''}
                    onChange={event => {setName(event.target.value)}}
                ></input>
                </div>
                <div className='pt-2'>
                <p className='text-sm font-bold'>DESCRIPTION</p>
                
                <textarea className='p-1 w-full border-2 border-gray-500 focus:border-gray-700 focus:ring-1 focus:ring-gray-700 resize-none focus:outline-none'
                    defaultValue={selectedProperty.business != undefined ? selectedProperty.business.description : ''}
                    onChange={event => {setDescription(event.target.value)}}
                ></textarea>
                </div>
            </div>
            </div>
            <button className={classNames(
                name && description ? 'text-black bg-yellow-300 hover:bg-yellow-400' : 'text-gray-400 bg-yellow-100',
                'w-1/3 rounded py-1 px-2 font-semibold')}
                onClick={onClickAddBusinessButton}
            >Add</button>
        </div>
    )
}

export default AddBusinessPopupBody;