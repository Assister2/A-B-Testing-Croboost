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
import Personal from "../../../public/image/personal.png"


const PAGES = {
  HOME: "/",
  ACCOUNT: "/account",
  DASHBOARD: "/dashboard",
  TESTS: "/tests",
  TESTVIEW: "/testview",
  ABTESTBACKLOG: "/backlog",
  SEO: "/seo",
  ACQUISTION: "/acquisition",
  CONVERSION: "/Conversion",
  SUGGESTION: "/Suggestions"
}

const NavBar = () => {
  const [location, setLocation] = useState(PAGES.HOME);
  useEffect(() => {
    setLocation(window.location.pathname);
  }, []);

  const headerStyle = {
    backgroundColor: '#142732',
  };
  return (
    <header className="flex flex-wrap justify-center sm:flex-nowrap z-50 w-full  text-md py-4" style={headerStyle}>
      <div className='flex flex-row items-center gap-5 mt-5 justify-center sm:mt-0 sm:pl-5'>
        <a className="flex-none text-xl font-semibold text-white bg-[#522646] p-3.5 leading-4 rounded-xl" href={PAGES.HOME}>Croboost</a>
      </div>
      <nav className="w-full flex mx-auto px-4 items-center justify-between p-2.5">
        <div className="flex flex-row gap-6 mt-5 justify-start sm:mt-0 sm:pl-5">
          <NavigationMenu>
            <NavigationMenuList className="space-x-4">

              <NavigationMenuItem>
                <NavigationMenuLink
                  href={PAGES.ABTESTBACKLOG}
                  active={location === PAGES.ABTESTBACKLOG}
                  style={
                    location === PAGES.ABTESTBACKLOG
                      ? { color: '#ffffff9e', background: "#ffffff1a", padding: "8px", borderRadius: "8px" }
                      : { color: 'gray' }
                  }
                >
                  A/B Tests Backlog
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink
                  href={PAGES.HOME}
                  active={location === PAGES.HOME}
                  style={
                    location === PAGES.HOME
                      ? { color: '#ffffff9e', background: "#ffffff1a", padding: "8px", borderRadius: "8px" }
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
                      ? { color: '#ffffff9e', background: "#ffffff1a", padding: "5px", borderRadius: "8px" }
                      : { color: 'gray' }
                  }
                >
                  Live Tests
                </NavigationMenuLink>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuLink
                  href={PAGES.DASHBOARD}
                  active={location === PAGES.DASHBOARD}
                  style={
                    location === PAGES.DASHBOARD
                      ? { color: '#ffffff9e', background: "#ffffff1a", padding: "8px", borderRadius: "8px" }
                      : { color: 'gray' }
                  }
                >
                  Dashboard
                </NavigationMenuLink>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuLink
                  href={PAGES.SEO}
                  active={location === PAGES.SEO}
                  style={
                    location === PAGES.SEO
                      ? { color: '#ffffff9e', background: "#ffffff1a", padding: "5px", borderRadius: "8px" }
                      : { color: 'gray' }
                  }
                >
                  SEO
                </NavigationMenuLink>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuLink
                  href={PAGES.ACQUISTION}
                  active={location === PAGES.ACQUISTION}
                  style={
                    location === PAGES.ACQUISTION
                      ? { color: '#ffffff9e', background: "#ffffff1a", padding: "5px", borderRadius: "8px" }
                      : { color: 'gray' }
                  }
                >
                  Acquisition
                </NavigationMenuLink>
              </NavigationMenuItem>



              <NavigationMenuItem>
                <NavigationMenuLink
                  href={PAGES.CONVERSION}
                  active={location === PAGES.CONVERSION}
                  style={
                    location === PAGES.CONVERSION
                      ? { color: '#ffffff9e', background: "#ffffff1a", padding: "8px", borderRadius: "8px" }
                      : { color: 'gray' }
                  }
                >
                  Conversion
                </NavigationMenuLink>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuLink
                  href={PAGES.SUGGESTION}
                  active={location === PAGES.SUGGESTION}
                  style={
                    location === PAGES.SUGGESTION
                      ? { color: '#ffffff9e', background: "#ffffff1a", padding: "8px", borderRadius: "8px" }
                      : { color: 'gray' }
                  }
                >
                  Suggestions
                </NavigationMenuLink>
              </NavigationMenuItem>


              {/* Add more menu items as needed */}
            </NavigationMenuList>
            <NavigationMenuIndicator />
          </NavigationMenu>



        </div>

        <div className='text-white'>

          <div className="flex gap-2">
            <p>Dami</p>
            <img src={Personal} className='h-4 w-4 mt-1' />
          </div>
        </div>

      </nav>
    </header>
  )
}

export default NavBar;