import './App.css'
import { Routes, Route } from 'react-router-dom'
import Signup from './pages/Signup'
import Login from './pages/Login'
import Home from './pages/Home'
import Navbar from './components/Navbar'

function App() {

  return (
    <>
      <Routes>
        <Route path="/" element={<Navbar />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<h1>404 page not found</h1>} />
      </Routes>
    </>
  )
}

export default App
