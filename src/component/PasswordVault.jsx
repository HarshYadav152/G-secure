import React from 'react'
import { useAuth } from '../contexts/AuthContext';
import SavedPassword from './SavedPassword';

function PasswordVault() {
  const { user } = useAuth();
  return (
    <>
      <header className="shadow-sm flex flex-col">
        <span className="">
          Welcome <span className="font-semibold">{user.username}</span>
        </span>
      </header>
      <SavedPassword/>
    </>
  )
}

export default PasswordVault