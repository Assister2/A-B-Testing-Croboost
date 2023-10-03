import React from 'react'
import { useState, useEffect } from 'react'

const PAGES = {
  HOME: "/",
  ACCOUNT: "/account",
  DASHBOARD: "/dashboard",
  TESTS: "/tests",
  TESTVIEW: "/testview",
}

const NavBar = () => {
  const [location, setLocation] = useState(PAGES.HOME);
  useEffect(() => {
    setLocation(window.location.pathname);
  }, []);
  return (
    <header className="flex flex-wrap justify-center sm:flex-nowrap z-50 w-full bg-white text-md py-4">
      <nav className="w-full mx-auto px-4 grid grid-cols-3 items-center justify-between">
          <div className="flex flex-row gap-6 mt-5 justify-start sm:mt-0 sm:pl-5">
            <a style={location === PAGES.HOME ? {color: "#158370"} : {color: "gray"}} className="font-medium text-gray-600 hover:text-gray-400 dark:text-gray-400 dark:hover:text-gray-500" href={PAGES.HOME} aria-current="page">
              Home
            </a>
            <a style={location === PAGES.TESTS ? {color: "#158370"} : {color: "gray"}} className="font-medium text-gray-600 hover:text-gray-400 dark:text-gray-400 dark:hover:text-gray-500" href={PAGES.TESTS}>
              Tests
            </a>
            {/* <a style={location === PAGES.ACCOUNT ? {color: "#158370"} : {color: "gray"}} className="font-medium text-gray-600 hover:text-gray-400 dark:text-gray-400 dark:hover:text-gray-500" href={PAGES.ACCOUNT}>
              Account
            </a> */}
            <a style={location === PAGES.DASHBOARD ? {color: "#158370"} : {color: "gray"}} className="font-medium text-gray-600 hover:text-gray-400 dark:text-gray-400 dark:hover:text-gray-500" href={PAGES.DASHBOARD}>
              Dashboard
            </a>
            <a style={location === PAGES.TESTVIEW ? {color: "#158370"} : {color: "gray"}} className="font-medium text-gray-600 hover:text-gray-400 dark:text-gray-400 dark:hover:text-gray-500" href={PAGES.TESTVIEW}>
              Testview
            </a>
          </div>
          <div className='flex flex-row items-center gap-5 mt-5 justify-center sm:mt-0 sm:pl-5'>
            <a className="flex-none text-xl font-semibold dark:text-black" href={PAGES.HOME}>Croboost</a>
          </div>
          <div className='flex flex-row items-center gap-5 mt-5 justify-end sm:mt-0 sm:pl-5'>
            {/* <a className="font-medium text-blue-500" href="#" aria-current="page">Landing</a> */}
            {/* <a className="font-medium text-gray-600 hover:text-gray-400 dark:text-gray-400 dark:hover:text-gray-500" href="#">Account</a> */}
            {/* <a className="font-medium text-gray-600 hover:text-gray-400 dark:text-gray-400 dark:hover:text-gray-500" href="#">Work</a> */}
          </div>
      </nav>
    </header>
  )
}

export default NavBar;