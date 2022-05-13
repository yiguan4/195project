import React from 'react'
import CustomNavbar from './customNavbar'
import Footer from './footer'

function Default(props) {

  return (
    <div>
      <div >
        <CustomNavbar/>  
      </div>
      <div>
          {props.children}       
      </div>
      <Footer/>
    </div>
  )
}

export default Default