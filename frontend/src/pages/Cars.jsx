import {  useState } from "react"
import { assets, dummyCarData } from "../assets/assets"
import Title from "../components/Title"
import CarCard from "../components/CarCard"

function Cars() {
  const [input,setInput] = useState()
  const carLength = dummyCarData.length

  return (
    <div>
        <div className="bg-light gap-6 py-20 max-sm:px-4 flex flex-col items-center">
            <Title title='Available Cars' subTitle='Browse our selection of premium vehicles available for your next adventure'/>
            <div className="bg-white flex gap-2 items-center text-gray-500 py-3 px-5 rounded-full shadow-sm w-full sm:w-[550px]">
                <img src={assets.search_icon} alt="" />
                <input onChange={(e)=>setInput(e.target.value)} value={input} className="w-full outline-none placeholder:text-gray-300" placeholder="Search by make, model, or features" type="text" />
                <img src={assets.filter_icon} alt="" />
            </div>
        </div>
        <div className="mt-10 px-6 sm:px-16 lg:px-32">
          <p className="text-gray-500 max-w-6xl mx-auto mb-5">Showing {carLength} Cars</p> 
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 max-w-6xl mx-auto gap-8">
            {
              dummyCarData.map((car)=>(
                  <CarCard key={car._id} car={car}/>
              ))
            }
          </div>
        </div>

    </div>
  )
}

export default Cars