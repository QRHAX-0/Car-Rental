import { useEffect, useState } from 'react'
import TitleOwner from '../../components/owner/TitleOwner'
import { assets, dummyDashboardData } from '../../assets/assets'

function Dashboard() {
  const currency = import.meta.env.VITE_CURRENCY;

  const [data,setData] = useState({
    "totalCars": 0,
        "totalBookings": 0,
        "pendingBookings": 0,
        "completedBookings": 0,
        "recentBookings": [],
        "monthlyRevenue": 0
  })
  
  const dataDashboardCards = [
    {title:"Total Cars", value:data.totalCars, icon:assets.carIconColored},
    {title:"Total Bookings", value:data.totalBookings, icon:assets.listIconColored},
    {title:"Pending", value:data.pendingBookings, icon:assets.cautionIconColored},
    {title:"Confirmed", value:data.completedBookings, icon:assets.listIconColored}
  ]

  useEffect(()=>{
    setData(dummyDashboardData)
  },[])

  return (
    <div>
      <TitleOwner title={"Admin Dashboard"} subTitle={"Monitor overall platform performance including total cars, bookings, revenue, and recent activities"}/>
      <div className='mt-8'>
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full md:max-w-3xl mb-8'>
          {dataDashboardCards.map((data,index)=>(
            <div key={index} className='flex items-center p-4 border border-borderColor rounded-lg justify-between'>
              <div>
                <h1 className='text-xs text-gray-500'>{data.title}</h1>
                <p className='text-lg font-medium'>{data.value}</p>
              </div>
              <div className='bg-primary/10 p-3 rounded-full'>
                <img className='h-4' src={data.icon} alt="" />
              </div>
            </div>
          ))}
        </div>
        <div className='flex items-start max-lg:flex-col gap-6'>
          {/* Recent Bookings */}
          <div className='w-full sm:max-w-lg border border-borderColor p-6 rounded-lg'>
            <div>
              <h1 className='font-medium text-lg'>Recent Bookings</h1>
              <p className='text-gray-500'>Latest customer bookings</p>
            </div>
            <div>
              {data.recentBookings.map((booking,index)=>(
                <div key={index} className='flex items-center justify-between mt-6'>
                  <div className='flex items-center gap-2'>
                    <div className='hidden md:flex bg-primary/10 p-3 rounded-full'>
                      <img className='h-4' src={assets.listIconColored} alt="" />
                    </div>
                    <div>
                      <h1>{booking.car.brand} {booking.car.model}</h1>
                      <p className='text-xs text-gray-500'>{booking.createdAt.split('T')[0]}</p>
                    </div>
                  </div>
                  <div className='flex items-center gap-2 font-medium'>
                    <p className='text-sm text-gray-500'>{currency}{booking.price}</p>
                    <p className='text-sm px-3 py-0.5 border border-borderColor rounded-full'>{booking.status}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          {/* Monthly Revenue */}
          <div className='w-full md:max-w-xs p-6 border border-borderColor rounded-lg'>
            <h1 className='font-medium text-lg'>Monthly Revenue</h1>
            <p className='text-gray-500'>Revenue for current month</p>
            <p className='text-3xl mt-6 font-semibold text-primary'>{currency}{data.monthlyRevenue}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard