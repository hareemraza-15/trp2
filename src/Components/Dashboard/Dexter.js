import React from 'react'
import { Outlet } from 'react-router-dom'
import Footer from '../Sections/Footer/Footer'

function Dexter() {
  return (<>
  <Outlet />
  <Footer />
  </>
  )
}

export default Dexter