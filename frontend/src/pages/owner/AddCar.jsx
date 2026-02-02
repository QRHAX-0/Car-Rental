import { useState } from 'react'
import TitleOwner from '../../components/owner/TitleOwner'
import { assets } from '../../assets/assets'

function AddCar() {
  const currency = import.meta.env.VITE_CURRENCY;
  const [image, setImage] = useState(null)
  const [car, setCar] = useState({
    "brand": "",
    "model": "",
    "year": 0,
    "category": "",
    "seating_capacity": 0,
    "fuel_type": "",
    "transmission": "",
    "pricePerDay": 0,
    "location": "",
    "description": "",       
  })

  function submitionHandler(e){
    e.preventDefault()
  }
  return (
    <div>
        <TitleOwner title={"Add New Car"} subTitle={"Fill in details to list a new car for booking, including pricing, availability, and car specifications."}/>
      <div>
        <form className='mt-8 max-w-xl flex flex-col gap-6' onSubmit={submitionHandler}>
          <div className='w-full flex items-center gap-2'>
            <label htmlFor="upload-image">
               <img className='h-14 rounded-md cursor-pointer' src={image ? URL.createObjectURL(image) : assets.upload_icon} alt="" />
               <input type="file" name="name" id="upload-image" required hidden accept='image/*' onChange={(e)=>{setImage(e.target.files[0])}} />
            </label>
            <p className='text-sm text-gray-500'>Upload a picture of your car</p>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            <div className='flex flex-col gap-1 text-sm text-gray-500'>
              <label>Brand</label>
              <input type="text" className='px-3 py-2 outline-none placeholder:text-gray-400 placeholder:text-sm border border-borderColor rounded-md' required placeholder='e.g. BMW, Mercedes, Audi...' value={car.brand} onChange={(e)=>{setCar({...car,brand:e.target.value})}} />
            </div>
            <div className='flex flex-col gap-1 text-sm text-gray-500'>
              <label>Model</label>
              <input type="text" className='px-3 py-2 outline-none placeholder:text-gray-400 placeholder:text-sm border border-borderColor rounded-md' required placeholder='e.g. X5, E-Class, M4...' value={car.model} onChange={(e)=>{setCar({...car,model:e.target.value})}} />
            </div>
          </div>

          <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6'>
            <div className='flex flex-col gap-1 text-sm text-gray-500'>
              <label>Year</label>
              <input type="number" className='px-3 py-2 outline-none placeholder:text-gray-500 placeholder:text-sm border border-borderColor rounded-md' required placeholder='2025' value={car.year} onChange={(e)=>{setCar({...car,year:e.target.value})}} />
            </div>
            <div className='flex flex-col gap-1 text-sm text-gray-500'>
              <label>{`Daily Price (${currency})`}</label>
              <input type="number" className='px-3 py-2 outline-none placeholder:text-gray-500 placeholder:text-sm border border-borderColor rounded-md' required placeholder='100' value={car.pricePerDay} onChange={(e)=>{setCar({...car,pricePerDay:e.target.value})}} />
            </div>
            <div className='flex flex-col gap-1 text-sm text-gray-500'>
              <label>Category</label>
              <select className='px-3 py-2 outline-none placeholder:text-gray-500 placeholder:text-sm border border-borderColor rounded-md text-gray-500 text-sm' required value={car.category} onChange={(e)=>{setCar({...car, category:e.target.value})}}>
                <option value="">Select a category</option>
                <option value="sedan">Sedan</option>
                <option value="suv">SUV</option>
                <option value="van">Van</option>
              </select>
            </div>
          </div>

          <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6'>
            <div className='flex flex-col gap-1 text-sm text-gray-500'>
              <label>Transmission</label>
              <select className='px-3 py-2 outline-none placeholder:text-gray-500 placeholder:text-sm border border-borderColor rounded-md text-gray-500 text-sm' required value={car.transmission} onChange={(e)=>{setCar({...car, transmission:e.target.value})}}>
                <option value="">Select a transmission</option>
                <option value="automatic">Automatic</option>
                <option value="manual">Manual</option>
                <option value="semi-automatic">Semi-Automatic</option>
              </select>
            </div>
            <div className='flex flex-col gap-1 text-sm text-gray-500'>
              <label>Fuel Type</label>
              <select className='px-3 py-2 outline-none placeholder:text-gray-500 placeholder:text-sm border border-borderColor rounded-md text-gray-500 text-sm' required value={car.fuel_type} onChange={(e)=>{setCar({...car, fuel_type:e.target.value})}}>
                <option value="">Select a fuel type</option>
                <option value="gas">Gas</option>
                <option value="diesel">Diesel</option>
                <option value="petrol">Petrol</option>
                <option value="electric">Electric</option>
                <option value="hybrid">Hybrid</option>
              </select>
            </div>
            <div className='flex flex-col gap-1 text-sm text-gray-500'>
              <label>{`Daily Price (${currency})`}</label>
              <input type="number" className='px-3 py-2 outline-none placeholder:text-gray-500 placeholder:text-sm border border-borderColor rounded-md' required placeholder='0' value={car.seating_capacity} onChange={(e)=>{setCar({...car,seating_capacity:e.target.value})}} />
            </div>
          </div>
          
          <div className='grid grid-cols-1'>
            <div className='flex flex-col gap-1 text-sm text-gray-500'>
              <label>Location</label>
              <select className='px-3 py-2 outline-none placeholder:text-gray-500 placeholder:text-sm border border-borderColor rounded-md text-gray-500 text-sm' required value={car.location} onChange={(e)=>{setCar({...car, location:e.target.value})}}>
                <option value="">Select a location</option>
                <option value="new-york">New York</option>
                <option value="los-angeles">Los Angeles</option>
                <option value="houston">Houston</option>
                <option value="chicago">Chicago</option>
              </select>
            </div>
          </div>

          <div className='grid grid-cols-1'>
            <div className='flex flex-col gap-1 text-sm text-gray-500'>
              <label>Description</label>
              <textarea rows={5} className='px-3 py-2 outline-none border border-borderColor rounded-md' required value={car.description} onChange={(e)=>{setCar({...car,description:e.target.value})}} placeholder='Describe your car, its condition, and any notable details...'></textarea>
            </div>
          </div>

          <button className='flex text-white bg-primary px-3 py-2 w-fit rounded-md gap-2 items-center'> <img src={assets.tick_icon} alt="" /> List Your Car</button>
        </form>
      </div>
    </div>
  )
}

export default AddCar