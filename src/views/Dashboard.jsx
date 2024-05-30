import { useEffect, useState } from "react"
import axiosClient from "../axiosClient";
import DatePicker from "react-datepicker";
import moment from "moment";
import { Link } from "react-router-dom";



function Dashboard() {

    const [empRole, setRole] = useState("");
    const [userData, setUserData] = useState({
        employee_id: "",
        employee_image: "",
        employee_name: "",
        employee_email: "",
        employee_role: "",
        employee_start_date: new Date(),
     })
     const [totalEmployee, setTotalEmployee] = useState([])
     const [pendingLeave, setPendingLeave] = useState([]);
     const [totalNotifications, setTotalNotifications] = useState([])
     const [load, setLoading] = useState(false);
  
    useEffect(()=>{
       
        setLoading(true)
        Promise.all(
            [
                axiosClient.get("/employee", {
                   params:{
                    all:true
                   }
                }),
                axiosClient.get("/user"),
                axiosClient.get("leave",{
                    params: {
                        type: 'all_pending_leave'
                    }
                }),
                axiosClient.get("/notification")
            ]
        ).then(res => {

            const role_of_employee = res[0].data.data.find(d => d.employee_email === res[1].data.email)?.employee_role
            const employee_id = res[0].data.data.find(d => d.employee_email === res[1].data.email)?.id

           
            setTotalEmployee(res[0].data.data);
            setPendingLeave(res[2].data.data)
            if(!res[0].data.data.length){
                setLoading(false);
                setRole("FIRTS_USER");
                return;
            }

            if(!role_of_employee || role_of_employee.trim() === "NOT EMPLOYED"){
                setRole('NOT_EMPLOYEED')
            }else{
                setRole(role_of_employee)
            }
       
            const fetchNotif = role_of_employee === "HR" || role_of_employee === "ADMIN" ? axiosClient.get("/notification", {
                params: {
                    for_admin_hr: true,
                    all:true
                }
            }) : axiosClient.get("/notification", {
                params: {
                    for_employee_only:true,
                    id: employee_id,
                    all:true
                }
            });

 
            fetchNotif.then(rs => {

                setLoading(false);
                setTotalNotifications(rs.data.data);
            })
         
           
            
        })
    
      },[])

      const handleSetAccount = (e) => {
        e.preventDefault();

       const check = totalEmployee.filter(e => e.employee_role === "HR" || e.employee_role === "ADMIN")

       if(!check){
            axiosClient.post("/employee", {
                    employee_id: userData.employee_id,
                    employee_name: userData.employee_name,
                    employee_email: userData.employee_email,
                    employee_role: userData.employee_role,
                    employee_image: userData.employee_image,
                    employee_start_date: moment(userData.employee_start_date).format('L'),
                    employee_status: 'Active',
                    type:'setAccount',
                })
            .then(({data}) => {

                document.getElementById('my_modal_5').close();
                swal({
                    title: "Good job!",
                    text: data.message,
                    icon: "success",
                    button: "Okay!",
                  });
         
                  window.location.href = "/dashboard"

            
            }).catch((er)=>{
                console.log(er);
            })

       }else{
        
        const res = totalEmployee.find(e => e.employee_id?.trim() === userData.employee_id)
     

        const url = {
            employee_email: userData.employee_email,
            employee_image: userData.employee_image || "",
        }
 

       
        if(res){

            
            if(res?.employee_status?.trim() === "Inactive"){
                document.getElementById('my_modal_5').close();
                swal({
                    title: "Oooops!",
                    text: "Your employee ID is Inactive, please contact HR or ADMIN for more details!",
                    icon: "warning",
                    dangerMode: true,
                })
                return;
            }
          

            if(!res.employee_email){
            
                axiosClient.put(`/employee/${res.id}?${new URLSearchParams(url).toString()}`,{
                        action:'Employee_set_account',
                })
               .then(() => { 
                document.getElementById('my_modal_5').close();

                swal({
                    title: "Good job!",
                    text: `Your account is set successfully as an employee.`,
                    icon: "success",
                    button: "Okay!",
                  });
                
                  window.location.href = "/dashboard"
    
               }).catch((er)=>{
                console.log(er);
               })
               return;
            }


            document.getElementById('my_modal_5').close();
            swal({
                title: "Oooops!",
                text: "EMPLOYEE ID is already used, please try another again!",
                icon: "warning",
                dangerMode: true,
              })
         
            return;
        
        }else{
            document.getElementById('my_modal_5').close();
            if(!userData.employee_id){
                swal({
                    title: "Oooops!",
                    text: "Input the EMPLOYEE ID please...",
                    icon: "warning",
                    dangerMode: true,
                  })
                  return;
            }
            swal({
                title: "Oooops!",
                text: "Looks like, EMPLOYEE ID you entered is not a valid employee.",
                icon: "warning",
                dangerMode: true,
              })
            return;
        }
      
       }
       
      }


      
    if(load){
        return (
            <div className="ml-auto mb-6 lg:w-[75%] xl:w-[80%] 2xl:w-[85%] h-[750px] flex justify-center ">
                <div className="flex flex-col gap-4 w-full m-8">
                    <div className="skeleton h-72 w-full"></div>
                    <div className="skeleton h-4 w-full"></div>
                    <div className="skeleton h-4 w-full"></div>
                    <div className="skeleton h-4 w-full"></div>
                    <div className="skeleton h-4 w-full"></div>
                    <div className="skeleton h-4 w-full"></div>
                </div>
           </div>  
        )
      }

      switch (empRole) {
        case 'HR': 
        case 'ADMIN': 
        case 'EMPLOYEE':  
            return (
                <div className="ml-auto mb-6 lg:w-[75%] xl:w-[80%] 2xl:w-[85%] bg-white">
                    <div className="px-6 pt-6 2xl:container ">
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 ">

                            {empRole === "HR" || empRole === "ADMIN" ? (
                            <div className="relative flex flex-col bg-clip-border rounded-xl bg-white text-gray-700 shadow-md">
                                <div className="bg-clip-border mx-4 rounded-xl overflow-hidden bg-gradient-to-tr from-[#0984e3] to-[#0984e3] text-white shadow-[#0984e3]/40 shadow-lg absolute -mt-4 grid h-16 w-16 place-items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="w-6 h-6 text-white">
                                    <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clipRule="evenodd"></path>
                                    </svg>
                                </div>
                                <div className="p-4 text-right">
                                    <p className="block antialiased font-sans text-sm leading-normal font-semibold uppercase text-blue-gray-600">Total Employees</p>
                                    <h4 className="block antialiased tracking-normal font-sans text-2xl font-normal leading-snug text-blue-gray-900">{totalEmployee && totalEmployee.length}</h4>
                                </div>
                                <div className="border-t border-blue-gray-50 p-4">
                                    <div className='border w-full p-2 text-sm rounded-md flex gap-2 justify-center items-center bg-[#0984e3] text-white font-bold cursor-pointer transition-all ease-in opacity-80 hover:opacity-100'>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className ="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25ZM6.75 12h.008v.008H6.75V12Zm0 3h.008v.008H6.75V15Zm0 3h.008v.008H6.75V18Z" />
                                    </svg>
        
                                        <Link to="/employees" className="text-sm uppercase ">View User</Link>
                                    </div>
                                </div>
                            </div>
                            ): (
                                <></>
                            )}
        
                            <div className="relative flex flex-col bg-clip-border rounded-xl bg-white text-gray-700 shadow-md">
                                <div className="bg-clip-border  mx-4 rounded-xl overflow-hidden bg-gradient-to-tr from-[#00b894] to-[#00b894] text-white shadow-[#00b894]/40 shadow-lg absolute -mt-4 grid h-16 w-16 place-items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-7 h-7">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0M3.124 7.5A8.969 8.969 0 0 1 5.292 3m13.416 0a8.969 8.969 0 0 1 2.168 4.5" />
                                    </svg>
        
                                </div>
                                <div className="p-4 text-right">
                                    <p className="block antialiased font-sans text-sm leading-normal font-semibold text-blue-gray-600 uppercase">Notifications</p>
                                    <h4 className="block antialiased tracking-normal font-sans text-2xl font-normal leading-snug text-blue-gray-900">{totalNotifications &&  totalNotifications.length}</h4>
                                </div>
                                <div className="border-t border-blue-gray-50 p-4">
                                <div className='border w-full p-2 rounded-md flex gap-2 justify-center items-center bg-[#00b894] text-white font-bold cursor-pointer transition-all ease-in opacity-80 hover:opacity-100'>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25ZM6.75 12h.008v.008H6.75V12Zm0 3h.008v.008H6.75V15Zm0 3h.008v.008H6.75V18Z" />
                                </svg>
        
                                        <Link to="/notification" className="text-sm uppercase">Notifications</Link>
                                    </div>
                                </div>
                            </div>


                            {empRole?.trim() === "HR" || empRole === "ADMIN"  ? (
                            <div className="relative flex flex-col bg-clip-border rounded-xl bg-white text-gray-700 shadow-md">
                                <div className="bg-clip-border  mx-4 rounded-xl overflow-hidden bg-gradient-to-tr from-[#ff7675] to-[#ff7675] text-white shadow-[#ff7675]/40 shadow-lg absolute -mt-4 grid h-16 w-16 place-items-center">
                                
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-7 h-7">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                                    </svg>

        
                                </div>
                                <div className="p-4 text-right">
                                    <p className="block antialiased font-sans text-sm leading-normal font-semibold text-blue-gray-600 uppercase">Pending leaves</p>
                                    <h4 className="block antialiased tracking-normal font-sans text-2xl font-normal leading-snug text-blue-gray-900">{pendingLeave && pendingLeave.length}</h4>
                                </div>
                                <div className="border-t border-blue-gray-50 p-4">
                                <div className='border w-full p-2 rounded-md flex gap-2 justify-center items-center bg-[#ff7675] text-white font-bold cursor-pointer transition-all ease-in opacity-80 hover:opacity-100'>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25ZM6.75 12h.008v.008H6.75V12Zm0 3h.008v.008H6.75V15Zm0 3h.008v.008H6.75V18Z" />
                                </svg>
        
                                        <Link to="/leave" className="text-sm uppercase">View now</Link>
                                    </div>
                                </div>
                            </div>
                            ): (
                                <></>
                            )}
        
                           
                        </div>
                    </div> 
        
                
                </div> 
        
        
        
            )
        case 'NOT_EMPLOYEED':
            return (
                <>
                <div className="ml-auto mb-6 lg:w-[75%] xl:w-[80%] 2xl:w-[85%]">
                    <div className="bg-white shadow rounded-lg p-4 sm:p-6 xl:p-8 m-5">
              
                        <div className="hero min-h-screen bg-base-200">
                            <div className="hero-content text-center ">
                                <div>
                                    <h1 className="text-5xl font-bold">Hi there, Welcome to Workwise<span className="text-[#00b894]">HR.</span></h1>
                                        <p className="py-6 opacity-70 font-medium">Ooopps, looks like you don't have a position yet. <br></br> Please use your <span className="font-bold text-red-500">EMPLOYEE ID</span> to become an employee.</p> 
                                        <button className="btn bg-[#00b894] opacity-70 text-white hover:bg-[#00b894] hover:opacity-100 transition-all ease-in" onClick={()=> {

                                        document.getElementById('my_modal_5').showModal();
                                        axiosClient.get("/user")
                                        .then((user)=>{
                                    
                                            setUserData({
                                                ...userData,
                                                employee_email:user.data.email,
                                                employee_image:user.data.image
                                                
                                            }) 
                                          
                                        })
                                      
                                    }}>Click here</button>
                                </div>
                            </div>
                        </div>   
                    </div>
                
                </div> 
                <dialog id="my_modal_5" className="modal modal-bottom sm:modal-middle ">
            <div className="modal-box w-[10px]">
                <div className="flex justify-between">
                <div>
                <h3 className="font-bold text-lg">New Employee</h3>
                <span className="label-text opacity-70 ">Input all the fields below</span>
                </div>
                <button type='button' className="btn shadow"  onClick={()=>  document.getElementById('my_modal_5').close()} >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>
                <form onSubmit={handleSetAccount}  method="dialog">
                <div className="avatar mt-5 w-full flex-col flex justify-center items-center gap-3">
                </div>
                <label className="input input-bordered mt-2 flex items-center gap-2">
                  Employee ID
                   <input value={userData.employee_id || ""}   type="text" className="grow" placeholder="i.g xxxxxxxxx" onChange={(e)=> setUserData({...userData, employee_id: e.target.value })} />
                </label>
                <label className="input input-bordered mt-2 flex items-center gap-2">
                   Email
                   <input value={userData.employee_email || ""} type="email" className="grow opacity-70 cursor-not-allowed" placeholder="i.g email" disabled  onChange={(e)=> setUserData({...userData, employee_email: e.target.value })} />
                </label>
             
                <div className="modal-action">
                    <button type='submit'  className="btn btn-success text-white w-[100%]">Submit</button>
                </div>
                </form>
            </div>
        </dialog>
                </>
            )
            
      
        default:
            return (
                <div className="ml-auto mb-6 lg:w-[75%] xl:w-[80%] 2xl:w-[85%]">
                    <div className="bg-white shadow rounded-lg p-4 sm:p-6 xl:p-8 m-5">
                        <div className="hero min-h-screen bg-base-200">
                            <div className="hero-content text-center">
                                <div>
                                    <h1 className="text-5xl font-bold">Hi there, Welcome to Workwise<span className="text-[#00b894]">HR.</span></h1>
                                        <p className="py-6 opacity-70 font-medium">Look like no ADMIN or HR role in this application, <br></br> so you can set your account to two role now to manage this application.</p> 
                                    <button className="btn bg-[#00b894] opacity-70 text-white hover:bg-[#00b894] hover:opacity-100 transition-all ease-in" onClick={()=> {
                                        document.getElementById('my_modal_5').showModal();
                                        axiosClient.get("/user")
                                        .then((user)=>{
                                            setUserData({
                                                ...userData,
                                                employee_name:user.data.name,
                                                employee_email:user.data.email,
                                                employee_image:user.data.image
                                                
                                            }) 
                                          
                                        })
                                     
                                      
                                    }}>Set Account</button>
                                </div>
                            </div>
                        </div>   
                    </div>
                    <dialog id="my_modal_5" className="modal modal-bottom sm:modal-middle ">
            <div className="modal-box w-[10px]">
                <div className="flex justify-between">
                <div>
                <h3 className="font-bold text-lg">New Employee</h3>
                <span className="label-text opacity-70 ">Input all the fields below</span>
                </div>
                <button type='button' className="btn shadow"  onClick={()=>  document.getElementById('my_modal_5').close()} >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>
                <form onSubmit={handleSetAccount}  method="dialog">
                <div className="avatar mt-5 w-full flex-col flex justify-center items-center gap-3">
                </div>
                <label className="input input-bordered mt-2 flex items-center gap-2">
                  Employee ID
                   <input value={userData.employee_id || ""}   type="text" className="grow" placeholder="i.g Onsoure000***" onChange={(e)=> setUserData({...userData, employee_id: e.target.value })} />
                </label>
                <label className="input input-bordered mt-2 flex items-center gap-2">
                  Full name
                   <input value={userData.employee_name || ""}  type="text" className="grow opacity-70 cursor-not-allowed" placeholder="i.g marcus" disabled   onChange={(e)=> setUserData({...userData, employee_name:  e.target.value})}  />
                </label>
                <label className="input input-bordered mt-2 flex items-center gap-2">
                   Email
                   <input value={userData.employee_email || ""} type="email" className="grow opacity-70 cursor-not-allowed" placeholder="i.g email" disabled  onChange={(e)=> setUserData({...userData, employee_email: e.target.value })} />
                </label>
                <label className="input input-bordered mt-2 flex items-center gap-2 mb-4">
                   Start-date:
                   <DatePicker className="grow"  selected={userData.employee_start_date}  onChange={(date) => setUserData({...userData, employee_start_date:date})} />
                </label>
            
    
                <label className="form-control w-full mt-2">
                   <div className="label">
                      <span className="label-text">Role</span>
                   </div>
                   <select value={userData.employee_role} className="select select-bordered" onChange={(e)=> setUserData({...userData, employee_role: e.target.value})} >
                      <option  defaultValue>Select here</option>
                      <option value="HR">HR</option>
                      <option value="ADMIN">ADMIN</option>
                   </select>
                </label>
               
                <div className="modal-action">
                    <button type='submit'  className="btn btn-success text-white w-[100%]">Set account as HR</button>
                </div>
                </form>
            </div>
        </dialog>
                </div> 
            )
           
      }
      

    

  
}

export default Dashboard