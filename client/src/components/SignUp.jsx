
import { useState } from 'react';
import logo from '../assests/logo.svg'; 
import companyLogo from '../assests/logomain2.png';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { signup } from '../redux/features/auth/authSlice';


const SignUp = () => {
  const [email, setEmail] = useState('')
  const [errorMessage,setErrorMessage] = useState('')
  const [password, setPassword] = useState('');
  const [userName,setUserName] = useState('')
  const dispatch = useDispatch();

// Assuming your signup action is imported

const onSubmit = async (e) => {
  e.preventDefault();

  try {
   
    const userDetails = {
      name:userName,
      email,
      password,
    };

    // Dispatch the signup action
    await dispatch(signup(userDetails));

    // Handle successful signup (e.g., redirect to a protected route)
    // You might need to access the user's data from the Redux store here
    console.log('Signup successful!');
    // Example: navigate to a protected route
    // history.push('/dashboard');
  } catch (error) {
    // Handle signup errors
    setErrorMessage(error.message);
  }
};

 

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
              <h3 className="font-semibold text-2xl text-white">Sign Up </h3>
              <p className="text-gray-400">
                Already  have an account? <Link to="/" className="text-sm text-white hover:text-gray-300">Sign In</Link>
              </p>
            </div>
            <div className="space-y-6">
            <div>
                <input
                  className="w-full text-sm px-4 py-3 text-white bg-transparent  border border-gray-200 rounded-lg focus:outline-none "
                  type="text"
                  placeholder="UserName"
                  onChange={(e)=>setUserName(e.target.value)}
                />
              </div>
              <div>
                <input
                  className="w-full text-sm px-4 py-3 text-white bg-transparent  border border-gray-200 rounded-lg focus:outline-none "
                  type="email"
                  placeholder="Email"
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="relative" x-data="{ show: true }">
                <input
                  placeholder="Password"
                  type='Password'
                  onChange={(e) => setPassword(e.target.value)} 
                  className="w-full text-sm px-4 py-3 text-white bg-transparent  border border-gray-200 rounded-lg focus:outline-none "
                />
               
              </div>
              <div>
              <div className="flex items-center mb-4">
      
    </div>
						<button onClick={onSubmit} type="submit" class="w-full flex justify-center bg-blue-900  hover:bg-blue-800 text-gray-100 p-3  rounded-lg tracking-wide font-semibold  cursor-pointer transition ease-in duration-500">
                Sign Up
              </button>
              <p className='mt-2'>{errorMessage}</p>
					</div>

              

            </div>
          </div>
        </div>
      </div>

     
    </div>
  );
};

export default SignUp;
