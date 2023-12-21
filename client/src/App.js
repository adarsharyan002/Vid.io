import { Routes,Route } from 'react-router-dom'

import { Suspense, lazy } from 'react';
import Login from './components/Login';
const LobbyScreen = lazy(()=>import('./screens/LobbyScreen'))
const Room = lazy(()=>import('./screens/Room'))
const SignUp = lazy(()=>import('./components/SignUp'))



function App() {
  return (
    <>

       
             <Suspense fallback={<div>Loading</div>}>

       <Routes>
        <Route path = '/lobby' element={<LobbyScreen/>}/>
        <Route path = '/room/:id' element={<Room/>}/>
        <Route path = '/signup' element={<SignUp/>}/>
        <Route path = '/' element={<Login/>}/>

        

       </Routes>
       </Suspense>
       
    </>
  );
}

export default App;
