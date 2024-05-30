import React, { useEffect, useState } from 'react'
import { Outlet, Navigate, useParams } from 'react-router-dom'
import { useAuth } from '../context';
import { links } from '../links';
import { useLocation } from 'react-router-dom'
import axiosClient from '../axiosClient';
import { googleLogout } from '@react-oauth/google';
import { Link } from 'react-router-dom';
import moment from 'moment';
import "./../App.css"
import Pusher from 'pusher-js';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const ComponentShow = ({settings, payload, setPayload, allRole, allDepartment, allPosition, handleSubmit,  dis, error, loadnow, role}) => {
  let html_render = ""
  switch (settings) {
    case "Profile":
      html_render = (
        <form  method="dialog">
        <span className="opacity-60 text-sm">See all your profile info below.</span>
        <div className="avatar mt-5 w-full flex-col flex justify-center items-center gap-3">
           <div className="w-24 rounded-full mt-4 ring ring-[#3498db] ring-offset-base-100 ring-offset-2">
              <img  src={
                payload.employee_image ? typeof payload.employee_image === "object" ? URL.createObjectURL(payload.employee_image) : payload.employee_image  : 
                "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg"} />
             
           </div>
           <input  type="file"  className="file-input file-input-bordered w-full mt-2" 
           onChange={(e)=>{
                const file = e.target.files[0]; 
                 const reader = new FileReader();
                 reader.onload = () => {
                    setPayload({...payload, employee_image:e.target.files[0], employee_image_url: reader.result})
                 };
                 reader.readAsDataURL(file);
           }} 
           />
        </div>
        <label className="input input-bordered mt-2 flex items-center gap-2 opacity-50 cursor-not-allowed">
          Employee ID:
           <input disabled  value={payload.employee_id || ""} name="employee_id"  type="text" className="grow cursor-not-allowed"  placeholder="i.g Onsoure000***" onChange={(e)=> setPayload({...payload, [e.target.name]: e.target.value })}  />
        </label>
        <label className="input input-bordered mt-2 flex items-center gap-2">
          Full name:
           <input value={payload.employee_name || ""}  name="employee_name"   type="text" className="grow" placeholder="i.g marcus"  
           onChange={(e)=> {
            setPayload({...payload, [e.target.name]: e.target.value })
           }}  
           />
        </label>
        <label className="input input-bordered mt-2 flex items-center gap-2 ">
          Email:
           <input value={payload.employee_email || ""} name="employee_email" disabled={dis}  type="text" className={`grow ${dis && "opacity-50"}`} placeholder="i.g marcus" onChange={(e)=> setPayload({...payload, [e.target.name]: e.target.value })}  />

          
        </label>
        <label className="input input-bordered mt-2 flex items-center gap-2">
           Address:
           <input value={payload.employee_address || ""} name="employee_address"  type="text" className="grow" placeholder="i.g address" onChange={(e)=> setPayload({...payload, [e.target.name]: e.target.value })} />
        </label>

        <label className="input input-bordered mt-2 flex items-center gap-2">
           Contact:
           <input value={payload.employee_phone || ""} name="employee_phone"  type="number" className="grow" placeholder="i.g 0969*****" onChange={(e)=> setPayload({...payload, [e.target.name]: e.target.value })} />
        </label>

        <label className="form-control w-full mt-2">
           <div className="label">
              <span className="label-text">Gender:</span>
           </div>
           <select value={payload.employee_gender || ""} name="employee_gender" className="select select-bordered" onChange={(e)=> setPayload({...payload, [e.target.name]: e.target.value })} >
              <option  defaultValue>Select here</option>
              <option value="M">MALE</option>
              <option value="F">FEMALE</option>
           </select>
        </label>
        {role === "HR" || role === "ADMIN" ? (
          <>
          <label className="form-control w-full mt-2">
            <div className="label">
                <span className="label-text">Role:</span>
            </div>
            <select value={payload.employee_role || ""} name="employee_role"  className="select select-bordered" onChange={(e)=> setPayload({...payload, [e.target.name]: e.target.value })} >
                <option defaultValue>Select here</option>
                {allRole && allRole.map(r => {
                  return (
                      <option value={r} key={r}>{r}</option>
                  )
                })}
            </select>
          </label>

          <label className="form-control w-full mt-2">
            <div className="label">
                <span className="label-text">Department:</span>
            </div>
            <select value={payload.department_id || ""} name="department_id" className="select select-bordered"onChange={(e)=> setPayload({...payload, [e.target.name]: e.target.value })} >
                <option  defaultValue>Select here</option>
                {allDepartment.map((de)=>{
                  return <option key={de.id} value={de.id}>{de.department}</option> 
                })}
              
            </select>
          </label>

          <label className="form-control w-full mt-2">
            <div className="label">
                <span className="label-text">Position:</span>
            </div>
            <select value={payload.position_id || ""} name="position_id" className="select select-bordered" onChange={(e)=> setPayload({...payload, [e.target.name]: e.target.value })} >
                <option defaultValue>Select here</option>
                {allPosition.map((pos)=>{
                  return <option key={pos.position_id} value={pos.position_id}>{pos.position}</option> 
                })}
            </select>
          </label>
          </>
        ): (
          <></>
        )}

       
        <div className="modal-action">
            <button type='button' className="btn bg-[#3498db] hover:bg-[#3498db] text-white w-[50%] max-md:w-full" onClick={handleSubmit}>UPDATE ACCOUNT</button>
        </div>
        </form>
      )
    break;
    case "Account Verification":
      html_render = (
        <form  method="dialog">
       <span className='text-sm opacity-65 '>Click submit to verify your account.</span>
        <label className="input input-bordered mt-4 flex items-center gap-2 ">
          Email:
           <input value={payload.employee_email || ""} name="employee_email" disabled={true}  type="text" className={`grow ${dis && "opacity-50"}`} placeholder="i.g marcus" onChange={(e)=> setPayload({...payload, [e.target.name]: e.target.value })}  />
        </label>
       
        <div className="modal-action">
      

            <button type='button' className="btn btn-success text-white w-[50%] gap-2" onClick={handleSubmit}>
              {loadnow && (
                <span className="loading loading-spinner"></span>
              )}
             {loadnow ? "PLEASE WAIT" : "VERIFY EMAIL"}</button>
        </div>
        </form>
      )
    break;
    case "Change Email Address":
      html_render = (
        <form  method="dialog">
       <span className='text-sm opacity-65 '>Input your new email account here</span>
       <label className="input input-bordered mt-4 flex items-center gap-2 ">
          <span className=' max-md:text-sm'>Current email: </span>
           <input value={payload.employee_email || ""} name="employee_email"  disabled  type="text" className={`grow opacity-50`} placeholder="i.g marcus" onChange={(e)=> setPayload({...payload, [e.target.name]: e.target.value })}  />
        </label>
        <label className="input input-bordered mt-4 flex items-center gap-2 ">
           <span className=' max-md:text-sm'>New email:</span>
           <input value={payload.new_email || ""} name="new_email"   type="text" className={`grow opacity-50`} placeholder="i.g marcus" onChange={(e)=> setPayload({...payload, [e.target.name]: e.target.value })}  />
        </label>
        <p  className="text-red text-xs italic mt-2 text-red-500 ml-2 error-message">{error && error['email']}</p>
        <div className="modal-action">
            <button type='button' className="btn btn-success text-white w-[50%] max-md:w-full" onClick={handleSubmit}>CHANGE EMAIL</button>
        </div>
        </form>
      )
    break;
    case "Change Password":
      html_render = (
        <form  method="dialog">
        <span className='text-sm opacity-65'>Input all fields below to change your password.</span>
        <label className="input input-bordered mt-2 flex items-center gap-2 ">
          <span className=' max-md:text-sm'>Current Password:</span>
           <input name="current_password" value={payload.current_password || ""} type="password" className={`grow `} placeholder="..." onChange={(e)=> setPayload({...payload, [e.target.name]: e.target.value })} />
        </label>
        <p  className="text-red text-xs italic mt-2 text-red-500 ml-2 error-message">{error && error['current_password']}</p>
        <label className="input input-bordered mt-3 flex items-center gap-2 ">
          <span className=' max-md:text-sm'>New Password:</span>
           <input  name="new_password" value={payload.new_password || ""} type="password" className={`grow `} placeholder="..." onChange={(e)=> setPayload({...payload, [e.target.name]: e.target.value })} />
        </label>
        <p  className="text-red text-xs italic mt-2 text-red-500 ml-2 error-message">{error && error['new_password']}</p>
        <label className="input input-bordered mt-3 flex items-center gap-2 ">
           <span className=' max-md:text-sm'>Confirmed Password:</span>
           <input  name="new_password_confirmation" value={payload.new_password_confirmation || ""} type="password" className={`grow `} placeholder="..." onChange={(e)=> setPayload({...payload, [e.target.name]: e.target.value })} />
        </label>
        <p  className="text-red text-xs italic mt-2 text-red-500 ml-2 error-message">{error && error['new_password_confirmation']}</p>
       
        <div className="modal-action">
            <button type='button' className="btn btn-success text-white w-[50%] max-md:w-full" onClick={handleSubmit}>CHANGE PASSWORD</button>
        </div>
        </form>
      )
    break;
    default:
      break;
  }
  return html_render;
}


