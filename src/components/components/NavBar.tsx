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
  INSTALLATION:"/installation"
  // V2CREATE: '/v2create'
}
interface NavbarProps {
  navbarColor:string
}

const logOut = () => {
  console.log('clicked')
  resetTokens()
  window.location.replace('/');
}
const NavBar = ({navbarColor="original"}:NavbarProps) => {
  const [location, setLocation] = useState(PAGES.HOME);
  const [buttonVisible, setButtonVisible] = useState(true);
  const [buttonIsHovered, setButtonHovered] = useState(false);
  const [bgColor, setBgColor] =  useState<string>()
  useEffect(() => {
    setLocation(window.location.pathname);
  }, []);

  useEffect(()=>{
    var tokens = loadTokens();
    if (tokens) {
      setButtonVisible(true)

    }
    else 
      setButtonVisible(false);

  },[])

  useEffect(()=>{
    if (navbarColor != 'primary')
      setBgColor("#122632");
    else
      setBgColor("#1b1d1f");
  },[navbarColor])

  return (
    <header className=
    { bgColor == '#122632' ? 
      "flex flex-wrap justify-center sm:flex-nowrap z-50 w-full  text-md py-4 bg-[#122632]"
      :
      "flex flex-wrap justify-center sm:flex-nowrap z-50 w-full  text-md py-4 bg-[#1b1d1f]"
      }>
      <div className='flex justify-between w-full items-center'>
        <div className='flex flex-row items-center gap-5 mt-5 justify-center sm:mt-0 sm:pl-5'>
          {/* <a className="flex-none text-xl font-semibold text-white bg-[#522646] p-3.5 leading-4 rounded-xl" href={PAGES.HOME}>Croboost</a> */}
          <a href={PAGES.HOME}>
            <img src="/logo.png"/>
          </a>
        </div>
        <nav className="w-full mx-auto px-4 grid grid-cols-3 items-center justify-between">
          <div className="flex flex-row gap-6 mt-5 justify-start sm:mt-0 sm:pl-5">
            <NavigationMenu className='flex justify-between'>
              <NavigationMenuList className="gap-2">
                {/* <NavigationMenuItem>

                  <NavigationMenuLink
                    href={PAGES.HOME}
                    active={location === PAGES.HOME}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor  = `rgba(255, 255, 255, 0.10)`;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = location === PAGES.HOME ? `rgba(255, 255, 255, 0.10)` : `transparent`
                    }}
                    style={
                      location === PAGES.HOME  
                        ? { color: 'rgba(255, 255, 255, 0.62)', backgroundColor:'rgba(255, 255, 255, 0.10)', borderRadius:'8px', padding:'8px',  }
                        : { color: 'rgba(255, 255, 255, 0.62)', borderRadius:'8px', padding:'8px', display: 'flex' }
                    }
                  >
                    Home
                  </NavigationMenuLink>
                </NavigationMenuItem> */}
                <NavigationMenuItem>
                  <NavigationMenuLink
                    href={PAGES.DASHBOARD}
                    active={location === PAGES.DASHBOARD}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor  = `rgba(255, 255, 255, 0.10)`;
                    }}
                    onMouseLeave={(e) => {
                       e.currentTarget.style.backgroundColor = location === PAGES.DASHBOARD ? `rgba(255, 255, 255, 0.10)` : `transparent`
                    }}
                    style={
                      location === PAGES.DASHBOARD  
                      ? { color: 'rgba(255, 255, 255, 0.62)', backgroundColor:'rgba(255, 255, 255, 0.10)', borderRadius:'8px', padding:'8px',  }
                      : { color: 'rgba(255, 255, 255, 0.62)', borderRadius:'8px', padding:'8px', display: 'flex'}
                    }
                  >
                    Home
                  </NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuLink
                    href={PAGES.TESTS}
                    active={location === PAGES.TESTS}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor  = `rgba(255, 255, 255, 0.10)`;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = location === PAGES.TESTS ? `rgba(255, 255, 255, 0.10)` : `transparent`
                    }}
                    style={
                      location === PAGES.TESTS 
                      ? { color: 'rgba(255, 255, 255, 0.62)', backgroundColor:'rgba(255, 255, 255, 0.10)', borderRadius:'8px', padding:'8px',  }
                      : { color: 'rgba(255, 255, 255, 0.62)', borderRadius:'8px', padding:'8px', display: 'flex'}
                    }
                  >
                    Test Data
                  </NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuLink
                    href={PAGES.INSTALLATION}
                    active={location === PAGES.INSTALLATION}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor  = `rgba(255, 255, 255, 0.10)`;
                    }}
                    onMouseLeave={(e) => {
                       e.currentTarget.style.backgroundColor = location === PAGES.INSTALLATION ? `rgba(255, 255, 255, 0.10)` : `transparent`
                    }}
                    style={
                      location === PAGES.INSTALLATION  
                      ? { color: 'rgba(255, 255, 255, 0.62)', backgroundColor:'rgba(255, 255, 255, 0.10)', borderRadius:'8px', padding:'8px',  }
                      : { color: 'rgba(255, 255, 255, 0.62)', borderRadius:'8px', padding:'8px', display: 'flex'}
                    }
                  >
                    Installation
                  </NavigationMenuLink>
                </NavigationMenuItem>
               

                {/* <NavigationMenuItem>
                  <NavigationMenuLink
                    href={PAGES.V2CREATE}
                    active={location === PAGES.V2CREATE}
                    style={
                      location === PAGES.V2CREATE
                      ? { color: 'gray', backgroundColor:'rgba(255, 255, 255, 0.10)', borderRadius:'8px', padding:'8px' }
                      : { color: 'gray', borderRadius:'8px', padding:'8px'}
                    }
                  >
                    V2Create
                  </NavigationMenuLink>
                </NavigationMenuItem> */}

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
        {buttonVisible && <button className='min-w-[100px] text-sl font-semibold text-white cursor-pointer' onClick={logOut}>
          Log out
        </button>}
      </div>
    </header>
  )
}

export default NavBar;