import { Routes,Route } from 'react-router-dom'

import { Suspense, lazy } from 'react';
import Login from './components/Login';
import { PrivateRoute } from './components/AuthenticatedRoute';
import { Toaster } from 'react-hot-toast';
import { GoogleOAuthProvider } from '@react-oauth/google';
const LobbyScreen = lazy(()=>import('./screens/LobbyScreen'))
const Room = lazy(()=>import('./screens/Room'))
const SignUp = lazy(()=>import('./components/SignUp'))




function App() {
  return (
    <>


    
       <GoogleOAuthProvider clientId="" >

       
        <Suspense fallback={<div>Loading</div>}>

       <Routes>
       <Route element={<PrivateRoute redirectTo="/" />}>
       
       <Route path = '/lobby' element={<LobbyScreen/>}/>
        <Route path = '/room/:id' element={<Room/>}/>
      </Route>
       
        <Route path = '/signup' element={<SignUp/>}/>
        <Route path = '/' element={<Login/>}/>

        

       </Routes>
       </Suspense>
       </GoogleOAuthProvider>
       
       <Toaster/>
       
    </>
  );
}

export default App;
