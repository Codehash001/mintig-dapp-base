import Image from 'next/image'
import { useState,useEffect } from "react"
import { AiOutlineClose, AiOutlineMenu } from 'react-icons/ai';
import {Link} from 'react-scroll/modules';
import Mint from './mint'
import { ConnectWallet } from "@thirdweb-dev/react";


export default function Base () {


const[nav, setNav] = useState(false)

const handleNav = () => {
  setNav(!nav);
}

const [toggleState, setToggleState] = useState(1);

   const toggleTab = (index) =>{
    setToggleState (index);
    setNav(false);
   }



  
  return (
      <>
       <div className='w-screen min-h-screen flex flex-col items-center font-Archivo relative'>
       <div className='-mt-10 absolute top-20 right-10'>
                <ConnectWallet/>
            </div>  
         <div className='w-screen h-screen bg-bg1 bg-center bg-no-repeat bg-cover flex justify-center items-center overflow-y-auto'>
           <div className= "w-auto h-auto ">
             <Mint/>
           </div>
         </div>        
       </div>
      </>
  )
}

