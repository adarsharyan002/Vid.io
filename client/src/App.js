import { Routes,Route } from 'react-router-dom'

import { Suspense, lazy } from 'react';
const LobbyScreen = lazy(()=>import('./screens/LobbyScreen'))
const Room = lazy(()=>import('./screens/Room'))
const LoginSignup = lazy(()=>import('./components/LoginSignup'))



function App() {
  return (
    <>

       
             <Suspense fallback={<div>Loading</div>}>

       <Routes>
        <Route path = '/' element={<LobbyScreen/>}/>
        <Route path = '/room/:id' element={<Room/>}/>
        <Route path = '/login' element={<LoginSignup/>}/>
        

       </Routes>
       </Suspense>
       
    </>
  );
}

export default App;
