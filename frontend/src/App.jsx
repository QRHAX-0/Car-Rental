import { useState } from 'react'
import Navbar from './components/Navbar'
import {Routes,Route, useLocation } from 'react-router-dom'
import Home from './pages/Home'
import Footer from './components/Footer'
import CarDetails from './pages/CarDetails'
import Cars from './pages/Cars'
import MyBookings from './pages/MyBookings'
import Layout from './pages/owner/Layout'
import Dashboard from './pages/owner/Dashboard'
import AddCar from './pages/owner/AddCar'
import ManageBookings from './pages/owner/ManageBookings'
import ManageCars from './pages/owner/ManageCars'
import Login from './components/Login'


function App() {
  const[showLogin,setShowLogin] = useState(false)
  const isOwnerPath = useLocation().pathname.startsWith("/owner")
  return (
    <>
      {showLogin && <Login setShowLogin={setShowLogin} />}
     {!isOwnerPath && <Navbar setShowLogin={setShowLogin} />}

     <Routes>
        <Route path='/' element={<Home/>} /> 
        <Route path='/car-details/:id' element={<CarDetails/>} /> 
        <Route path='/cars' element={<Cars/>} /> 
        <Route path='/my-bookings' element={<MyBookings/>} /> 
        <Route path='/owner' element={<Layout/>}>
          <Route index element={<Dashboard/>}/>
          <Route path='add-car' element={<AddCar/>}/>
          <Route path='manage-bookings' element={<ManageBookings/>}/>
          <Route path='manage-cars' element={<ManageCars/>}/>
        </Route>
     </Routes>

    {!isOwnerPath && <Footer />}

    </>
  )
}

export default App