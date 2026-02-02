import { useState } from "react"
import { assets, cityList } from "../assets/assets"

function Hero() {
    const [optVal,setOptVal] = useState("")
  return (
    <>
        <div className="bg-light h-screen flex flex-col justify-center items-center gap-14">
            <h1 className="text-5xl max-sm:text-4xl font-semibold">Luxury cars on Rent</h1>
            <form className="bg-white w-full max-w-80 md:max-w-200 rounded-xl md:rounded-full flex flex-col md:flex-row p-6 shadow-lg items-start md:items-center justify-between">
                <div className="flex flex-col md:flex-row items-start md:items-center md:ml-8 gap-10 ">
                    <div className="flex flex-col items-start gap-2">
                        <select value={optVal} onChange={(e)=> setOptVal(e.target.value)}>
                            <option value="">Pickup Location</option>
                            {cityList.map((city)=>(
                                <option key={city} value={city}>{city}</option>
                            ))}
                        </select>
                        <p className="px-1 text-sm text-gray-500">{optVal? optVal:"Please select location"}</p>
                    </div>
                    <div className="flex flex-col gap-2">
                        <label htmlFor="PickupDate">Pick-up Date</label>
                        <input type="date" id="PickupDate" className="text-gray-500 text-sm" min={new Date().toISOString().split("T")[0]} />
                    </div>
                    <div className="flex flex-col gap-2">
                        <label htmlFor="ReturnDate">Return Date</label>
                        <input type="date" id="ReturnDate" className=" text-gray-500 text-sm" />
                    </div>
                </div>
                <button className="flex text-white bg-primary hover:bg-primary-dull px-9 py-3 gap-1 rounded-full max-md:mt-8 cursor-pointer">
                    <img className="brightness-300" src={assets.search_icon} alt="" />
                    Search</button>
            </form>
            <img className="w-4xl" src={assets.main_car} alt="" />
        </div>
    </>
  )
}

export default Hero