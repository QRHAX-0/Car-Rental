import React, { useEffect, useState } from 'react'
import {useNavigate, useParams} from 'react-router-dom'
import { assets, dummyCarData } from '../assets/assets'

function CarDetails() {
    const {id} = useParams()
    const navigate = useNavigate()
    const [car,setCar] = useState(null)
    const currency = import.meta.env.VITE_CURRENCY;
    useEffect(()=>{
      setCar(dummyCarData.find((car)=> id === car._id))
    },[id])

  return car ? (
    <div className='pt-16 px-6 md:px-16 lg:px-32'>
        <div onClick={()=>navigate(-1)} className='flex gap-2 text-gray-500 cursor-pointer'>
          <img  src={assets.arrow_icon} className='rotate-180 brightness-250' alt="" />
          <span>Back to all cars</span>
        </div>
        <div className='flex flex-col gap-10 items-center lg:items-start lg:flex-row mt-5'>
          <div>
             <div className='mb-6'>
                <img className='w-6xl max-h-100 object-cover rounded-2xl mb-4' src={car.image} alt="" />
                <p className='text-3xl font-semibold'>{car.brand} {car.model}</p>
                <p className='text-gray-500 text-lg'>{car.category} {car.year}</p>
             </div>
              <hr className='text-gray-300'/>
              <div className='grid grid-cols-2 sm:grid-cols-4 gap-6 mt-6'>
                {
                  [{text: `${car.seating_capacity}Seats`,icon:assets.users_icon},
                    {text: car.fuel_type,icon:assets.fuel_icon},
                    {text: car.transmission,icon:assets.car_icon},
                    {text: car.location,icon:assets.location_icon},
                  ].map(({text,icon})=>(
                    <div key={text} className='flex flex-col justify-center items-center gap-2 py-4 bg-light rounded-xl'>
                      <img className='h-5' src={icon} alt="" />
                      {text}
                    </div>
                ))}
              </div>
              <div className='mt-6'>
                <h1 className='text-xl mb-3 font-medium '>Description</h1>
                <p className='text-gray-500'>{car.description}</p>
              </div>
              <div className='mt-6'>
                <h1 className='text-xl font-medium mb-3'>Features</h1>
                <ul className=' grid grid-cols-1 sm:grid-cols-2 gap-2'>
                {[
                  "360 Camera", "Bluetooth", "GPS", "Heated Seats", "Rear View Mirror"
                ].map((text)=>(
                  <li key={text} className='flex gap-2 text-gray-500 text-md'>
                      <img src={assets.check_icon} alt="" />
                      {text}
                  </li>
                ))}
                </ul>
              </div>
          </div>
          <form className='flex flex-col justify-center px-5 py-6 rounded-lg shadow-lg sticky top-16 w-full lg:w-lg'>
            <div className='flex justify-between mb-3'>
              <h1 className='text-2xl font-semibold'>{currency}{car.pricePerDay}</h1>
              <p className='text-gray-500'>per day</p>
            </div>
            <hr className='text-gray-300 mb-8'/>
            <div className='text-gray-500 flex flex-col'>
              <label htmlFor="PickDate">Pickup Date</label>
              <input type="date" id='PickDate' className='border border-borderColor p-2 mb-5 rounded-lg' min={new Date().toISOString().split("T")[0]}  />
              <label htmlFor="ReturnDate">Return Date</label>
              <input type="date" id='ReturnDate' className='border border-borderColor p-2 mb-5 rounded-lg' />
            </div>
            <button className='bg-primary hover:bg-primary-dull cursor-pointer text-white rounded-lg py-3 px-8 mb-5'>Book Now</button>
            <p className='text-center text-gray-500 text-sm'>No credit card required to reserve</p>
          </form>
        </div>
    </div>
  ):<p>loading...</p>
}

export default CarDetails