import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from "./pages/Login"
import Signup from "./pages/Signup"
import Home from './pages/Home';

function App() {

  return (
    <>
      <Router>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/register' element={<Signup />} />
          <Route path='/login' element={<Login />} />
        </Routes>
      </Router>
      
    </>
  )
}

export default App