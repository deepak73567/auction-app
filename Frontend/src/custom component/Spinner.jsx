import React from 'react'
import {HashLoader} from "react-spinners"

const Spinner = () => {
  return (
    <div className='w-full min-h-[600px] flex justify-center items-center'>
      <HashLoader size={130} color='purple'/>
    </div>
  )
}

export default Spinner
