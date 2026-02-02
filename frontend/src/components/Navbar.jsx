import { Link, useLocation, useNavigate } from "react-router-dom"
import { assets, menuLinks } from "../assets/assets"
import { useState } from "react"
function Navbar({setShowLogin}) {
    const location = useLocation()
    const [open,setOpen] =useState(false)
    const navigate = useNavigate()
  return (
    <div className={`flex justify-between items-center py-4 px-6 md:px-16 lg:px-26 xl:px-32 relative border-b border-borderColor transition-all ${location.pathname==="/" && "bg-light"}`}>
        <Link to={"/"}>
            <img className="h-8" src={assets.logo} alt="" />
        </Link>

        <div className={`max-sm:fixed max-sm:w-full max-sm:h-screen max-sm:border-t max-sm:p-4 max-sm:top-16 text-gray-600 transition-all duration-300 z-50 border-borderColor gap-4 sm:gap-8 right-0 items-start sm:items-center flex flex-col sm:flex-row  ${location.pathname==="/" ? "bg-light":"bg-white"} ${open?"max-sm:translate-x-0":"max-sm:translate-x-full"}`}>
            {menuLinks.map((link,index)=>(
                <Link key={index} to={link.path}>
                    {link.name}
                </Link>
            ))}

            <div className="hidden lg:flex border border-borderColor rounded-full text-sm py-1.5 px-3 max-w-52 gap-2 max-sm:top-16">
                <input type="text" placeholder="Search cars" className=" placeholder-gray-500 bg-transparent outline-none w-full"/>
                <img src={assets.search_icon} />
            </div>
            <div className="flex max-sm:flex-col gap-6 items-start sm:items-center">
                <button className="cursor-pointer" onClick={()=> navigate('/owner')}>Dashboard</button>
                <button className="cursor-pointer bg-primary text-white py-2 px-8 rounded-lg hover:bg-primary-dull" onClick={()=> setShowLogin(true)}>Login</button>
            </div>
        </div>
        <button className="sm:hidden cursor-pointer" onClick={()=>setOpen(!open)}>
            <img src={open?  assets.close_icon:assets.menu_icon}  alt="" />
        </button>
    </div>
  )
}

export default Navbar