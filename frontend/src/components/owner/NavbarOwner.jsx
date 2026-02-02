import React from 'react'
import { assets, dummyUserData } from '../../assets/assets'
import { Link } from 'react-router-dom';

function NavbarOwner() {
    const user = dummyUserData;

  return (
    <div className='flex justify-between items-center py-4 px-6 md:px-10  relative border-b border-borderColor transition-all'>
        <Link to={"/"}>
            <img className="h-7" src={assets.logo} alt="" />
        </Link>
        <p className='text-gray-500'>Welcome, {user.name || "Owner"}</p>
    </div>
  )
}

export default NavbarOwner