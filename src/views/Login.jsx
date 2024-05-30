import React, {  useRef, useState } from 'react'
import { useAuth } from '../context';
import axiosClient from '../axiosClient';
import 'boxicons'
import { useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { Link } from 'react-router-dom';

function Login() {

  const {setUser, setToken} =  useAuth();
  const email = useRef();
  const resetEmail = useRef();
  const password = useRef();
  const [error, setError] = useState(null);
  const [error_for_email, setForEmail] = useState(null);
  const [loadnow, setLoadnow] = useState(false);
  
  const loginWithGoogle =  useGoogleLogin({
        onSuccess: tokenResponse => {
                axios.get(`${import.meta.env.VITE_API_GOOGLE_LINK}`, {
        headers: {
            Authorization: `Bearer ${tokenResponse.access_token}`
        }
        })
        .then(userInfoResponse => {
            onGoogleSubmit(userInfoResponse.data)
        })
        .catch(error => {
          console.error('Error fetching user data from Google:', error);
        });
        },
  });

  const onGoogleSubmit = (data) => {
    
    const payload = {
        name: data.name,
        email: data.email,
        image: data.picture,
        provider: 'GOOGLE',
    }
 
    axiosClient.post("/register", payload)
   .then(({data}) => {
       setUser(data.user);
       setToken(data.token);
      })
   .catch((err) => {
       const {response} = err;
       if(response &&  response.status  === 422){
    
       }
    });
  }

  
  const login = (ev) => {
    ev.preventDefault();

    const payload = {
      email: email.current.value,
      password: password.current.value,
      provider: 'CREDENTIAL',
    }
  
    axiosClient.post('/login', payload)
    .then(({data})=>{
       setToken(data.token)
       setUser(data.user);
    }).catch((err)=>{
        const {response} = err;

        if (response && response.status === 422) {
      
            if(response.data.errors){
                setError(response.data.errors);
            }else{
                setError({
                    email: response.data.message
                })
            }
            setTimeout(() => {
                setError(null)
            }, 2000);

            localStorage.removeItem('ACCESS_TOKEN');
        }
    })
  }

  const sendPasswordReset = () => {
    setLoadnow(true)
    const payload = {
      email: resetEmail.current.value,
    }
    axiosClient.post('/send-password-reset-email', payload)
    .then(({data})=>{
        setLoadnow(false)
       swal({
        title: "Good job!",
        text: data.message,
        icon: "success",
        button: "Okay!",
      });
       resetEmail.current.value="";
       document.getElementById('my_modal_4').close()
    }).catch((err)=>{
        setLoadnow(false)
        const {response} = err;
        if (response && response.status === 422) {
            setForEmail(response.data.errors);
            setTimeout(() => {
                setForEmail(null)
            }, 2000);

        }
    })

  }


  

  return (
    <>
            
        <div className="flex min-h-screen items-center justify-center">
        <div className="relative flex flex-col rounded-xl bg-transparent bg-clip-border text-gray-700 shadow-none">
            <h4 className="block font-sans text-2xl font-semibold leading-snug tracking-normal text-blue-gray-900 antialiased">
            Login for Workwise<span className=' text-[#3498db] font-bold'>HR</span>
            </h4>
            <p className="mt-1 block font-sans text-sm font-normal leading-relaxed text-gray-700 opacity-60 antialiased">
            Input all the fields
            </p>
  
            <form onSubmit={login} className="mt-5 mb-2 w-80 max-w-screen-lg sm:w-96">
            <div className="mb-4 flex flex-col gap-6">
                
                <div className={`relative  h-11 w-full min-w-[200px]`}>
                <input
                    ref={email}
                    className="peer h-full w-full rounded-md border border-blue-gray-200 bg-transparent px-3 py-3 font-sans text-sm font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 focus:border-2 focus:border-[#3498db] focus:border-t-transparent focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50"
                    placeholder=""
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
                    className="peer h-full w-full rounded-md border border-blue-gray-200 bg-transparent px-3 py-3 font-sans text-sm font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 focus:border-2 focus:border-[#3498db] focus:border-t-transparent focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50"
                    placeholder=" "
                />
                <label className="before:content[' '] after:content[' '] pointer-events-none absolute left-0 -top-1.5 flex h-full w-full select-none text-[11px] font-normal leading-tight text-blue-gray-400 transition-all before:pointer-events-none before:mt-[6.5px] before:mr-1 before:box-border before:block before:h-1.5 before:w-2.5 before:rounded-tl-md before:border-t before:border-l before:border-blue-gray-200 before:transition-all after:pointer-events-none after:mt-[6.5px] after:ml-1 after:box-border after:block after:h-1.5 after:w-2.5 after:flex-grow after:rounded-tr-md after:border-t after:border-r after:border-blue-gray-200 after:transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[4.1] peer-placeholder-shown:text-blue-gray-500 peer-placeholder-shown:before:border-transparent peer-placeholder-shown:after:border-transparent peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-[#3498db] peer-focus:before:border-t-2 peer-focus:before:border-l-2 peer-focus:before:!border-[#3498db] peer-focus:after:border-t-2 peer-focus:after:border-r-2 peer-focus:after:!border-[#3498db] peer-disabled:text-transparent peer-disabled:before:border-transparent peer-disabled:after:border-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500">
                    Password
                </label>

                <p  className="text-red text-xs italic mt-2 text-red-500 ml-2 error-message">{error && error['password']}</p>
                </div>
            </div>
       
            <button
                className={`${error && error['password'] ?"mt-10": "mt-6"}  block w-full select-none rounded-lg bg-[#3498db] py-3 px-6 text-center align-middle font-sans text-xs font-bold uppercase text-white shadow-md shadow-[#3498db]/20 transition-all hover:shadow-lg hover:shadow-[#3498db]/20 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none`}
                type="submit"
                data-ripple-light="true"
            >
                Login
            </button> 
           
            </form>

            <div className='w-full  justify-center '>
            <button type='submit' className="btn  bg-[#00b894] hover:bg-[#00b894] my-2 w-full text-white" onClick={() => loginWithGoogle()}><box-icon color="white" size="sm"  type='logo' name='google'></box-icon> Login with Google</button>
            
            <div className='mt-2 flex flex-col gap-1'>
            <p className=" block text-center font-sans text-sm font-normal leading-relaxed text-gray-700 antialiased">
                Forget password?
                <a
                className="font-semibold text-red-500 cursor-pointer transition-colors hover:text-blue-700 ml-1 text-sm italic"
                onClick={()=>document.getElementById('my_modal_4').showModal()}>
                Click here.
                </a>
            </p>
           
            <p className=" block text-center font-sans  font-normal leading-relaxed text-gray-700 text-sm antialiased">
                Don't have an account?
                <Link
                className="font-semibold text-[#3498db] transition-colors hover:text-blue-700 ml-1 text-sm italic"
                to="/register"
                >
                Register.
                </Link>
            </p>
           </div>
            </div>
        </div>
               
        <dialog id="my_modal_4" className="modal">
            <div className={`modal-box ${error_for_email && error_for_email['email'] && "h-64"}`}>
                <form method="dialog">
             
                <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                </form>
                <h3 className="font-bold text-lg">Forget Password</h3>
                <p className='mt-1 opacity-60 text-sm'>Enter the email address associated with your account.</p>
                <div className="relative h-11  w-full min-w-[200px] mt-4">
                <input
                    ref={resetEmail}
                    className="peer h-full w-full rounded-md border border-blue-gray-200 bg-transparent px-3 py-3 font-sans text-sm font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 focus:border-2 focus:border-[#3498db] focus:border-t-transparent focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50"
                    placeholder=" "
                />
                <label className="before:content[' '] after:content[' '] pointer-events-none absolute left-0 -top-1.5 flex h-full w-full select-none text-[11px] font-normal leading-tight text-blue-gray-400 transition-all before:pointer-events-none before:mt-[6.5px] before:mr-1 before:box-border before:block before:h-1.5 before:w-2.5 before:rounded-tl-md before:border-t before:border-l before:border-blue-gray-200 before:transition-all after:pointer-events-none after:mt-[6.5px] after:ml-1 after:box-border after:block after:h-1.5 after:w-2.5 after:flex-grow after:rounded-tr-md after:border-t after:border-r after:border-blue-gray-200 after:transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[4.1] peer-placeholder-shown:text-blue-gray-500 peer-placeholder-shown:before:border-transparent peer-placeholder-shown:after:border-transparent peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-[#3498db] peer-focus:before:border-t-2 peer-focus:before:border-l-2 peer-focus:before:!border-[#3498db] peer-focus:after:border-t-2 peer-focus:after:border-r-2 peer-focus:after:!border-[#3498db] peer-disabled:text-transparent peer-disabled:before:border-transparent peer-disabled:after:border-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500">
                    Email
                </label>
                <p  className="text-red text-xs italic mt-2  text-red-500 ml-2 error-message">{error_for_email && error_for_email['email']}</p>
                </div>

                <button
                className={` ${error_for_email && error_for_email['email'] ?"mt-10": "mt-6"} flex justify-center items-center gap-4 w-full select-none rounded-lg bg-[#3498db] py-3 px-6 text-center align-middle font-sans text-xs font-bold uppercase text-white shadow-md shadow-pink-500/20 transition-all hover:shadow-lg hover:shadow-[#00b894]/20 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none`}
                type="submit"
                data-ripple-light="true"
                onClick={sendPasswordReset}
                >
                {loadnow && (
                <span className="loading loading-spinner loading-sm"></span>
              )}
              {loadnow ? "PLEASE WAIT" : "RESET PASSWORD"}
            </button> 
               
            </div>
        </dialog>
        </div>
            
 
    </>
  )
}

export default Login