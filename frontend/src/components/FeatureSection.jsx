import React from 'react'
import Title from './Title'
import CarCard from './CarCard'
import { assets, dummyCarData } from '../assets/assets'
import { useNavigate } from 'react-router-dom'

function FeatureSection() {
    const navigate = useNavigate()
  return (
    <>
        <div className='flex flex-col gap-15 p-10 items-center mt-10'>
            <div className='flex flex-col justify-center items-center'>
                <Title title='Featured Vehicles' subTitle='Explore our selection of premium vehicles available for your next adventure.' />
            </div>
            <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10'>
                {dummyCarData.slice(0,3).map((car)=>(
                    <CarCard key={car._id} car={car}/>
                ))}
            </div>
            <button onClick={()=>{navigate('/cars')}} className='px-6 py-2 border border-borderColor hover:bg-gray-50 w-fit rounded-lg flex gap-2 cursor-pointer'>
                <span>Explore all cars</span>
                <img className='mt-1' src={assets.arrow_icon} alt="" />
            </button>
        </div>
    </>
  )
}

export default FeatureSection