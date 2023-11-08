import React from 'react'
import { useState, useEffect } from 'react'
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
} from '@/components/ui/navigation-menu';
import { resetTokens, loadTokens } from "../../utils"
const PAGES = {
  HOME: "/",
  ACCOUNT: "/account",
  DASHBOARD: "/dashboard",
  TESTS: "/tests",
  TESTVIEW: "/testview",
}

const logOut = () => {
  resetTokens()
  window.location.reload()
}
const NavBar = () => {
  const [location, setLocation] = useState(PAGES.HOME);
  const [buttonVisible, setButtonVisible] = useState(true);
  useEffect(() => {
    setLocation(window.location.pathname);
  }, []);

  const headerStyle = {
    backgroundColor: '#142732',
  };

  useEffect(()=>{
    var tokens = loadTokens();
    if (tokens)
      setButtonVisible(true)
    else 
      setButtonVisible(false);
  },[])
  return (
    <header className="flex flex-wrap justify-center sm:flex-nowrap z-50 w-full  text-md py-4" style={headerStyle}>
      <div className='flex justify-between w-full items-center'>
        <div className='flex flex-row items-center gap-5 mt-5 justify-center sm:mt-0 sm:pl-5'>
          <a className="flex-none text-xl font-semibold text-white bg-[#522646] p-3.5 leading-4 rounded-xl" href={PAGES.HOME}>Croboost</a>
        </div>
        <nav className="w-full mx-auto grid grid-cols-3 items-center justify-between">
          <div className="flex flex-row gap-[27px] mt-5 justify-start sm:mt-0 sm:pl-5">
            <NavigationMenu className='flex justify-between'>

              <NavigationMenuList className="gap-2">
                {/* <NavigationMenuItem>

                  <NavigationMenuLink
                    href={PAGES.HOME}
                    active={location === PAGES.HOME}
                    style={
                      location === PAGES.HOME
                        ? { color: '#158370' }
                        : { color: 'gray' }
                    }
                  >
                    Home
                  </NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuLink
                    href={PAGES.TESTS}
                    active={location === PAGES.TESTS}
                    style={
                      location === PAGES.TESTS
                        ? { color: '#158370' }
                        : { color: 'gray' }
                    }
                  >
                    Tests
                  </NavigationMenuLink>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuLink
                    href={PAGES.DASHBOARD}
                    active={location === PAGES.DASHBOARD}
                    style={
                      location === PAGES.DASHBOARD
                        ? { color: '#158370' }
                        : { color: 'gray' }
                    }
                  >
                    Dashboard
                  </NavigationMenuLink>
                </NavigationMenuItem>

                {/* <NavigationMenuItem>
                  <NavigationMenuLink
                    href={PAGES.TESTVIEW}
                    active={location === PAGES.TESTVIEW}
                    style={
                      location === PAGES.TESTVIEW
                        ? { color: '#158370' }
                        : { color: 'gray' }
                    }
                  >
                    Testview
                  </NavigationMenuLink>
                </NavigationMenuItem> */}
                {/* Add more menu items as needed */}
              </NavigationMenuList>
              <NavigationMenuIndicator />
            </NavigationMenu>
          </div>

          <div className='flex flex-row items-center gap-5 mt-5 justify-end sm:mt-0 sm:pl-5'>
            {/* <a className="font-medium text-blue-500" href="#" aria-current="page">Landing</a> */}
            {/* <a className="font-medium text-gray-600 hover:text-gray-400 dark:text-gray-400 dark:hover:text-gray-500" href="#">Account</a> */}
            {/* <a className="font-medium text-gray-600 hover:text-gray-400 dark:text-gray-400 dark:hover:text-gray-500" href="#">Work</a> */}
          </div>
        </nav>
        {buttonVisible && <p className='min-w-[100px] text-sl font-semibold text-white cursor-pointer' onClick={logOut}>
          Log out
        </p>}
      </div>
    </header>
  )
}

export default NavBar;