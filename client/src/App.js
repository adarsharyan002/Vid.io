import { Routes,Route } from 'react-router-dom'
import LobbyScreen from './screens/LobbyScreen';
import Room from './screens/Room';
import LoginSignup from './components/LoginSignup';

function App() {
  return (
    <div className="App">
       <Routes>
        <Route path = '/' element={<LobbyScreen/>}/>
        <Route path = '/room/:id/:data' element={<Room/>}/>
        <Route path = '/login' element={<LoginSignup/>}/>

       </Routes>
    </div>
  );
}

export default App;
