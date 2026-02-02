import { useEffect, useState } from 'react';
import TitleOwner from '../../components/owner/TitleOwner'
import { assets, dummyCarData, dummyMyBookingsData } from '../../assets/assets';

function ManageBookings() {
  const currency = import.meta.env.VITE_CURRENCY;
  const [bookings, setBookings] = useState([])

  useEffect(()=>{
    const fetchBookingData = async()=>{
      setBookings(dummyMyBookingsData)
    } 
    fetchBookingData()
  },[])
  return (
    <div>
        <TitleOwner title={"Manage Bookings"} subTitle={"Track all customer bookings, approve or cancel requests, and manage booking statuses"}/>
      <div className="max-w-3xl border border-borderColor border-collapse rounded-md mt-6">
        <table className="text-left w-full text-sm text-gray-500">
          <thead>
            <tr>
              <th className="p-3 font-medium">Car</th>
              <th className="p-3 font-medium max-md:hidden">Date Range</th>
              <th className="p-3 font-medium">Total</th>
              <th className="p-3 font-medium max-md:hidden">Payment</th>
              <th className="p-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking,index)=>(
              <tr className="border-t border-borderColor" key={index}>
                <td className="p-3 flex items-center gap-2">
                  <img className="w-12 h-12 object-cover rounded-md aspect-square" src={booking.car.image} alt="" />
                  <p>{booking.car.brand}{booking.car.model}</p>                
                </td>
                <td className="p-3 max-md:hidden">
                  {booking.pickupDate.split('T')[0]} To {booking.returnDate.split('T')[0]}
                </td>
                <td className="p-3">
                  {currency}{booking.price}
                </td>
                <td className="p-3 max-md:hidden">
                  <span className='text-xs rounded-full bg-gray-100 px-2 py-1'>offline</span>
                </td>
                <td className="p-3">
                  {booking.status=="pending" ? (
                    <select value={booking.status} onChange={(e)=>{e.target.value}} className='text-xs outline-none border border-borderColor rounded-md px-1 py-0.5'>
                      <option value="cancelled">Cancelled</option>
                      <option value="pending">Pending</option>
                      <option value="confirmed">Comfirmed</option>
                    </select>  
                  ):
                  (
                    <span className={`px-2 py-1 rounded-full text-xs ${booking.status== "confirmed"?"bg-green-100 text-green-500":"bg-red-100 text-red-500"}`}>
                      {booking.status}
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default ManageBookings