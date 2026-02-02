import { useEffect, useState } from "react"
import TitleOwner from "../../components/owner/TitleOwner"
import { assets, dummyCarData } from "../../assets/assets"

function ManageCars() {
  const currency = import.meta.env.VITE_CURRENCY;
  const [cars, setCar] = useState([])

  useEffect(()=>{
    const fetchOwnerCar = async()=>{
      setCar(dummyCarData)
    } 
    fetchOwnerCar()
  },[])

  return (
    <div>
        <TitleOwner title={"Manage Cars"} subTitle={"View all listed cars, update their details, or remove them from the booking platform"}/>
      <div className="max-w-3xl border border-borderColor border-collapse rounded-md mt-6">
        <table className="text-left w-full text-sm text-gray-500">
          <thead>
            <tr>
              <th className="p-3 font-medium">Car</th>
              <th className="p-3 font-medium max-md:hidden">Category</th>
              <th className="p-3 font-medium">Price</th>
              <th className="p-3 font-medium max-md:hidden">State</th>
              <th className="p-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {cars.map((car,index)=>(
              <tr className="border-t border-borderColor" key={index}>
                <td className="p-3 flex items-center gap-2">
                  <img className="w-12 h-12 object-cover aspect-square rounded-md" src={car.image} alt="" />
                  <div className="max-md:hidden">
                    <p>{car.brand}{car.model}</p>
                    <p className="text-xs">{car.seating_capacity} seats • {car.transmission} </p>
                  </div>
                </td>
                <td className="p-3 max-md:hidden">
                  {car.category}
                </td>
                <td className="p-3">
                  {currency}{car.pricePerDay}
                </td>
                <td className="p-3 max-md:hidden">
                  <span className={`px-2 py-0.5 rounded-full text-xs ${car.isAvaliable?"bg-green-100 text-green-500":"bg-red-100 text-red-500"}`}>
                    {car.isAvaliable?"Available":"Not Available"}
                  </span>
                </td>
                <td className="p-3 flex items-center">
                  <img className="cursor-pointer" src={car.isAvaliable? assets.eye_close_icon:assets.eye_icon} alt="" />
                  <img className="cursor-pointer" src={assets.delete_icon} alt="" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default ManageCars