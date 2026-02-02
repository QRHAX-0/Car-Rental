import { useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";

function CarCard({car}) {
    const currency = import.meta.env.VITE_CURRENCY;
    const navigate=useNavigate();
  return (
    <div onClick={()=>{navigate(`/car-details/${car._id}`), scrollTo(0,0)}} className='group overflow-hidden rounded-lg cursor-pointer transition-all duration-500 hover:-translate-y-1 shadow-lg '>
        <div className='relative h-48 overflow-hidden '>
            <img className='object-cover h-full w-full group-hover:scale-105 duration-500 transition-all' src={car.image} alt="car" />
            {car.isAvaliable && <p className='absolute left-4 text-white bg-primary text-xs px-2 py-1 rounded-full top-4'>Avaliable Now</p>}
            <div className='absolute right-4 bottom-4 text-white p-2 text-xs rounded-lg bg-black/75 '>
                <span className='font-semibold'>{currency}{car.pricePerDay}</span>
                <span className='text-gray-300'> / day</span>
            </div>
        </div>
        <div className="flex flex-col p-4 gap-4">
            <div>
                <p className="text-lg">{car.brand} {car.model}</p>
                <p className="text-xs text-gray-600">{car.category} {car.year}</p>
            </div>
                <div className="grid grid-cols-2 text-gray-600 gap-2 text-sm">
                    <div className="flex items-center gap-2">
                        <img className="h-4" src={assets.users_icon} alt="" />
                        <span className="">{car.seating_capacity} Seats</span>
                    </div>
                        <div className="flex items-center gap-2">
                        <img className="h-4" src={assets.carIcon} alt="" />
                        <span className="">Automatic</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <img className="h-4" src={assets.fuel_icon} alt="" />
                        <span className="">Gasoline</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <img className="h-4" src={assets.location_icon} alt="" />
                        <span className="">{car.location}</span>
                    </div>
                </div>
        </div>
    </div>
  )
}

export default CarCard