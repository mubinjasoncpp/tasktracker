import React from 'react'
import { Link } from 'react-router-dom'
import '../styles/Menubar.css'

const Menubar = () => {
  return (
    <div className='container'>
      <div className='menubar'>
        <Link to='/'>Dashboard</Link>
        <Link to='/setting'>Setting</Link>
        <Link to='/about'>About</Link>
      </div>
    </div>
  )
}

export default Menubar