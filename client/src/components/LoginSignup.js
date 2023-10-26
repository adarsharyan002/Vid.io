import React,{ useState } from 'react'
import './LoginSignup.css'

const LoginSignup = () => {

  const [action, setAction] = useState("Login");  

  return (
    <div className= 'background'>
    <div className='container'>
      <div className="header">
        <div className='text'>{action}</div>
      </div>
      
        <div className='inputs'>
            <input className='input' type="text" placeholder='Username' />
        </div>
        {action==="Sign Up"?<div className='inputs'>
            <input className='input' type="email" placeholder='E-mail'/>
        </div>: <div></div>}
        <div className='inputs'>
            <input className='input' type="passwoed" placeholder='Password'/>
        </div>
        {action==="Login"?<div className='forgot-password'>
            <span>Forgot password?</span>
        </div>:<div></div>}
        <div className='submit-container'>
            <div className={action==="Login"?"submit gray":"submit"} onClick={()=>{setAction("Sign Up")}}> Sign Up </div>
            <div className={action==="Sign Up"?"submit gray":"submit"} onClick={()=>{setAction("Login")}}>Login</div>
        </div>
      
    </div>
    </div>
    
  )
}

export default LoginSignup
