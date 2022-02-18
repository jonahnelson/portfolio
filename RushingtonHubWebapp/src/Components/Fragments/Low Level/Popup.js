import React from "react";
import { EmojiSadIcon, PencilIcon } from "@heroicons/react/solid";
import { Dialog, Transition } from "@headlessui/react";
import { CheckIcon } from "@heroicons/react/outline";
import { Fragment, useRef, useState } from "react";
import axios from "axios";
import { useParams } from "react-router";

const Popup = ({ open, setOpen, header, additionalComponent }) => {
  const cancelButtonRef = useRef(null);

  // Optional additional comp. passed as prop. Has to be a function for React to use it as a component
  function AdditionalComponent(){
    return additionalComponent();
  }

  return (
    <>
      <Transition.Root show={open} as={Fragment}>
        <Dialog
          as="div"
          static
          className="fixed z-10 inset-0 overflow-y-auto "
          open={open}
          onClose={setOpen}
        >
          <div className="flex items-end justify-center  min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Overlay className="fixed inset-0 bg-gray-700 bg-opacity-30 transition-opacity" />
            </Transition.Child>

            {/* This element is to trick the browser into centering the modal contents. */}
            <span
              className="hidden sm:inline-block sm:align-middle sm:h-screen"
              aria-hidden="true"
            >
              &#8203;
            </span>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <div className="inline-block align-bottom justify-items-center bg-gray-100 rounded-lg px-4 pt-5 pb-4 overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-sm sm:w-full sm:p-6">
              <div className='flow-root w-full'>
              <button
                    type="button"
                    className="mt-3 inline-flex float-right justify-center rounded-sm border border-gray-600 shadow-sm px-4 py-1 bg-red text-base font-medium text-gray hover:bg-red-600 hover:text-white focus:outline-none sm:mt-0 sm:col-start-1 sm:text-sm"
                    onClick={() => setOpen(false)}
                    ref={cancelButtonRef}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                    
                  </button>
                  </div>
                <div>
                  <div className="flex items-center justify-center rounded-full">
                    <h1 className="text-green text-center font-semibold text-2xl px-2">{header}</h1>
                  </div>
                  <div className="mt-3 text-center sm:mt-5">
                    <Dialog.Title
                      as="h3"
                      className="text-lg leading-6 font-medium text-green"
                    >
                      
                    </Dialog.Title>
                    <div className="mt-2">
                      {additionalComponent &&
                      <AdditionalComponent/>
                      }
                      <p className="text-sm text-gray-500"></p>
                    </div>
                  </div>
                  
                </div>
                
                  
                  
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>
    </>
  );
};
export default Popup;
