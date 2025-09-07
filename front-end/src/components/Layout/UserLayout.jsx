import React from 'react'
import { Header } from '../Common/Header'
import Footer from '../Common/Footer'
import { Outlet } from 'react-router-dom'

export const UserLayout = () => {
  return (
    <>
    <Header/>
    <main>
      <Outlet/>
    </main>
    <Footer/>
</>
  )
}
