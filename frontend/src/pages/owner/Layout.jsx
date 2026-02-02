import React from 'react'
import NavbarOwner from '../../components/owner/NavbarOwner'
import Sidebar from '../../components/owner/Sidebar'
import { Outlet } from 'react-router-dom'

function Layout() {
  return (
    <div>
        <NavbarOwner/> 
        <div className='flex'>
            <Sidebar/>
            <div className='flex-1 pt-10 px-4 md:px-10'>
              <Outlet/>
            </div>
        </div>
    </div>
  )
}

export default Layout