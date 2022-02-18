import { PlusCircleIcon } from "@heroicons/react/outline";
import Popup from '../Low Level/Popup'
import {useEffect, useState} from 'react'
import NewTransferPopupBody from "../Low Level/NewTransferPopupBody";

const Bank = ({user, citizenID, database, getTime, getDate, getYear}) => {
  
    const [newTransferPopupOpen, setNewTransferPopupOpen] = useState(false);
    const [meldas, setMeldas] = useState('...');
    const [bankAccounts, setBankAccounts] = useState([]);
    
    function censor(id){
        return(id.startsWith('CI-') && user.citizenID != id ? `CI-***${id.substring(6, 8)}` : id);
    }

    return(
        <div className='mx-1 lg:mx-10 my-1 lg:my-5'>
            <div className='flow-root py-2'>
                <div className='float-left'>
            <p className='text-4xl text-black font-bold'>Bank</p>
            
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
                    additionalComponent={()=>{return <NewTransferPopupBody database={database} bankAccounts={bankAccounts} user={user} setMeldas={setMeldas} meldas={meldas} getTime={getTime} getDate={getDate} getYear={getYear} setNewTransferPopupOpen={setNewTransferPopupOpen}/>}}
                />
                </button>
            </div>
            </div>
            <div className='p-2 lg:p-6 group bg-gray-100 rounded'>
            <div className='lg:flow-root w-full  p-1 shadow bg-white border-4 border-gray-500 text-bottom'>
                <div className='lg:float-left text-bottom bg-white'>
                <p className='text-2xl font-semibold pl-1 text-gray-700'>Current Balance</p>
                
                
                </div>
            <div className='flex justify-center text-2xl font-bold lg:float-right px-1 border-2 border-gray-500 bg-white'>
                <p className='pr-1'>{user.meldas}</p>
                <p>[M]</p>
            </div>
            </div>
            
            <div className='w-full border-gray-500 border-b-4 border-r-4 border-l-4 bg-white'>
                
                <p className='font-semibold text-gray-700 px-2 pt-2 text-2xl'>Transaction History</p>
                {user.transfers != undefined && Object.values(user.transfers).length != 0 ?
                <div className='lg:p-2 p-1 bg-gray-200'>
                {Object.values(user.transfers).sort((transfer1, transfer2) => {
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
                <p className='font-bold text-2xl'>Nothing yet</p>
                </div>
            }
                
            </div>
            </div>
            
            
            
            
        </div>
    )
    

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
                    <p className=''>{transfer.receiverName != 'Rushington Government' && transfer.receiverName != 'Rushington Bank' && transfer.receiverName != 'Real Currency' ? 
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
}


export default Bank;