import './App.css'
import { Routes, Route } from 'react-router-dom'
import Signup from './pages/Signup'
import Login from './pages/Login'
import Home from './pages/Home'
import Navbar from './components/Navbar'
import Dashboard from './pages/dashboard'
import ExpenseInput from './components/ExpenseInput'
import AddCategory from './components/AddCategory'
import ProtectedRoute from './components/ProtectedRoute'

function App() {

  return (
    <>
      <Routes>
        <Route path="/" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        
        <Route path='/add-expense' element={<ExpenseInput/>}/>
        <Route path='/add-category' element={
          <ProtectedRoute>
            <>
              <Navbar/>
              <AddCategory/>
            </>
          </ProtectedRoute>
        }/>
        {/* <Route path="*" element={<Dashboard />} /> */}
      </Routes>
    </>
  )
}

export default App
