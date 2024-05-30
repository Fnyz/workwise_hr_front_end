import React, { useRef, useState } from 'react'
import {axiosClient} from "../axiosClient.js";
import { useAuth } from '../context'
import { Link } from 'react-router-dom';

function Register() {
    
    const {setToken, setUser} = useAuth();

    const name = useRef();
    const email = useRef();
    const password = useRef();
    const confirmedPassword = useRef();
    const [error, setError] = useState(null);

  const onRegisterSubmit = (ev) => {
    ev.preventDefault();
    const currentUrl = window.location.href;
    const url = new URL(currentUrl).origin;
 

    const payload = {
        name: name.current.value,
        email: email.current.value,
        password: password.current.value,
        confirmed_password: confirmedPassword.current.value,
        provider: 'CREDENTIAL',
    }


 
    
    axiosClient.post("/register", payload)
   .then(({data}) => {
       setUser(data.user);
       setToken(data.token);
        axiosClient.post("/send-welcome-email", {
            url: url,
            user_id:data.user.id
        })
        
    
      })
   .catch((err) => {
       const {response} = err;
       if(response &&  response.status  === 422){
            if(response.data.errors){
                setError(response.data.errors);
                setTimeout(() => {
                    setError(null)
                }, 3000);
            }
     
       }
    });
  }

  

 

  return (
    <div className="flex min-h-screen items-center justify-center ">
    <div className="relative flex flex-col rounded-xl bg-transparent bg-clip-border text-gray-700 shadow-none ">
        <h4 className="block font-sans text-2xl font-semibold leading-snug tracking-normal text-blue-gray-900 antialiased">
        Register for Workwise<span className=' text-[#3498db] font-bold'>HR</span>
        </h4>
        <p className="mt-1 block font-sans text-sm opacity-70 font-normal leading-relaxed text-gray-700 antialiased">
        Input all the fields
        </p>
        <form onSubmit={onRegisterSubmit} className="mt-4 mb-2 w-80 max-w-screen-lg sm:w-96">
        <div className="mb-4 flex flex-col gap-6">
        <div className="relative h-11 w-full min-w-[200px]">
            <input
                ref={name}
                className={`peer h-full w-full rounded-md border border-blue-gray-200 bg-transparent px-3 py-3 font-sans text-sm font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 focus:border-2 focus:border-[#3498db] focus:border-t-transparent focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50`}
                placeholder=''
            />
            <label className={` before:content[' '] after:content[' '] pointer-events-none absolute left-0 -top-1.5 flex h-full w-full select-none text-[11px] font-normal leading-tight text-blue-gray-400 transition-all before:pointer-events-none before:mt-[6.5px] before:mr-1 before:box-border before:block before:h-1.5 before:w-2.5 before:rounded-tl-md before:border-t before:border-l before:border-blue-gray-200 before:transition-all after:pointer-events-none after:mt-[6.5px] after:ml-1 after:box-border after:block after:h-1.5 after:w-2.5 after:flex-grow after:rounded-tr-md after:border-t after:border-r after:border-blue-gray-200 after:transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[4.1] peer-placeholder-shown:text-blue-gray-500 peer-placeholder-shown:before:border-transparent peer-placeholder-shown:after:border-transparent peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-[#3498db] peer-focus:before:border-t-2 peer-focus:before:border-l-2 peer-focus:before:!border-[#3498db] peer-focus:after:border-t-2 peer-focus:after:border-r-2 peer-focus:after:!border-[#3498db] peer-disabled:text-transparent peer-disabled:before:border-transparent peer-disabled:after:border-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500`}>
                Name
            </label>
              <p  className="text-red text-xs italic mt-2 text-red-500 ml-2 error-message">{error && error['name']}</p>
            </div>
           
        
            <div className={`${error && error['name'] && "mt-3"} relative  h-11 w-full min-w-[200px]`}>
            <input
                ref={email}
                className={` peer h-full w-full rounded-md border border-blue-gray-200 bg-transparent px-3 py-3 font-sans text-sm font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 focus:border-2 focus:border-[#3498db] focus:border-t-transparent focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50`}
                placeholder=''
            />
            <label className="before:content[' '] after:content[' '] pointer-events-none absolute left-0 -top-1.5 flex h-full w-full select-none text-[11px] font-normal leading-tight text-blue-gray-400 transition-all before:pointer-events-none before:mt-[6.5px] before:mr-1 before:box-border before:block before:h-1.5 before:w-2.5 before:rounded-tl-md before:border-t before:border-l before:border-blue-gray-200 before:transition-all after:pointer-events-none after:mt-[6.5px] after:ml-1 after:box-border after:block after:h-1.5 after:w-2.5 after:flex-grow after:rounded-tr-md after:border-t after:border-r after:border-blue-gray-200 after:transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[4.1] peer-placeholder-shown:text-blue-gray-500 peer-placeholder-shown:before:border-transparent peer-placeholder-shown:after:border-transparent peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-[#3498db] peer-focus:before:border-t-2 peer-focus:before:border-l-2 peer-focus:before:!border-[#3498db] peer-focus:after:border-t-2 peer-focus:after:border-r-2 peer-focus:after:!border-[#3498db] peer-disabled:text-transparent peer-disabled:before:border-transparent peer-disabled:after:border-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500">
                Email
            </label>
                <p  className="text-red text-xs italic mt-2 text-red-500 ml-2 error-message">{error && error['email']}</p>
            </div>
            <div className={`${error && error['email'] && "mt-3"} relative  h-11 w-full min-w-[200px]`}>
            <input
                ref={password}
                type="password"
                className={`peer h-full w-full rounded-md border border-blue-gray-200 bg-transparent px-3 py-3 font-sans text-sm font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 focus:border-2 focus:border-[#3498db] focus:border-t-transparent focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50`}
                placeholder=''
            />
            <label className="before:content[' '] after:content[' '] pointer-events-none absolute left-0 -top-1.5 flex h-full w-full select-none text-[11px] font-normal leading-tight text-blue-gray-400 transition-all before:pointer-events-none before:mt-[6.5px] before:mr-1 before:box-border before:block before:h-1.5 before:w-2.5 before:rounded-tl-md before:border-t before:border-l before:border-blue-gray-200 before:transition-all after:pointer-events-none after:mt-[6.5px] after:ml-1 after:box-border after:block after:h-1.5 after:w-2.5 after:flex-grow after:rounded-tr-md after:border-t after:border-r after:border-blue-gray-200 after:transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[4.1] peer-placeholder-shown:text-blue-gray-500 peer-placeholder-shown:before:border-transparent peer-placeholder-shown:after:border-transparent peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-[#3498db] peer-focus:before:border-t-2 peer-focus:before:border-l-2 peer-focus:before:!border-[#3498db] peer-focus:after:border-t-2 peer-focus:after:border-r-2 peer-focus:after:!border-[#3498db] peer-disabled:text-transparent peer-disabled:before:border-transparent peer-disabled:after:border-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500">
                Password
            </label>
            <p  className="text-red text-xs italic mt-2 text-red-500 ml-2 error-message">{error && error['password']}</p>
            </div>

            <div className={`${error && error['password'] && "mt-3"} relative  h-11 w-full min-w-[200px]`}>
            <input
                ref={confirmedPassword}
                type="password"
                className={` peer h-full w-full rounded-md border border-blue-gray-200 bg-transparent px-3 py-3 font-sans text-sm font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 focus:border-2 focus:border-[#3498db] focus:border-t-transparent focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50`}
                placeholder=''
            />
            <label className="before:content[' '] after:content[' '] pointer-events-none absolute left-0 -top-1.5 flex h-full w-full select-none text-[11px] font-normal leading-tight text-blue-gray-400 transition-all before:pointer-events-none before:mt-[6.5px] before:mr-1 before:box-border before:block before:h-1.5 before:w-2.5 before:rounded-tl-md before:border-t before:border-l before:border-blue-gray-200 before:transition-all after:pointer-events-none after:mt-[6.5px] after:ml-1 after:box-border after:block after:h-1.5 after:w-2.5 after:flex-grow after:rounded-tr-md after:border-t after:border-r after:border-blue-gray-200 after:transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[4.1] peer-placeholder-shown:text-blue-gray-500 peer-placeholder-shown:before:border-transparent peer-placeholder-shown:after:border-transparent peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-[#3498db] peer-focus:before:border-t-2 peer-focus:before:border-l-2 peer-focus:before:!border-[#3498db] peer-focus:after:border-t-2 peer-focus:after:border-r-2 peer-focus:after:!border-[#3498db] peer-disabled:text-transparent peer-disabled:before:border-transparent peer-disabled:after:border-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500">
                Comfirm Password
            </label>
                    <p  className="text-red text-xs italic mt-2 text-red-500 ml-2 error-message">{error && error['confirmed_password']}</p>
            </div>
            
        </div>
       
        <button
            className={`${error && error['confirmed_password'] ?"mt-10": "mt-6"}  block w-full select-none rounded-lg bg-[#3498db] py-3 px-6 text-center align-middle font-sans text-xs font-bold uppercase text-white shadow-md shadow-pink-500/20 transition-all hover:shadow-lg hover:shadow-[#3498db]/40 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none`}
            type="submit"
            data-ripple-light="true"
        >
            Register
        </button>
        <p className="mt-4 block text-center font-sans text-sm  font-normal leading-relaxed  text-gray-700 antialiased">
            Already have an account?
            <Link
            className="font-semibold text-[#3498db] transition-colors hover:text-blue-700 ml-1 italic"
            to="/Login"
            >
            Login
            </Link>
        </p>
        </form>
    
    </div>
    </div>
  )
}

export default Register