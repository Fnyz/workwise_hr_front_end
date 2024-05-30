import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { RouterProvider } from 'react-router-dom'
import { router } from './router.jsx'
import { ContextProvider } from './context';
import { GoogleOAuthProvider } from '@react-oauth/google';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
     <ContextProvider>
     <GoogleOAuthProvider clientId={import.meta.env.VITE_API_CLIENT_ID}>
      <RouterProvider router={router} />
     </GoogleOAuthProvider>
     </ContextProvider>
  </React.StrictMode>,
)
