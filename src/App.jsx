
import {  BrowserRouter, Route, Routes } from "react-router-dom";
import { Box } from '@mui/material'
import Index from './assets/pages/Index'
import User from './assets/pages/User';
import Users from "./assets/pages/Users";
import './App.css'
import 'leaflet/dist/leaflet.css';
import Navbar from "./assets/components/Navbar";
function App() {


  return (
    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" ,height:"100vh"}}>
      <BrowserRouter>

        <Navbar/>
        <Routes>
          <Route path='/' element={<Index />} />
          <Route path='/user/:username' element={<User/>}/>
          <Route path='/users' element={<Users/>}/>
        </Routes>
      </BrowserRouter>




    </Box>
  )
}

export default App
