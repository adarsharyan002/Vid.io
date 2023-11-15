import React,{ useState } from 'react'
import './LoginSignup.css'
import vedioCalling from './vedio-calling-image.jpg' 

const LoginSignup = () => {

  const [action, setAction] = useState("Create Your Account");  

  return (
    <div className='whole-page'>
        <div className='container'>
            <div className="header">Video Calling App</div>
            <div className='login-signup'>{action}</div>
            <div className='text'> 
                <div>Record vedios to share your</div>
                <div>feedback and ideas.</div> 
            </div>
            <div className='gap'>
            <div className='button-4'>
                <div>Continue with Google</div>
            </div>
            {/* <div className='button-4'>
                <div>Continue with Slack</div>
            </div> */}
            </div>

            <div>or</div>

            {/* <div className='inputs'>
                <input className='input' type="text" placeholder='Username' />
            </div> */}
            <div className='inputs'>
                <input className='input' type="email" placeholder='E-mail'/>
            </div>
            <div className='inputs'>
                <input className='input' type="passwoed" placeholder='Password'/>
            </div>
            <div className='forgot-password'>
            {action==="Sign in"?<span>Forgot password?</span>:<div></div>}
            </div>
            <div className='submit-container'>
                {action==="Create Your Account"?<div className="button-3" > Sign Up </div>:<div></div>}
                {action==="Sign in"?<div className="button-3" >Login</div>:<div></div>}
            </div>
            <div className='already-have-an-account'>
                {action==="Create Your Account"?<div className='text'>Already have an account? </div>:<div></div>}
                {action==="Create Your Account"?<span className='text' onclick onClick={()=>{setAction("Sign in")}}>Sign in</span>:<div></div>}
                {action==="Sign in"?<span className="text" onclick onClick={()=>{setAction("Create Your Account")}}>Signup</span>:<div></div>}
            </div>
      
        </div>
        <div className='vedio-calling-image'>
            <img src={vedioCalling} alt='Vedio calling '/>
            
        </div>

    </div>
    
    
  )
}

export default LoginSignup