function DefaultLayout() {

  const [totalNotifications, setTotalNotifications] = useState([]);
  const location = useLocation();
  const {id} = useParams();
  const { pathname } = location;
  const {setToken, setUser, user} = useAuth();
  const [role, setRole] = useState("");
  const [position, setPosition] = useState("");
  const [department, setDepartment] = useState("");
  const [_id, setEmployee_id] = useState("")
  const [canFileLeave, setCanFileLeave] = useState(false);
  const [chooseSettings, setChooseSettings] = useState("");
  const [employeeData, setEmployeeData] = useState(null);
  const [payload, setPayload] = useState({
    employee_name:""
  });
  const [allPosition, setAllPosition] = useState([]);
  const [allDepartment, setAllDepartment] = useState([]);
  const [allRole, setAllRole] = useState([]);
  const [dis, setDisabled] = useState(true)
  const [error, setError] = useState(null)
  const [loadnow, setLoadnow] = useState(false);
  const [load, setLoading] = useState(false);




  const logOut = () => {

    axiosClient.post("/logout")
    .then(()=>{
        googleLogout();
        setUser({});
        setToken(null);
    })
  }




  const handleSubmit = () => {

    const currentUrl = window.location.href;
    const url = new URL(currentUrl).origin;


    switch (chooseSettings) {
    case "Account Verification":
      setLoadnow(true);
      axiosClient.get('/verify-email',{
        params:{
          url: url,
        }
      })
      .then(response => {
        setLoadnow(false);
        document.getElementById('my_settings_3').close()
        swal({
          title: "Good job!",
          text: response.data.message,
          icon: "success",
          button: "Okay!",
        });
    
        fetchData();
      })
      .catch(error => {
        console.error(error); 
      });

      break;
    case "Profile":
      if(!payload.employee_image_url){
        payload.employee_image = payload.employee_image ? payload.employee_image : "";
      }else{
        payload.employee_image = payload.employee_image_url;
  
      }
     delete payload.employee_image_url;
     const data = {
        employee_image:payload.employee_image || "",
        employee_id:payload.employee_id,
        employee_name:payload.employee_name,
        employee_address:payload.employee_address || "",
        employee_phone:payload.employee_phone || "",
        employee_gender:payload.employee_gender || "",
        employee_email:payload.employee_email || "",
        employee_role:payload.employee_role,
        department_id:payload.department_id,
        position_id:payload.position_id,
        action: 'Employee_update_data'
      }
  
     const config = {
      headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
      }
    };
    const queryString = new URLSearchParams(data).toString();
  
     axiosClient.put(`/employee/${_id}`, queryString, config)
           .then(()=>{
              document.getElementById('my_settings_3').close()
              swal({
                title: "Good job!",
                text: `Your account is succesfully updated`,
                icon: "success",
                button: "Okay!",
              });
              fetchData();
              setPayload({})
           })
           .catch((err)=>{
              const {response} = err;
              if(response &&  response.status  === 422){
              console.log(response.data)
              }
    })

      break;
    case "Change Password":
      const value = {
        current_password:  payload.current_password,
        new_password: payload.new_password,
        new_password_confirmation: payload.new_password_confirmation
      }
      axiosClient.post('/change-password', value)
      .then(response => {
        document.getElementById('my_settings_3').close()
        swal({
          title: "Good job!",
          text: response.data.message,
          icon: "success",
          button: "Okay!",
        });
      })
      .catch(err => {
        const {response} = err;
          if(response &&  response.status  === 422){
            if(response.data.errors){
              setError(response.data.errors)
            }else{
              setError({
                current_password: response.data.message
              })
            }
            setTimeout(() => {
              setError(null)
            }, 3000);
          }
      });

      break;

      case "Change Email Address":
      
      const configs = {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
      };
      
      const queryStrings = new URLSearchParams({email: payload.new_email, employee_id:_id}).toString();
       axiosClient.put(`/users/${user.id}/email`, queryStrings, configs)
      .then(()=>{
          document.getElementById('my_settings_3').close()
          swal({
            title: "Good job!",
            text: `Your email address is updated successfully.`,
            icon: "success",
            button: "Okay!",
          });
          fetchData();
          setPayload({})
        })
        .catch((err)=>{
          const {response} = err;
          console.log(response.data.errors);
          if(response &&  response.status  === 422){
            setError(response.data.errors)
            setTimeout(() => {
              setError(null)
            }, 3000);
          }
      })

      break;
    default:
      break;
  }

  

  }


  

  useEffect(()=>{
    fetchData();
 },[])


 const fetchData = () => {
  setLoading(true)
  Promise.all([
    getDataList('user'), 
    getDataList('employee'), 
    getDataList('position'),
    getDataList('department')
  ])
    .then((data) => {
    
      const emp_id = data[1].data.find(emp => emp.employee_email === data[0].email)?.id;
      const emp_role = data[1].data.find(emp => emp.employee_email === data[0].email)?.employee_role;
      const department_id = data[1].data.find(emp => emp.employee_email === data[0].email)?.department_id;
      const position_id = data[1].data.find(emp => emp.employee_email === data[0].email)?.position_id;
       


      setUser(data[0])
      

      if(data[0].provider === "CREDENTIAL"){
        const payload = data[1].data.find(emp => emp.employee_email === data[0].email) ? {
          ...employeeData, ...data[1].data.find(emp => emp.employee_email === data[0].email)
        } : {
          ...employeeData,
          employee_image: data[0].image,
          employee_name:data[0].name
        } 

       
        setEmployeeData(payload);
      
      }else{
    
      setEmployeeData({
        ...data[1].data.find(emp => emp.employee_email === data[0].email),
        employee_image: !data[0].image ? data[1].data.find(emp => emp.employee_email === data[0].email).employee_image : data[0].image,
        employee_name:data[0].name
      });
      }
      setRole(emp_role);
     
      setPosition(data[2].data.find(pos => pos.position_id === data[1].data.find(emp => emp.employee_email === data[0].email)?.position_id)?.position);
      setDepartment(data[3].data.find(de => de.id === department_id)?.department)
      setEmployee_id(emp_id);

      setAllPosition(data[2].data);
      setAllDepartment(data[3].data);

      let allRoles = ['EMPLOYEE', 'HR', 'ADMIN'];
  
      setAllRole(allRoles);
    
      if(!department_id || !position_id){
        setCanFileLeave(false);
      }else{
        setCanFileLeave(true);
      }

      // var pusher = new Pusher('58cfedbc50426467817a', {
      //   cluster: 'ap1'
      // });
  
   
      // var channel = pusher.subscribe('workwise_channel');
      //   channel.bind('workwise_event', function() {
      //     fetchNotification(emp_id, emp_role)
      //      return;
      //   }); 

      fetchNotification(emp_id, emp_role)
      setLoading(false);
      

    })
    .catch((err) => {
        console.error(err);
    });
 }



 const fetchNotification = (id, role) => {
  if(role === "HR" || role === "ADMIN"){
    getNotificationList()
  }else{
    getNotificationList(id)
  }
 }


 const getNotificationList = (id = null) => {
   getDataList('notification', id)
   .then(data => {
  
    setTotalNotifications(data.data);
   })
 }


 const IconFile = ({authorize_leave, icon, user}) => {
 
   if(authorize_leave && user.email_verified_at){
    return icon
   }else{
    return (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 0 0 5.636 5.636m12.728 12.728A9 9 0 0 1 5.636 5.636m12.728 12.728L5.636 5.636" />
      </svg>
    )
   }
 }




 



  const getDataList = async (path, id = null) => {
    try {
      const res = await axiosClient.get(`/${path}`, {
        params:{
           id,
           data: path === "department" ? "ALL":"",
           allDepartment: path === "department",
           all:true
        }
      })
      return res.data;
    } catch (err) {
       const {response} = err;
       if(response &&  response.status  === 422){
         console.log(response.data)
       }
    }
 } 


 



  const {token} = useAuth();
  if(!token) {
    return <Navigate to='/login' />
  }


  const Component  = () => {
    switch (role) {
      case 'HR':
      case 'ADMIN':
        return links.filter(link => link.path === '/dashboard' 
        || link.path === '/positions' 
        || link.path === '/department'
        || link.path === '/employees'
        || link.path === '/notification'
        || link.path === '/leave'
        || link.path === '/history'
      ) 
        .map((link ,i) => (
             <li key={i} >
             <Link to={`${link.path}`} onClick={(e)=> {
            
            
                if(!user.email_verified_at && link.path === '/leave'){
                  e.preventDefault();
                  setChooseSettings("Account Verification")
                  setPayload({...payload, employee_email:employeeData.employee_email})
                  swal({
                    title: "Oooops!",
                    text: "You are not allowed to add leave, because you email account is not verified yet. Click OK now to verified your email account.",
                    icon: "warning",
                    buttons: true,
                    dangerMode: true,
                  })
                  .then((willDelete) => {
                    if (willDelete) {
                      document.getElementById('my_settings_3').showModal()
                    } 
                  });
                 
                  return;
                }
                
                if(!canFileLeave && link.path === '/leave'){
                  e.preventDefault();
                  swal({
                    title: "Oooops!",
                    text: `You are not allowed to add leave, because you don't have a department or a position as an ${role}.`,
                    icon: "warning",
                    buttons: true,
                    dangerMode: true,
                  })
                  return ;
                }
              
             }}  aria-label="dashboard" className={`${link.path === "/leave" && !canFileLeave ? "cursor-not-allowed" : ""} relative px-4 py-3 flex items-center space-x-4 rounded-xl ${link.name.toLowerCase()=== pathname.split('/')[1] ? "rounded-xl text-white bg-gradient-to-r from-[#3498db] to-[#3498db]" : " group"} `}>
                 {link.path === "/leave" ? <IconFile authorize_leave={canFileLeave} icon={link.icons} user={user}/> : link.icons}
                 <span  className="-mr-1 font-medium">{link.name}</span>
             </Link>
         </li>
         ))

      case 'EMPLOYEE':
        return links.filter(link => link.path === '/dashboard'
        || link.path === '/notification'
        || link.path === '/leave'
      ) 
        .map((link ,i) => (
             <li key={i} >
            <Link to={`${link.path}`} onClick={(e)=> {
              if(!user.email_verified_at && link.path === '/leave'){
                  e.preventDefault();
                  setChooseSettings("Account Verification")
                  setPayload({...payload, employee_email:employeeData.employee_email})
                  swal({
                    title: "Oooops!",
                    text: "You are not allowed to add leave, because you email account is not verified yet. Click OK now to verified your email account.",
                    icon: "warning",
                    buttons: true,
                    dangerMode: true,
                  })
                  .then((willDelete) => {
                    if (willDelete) {
                      document.getElementById('my_settings_3').showModal()
                    } 
                  });
                 
                  return ;
              }
                      
              if(!canFileLeave && link.path === '/leave'){
                e.preventDefault();
                swal({
                  title: "Oooops!",
                  text: `You are not allowed to add leave, because you don't have a department or a position as an ${role}.`,
                  icon: "warning",
                  buttons: true,
                  dangerMode: true,
                })
                return ;
              }
             }}  aria-label="dashboard" className={`${link.path === "/leave" && !canFileLeave ? "cursor-not-allowed" : link.path === "/leave" && !user.email_verified_at ? "cursor-not-allowed" : ""} relative px-4 py-3 flex items-center space-x-4 rounded-xl ${link.name.toLowerCase()=== pathname.split('/')[1] ? "rounded-xl text-white bg-gradient-to-r from-[#3498db] to-[#3498db]" : " group"} `}>
                 {link.path === "/leave" ? <IconFile authorize_leave={canFileLeave} icon={link.icons} user={user}/> : link.icons}
                 <span  className="-mr-1 font-medium">{link.name}</span>
             </Link>
         </li>
         ))
    
      default:
        return links.filter(link => link.path === '/dashboard'  )
       .map((link ,i) => (
            <li key={i}>
            <Link to={`${link.path}`} aria-label="dashboard" className={`relative px-4 py-3 flex items-center space-x-4 rounded-xl ${link.name.toLowerCase()=== pathname.split('/')[1] ? "rounded-xl text-white bg-gradient-to-r from-[#3498db] to-[#3498db]" : " group"} `}>
                {link.icons}
                <span className="-mr-1 font-medium">{link.name}</span>
            </Link>
        </li>
        ))
    }
  }



 

  

  




  return (
    <div className="App ">
       <aside className="ml-[-100%] fixed z-10 top-0 pb-3 px-6 w-full flex flex-col justify-between items-center h-screen border-r  transition duration-300 md:w-4/12 lg:ml-0 lg:w-[25%] xl:w-[20%] 2xl:w-[15%]">


        {load ? (
          <div className="flex flex-col gap-4 mt-8 w-full">
            <div className="skeleton h-32 w-full"></div>
            <div className="skeleton h-4 w-28"></div>
            <div className="skeleton h-4 w-full"></div>
            <div className="skeleton h-4 w-full"></div>
          </div>
        ): (
         <div className='w-full '>
              <div className="-mx-6 px-6 py-4 text-center ">
                  <a href="#" title="home">
                  <h4 className="block font-sans text-2xl font-semibold leading-snug tracking-normal text-blue-gray-900 antialiased">
                  Workwise<span className=' text-[#3498db] font-bold'>HR.</span>
                
                  </h4>
                  </a>
              </div>
       
              <div className="mt-2 text-center flex justify-center items-center flex-col">
          
                 {employeeData && employeeData?.employee_image ? (
                
                    <div className="avatar">
                    <div className="w-24 rounded-full ring ring-[#3498db] ring-offset-base-100 ring-offset-2">
                      <img  srcSet={employeeData.employee_image || "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg"}/>
                    </div>
                  </div>
             
                 ): (

                  <div className="avatar placeholder">
                   
                    <div className=" bg-[#3498db] rounded-full w-24 from-[#3498db] to-[#3498db] text-white shadow-[#3498db]/20 shadow-lg">
                        <span className="text-3xl uppercase">{employeeData && employeeData.employee_name.split("")[0]}</span>
                    </div>
                    </div> 
                 )}
                  <div className=' max-md:hidden flex flex-col mt-4 justify-center items-center gap-2'>
                    
                    <h5 className="hidden  text-xl font-semibold  lg:block capitalize">{employeeData && employeeData?.employee_name}</h5> 
                    <span className='border w-full'></span>
                    
                    {!position && !role && (
                      <span className="hidden opacity-70  lg:block font-semibold">No Position</span>
                    )}
                    {role && (
                      <>
                      <span className="hidden opacity-70 lg:block text-sm font-semibold">{role === "EMPLOYEE" ? position : role} {role === "NOT EMPLOYED" ? "" : department && (<>/ <span className="text-blue-500">{department}</span></> )} </span>
                      </>
                    )}
                   
                  </div>
              </div>

              <ul className="space-y-2 tracking-wide mt-8 ">
                <Component />
          
              </ul>
          </div> 
        )}
        
          <div className="px-6  pt-4 flex justify-between items-center border-t">
              <button onClick={logOut} className="px-4 py-3 flex items-center space-x-4 rounded-md text-gray-600 group">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  <span className="group-hover:text-gray-700">Logout</span>
              </button>
          </div>
      </aside>

      <div className="ml-auto mb-6 lg:w-[75%] xl:w-[80%] 2xl:w-[85%] ">

        <div className="navbar bg-base-100 border-b">
          <div className="navbar-start">
          <div className="dropdown lg:hidden">
                <div tabIndex={0} role="button" className="btn btn-ghost btn-circle">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7" /></svg>
                            </div>
                            <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
                              <Component />
                            </ul>
          </div>

          <div className='flex justify-center items-center gap-1'>
                <svg className=" h-5 w-5 max-lg:hidden  ml-4 " viewBox="0 0 24 24" fill="none">
                  <path d="M6 8a2 2 0 0 1 2-2h1a2 2 0 0 1 2 2v1a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V8ZM6 15a2 2 0 0 1 2-2h1a2 2 0 0 1 2 2v1a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2v-1Z" className="fill-current text-cyan-400 dark:fill-slate-600"></path>
                  <path d="M13 8a2 2 0 0 1 2-2h1a2 2 0 0 1 2 2v1a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2V8Z" className="fill-current text-cyan-200 group-hover:text-cyan-300"></path>
                  <path d="M13 15a2 2 0 0 1 2-2h1a2 2 0 0 1 2 2v1a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-1Z" className="fill-current group-hover:text-sky-300"></path>
               </svg>

                  <div className="text-sm breadcrumbs ">
                        <ul>
                           {pathname.split("/").slice(1, pathname.split("/").length).map((pt, i)=>{
                              return (
                                <li   key={i}>
                                  <Link  to={pathname.split("/").slice(1, pathname.split("/").length)[0] === pt ? `/${pt}`: `${pathname.split("/").slice(1, pathname.split("/").length)[0]}/${pt}` }>
                                       <h5  hidden className={`text-sm  text-gray-600 font-medium block capitalize ${pt === id ? "cursor-not-allowed" : "cursor-pointer"}`} >{pt}</h5>
                                  </Link>
                                </li> 
                              )
                           })}
                        </ul>
                  </div>
            </div>
            <div>

      </div>
              </div>

           


            <div className="navbar-end">
            {_id && (
                  <div className="flex space-x-2 items-center"> 
                   
                      <div>
                        <div className="dropdown dropdown-end">
                          <div tabIndex={0} role="button" className={`btn btn-ghost btn-circle btn-md avatar ${user.email_verified_at ? "offline" : "online"} placeholder`}>
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                          </svg>

                          </div>
                          <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-60 ">
                           
                            {!user.email_verified_at && (
                            <li>
                              <a className="justify-between" onClick={()=>{
                                setChooseSettings("Account Verification")
                                setPayload({...payload, employee_email:employeeData.employee_email});
                                document.getElementById('my_settings_3').showModal()
                              }}>
                                Account Verification
                                <span className="badge badge-error badge-sm"></span>
                              </a>
                            </li>
                            )}
                            <li><a onClick={()=>{
                                setChooseSettings("Profile")
                                setPayload(employeeData);
                                document.getElementById('my_settings_3').showModal()
                              }}>Profile</a></li>
                              {user.provider === "CREDENTIAL" && (
                                <li><a onClick={()=>{
                                    setChooseSettings("Change Password")
                                    document.getElementById('my_settings_3').showModal()
                                    setPayload({});
                                  }}>Change password</a></li>
                              )}
                              {user.provider === "CREDENTIAL" && (
                                <li><a onClick={()=>{
                                 setPayload({...payload, employee_email:employeeData.employee_email});
                                 setChooseSettings("Change Email Address")
                                 document.getElementById('my_settings_3').showModal()
                               }}>Change email address</a></li>
                              )}

                            <li className=' max-md:block hidden'><a onClick={logOut}>Log-out</a></li>
                          </ul>
                        </div>
                      </div>

                 
                      <div className="indicator ">
                        <span className="indicator-item badge text-sm bg-[#3498db] text-white mr-2">{totalNotifications &&  totalNotifications.filter(n => n.leave_has_seen !== 1)?.length}</span> 
                        <button type='button' onClick={()=>   document.getElementById('for_notification').showModal()} aria-label="notification" className="w-10 h-10 rounded-xl border bg-gray-100 focus:bg-gray-100 active:bg-gray-200 indicator">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 m-auto text-gray-600" viewBox="0 0 20 20" fill="currentColor">
                              <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
                          </svg>
                      </button>
                      </div>
                  </div>
                  )}

    
                 </div>
            </div>

      </div>

      <Outlet/>


          <dialog id="for_notification" className="modal">
            <div className="modal-box">
              <form method="dialog">
                <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
              </form>
              <div className='flex gap-2 items-center'>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0M3.124 7.5A8.969 8.969 0 0 1 5.292 3m13.416 0a8.969 8.969 0 0 1 2.168 4.5" />
                      </svg>
               
              <h3 className="font-bold text-lg">List of Notifications</h3>
              </div>
              <div className="text-sm my-4 w-full">
                <ul className='flex flex-col overflow-y-scroll w-full h-56 p-2 '>
                  {!totalNotifications.length && (
                    <div className="text-center text-gray-600 font-semibold mt-20">
                      No Notifications found!
                      </div>
                  )}
                  {totalNotifications.length > 0 && totalNotifications.map((notification, i) =>{
                    return (
                      <li key={i} >
                      <div role="alert" className={`  alert shadow-sm pb-8 mb-4 relative ${notification.leave_has_seen === 0 ? "opacity-100": "opacity-50"}`}>
                            <div className='flex items-center gap-2'>
                            <div>
                              <h3 className=" max-lg:text-start font-bold max-md:text-[12px]">{notification.employee_approval_id === _id ? "YOUR NOTIFICATION: " : `From: ${notification.from_user}`} </h3>
                              {role === "HR" || role === "ADMIN"  ? (
                                <div className="text-xs max-lg:text-start max-md:text-[11px]">{_id === notification.employee_id ? "Your" : notification.to_user} {notification.sender_message.split("is")[0]} is <span className={`font-bold ${notification.sender_message.split("is")[1]?.trim() === "PENDING" || notification.sender_message.split("is")[1]?.trim() === "DISAPPROVED" ? "text-red-500" : "text-blue-500"} `}>{notification.sender_message.split("is")[1]?.trim()}</span>, for <span className='font-bold uppercase'>{notification.sender_leave_request}</span>.</div>
                              ): (
                                <div className="text-xs max-lg:text-start max-md:text-[11px]">Your {notification.sender_message.split("is")[0]} is <span className={`font-bold max-md:text-[12px] ${notification.sender_message.split("is")[1]?.trim() === "PENDING" || notification.sender_message.split("is")[1]?.trim() === "DISAPPROVED" ? "text-red-500" : "text-blue-500"} `}>{notification.sender_message.split("is")[1]?.trim()}</span>, for <span className='font-bold'>{notification.sender_leave_request}</span>.</div>
                              )}
                            </div>
                       
                              <Link to={`/notification?id=${notification.id}`} className="btn btn-sm " onClick={()=> {
                                document.getElementById('for_notification').close();
                                if(notification.leave_has_seen === 0){
                                  axiosClient.put(`/notification/${notification.id}`, {
                                    leave_has_seen: 1
                                  }).then(() => {
                                    if(role === "HR" || role === "ADMIN"){
                                      getNotificationList()
                                    }else{
                                      getNotificationList(notification.employee_id)
                                    }
                              
                                  })
                                }
                              }}>View</Link>

                            <span className='text-[9px] font-semibold absolute right-5 opacity-70 bottom-2'>{moment(notification.created_at).calendar()}</span>
                        </div>
                            </div>
                    
                      </li>
                    )
                  })}
                </ul>
               </div>
             
            </div>
          </dialog>

          <dialog id="my_settings_3" className="modal">
            <div className="modal-box">
              <form method="dialog">
                <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2" onClick={()=> {
                   document.getElementById('my_settings_3').close()
                   setPayload({});
                   setDisabled(true)
                   setLoadnow(false)
                }}>✕</button>
              </form>
              <h3 className="font-bold text-lg uppercase mb-2">{chooseSettings === "Profile" ? "PROFILE INFORMATION": chooseSettings}</h3>
              <ComponentShow settings={chooseSettings} 
              payload={payload}
              allRole={allRole}
              setPayload={setPayload}
              allDepartment={allDepartment}
              allPosition={allPosition}
              handleSubmit={handleSubmit}
              dis={dis}
              error={error}
              loadnow={loadnow}
              role={role}
                />
            </div>
          </dialog>
          <ToastContainer
        />
          
    </div>
  )
}

export default DefaultLayout