import React, { useState } from 'react'
import { assets, dummyDashboardData, dummyUserData, ownerMenuLinks } from '../../assets/assets'
import { NavLink, useLocation } from 'react-router-dom'

function Sidebar() {
  const user = dummyUserData
  const location = useLocation()
  const[image,setImage] = useState('');

  const updateImge = async()=>{
    user.image = URL.createObjectURL(image);
    setImage('');
  } 

  return (
    <div className='relative min-h-screen w-13 pt-6 md:w-60 md:flex flex-col items-center border-r border-borderColor '>
      <div className='relative group'>
        <label htmlFor="image" className='flex flex-col items-center gap-2'>
          <img src={image ? URL.createObjectURL(image) : user.image} alt="" className={`h-10 w-10 md:h-15 md:w-15 rounded-full ${image && "max-md:mt-5"}`} />
          <input type="file" hidden onChange={(e)=>{setImage(e.target.files[0])}} name="image" accept='image/*' id="image"  />
          <div className='hidden group-hover:flex justify-center items-center cursor-pointer absolute top-0 left-0 right-0 bottom-0'>
            <img className='h-6' src={assets.edit_icon} alt="" />
          </div>
        </label>
      </div>
      {image && (
        <button onClick={updateImge} className='absolute flex cursor-pointer gap-1 items-center p-2 text-primary top-0 right-0 bg-primary-dull/12 text-sm '> Save <img className='h-3' src={assets.check_icon} alt="" /></button>
      )}
      <p className='mt-2 max-md:hidden'>{user.name}</p>
      <div className='flex flex-col w-full mt-6'>
        {ownerMenuLinks.map((link,index)=>(
          <NavLink to={link.path} key={index} className={`relative flex items-center w-full gap-2 px-4 py-3 text-sm ${location.pathname == link.path? "text-primary bg-primary/10":"text-gray-600"}`}>
            <img src={location.pathname == link.path? link.coloredIcon: link.icon} alt="" />
            <p className='max-md:hidden'>{link.name}</p>
            <div className={`${location.pathname == link.path&&"absolute right-0 bg-primary w-1.5 h-8 rounded-bl-sm rounded-tl-sm"}`}></div>
          </NavLink>
          ))}
      </div>

    </div>
  )
}

export default Sidebar