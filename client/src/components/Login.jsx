

import { useState ,useEffect} from 'react';
import logo from '../assests/logo.svg'; 
import companyLogo from '../assests/logomain2.png';
import { Link,useNavigate } from 'react-router-dom';
import { useDispatch,useSelector } from 'react-redux';
import { login } from '../redux/features/auth/authSlice';
import { clearState } from '../redux/features/auth/authSlice';
import { FaEyeSlash,FaEye } from "react-icons/fa6";
import toast from 'react-hot-toast';
import GoogleLoginButton from './GoogleLogin';


const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const [type,setType] = useState('Password');
  const [toastId,setToastId] =useState(null)

  const {  user, error, isAuthenticated } = useSelector(
    (state) => state.auth
  )

  //toast notification
  
  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
     const Id=toast.loading('Signing In')
     setToastId(Id);
  
    
      const credentials = { email, password };
  
      // Dispatch the login action
      await dispatch(login(credentials));
  
     
  };

  const toggleVisibility = ()=>{

    if(type==='Password')setType('text')
    else setType('Password')
  }

  useEffect(() => {
    // redirect user to login page if registration was successful
    if (isAuthenticated) {
      toast.success('Signed In', {
        id: toastId,
      });
      navigate('/lobby')}

    if(error){
      toast.error(error,{
        id:toastId
      })
    }
  
    return ()=>{
      dispatch(clearState())
    }
    // redirect authenticated user to profile screen
    // if (user) navigate('/user-profile')
  }, [navigate, isAuthenticated, user, error, dispatch, toastId])

 

  return (
    <div className="bg-gradient-to-r from-gray-800 via-black to-blue-900 absolute top-0 left-0  bottom-0 leading-5 h-full w-full overflow-hidden">
     <div className="fixed top-8 left-12 z-50">
  <img
    src={companyLogo}
    width={100}
    alt="Company Logo"
  />
</div>

      <div className="relative min-h-screen flex flex-row justify-center lg:gap-40  bg-transparent rounded-3xl shadow-xl">
        {/* Left side content */}
        <div className="flex-col flex self-center lg:px-4 sm:max-w-4xl xl:max-w-md z-10">
          <div className="self-start hidden lg:flex flex-col text-gray-300">
           
            <img
            src={logo}
            alt='company logo'
            />
          </div>
        </div>

        {/* Right side content */}
        <div className="flex justify-center self-center z-10">
          <div className="p-12 bg-gray-500  bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-20 border-gray-600 border-2 border-solid  mx-auto rounded-3xl w-96">
            <div className="mb-7">
              <h3 className="font-semibold text-2xl text-white">Sign In </h3>
              <p className="text-gray-400">
                Already  have an account? <Link to="/signup" className="text-sm text-white hover:text-red-100">Sign Up</Link>
              </p>
            </div>
            <div className="space-y-6">
           
              <div>
                <input
                  className="w-full text-sm px-4 py-3 text-white bg-transparent  border border-gray-200 rounded-lg focus:outline-none "
                  type="email"
                  placeholder="Email"
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="relative flex justify-center items-center" x-data="{ show: true }">
                <input
                  placeholder="Password"
                  type={type}
                  onChange={(e) => setPassword(e.target.value)} 
                  className="w-full text-sm px-4 py-3 text-white bg-transparent  border border-gray-200 rounded-lg focus:outline-none"
                />
               <button onClick={toggleVisibility} className='absolute right-4 text-white'>{type==='Password'?<FaEyeSlash/>:<FaEye/>}</button>
              </div>
              <div>
              <div className="flex items-center mb-4">
     
      
    </div>
						<button onClick={onSubmit} type="submit" className="w-full flex justify-center bg-blue-900  hover:bg-blue-800 text-gray-100 p-3  rounded-lg tracking-wide font-semibold  cursor-pointer transition ease-in duration-500">
                Sign In
              </button>
					</div>

              {/* <GoogleLoginButton/> */}
            </div>
          </div>
        </div>
        
      </div>

     
    </div>
  );
};

export default Login;
