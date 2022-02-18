import React, { Fragment } from "react";
import { Menu, Popover, Transition } from "@headlessui/react";
import { MenuIcon, XIcon } from "@heroicons/react/outline";
import Logo from '../../../logo.svg';



function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

// Changes navigation links based on if the user is an admin. If they aren't, I don't want them
// seeing the government nav link, even though they can't access it anyway at .../government
const navLinksAdmin = [
  { title: "Home", active: true, href: "/" },
  { title: "All Resources", active: false, href: "/resources" },
  { title: "Profile", active: false, href: '/profile'},
  { title: "Government", active: false, href: "/government"}
];

const navLinksUser = [
  { title: "Home", active: true, href: "/" },
  { title: "All Resources", active: false, href: "/resources" },
  { title: "Profile", active: false, href: '/profile'},
];

const Header = ({
  setSignedIn,
  isAdmin,
  setIsAdmin,
  currentTime,
  currentDate,
  currentYear,
  user,
  setUser
}) => {

  // The local storage values are set so that you can't refresh the page after logging out and stay logged in, since
  // the initial values are set to the local storage values at the top
  function signOut(){
        setUser(null);
        setIsAdmin(null);
        localStorage.setItem('signedIn', null);
        localStorage.setItem('user', null);
        localStorage.setItem('isAdmin', null);
        setSignedIn(null);
  }

  // Censor function ready in case I ever implement a settings page that would allow user to hide or show
  // their citizen ID in case they want to screenshot or show something to someone else without giving
  // away their citizen ID
  function censor(citizenID){
      return citizenID;
  }

  return (
    <Popover as="header" className="pb-24 bg-gray-100 align-bottom">
      {({ open }) => (
        <>
          <a className='lg:hidden bg-black w-full flow-root px-2 pt-2.5 pb-1 h-10 fixed z-50'
            href='/calendar'
          >
              <p className='text-white float-right font-semibold'>{currentDate}, {currentYear}</p>
              <p className='text-white float-left font-semibold'>{currentTime}</p>
          </a>
          <div className=" px-4 sm:px-6 pt-9 lg:pt-0 w-full">
            <div className="relative pt-5 pb-1 align-items-bottom items-baseline h-16 lg:h-24">
            <div className='flow-root w-full align-bottom'>
                        <div className='absolute bottom-1 lg:bottom-0 left-0'>
                           {/* Logo */}
              <div className="shadow bg-white border-l-2 border-b-2 border-blue-300 border-b-blue-200">
                <a href="/">
                  <span className="sr-only">Workflow</span>
                  <p className='text-3xl font-bold text-gray-700 p-1 border-r-2 border-t-2 border-yellow-300'>Rushington Hub</p>
                </a>
              </div>
              <a
              href='/calendar'
              className='hidden lg:flow-root hover:bg-white px-1 hover:border hover:border-1 hover:border-gray-700'>
                          <div className='float-left'>
                        <p className='text-base text-gray-700 font-semibold'>{currentTime}</p>
                        </div>
                        <p className='text-base text-gray-700 float-right font-semibold'>{currentDate}, {currentYear}</p>
                        </a>
                              </div>
              {/* Right section on desktop */}
              <div className="absolute bottom-0 right-0">
                {/* Profile dropdown */}
                <Menu as="div" className="relative flex-shrink-0">
                  {({ profileOpen }) => (
                    <>
                      <div>
                        <Menu.Button className="bg-gray hover:bg-white px-2 rounded text-right text-sm focus:outline-none focus:ring-opacity-100">
                                <p className='lg:text-lg text-gray-700 font-semibold'>{censor(user.citizenID)}</p>
                                <p className='lg:text-lg text-gray-700 font-semibold'>{user.name}</p>
                        </Menu.Button>
                      </div>
                      <Transition
                        show={profileOpen}
                        as={Fragment}
                        enter="transition ease-out duration-75"
                        enterFrom="transform opacity-0 scale-95"
                        enterTo="transform opacity-100 scale-100"
                        leave="transition ease-in duration-75"
                        leaveFrom="transform opacity-100 scale-100"
                        leaveTo="transform opacity-0 scale-95"
                      >
                        <Menu.Items
                          static
                          className="origin-top-right z-40 absolute -right-2 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-green ring-opacity-5 focus:outline-none"
                        >
                          <Menu.Item>
                            {({ active }) => (
                               <button
                               onClick={event => {
                                      event.preventDefault();
                                      localStorage.setItem('selectedCitizen', JSON.stringify(user));
                                      window.location.href = '/profile';
                              }}
                               className={classNames(
                                 active ? "bg-gray-100" : "",
                                 "block px-4 py-2 text-sm w-full text-left text-green"
                               )}
                             >
                              Profile
                             </button>
                            )}
                          </Menu.Item>
                          {
                            // Settings link in case I ever implement them
                          }
                          {/* <Menu.Item>
                            {({ active }) => (
                               
                              <a
                              href='/settings'
                              className={classNames(
                                active ? "bg-gray-100" : "",
                                "block px-4 py-2 text-sm text-green w-full text-left"
                              )}
                              >Settings</a>
                             
                            )}
                          </Menu.Item> */}
                          <Menu.Item>
                            {({ active }) => (
                               
                              <a onClick={signOut}
                              href='/'
                              className={classNames(
                                active ? "bg-gray-100" : "",
                                "block px-4 py-2 text-sm text-green w-full text-left"
                              )}
                              >Sign Out</a>
                             
                            )}
                          </Menu.Item>
                          
                        </Menu.Items>
                      </Transition>
                    </>
                  )}
                </Menu>
              </div>
              </div>
              {/* Menu button */}
              <div className="absolute right-0 flex-shrink-0 hidden">
                {/* Mobile menu button */}
                <Popover.Button className="bg-transparent p-2 rounded-md inline-flex items-center justify-center text-green hover:text-green hover:bg-gray hover:bg-opacity-10">
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <XIcon className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <MenuIcon className="block h-6 w-6" aria-hidden="true" />
                  )}
                </Popover.Button>
              </div>
              </div>

            <div className="lg:block border-t border-gray-700 border-opacity-40 py-3">
              <div className="lg:grid lg:grid-cols-3 lg:gap-8 lg:items-center">
                <div className="lg:col-span-2">
                  {isAdmin &&
                  <nav className="flex lg:space-x-4">
                    {navLinksAdmin.map((link) => (
                      <a
                        key={link.title}
                        href={link.href}
                        onClick={event => {
                          if(link.href == '/profile'){
                                event.preventDefault();
                                localStorage.setItem('selectedCitizen', JSON.stringify(user));
                                window.location.href = '/profile';
                          }
                        }}
                        className={classNames(
                          link.active ? "text-blue-600" : "text-blue-600",
                          "flex-auto lg:flex-none text-center lg:text-left text-sm font-semibold rounded-md px-3 py-2 hover:bg-gray-200"
                        )}
                        aria-current={link.active ? "page" : "false"}
                      >
                        {link.title}
                      </a>
                    ))}
                  </nav>}
                  {!isAdmin &&
                  <nav className="flex lg:space-x-4">
                  {navLinksUser.map((link) => (
                    <a
                      key={link.title}
                      href={link.href}
                      onClick={event => {
                        if(link.href == '/profile'){
                              event.preventDefault();
                              localStorage.setItem('selectedCitizen', JSON.stringify(user));
                              window.location.href = '/profile';
                        }
                      }}
                      className={classNames(
                        link.active ? "text-blue-600" : "text-blue-600",
                        "flex-auto lg:flex-none text-center lg:text-left text-sm font-semibold rounded-md px-3 py-2 hover:bg-gray-200"
                      )}
                      aria-current={link.active ? "page" : "false"}
                    >
                      {link.title}
                    </a>
                  ))}
                </nav>
                  }
                </div>
              </div>
            </div>
          </div>
          <Transition.Root show={open} as={Fragment}>
            <div className="lg:hidden">
              <Transition.Child
                as={Fragment}
                enter="duration-150 ease-out"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="duration-150 ease-in"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <Popover.Overlay
                  static
                  className="z-20 fixed inset-0 bg-gray bg-opacity-25"
                />
              </Transition.Child>

              <Transition.Child
                as={Fragment}
                enter="duration-150 ease-out"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="duration-150 ease-in"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Popover.Panel
                  focus
                  static
                  className="z-30 absolute top-0 inset-x-0 max-w-3xl mx-auto w-full p-2 transition transform origin-top"
                >
                  <div className="rounded-lg shadow-lg ring-1 ring-green ring-opacity-5 bg-white divide-y divide-gray">
                    <div className="pt-3 pb-2">
                      <div className="flex items-center justify-between px-4">
                        <div>
                          <img
                            className="h-8 w-auto"
                            src={Logo}
                            alt="GET Graph"
                          />
                        </div>
                        <div className="-mr-2">
                          <Popover.Button className="bg-gray rounded-md p-2 inline-flex items-center justify-center text-gray-400 hover:text-gray-500 hover:bg-gray-100">
                            <span className="sr-only">Close menu</span>
                            <XIcon className="h-6 w-6" aria-hidden="true" />
                          </Popover.Button>
                        </div>
                      </div>
                      <div className="mt-3 px-2 space-y-1">
                        {isAdmin &&
                        navLinksAdmin.map((n,idx) => {
                          return(
                            <a
                            key={idx}
                            href={n.href}
                            className="block rounded-md px-3 py-2 text-base text-blue-600 font-semibold hover:bg-dark hover:text-blue-800"
                            >
                            {n.title}
                          </a>
                          )
                        })}
                        {!isAdmin &&
                        navLinksUser.map((n,idx) => {
                          return(
                            <a
                            key={idx}
                            href={n.href}
                            className="block rounded-md px-3 py-2 text-base text-blue-600 font-semibold hover:bg-dark hover:text-blue-800"
                            >
                            {n.title}
                          </a>
                          )
                        })}
                      </div>
                    </div>
                  </div>
                </Popover.Panel>
              </Transition.Child>
            </div>
          </Transition.Root>
        </>
      )}
    </Popover>
  );
};

export default Header;
