import { Routes,Route } from 'react-router-dom'
import LobbyScreen from './screens/LobbyScreen';
function App() {
  return (
    <div className="App">
       <Routes>
        <Route path = '/' element={<LobbyScreen/>}/>
       </Routes>
    </div>
  );
}

export default App;
