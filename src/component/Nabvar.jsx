import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';

function Nabvar() {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  }
  return (
    <>
      <div className="nabvar flex justify-between bg-black/30 backdrop-blur items-center">
        <li className='list-none p-2 m-2 text-2xl'><a href="/">G-secure</a></li>
        <li className='list-none p-2 m-2 w-12'><a href="https://github.com/devPeers" target='_blank' ><img src="/github.png" alt="github.com" /></a></li>
        <div>
          {user && <><button className='list-none p-2 m-2 rounded bg-yellow-950 hover:bg-amber-800 transition'><Link to="/vault">Vault</Link></button>
            <button className='list-none p-2 m-2 rounded bg-yellow-950 hover:bg-amber-800 transition' onClick={handleLogout}>Logout</button>
          </>}
          {!user && <Link to={"/login"} className='list-none p-2 m-2 rounded bg-yellow-950 hover:bg-amber-800 transition'>Login</Link>}
        </div>
      </div>
    </>
  )
}

export default Nabvar