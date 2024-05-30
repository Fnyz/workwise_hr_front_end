import React, {useEffect, useState } from 'react'
import axiosClient from '../axiosClient'
import moment from 'moment';
import { useLocation } from 'react-router-dom';

export default function Notifications() {
  
    const [notification, setNotifications] = useState([]);
    const [pagination, setPagination] = useState([]);
     const [load, setLoad] = useState(false);
    const [search, setSearch] = useState("");
    const [checkboxState, setCheckboxState] = useState([]);
    const [checkHead, setCheckboxHead] = useState(false);
    const [change_of_params, setChange_of_params] = useState({});
    const [employeeData, setEmployeeData] = useState({});
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const id = searchParams.get('id') || null;


    const handleCheckboxChange = (e) => {
        setCheckboxHead(false)
        const checkboxId = e.target.id;
        const isChecked = e.target.checked;
      
        if (isChecked) {
         setCheckboxState(prevIds => [...prevIds, {id: checkboxId}]);
         } else {
         setCheckboxState(prevIds => prevIds?.filter(d => parseInt(d.id) !== parseInt(checkboxId)));
         }
   
    };


    const notificationList = (qry = null, srch = null, param = {}) => {
        setLoad(true)
         axiosClient.get(`/notification${qry ? qry : ""}`,  {
                params:  {...param, search:srch},
            }).then(rs => {
                setLoad(false)
                setNotifications(rs.data.data.data);
                setPagination(rs.data.data.links)
            })
         
    }

 
    const getInformation = () => {
        Promise.all(
            [
                axiosClient.get("/employee",{
                    params:{
                     all:true
                    }
                 }),
                axiosClient.get("/user"),
                axiosClient.get(`/notification`)
            ]
        ).then(res => {
            
            const role_of_employee = res[0].data.data.find(d => d.employee_email === res[1].data.email)?.employee_role
            const employee_id = res[0].data.data.find(d => d.employee_email === res[1].data.email)?.id

            let paramsChange = role_of_employee === "HR" || role_of_employee === "ADMIN" ?  {
                for_admin_hr: true,
            }:{
                id: employee_id,
                for_employee_only: true,
            }
            
            setEmployeeData({
                ...employeeData,
                employee_id,
                role: role_of_employee
            })

          
            setChange_of_params(paramsChange)
            notificationList(null, null, paramsChange)
            
        })
      }



   const handleCheckAll  = (e) => {
      setCheckboxHead(prev => !prev)
      if(e.target.checked){
         setCheckboxState(notification.map(d => {
            return {id: d.id}
         }))
      }else{
         setCheckboxState([]);
      }

   }

   const handleSearchPosition = (e) => {
    setSearch(e.target.value)
   
    if(e.target.value){
        notificationList(null, e.target.value, change_of_params)
    }else{
        notificationList(null, null, change_of_params)
    }
 }


    const handleUrlPaginate = (url) => {
   
        if(url){
           notificationList(`?${url.split("?")[1]}`, null, change_of_params);
           setCheckboxHead(false)
        }
        
    }

    const removePosition = () => {

        swal({
            title: "Are you sure?",
            text: "Once deleted, you will not be able to recover this notification?",
            icon: "warning",
            buttons: true,
            dangerMode: true,
          })
          .then((willDelete) => {
            if (willDelete) {
                axiosClient.delete(`/notification/delete`,{
                    data: checkboxState
                  })
                  .then(()=>{
                      setCheckboxState([])
                      setCheckboxHead(false)
                      notificationList(null, null, change_of_params)
                      swal({
                        title: "Good job!",
                        text: `${checkboxState.length > 1 ? 'Notifications': 'Notification'} is deleted succesfully.`,
                        icon: "success",
                        button: "Okay!",
                      });
                  })
                  .catch((err)=>{
                     const {response} = err;
                     if(response &&  response.status  === 422){
                       console.log(response.data)
                     }
                  })
              
            } else {
               setCheckboxState([])
               setCheckboxHead(false)
              swal({
               title: "Oooops!",
               text: `${checkboxState.length > 1 ? 'Notifications': 'Notification'} is not deleted in database.`,
               icon: "error",
               dangerMode: true,
             })
            }
          });
   

       
      
       
     }
   



    useEffect(()=>{       
        getInformation();
      },[])

      

  return (
    <div className="ml-auto mb-6 lg:w-[75%] xl:w-[80%] 2xl:w-[85%]">
     
    <div className="bg-white shadow rounded-lg p-4 sm:p-6 xl:p-8 m-5">
                     <div className=" flex items-center justify-start ">
                     <div className="relative flex gap-2 items-center  focus-within:text-[#0984e3] w-[50%] mb-5 max-md:w-full">
                                 <span className="absolute left-4 h-6 flex items-center pr-3 border-r border-gray-300">
                                 <svg xmlns="http://ww50w3.org/2000/svg" className="w-4 fill-current" viewBox="0 0 35.997 36.004">
                                    <path id="Icon_awesome-search" data-name="search" d="M35.508,31.127l-7.01-7.01a1.686,1.686,0,0,0-1.2-.492H26.156a14.618,14.618,0,1,0-2.531,2.531V27.3a1.686,1.686,0,0,0,.492,1.2l7.01,7.01a1.681,1.681,0,0,0,2.384,0l1.99-1.99a1.7,1.7,0,0,0,.007-2.391Zm-20.883-7.5a9,9,0,1,1,9-9A8.995,8.995,0,0,1,14.625,23.625Z"></path>
                                 </svg>
                                 </span>
                                 <input type="search" value={search} name="leadingIcon" id="leadingIcon" placeholder="Search employee name, department, position or status here"  onChange={handleSearchPosition} className="w-full pl-14 pr-4 py-2.5 rounded-xl text-sm text-gray-600 outline-none border border-gray-300 focus:border-[#0984e3] transition"/>
                                 {checkboxState.length > 0 && (
                                    <button className="btn  text-white btn-sm  btn-error" onClick={removePosition} >
                                       {checkboxState.length > 1? "Delete all": "Delete"}
                                       </button>
                                 )}
                           </div>
                     </div>
                     <div className="flex flex-col ">
                        <div className="overflow-x-auto rounded-lg">
                           <div className="align-middle inline-block min-w-full">
                              <div className="shadow overflow-hidden sm:rounded-lg">
                                  <table className="table overflow-x-hidden ">
                                    <thead>
                                    <tr>
                                        {notification.length > 0 && (
                                            <th className='tracking-wider'>
                                            <label>
                                                <input type="checkbox" className="checkbox" checked={checkHead}   onChange={handleCheckAll} />
                                            </label>
                                            </th>
                                        )}
                                        <th className='tracking-wider'>FROM</th>
                                        <th className='tracking-wider'>TO</th>
                                        <th className='tracking-wider'>DETAILS</th>
                                        <th className='tracking-wider'>DATE & TIME</th>
            
                                    </tr>
                                    </thead>
                                    <tbody>
                                    
                                 
                                    {load  ? (
                                         <tr>
                                         <td className="p-4 whitespace-nowrap text-sm font-normal text-gray-900" colSpan="4">
                                             <div className='ml-5 flex items-center gap-2 '>
                                                 <span className="loading loading-ring loading-lg text-primary"></span>
                                                  <span className="font-bold opacity-80">Loading for notification...</span>
                                               </div>
                                          
                                         </td>
                                      </tr>
                                    ) : notification?.length > 0 ? notification.map((nt, i)=> {
                                        return (  
                                            <tr key={i} className={`${parseInt(nt.id) === parseInt(id) ? "bg-slate-100 border-l-4 border-l-red-400": ""}`}>
                                                  {notification.length > 0 && (
                                                    <td className='whitespace-nowrap'>
                                                    <label>
                                                        <input type="checkbox" className="checkbox" id={nt.id} checked={checkboxState.some(d => parseInt(d.id) === parseInt(nt.id))} onChange={handleCheckboxChange}  />
                                                    </label>
                                                    </td>
                                                  )}
                                                <td>
                                                <div className="flex items-center gap-3 ">
                                                    <div className="avatar">
                                                    <div className="mask mask-squircle w-12 h-12">
                                                        <img src={nt.employee_image ? nt.employee_image : "https://img.daisyui.com/tailwind-css-component-profile-2@56w.png"} alt="Avatar Tailwind CSS Component" />
                                                    </div>
                                                    </div>
                                                    <div>
                                                    <div className="font-bold whitespace-nowrap">{nt.from_user.split("-")[1]}</div>
                                                    <div className="text-sm opacity-50 whitespace-nowrap">{nt.from_user.split("-")[0]}</div>
                                                    </div>
                                                </div>
                                                </td>
                                          
                                                <td>
                                                    <span className="font-semibold opacity-85 whitespace-nowrap capitalize"> {nt.to_user} </span>
                                                    <br/>
                                                    <span className="badge badge-ghost badge-sm whitespace-nowrap"><span className="text-red-500 opacity-70">{nt.position} / {nt.employee_role}</span></span>
                                                </td>
                    
                                                <td>
                                                    <span className='font-semibold opacity-80 whitespace-nowrap'>{nt.sender_message.split("is")[0].charAt(0).toUpperCase() + nt.sender_message.split("is")[0].slice(1)}</span> for <span className='font-semibold'> {nt.sender_leave_request}</span> is <span className={`font-bold ${nt.sender_message.split("is")[1].trim() === "PENDING" || nt.sender_message.split("is")[1].trim() === "DISAPPROVED" ? "text-red-500" : "text-blue-500"}`}>{nt.sender_message.split("is")[1]}.</span>
                                                </td>
                                                <td className="font-semibold opacity-70">
                                                    {moment(nt.created_at).calendar()}
                                                </td>
                                               
                                            </tr>
                                        
                                        )
                                    }): (
                                        <tr>
                                        <td className="p-4 whitespace-nowrap text-sm font-normal text-gray-900 " colSpan="4">
                                           <div className='ml-5'>
                                              <span className="font-bold opacity-80">No notification found!</span>
                                           </div>
                                        </td>
                                     </tr>
                                    )}
                                    </tbody>
                                
                                    
                                </table>


                               
                    
                            </div>
                      
                            
                        </div>

                      
                    </div>
                </div>
                <div className="join w-full justify-end mt-6">
                                {pagination.length > 0  && pagination.map((p, i) => {
                                        return (
                                        <button key={i} disabled={p.url ? false:true}   className={`join-item btn ${p.active ? "btn-active bg-[#0984e3] text-white  hover:bg-[#0984e3]" : ""} `}   dangerouslySetInnerHTML={{ __html: p.label }} onClick={()=> handleUrlPaginate(p.url)}></button>
                                        )
                                })}

                </div>
        </div>
    </div> 
  )
}
