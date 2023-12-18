import React,{ useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import './LoginSignup.css'
import vedioCalling from './vedio-calling-image.jpg' 
import { setAction,setEmail,setPassword } from '../redux/features/auth/authSlice';
import { signUpUser } from '../redux/features/auth/authSlice';


const LoginSignup = () => {

  const dispatch = useDispatch();
  const loginSignupState = useSelector((state)=> state.loginSignup)
  const [email, setEmail] = useState(loginSignupState.email);
  const [password, setPassword] = useState(loginSignupState.email);
  
  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    dispatch(setEmail(e.target.value));
  };

  
  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    dispatch(setPassword(e.target.value));
  };

  const handleSigninSubmit = (e) => {
   
  };

  

//   return (
//     <div className='whole-page'>
//         <div className='container'>
//             <div className="header">Video Calling App</div>
//             <div className='login-signup'>{action}</div>
//             <div className='text'> 
//                 <div>Record vedios to share your</div>
//                 <div>feedback and ideas.</div> 
//             </div>
//             <div className='gap'>
//             <div className='button-4'>
//                 <div>Continue with Google</div>
//             </div>
            
//             </div>

//             <div>or</div>

//             <div className='inputs'>
//                 <input className='input' type="email" placeholder='E-mail'/>
//             </div>
//             <div className='inputs'>
//                 <input className='input' type="passwoed" placeholder='Password'/>
//             </div>
//             <div className='forgot-password'>
//             {action==="Sign in"?<span>Forgot password?</span>:<div></div>}
//             </div>
//             <div className='submit-container'>
//                 {action==="Create Your Account"?<div className="button-3" > Sign Up </div>:<div></div>}
//                 {action==="Sign in"?<div className="button-3" >Login</div>:<div></div>}
//             </div>
//             <div className='already-have-an-account'>
//                 {action==="Create Your Account"?<div className='text'>Already have an account? </div>:<div></div>}
//                 {action==="Create Your Account"?<span className='text' onclick onClick={()=>{dispatch(setAction("Sign in"))}}>Sign in</span>:<div></div>}
//                 {action==="Sign in"?<span className="text" onclick onClick={()=>{dispatch(setAction("Create Your Account"))}}>Signup</span>:<div></div>}
//             </div>
      
//         </div>
//         <div className='vedio-calling-image'>
//             <img src={vedioCalling} alt='Vedio calling image'/>
            
//         </div>

//     </div>
    
    
//   )
// }

// export default LoginSignup

return (
    <div className='whole-page'>
        <div className='container'>
            <div className="header">Video Calling App</div>
            <div className='login-signup'>{loginSignupState.action}</div>
            <div className='text'> 
                <div>Record vedios to share your</div>
                <div>feedback and ideas.</div> 
            </div>
            <div className='gap'>
            <div className='button-4'>
                <div>Continue with Google</div>
            </div>
            
            </div>

            <div>or</div>

            <div className='inputs'>
                <input className='input' type="email" placeholder='E-mail' onChange={handleEmailChange}/>
            </div>
            <div className='inputs'>
                <input className='input' type="passwoed" placeholder='Password' onChange={handlePasswordChange}/>
            </div>
            <div className='forgot-password'>
            {loginSignupState.action==="Sign in"?<span>Forgot password?</span>:<div></div>}
            </div>
            <div className='submit-container'>
                {loginSignupState.action==="Create Your Account"?<div className="button-3" onClick={handleSigninSubmit}> Sign Up </div>:<div></div>}
                {loginSignupState.action==="Sign in"?<div className="button-3" onClick={handleSigninSubmit} >Login</div>:<div></div>}
            </div>
            <div className='already-have-an-account'>
                {loginSignupState.action==="Create Your Account"?<div className='text'>Already have an account? </div>:<div></div>}
                {loginSignupState.action==="Create Your Account"?<span className='text' onClick={handleSigninSubmit}>Sign in</span>:<div></div>}
                {loginSignupState.action==="Sign in"?<span className="text" onClick={handleSigninSubmit}>Signup</span>:<div></div>}
            </div>
      
        </div>
        <div className='vedio-calling-image'>
            <img src={vedioCalling} alt='Vedio calling image'/>
            
        </div>

    </div>
    
    
  )
}

export default LoginSignup
