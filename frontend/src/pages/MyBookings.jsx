import React, { useEffect, useState } from 'react'
import Title from '../components/Title'
import { assets, dummyMyBookingsData } from '../assets/assets'

function MyBookings() {
    const [bookings,setBookings]=useState([])
    const currency = import.meta.env.VITE_CURRENCY;

    const fetchBookings = async()=>{
        setBookings(dummyMyBookingsData)
    }
    useEffect(()=>{
        fetchBookings()
    },[])
  return (
    <div className='px-6 sm:px-16 md:px-32 mt-15'>
            <Title title='My Bookings' subTitle='View and manage your car bookings' align={'left'}/>
        <div className='mt-15'>
            {bookings.map((booking,index)=>(
                <div key={booking._id} className='grid grid-cols-1 md:grid-cols-4 gap-5 border border-borderColor p-8 rounded-xl mb-10' >
                    <div className='md:col-span-1'>
                        <div className='aspect-video rounded-lg overflow-hidden mb-2'>
                            <img src={booking.car.image} className='w-full object-cover h-full ' alt="" />
                        </div>
                        <h1 className='font-medium'>{booking.car.brand} {booking.car.model}</h1>
                        <p className='text-sm text-gray-500'>{booking.car.year} {booking.car.category} {booking.car.location}</p>
                    </div>
                    <div className='md:col-span-2'>
                        <div className='flex gap-3 mb-3 items-center text-xs'>
                            <p className='px-2 py-1 bg-light rounded-lg'>Booking #{index+1}</p> 
                            <p className={`px-2 py-1 rounded-lg ${booking.status==="confirmed"?'text-green-600 bg-green-400/15':'text-red-600 bg-red-400/15'} `}>{booking.status}</p>    
                        </div>
                        <div>
                            <div className='flex items-start gap-2 mb-2 text-sm'>
                                <img className='mt-1 h-4' src={assets.calendar_icon_colored} alt="" />
                                <div>
                                    <p className='text-gray-500'>Rental Period</p>
                                    <p>{booking.pickupDate.split('T')[0]} To {booking.returnDate.split('T')[0]}</p>
                                </div>
                             </div>
                             <div className='flex items-start gap-2 text-sm'>
                                <img className='mt-1 h-4' src={assets.location_icon_colored} alt="" />
                                <div>
                                    <p className='text-gray-500'>Pick-up Location</p>
                                    <p>{booking.car.location}</p>
                                </div>
                             </div>
                        </div>                     
                    </div>
                    <div className='md:col-span-1 flex flex-col justify-between'>
                        <div className='text-right'>
                            <p className='text-sm text-gray-500'>Total Price</p>
                            <h1 className='text-primary font-semibold text-2xl'>{currency}{booking.price}</h1>
                            <p className='text-sm text-gray-500'>Booked on {booking.createdAt.split('T')[0]}</p>
                        </div>
                    </div> 
                </div>
            ))}
        </div>
    </div>
  )
}

export default MyBookings