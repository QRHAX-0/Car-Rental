import { assets } from "../assets/assets"
function Banner() {

    return (
    <div className="flex flex-col md:flex-row max-w-6xl mx-5 md:mx-auto rounded-2xl md:items-start items-center justify-between px-8 pt-6 mt-15 md:pl-15 bg-gradient-to-r from-[#0558FE] to-[#A9CFFF]">
        <div className=" text-white mt-3 lg:mr-15 xl:mr-20" >
            <h1 className="text-3xl font-semibold mb-3">Do You Own a Luxury Car?</h1>
            <p className="">Monetize your vehicle effortlessy by listing it on CarRental.</p>
            <p className="">We take care of insurance, driver verification, and secure payments -- so you can earn passive income, stress-free.</p>
            <button className="bg-white text-primary px-6 py-2 transition-all duration-300 hover:bg-gray-100 hover:scale-105 text-sm cursor-pointer rounded-lg mt-5">List your car</button>
        </div>
        <img className="max-sm:mt-10 w-sm md:mt-12" src={assets.banner_car_image} alt="" />
    </div>
  )
}

export default Banner