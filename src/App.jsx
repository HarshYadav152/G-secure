import React, { useState } from 'react'
import { AuthProvider } from './contexts/AuthContext'
import ProtectedRoute from './component/ProtectedRoute'

import AddPassword from './component/AddPassword'
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom'
import Welcome from './pages/Welcome'
import Navbar from "./component/Nabvar"
import Signup from './pages/Signup'
import Login from './pages/Login'
import PasswordVault from './component/PasswordVault'
import BreachCheck from './component/BreachCheck'
import GeneratePassword from './component/GenPass'
import StrengthCheck from './component/StrengthCheck'
import Demo from './pages/Demo'
import AuthSuccess from './component/AuthSuccess'

export default function App() {
  const [alert, setAlert] = useState(null);

  const showAlert = (type, display, message,) => {
    setAlert({
      type: type,
      display: display,
      msg: message,
    })
    setTimeout(() => {
      setAlert(null)
    }, 1000);
  }
  return (
    <div>
      <BrowserRouter>
        <AuthProvider>
          <div className="fixed top-0 z-[-2] min-h-screen w-full bg-neutral-950 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]"></div>
          <Navbar />
          <Routes>
            <Route path="/" element={<Navigate to="/welcome" replace />} />
            <Route path="/auth-success" element={<AuthSuccess />} />
            <Route exact path='/welcome' element={<Welcome />} />
            <Route exact path='/signup' element={<Signup showAlert={showAlert} />} />
            <Route exact path='/login' element={<Login showAlert={showAlert} />} />

            <Route element={<ProtectedRoute />}>
              <Route exact path="/vault" element={<PasswordVault />} />
              <Route exact path="/vault/add" element={<AddPassword />} />
            </Route>
            <Route exact path="/features/breach" element={<BreachCheck />} />
            <Route exact path="/features/generate" element={<GeneratePassword />} />
            <Route exact path="/features/strength" element={<StrengthCheck />} />
            <Route exact path="/features/demo" element={<Demo />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </div>
  )
}
