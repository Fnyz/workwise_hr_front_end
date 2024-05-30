import { useEffect, useRef, useState } from "react";
import axiosClient from "../axiosClient"
import { Link } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from 'moment';




const Items = ({empList, changeStatus, positions, departments, load}) => {
 
   if(load){
      return (
         <tr className='whitespace-nowrap'>
         <td className="p-4 whitespace-nowrap text-sm font-normal text-gray-900" colSpan="4">
          <div className='ml-5 flex items-center gap-3'>
            <span className="loading loading-ring loading-lg text-primary"></span>
            <span className="font-bold opacity-80">Loading for employee list...</span>
         </div>
         </td>
      </tr>
      )
   }

   if(empList.length){
      return empList.map((emp , i)=> (
            
           <tr key={i}>                   
               <td className='whitespace-nowrap'>
                  <div className="flex items-center gap-3">
                     <div className="avatar">
                        <div className="mask mask-squircle w-12 h-12">
                           <img srcSet={`${emp.employee_image || "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg"}`} alt="Avatar Tailwind CSS Component" />
                        </div>
                     </div>
                     <div>
                        <div className="font-bold uppercase">{emp.employee_name}</div>
                        <div className="text-sm opacity-50">{!emp.employee_email ? emp.employee_id : `${emp.employee_email} / ` } <span className="font-semibold uppercase">{emp.employee_email && `${emp.employee_id}`}</span> </div>
                     </div>
                  </div>
               </td>
               <td className='whitespace-nowrap'>
                 
                  <span className="font-semibold opacity-85"> {departments.find(d => parseInt(d.id) === parseInt(emp.department_id))?.department} - {positions.find(p => parseInt(p.position_id) === parseInt(emp.position_id))?.position} </span>
                  <br/>
                  <span className="badge badge-ghost badge-sm"><span className="text-red-500 opacity-70 font-semibold uppercase">{ emp.employee_role.trim() === "NOT EMPLOYED" ? emp?.employee_reason_status : departments.find(d => d.employee_id === emp.id)?.remarks || emp.employee_role} </span></span>
               </td>
               <td className='whitespace-nowrap'>
                   {emp.employee_start_date}
               </td>
               <td>
                  <span className={`p-3 badge badge-ghost badge-sm whitespace-nowrap text-sm  ${emp.employee_end_date === null ? "text-[#0984e3] font-bold uppercase" : "font-semibold text-red-500"}`}> {emp.employee_end_date || "Ongoing"}</span>
               </td>
               <td className='whitespace-nowrap'>
                   {moment(emp.created_at).calendar()}
               </td>
               <td className={`p-3 whitespace-nowrap text-sm font-bold uppercase `}>
                    <select value={emp.employee_status} className={`${emp.employee_status === "Active" ? "text-blue-700" : "text-red-700"} select select-bordered select-sm w-28 opacity-90`} onChange={(e)=> {
                       changeStatus(e.target.value, emp.id, emp.employee_start_date, emp.employee_name)
                    }}>
                       <option disabled >Select here</option>
                       <option value="Active">ACTIVE</option>
                       <option value="Inactive">INACTIVE</option>
                    </select>
                
              </td>
              <td className="pt-6 px-2 whitespace-nowrap text-sm font-semibold text-gray-900 flex gap-2 max-md:hidden">
                    <Link to={`/employees/${emp.id}`}>
                       <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6 text-[#0984e3] cursor-pointer transition-all opacity-75 hover:opacity-100">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m5.231 13.481L15 17.25m-4.5-15H5.625c-.621 0-1.125.504-1.125 1.125v16.5c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Zm3.75 11.625a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
                       </svg>
                    </Link> 
                    <span>/</span>
                    <Link to={`/employees/${emp.id}/update`}>
                    <svg  xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6 text-[#0984e3] cursor-pointer transition-all opacity-75 hover:opacity-100">
                       <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                    </svg>
                    </Link> 
              </td>
            </tr>                      
        
            )
      )
      
   }else if (!empList.length) {
      return (
       
          <tr>
          <td className="p-4 whitespace-nowrap text-sm font-normal text-gray-900" colSpan="4">
           <div className='ml-5'>
             <span>No data found!</span>
          </div>
          </td>
       </tr>
      )
   }
}
 
function Employees() {

   const [error, setError] = useState(null)
   const [statusForLeave, setStatusForLeave] = useState('');
   const refRole = useRef(null);
   const refDep = useRef(null);
   const refPos = useRef(null);
   const refGen = useRef(null);
   const refStat = useRef(null);
   const refChoose = useRef(null);
   const [load, setLoading] = useState(true);
   const [startDate, setStartDate] = useState(new Date());
   const [_endDate, setEndDate] = useState(new Date());
   const [department, setDepartment] = useState([]);
   const [position, setPosition] = useState([]);
   const [allRole, setRoles] = useState([]);
   const [empList, setEmployeeList] = useState([]);
   const [_id, setEmpId] = useState("");
   const [reason, setReason] = useState("");
   const [userData, setUserData] = useState({})
   const [payload, setPayload] = useState({
      employee_id: "",
      employee_image: "",
      employee_gender: "",
      employee_name: "",
      employee_address: "",
      employee_email: "",
      employee_phone: "",
      employee_role: "",
      department_id: "",
      position_id: "",
      employee_image_url:"",
      employee_start_date: "",
      employee_end_date: "",
      employee_status: "Active",
   });
   const [pagination, setPagination] = useState([]);
   const [search, setSearch] = useState("");





   useEffect(()=>{
      Promise.all([getDataList('position'), getDataList('department', 'ALL'), getDataList('user'), getDataList('employee')])
        .then((data) => {
            setPosition(data[0].data);
            setDepartment(data[1].data.data);
            getAllEmployees(data[2]);
            setUserData(data[2]);
            

            const roles = Array.from(new Set(data[3].data.map(r => r.employee_role)));

            let allRoles = ['EMPLOYEE', 'HR', 'ADMIN'];
            
            roles.forEach(al => {
                if (al.trim() === "HR" || al.trim() === "ADMIN") {
                    allRoles = allRoles.filter(r => r !== al.trim());
                }
            });
            
            setRoles(allRoles);

        })
        .catch((err) => {
            console.error(err);
        });
   },[])

    
   const getDataList = async (path, id = null) => {
      try {
        const res = await axiosClient.get(`/${path}`,{
         params:{
            data:id,
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



  
   

   const changeStatus = (value, id,  currentEndDate, emp_name) => {
      if(value === "Active"){
         handleSubmitStatus(null, id, value)
         setPayload({...payload, employee_name: emp_name})
         return;
      }
      setEmpId(id)
      setPayload({...payload, employee_status: value, employee_end_date:currentEndDate, employee_name:emp_name})
      document.getElementById('my_modal_3').showModal()
   }


   
   const handleSubmitStatus = (e, id=null, status = null) => {
   
      const enddate = moment(_endDate).format('L')
    


      const startDateSeconds = moment(payload.employee_end_date).unix();
      const endDateSeconds = moment(enddate).unix();


      if (startDateSeconds === endDateSeconds || startDateSeconds > endDateSeconds  && status !== "Active") {
         document.getElementById('my_modal_3').close()
          swal({
            title: "Oooops!",
            text: `Employee leaving date must be a date after the employee start date.`,
            icon: "error",
            dangerMode: true,
          })
          return;
      } 
             let pay = {
               employee_status: status ? status : payload.employee_status,
               employee_reason_for_leaving:reason,
               employee_end_date: status === "Active" ? "" : enddate,
               employee_role: "EMPLOYEE",
               employee_reason_status:"",
               action: "Employee",
            }

            if(status !== "Active"){
               pay = {...pay, employee_set_head: 0 , employee_role: "NOT EMPLOYED", employee_reason_status: statusForLeave}
            }
            axiosClient.put(`/employee/${id ? id : _id}`, pay, {
               headers: {
                  "Content-Type": "application/x-www-form-urlencoded",
               }
            })
            .then(()=>{

               getDataList('department', 'ALL')
               .then((res)=>{
                  setDepartment(res.data.data);
               })


               swal({
                  title: "Good job!",
                  text: `${payload.employee_name} status is updated successfully.`,
                  icon: "success",
                  button: "Okay!",
                });
               setReason("");
               document.getElementById('my_modal_3').close()
               getAllEmployees(userData);
               setPayload({
                  ...payload,
                  employee_status:"",
                  employee_reason_for_leaving:"",
                  employee_start_date:"",
                  employee_end_date:"",
               });
               setEmpId("");
               setStartDate(new Date());
         
            })
            .catch((err)=>{
               const {response} = err;
               if(response &&  response.status  === 422){
               alert(response.data.message)
               }
            })
   }
  
   const getAllEmployees = async (user = null, path = null, srch = null) => {
      setLoading(true)
 
      try {
         const res = await axiosClient.get(`/employee${path ? path : ""}`,{
            params:{
               search: srch,
            }
         })
     
         setLoading(false);
     
         setEmployeeList(res.data.data.filter(r => r.employee_email !== user.email));
         setPagination(res.data.meta.links);
 

       } catch (err) {
          const {response} = err;
          if(response &&  response.status  === 422){
            console.log(response.data)
          }
       }
   }


  const handleRadioChange = (event) => {
    setStatusForLeave(event.target.value);
   };


   const handleSubmitEmployee = () => {
  
      if(payload.employee_image_url){
         payload.employee_image = payload.employee_image_url;
      }
 
      if(_id){

         if(!payload.employee_image_url){
            payload.employee_image = payload.employee_image ? `${payload.employee_image.split('/')[3]}/${payload.employee_image.split('/')[4]}` : "";
         }else{
            payload.employee_image = payload.employee_image_url;

         }
         delete payload.employee_image_url;
       
         const params = {...payload, employee_start_date:moment(startDate).format('L'), 
         employee_end_date:moment(startDate).format('L') === moment(_endDate).format('L') && payload.employee_status === "Active" ? "" : moment(new Date(_endDate)).format('L'),
         }

         const config = {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        };

         const queryString = new URLSearchParams(params).toString();

        
        
         axiosClient.put(`/employee/${_id}`, queryString, config)
         .then(()=>{
            refChoose.current.value = "";
            alert("Employee updated successfully");
            getAllEmployees(userData);
            setPayload({
               employee_image: "",
               employee_gender: "",
               employee_name: "",
               employee_address: "",
               employee_email: "",
               employee_phone: "",
               employee_role: "",
               department_id: "",
               position_id: "",
               employee_image_url:"",
               employee_start_date: "",
               employee_end_date: "",
               employee_status: "Active",
            })

         })
         .catch((err)=>{
            const {response} = err;
            if(response &&  response.status  === 422){
            console.log(response.data)
            }
         })
         return;
      }

    
      delete payload.employee_image_url
      delete payload.employee_email
   
     
      axiosClient.post('/employee', {...payload, 
      employee_start_date:moment(startDate).format('L'), 
      employee_end_date:moment(startDate).format('L') === moment(_endDate).format('L') ? null : moment(_endDate).format('L'),
      action:"Employee",
      department_id: parseInt(payload.department_id),
      position_id: parseInt(payload.position_id)
      }).then(()=>{
         document.getElementById('my_modal_5').close()
         swal({
            title: "Good job!",
            text: 'Company employee is created successfully.',
            icon: "success",
            button: "Okay!",
          });
   
         getAllEmployees(userData);
      }).catch((err)=>{
         const {response} = err;
         if(response &&  response.status  === 422){
            setError(response.data.errors)
            setTimeout(() => {
               setError(null)
             }, 3000);
         }
      })
   }

   const handleSearchPosition = (e) => {
      setSearch(e.target.value)

      if(e.target.value){
         getAllEmployees(userData, null, e.target.value)
      }else{
         getAllEmployees(userData)
      }
   }

   const handleUrlPaginate = (url) => {
      if(url){
         getAllEmployees(userData, `?${url.split("?")[1]}`)
      }
      
   }


  return (
      <div className="ml-auto mb-6 lg:w-[75%] xl:w-[80%] 2xl:w-[85%] z-0">

        <div  className=" shadow rounded-lg p-4 sm:p-6 xl:p-8 m-5 z-0">
       
                     <div className="mb-4 flex items-center justify-between max-md:flex-col-reverse">
                        <div className="flex max-md:flex-col max-md:mt-4 max-md:w-full gap-4 w-[50%]">
                        <div className="flex-shrink-0 flex justify-center items-center  gap-3 max-md:hidden" >
                           
                           <Link to="/employees/add-excel" className='shadow-md p-1 bg-[#0984e3] rounded-md text-white cursor-pointer transition-all ease-in opacity-75 hover:opacity-100'>
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                              </svg>
                           </Link>
                             <span className='font-bold opacity-70 '> VIA ( EXCEL )</span>

                           </div>
                              <div className="relative flex gap-2 items-center  focus-within:text-[#0984e3] w-full">
                                    <span className="absolute left-4 h-6 flex items-center pr-3 border-r border-gray-300  ">
                                    <svg xmlns="http://ww50w3.org/2000/svg" className="w-4 fill-current" viewBox="0 0 35.997 36.004">
                                       <path id="Icon_awesome-search" data-name="search" d="M35.508,31.127l-7.01-7.01a1.686,1.686,0,0,0-1.2-.492H26.156a14.618,14.618,0,1,0-2.531,2.531V27.3a1.686,1.686,0,0,0,.492,1.2l7.01,7.01a1.681,1.681,0,0,0,2.384,0l1.99-1.99a1.7,1.7,0,0,0,.007-2.391Zm-20.883-7.5a9,9,0,1,1,9-9A8.995,8.995,0,0,1,14.625,23.625Z"></path>
                                    </svg>
                                    </span>
                                    <input type="search" value={search || ""} name="leadingIcon" id="leadingIcon" placeholder="Search employee name , position , employee id or email here"  onChange={handleSearchPosition} className="w-full pl-14 pr-4 py-2.5 rounded-xl text-sm text-gray-600 outline-none border border-gray-300 focus:border-[#0984e3] transition"/>
                              </div>
                        </div>
                          
                        <div className="flex-shrink-0 flex justify-center items-center gap-3" >
                           
                        <div className='shadow-md p-1 bg-[#0984e3] rounded-md text-white cursor-pointer transition-all ease-in opacity-75 hover:opacity-100' onClick={()=>{
                           document.getElementById('my_modal_5').showModal();
                         
                        }}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                            </svg>
                        </div>
                          <span className='font-bold opacity-70'>NEW EMPLOYEE</span>
                        </div>

                  
                     </div>
             
                     <div className="flex flex-col mt-8 z-0" >
                        <div className="overflow-x-auto rounded-lg z-0">
                           <div className="align-middle inline-block min-w-full z-0">
                              <div className="shadow overflow-hidden sm:rounded-lg z-0 relative">


                                 <div className="overflow-x-auto">
                                    <table className="table">
                                 
                                       <thead>
                                          <tr>
                                          <th className='tracking-wider'>Department</th>
                                          <th className='tracking-wider'>Employee name</th>
                                          <th className='tracking-wider'>Start date</th>
                                          <th className='tracking-wider'>End date</th>
                                          <th className='tracking-wider'>Created at</th>
                                          <th className='tracking-wider'>Status</th>
                                          <th className='tracking-wider max-md:hidden'>Action</th>
                                          </tr>
                                       </thead>
                                       <tbody>
                                    <Items empList = {empList} changeStatus={changeStatus} positions = {position} departments={department} load={load}/>         
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

        <dialog id="my_modal_5" className="modal  sm:modal-middle ">
        <div className="modal-box">
            <div className="flex justify-between">
            <div>
            <h3 className="font-bold text-lg">New Employee</h3>
            <span className="label-text opacity-70 ">Input all the fields below</span>
            </div>
            <button type='button' className="btn shadow" onClick={()=>{
                     document.getElementById('my_modal_5').close();
                     setEmpId("");
                     setPayload({
                        employee_id: "",
                        employee_image: "",
                        employee_gender: "",
                        employee_name: "",
                        employee_address: "",
                        employee_email: "",
                        employee_phone: "",
                        employee_role: "",
                        department_id: "",
                        position_id: "",
                        employee_image_url:"",
                        employee_start_date: "",
                        employee_end_date: "",
                        employee_status: "Active",
                     })
                }}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
            </div>
            <form  method="dialog">
            <div className="avatar mt-5 w-full flex-col flex justify-center items-center gap-3">
               <div className="w-24 rounded-full ring ring-[#0984e3] ring-offset-base-100 ring-offset-2">
                  <img  src={payload.employee_image ? typeof payload.employee_image === "object" ? URL.createObjectURL(payload.employee_image) : payload.employee_image  : "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg"} />
                 
               </div>
               <input ref={refChoose} type="file"  className="file-input file-input-bordered w-full mt-2" onChange={(e)=>{
                    const file = e.target.files[0]; 
                     const reader = new FileReader();
                     reader.onload = () => {
                        setPayload({...payload, employee_image:e.target.files[0], employee_image_url: reader.result})
                     };
                     reader.readAsDataURL(file);
               }} />
            </div>
            <label className="input input-bordered mt-2 flex items-center gap-2 ">
              Employee ID:
               <input value={payload.employee_id} type="text" className="grow" placeholder="i.g xxxxxxx" onChange={(e)=> setPayload({...payload, employee_id: e.target.value })} />
            </label>
            <p  className="text-red text-xs italic mt-2 text-red-500 ml-2 error-message">{error && error['employee_id']}</p>
            <label className="input input-bordered mt-2 flex items-center gap-2 ">
              Full-name:
               <input value={payload.employee_name} type="text" className="grow" placeholder="i.g marcus" onChange={(e)=> setPayload({...payload, employee_name: e.target.value })} />
            </label>
            <label className="input input-bordered mt-2 flex items-center gap-2 ">
               Address:
               <input value={payload.employee_address} type="text" className="grow" placeholder="i.g address"  onChange={(e)=> setPayload({...payload, employee_address: e.target.value })}/>
            </label>
            <p  className="text-red text-xs italic mt-2 text-red-500 ml-2 error-message">{error && error['employee_address']}</p>
            <label className="input input-bordered mt-2 flex items-center gap-2 ">
               Contact no:
               <input value={payload.employee_phone} type="number" className="grow" placeholder="i.g *******" onChange={(e)=> setPayload({...payload, employee_phone: e.target.value })} />
            </label>

            <label className="input input-bordered mt-2 flex items-center gap-2 mb-4 ">
               Start-date:
               <DatePicker className="grow"  selected={startDate}  onChange={(date) => setStartDate(date)} />
            </label>
            <label className="opacity-70 text-sm">
               End-date (Leave as empty if employee is still active):
            </label>
            <DatePicker  className="input input-bordered mt-2 flex items-center gap-2 font-semibold" selected={_endDate}  onChange={(date) => setEndDate(date)} />


            {_id && (
            <label className="form-control w-full mt-2">
               <div className="label">
                  <span className="label-text">Status</span>
               </div>
               <select ref={refStat} className="select select-bordered " onChange={(e)=> setPayload({...payload, employee_status: e.target.value})}>
                  <option  defaultValue>Select here</option>
                  <option value="Active" >ACTIVE</option>
                  <option value="Inactive">INACTIVE</option>
               </select>
            </label>
            )}
           
            <label className="form-control w-full mt-2">
               <div className="label">
                  <span className="label-text font-semibold">Gender</span>
               </div>
               <select ref={refGen} className="select select-bordered" onChange={(e)=> setPayload({...payload, employee_gender: e.target.value})}>
                  <option  defaultValue>Select here</option>
                  <option value="M" className="font-semibold">MALE</option>
                  <option value="F" className="font-semibold">FEMALE</option>
               </select>
            </label>
            <p  className="text-red text-xs italic mt-2 text-red-500 ml-2 error-message">{error && error['employee_gender']}</p>
            <label className="form-control w-full mt-2">
               <div className="label">
                  <span className="label-text font-semibold">Role</span>
               </div>
               <select ref={refRole} className="select select-bordered" onChange={(e)=> setPayload({...payload, employee_role: e.target.value})}>
                  <option defaultValue>Select here</option>
                  {allRole && allRole.map(r => {
                     return (
                        <option value={r} key={r} className="font-semibold">{r}</option>
                     )
                  })}
               </select>
            </label>
            <p  className="text-red text-xs italic mt-2 text-red-500 ml-2 error-message">{error && error['employee_role']}</p>
            <label className="form-control w-full mt-2">
               <div className="label">
                  <span className="label-text font-semibold">Department</span>
               </div>
               <select ref={refDep} className="select select-bordered" onChange={(e)=> setPayload({...payload, department_id: e.target.value})}>
                  <option  defaultValue>Select here</option>
                  {department.map((de)=>{
                     return <option key={de.id} value={de.id} className="font-semibold">{de.department}</option> ;
                  })}
                 
               </select>
            </label>
            <p  className="text-red text-xs italic mt-2 text-red-500 ml-2 error-message">{error && error['department_id'] && "The department field is required."}</p>
            <label className="form-control w-full mt-2">
               <div className="label">
                  <span className="label-text font-semibold">Position</span>
               </div>
               <select ref={refPos} className="select select-bordered" onChange={(e)=> setPayload({...payload, position_id: e.target.value})}>
                  <option defaultValue>Select here</option>
                  {position.map((pos)=>{
                     return <option key={pos.position_id} value={pos.position_id} className="font-semibold">{pos.position}</option> ;
                  })}
               </select>
            </label>
            <p  className="text-red text-xs italic mt-2 text-red-500 ml-2 error-message">{error && error['position_id'] && "The position field is required."}</p>
           
            <div className="modal-action">
                <button type='button' onClick={handleSubmitEmployee} className="btn max-md:w-full bg-[#0984e3] hover:bg-[#0984e3] text-white w-[30%]">{_id ? 'Submit':'Create'}</button>
            </div>
            </form>
        </div>
    </dialog>

          
         <dialog id="my_modal_3" className="modal">
         <div className="modal-box">
            <form method="dialog">
               <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
            </form>
            <div className="-mx-6 px-6 py-4 text-center mb-2">
                  <a href="#" title="home">
                  <h4 className="block font-sans text-2xl font-semibold leading-snug tracking-normal text-blue-gray-900 antialiased">
                  Workwise<span className=' text-[#0984e3] font-bold'>HR.</span>
                  </h4>
                  </a>
              </div>
            
            <label className="form-control">
                  <h3 className="font-bold text-lg">Reason for leaving</h3>
                  <span className="label-text opacity-70 mb-4">(Input the reason in the text area below or leave as empty.)</span>

            
                  <div>
                     <label className="label cursor-pointer">
                     <span className="label-text font-semibold">Resign</span> 
                     <input
                        type="radio"
                        name="radio-10"
                        className="radio checked:bg-red-500"
                        value="Resign"
                        checked={statusForLeave === "Resign"}
                        onChange={handleRadioChange}
                     />
                     </label>
                     <label className="label cursor-pointer">
                     <span className="label-text font-semibold">AWOL</span> 
                     <input
                        type="radio"
                        name="radio-10"
                        className="radio checked:bg-red-500"
                        value="AWOL"
                        checked={statusForLeave === "AWOL"}
                        onChange={handleRadioChange}
                     />
                     </label>
                     <label className="label cursor-pointer">
                     <span className="label-text font-semibold">Terminate</span> 
                     <input
                        type="radio"
                        name="radio-10"
                        className="radio checked:bg-red-500"
                        value="Terminate"
                        checked={statusForLeave === "Terminate"}
                        onChange={handleRadioChange}
                     />
                     </label>
                     <label className="label cursor-pointer mb-4">
                     <span className="label-text font-semibold">Inactive</span> 
                     <input
                        type="radio"
                        name="radio-10"
                        className="radio checked:bg-red-500"
                        value="Inactive"
                        checked={statusForLeave === "Inactive"}
                        onChange={handleRadioChange}
                     />
                     </label>
   
                  </div>

                  <textarea value={reason} onChange={(e)=>setReason(e.target.value)} className="textarea textarea-bordered h-24 w-full" placeholder={`Input some reason here why the employee is ${statusForLeave.toLowerCase().trim() === "awol" ? statusForLeave.toUpperCase() :  statusForLeave.toLowerCase()} the company?`}></textarea>
                  <label className="opacity-70 text-sm mt-2">
                     Select employee end-date:
                  </label>
                  <DatePicker  className="input input-bordered mt-2 flex items-center gap-2" selected={_endDate}  onChange={(date) => setEndDate(date)} />
                  <button type="button" onClick={handleSubmitStatus} className="btn bg-[#0984e3] hover:bg-[#0984e3] mt-5 text-white">Submit Reason</button>
               </label> 
         </div>
         </dialog>
      </div> 
  )
}

export default Employees