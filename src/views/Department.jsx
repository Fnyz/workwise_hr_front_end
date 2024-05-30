import { useEffect, useState } from "react"
import axiosClient from "../axiosClient";

function Department() {

   const [department, setDepartment] = useState('');
   const [employee_id, setEmployeeId] = useState('');
   const [departments, setDataDepartment] = useState([]);
   const [_id, setDepartmentId] = useState('');
   const [empData, setEmpData] = useState([]);
   const [show, setShow] = useState(false);
   const [selectData, setSelectData] = useState([]);
   const [emp_de_id, setEmp_user_de_id] = useState("");
   const [choose, setChoose] = useState("")
   const [pagination, setPagination] = useState([]);
   const [search, setSearch] = useState("");
   const [checkboxState, setCheckboxState] = useState([]);
   const [checkHead, setCheckboxHead] = useState(false);
   const [error, setError] = useState(null)
   const [load, setLoad] = useState(false);

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



 const handleCheckAll  = (e) => {
    setCheckboxHead(prev => !prev)
    if(e.target.checked){
       setCheckboxState(departments.map(d => {
          return {id: d.id}
       }))
    }else{
       setCheckboxState([]);
    }

 }




   const handleSearchPosition = (e) => {
      setSearch(e.target.value)
  

      if(e.target.value){
         getListDepartment(choose,null, e.target.value)
      }else{
         getListDepartment(choose)
      }
   }

   const showDepartment = (id) => {
    
      axiosClient.get(`/department/${id}`)
      .then(({data})=>{
         document.getElementById('my_modal_5').showModal();
         setShow(true)
         setDepartmentId(data.data.id);
         setDepartment(data.data.department);
         if(!data.list_of_user_in_department[0].employee_name) return empData([])
         setEmpData(data.list_of_user_in_department
         .map(d => {
            return {
               ...d,
               employee_name: `${d.employee_name} (${d.employee_role})`
            }
         }))


         setEmployeeId(data.data.employee_id);  
 

    
       
       
      })
      .catch((err)=>{
         const {response} = err;
         if(response &&  response.status  === 422){
           console.log(response.data)
         }
      })
   }

   const deleteDepartment = () => {

      swal({
         title: "Are you sure?",
         text: "Once deleted, you will not be able to recover this department?",
         icon: "warning",
         buttons: true,
         dangerMode: true,
       })
       .then((willDelete) => {
         if (willDelete) {
             axiosClient.delete(`/department/delete`,{
               data: checkboxState
             })
             .then(()=>{
                  swal({
                        title: "Good job!",
                        text: `Company ${checkboxState.length > 1 ? "departments" : "department"} is deleted succesfully.`,
                        icon: "success",
                        button: "Okay!",
                     });
                   getListDepartment("ALL");
                  setCheckboxState([])
              
             })
             .catch((err)=>{
                const {response} = err;
                if(response &&  response.status  === 422){
                  swal({
                     title: "Oooops!",
                     text: response.data.message,
                     icon: "error",
                     dangerMode: true,
                   })
                }
             })
           
         } else {
           setCheckboxState([])
           setCheckboxHead(false)
           swal({
            title: "Oooops!",
            text: `Company ${checkboxState.length > 1 ? "departments" : "department"} is not deleted in database.`,
            icon: "error",
            dangerMode: true,
          })
         }
       });


   }

   const addDepartment = (e) => {
      e.preventDefault();

      const data = {
         department:department.trim(),
         employee_id,
      }
    
      if(_id){
        
         const {total_employees} = departments.find(d => parseInt(d.id) === parseInt(_id));
         if(!employee_id) {
            document.getElementById('my_modal_5').close()
            swal({
               title: "Oooops!",
               text: "Please choose a valid employee for this department",
               icon: "error",
               dangerMode: true,
             });
            return;
         }
    
         axiosClient.put(`/department/${_id}?department=${department.trim()}${parseInt(total_employees) > 0 ? `&employee_id=${employee_id}`: `&action=true`}`)
         .then(()=>{
            swal({
               title: "Good job!",
               text: "Company department is updated successfully!",
               icon: "success",
               button: "Okay!",
             });
            setShow(false);
            setDepartment("");
            document.getElementById('my_modal_5').close()
            getListDepartment("ALL");
            setEmpData([]);
            setDepartmentId("");
         })
         .catch((err)=>{
            const {response} = err;
            if(response &&  response.status  === 422){
              console.log(response.data)
            }
         })
         return;
      }

      axiosClient.post('/department', data)
      .then(() => {
         document.getElementById('my_modal_5').close()
         swal({
            title: "Good job!",
            text: "New company department is created successfully!",
            icon: "success",
            button: "Okay!",
          });
         getListDepartment("ALL");
         setDepartment("")
         })
      .catch((err) => {
         const {response} = err;
         if(response &&  response.status  === 422){
            setError(response.data.errors)
            setTimeout(() => {
               setError(null)
             }, 2000);
         }
         })
   }

   useEffect(()=>{
      Promise.all([getDataList('employee'), getDataList('user')])
        .then((data) => {
    
         setEmp_user_de_id(data[0].data.find(d => d.employee_email === data[1].email)?.department_id);

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

   const handleUrlPaginate = (url) => {
      if(url){
         getListDepartment(choose,`?${url.split("?")[1]}`);
      }
      
   }
   

   const getListDepartment = (id, path = null, srch = null) => {
      setLoad(true)
      axiosClient.get(`/department${path ? path : ""}`,{
         params: {
            data: id,
            search: srch, 
          }
      })
      .then(({data})=>{
       
         setLoad(false)
         setSelectData(data.for_filter_button)
         setDataDepartment(data.data.data);
         setPagination(data.data.links)
   
        
   
      })
      .catch((err)=>{
         const {response} = err;
         if(response &&  response.status  === 422){
           console.log(response.data)
         }
      })
   }



   const filterByDepartment = (e) => {
     getListDepartment(e.target.value)
     setChoose(e.target.value)
   }



   useEffect(()=>{
      getListDepartment('ALL');
      setChoose("ALL")
   },[])

  

  return (
    
      <div className="ml-auto mb-6 lg:w-[75%] xl:w-[80%] 2xl:w-[85%]">
          <div className="bg-white shadow rounded-lg p-4 sm:p-6 xl:p-8 m-5">
                     <div className="mb-4 flex items-center max-md:flex-col-reverse gap-4 justify-between">
                        <div className="flex items-center w-full max-md:flex-col gap-4">
                       
                           <label className="form-control  max-md:w-full">
                              <div className="label">
                                 <span className="label-text font-semibold">Filter by Department:</span>
                              </div>
                     
                              <select className="select select-bordered" onChange={filterByDepartment}>
                                 <option value='ALL'>ALL</option>
                                 {selectData.map((de, i)=> {
                                    return (
                                       <option key={i} value={de.id}>{de.department}</option>
                                    )
                                 })}
                              </select>
                           </label>
                  
                        <div className="relative flex gap-2 items-center lg:mt-8 focus-within:text-[#0984e3] w-96 max-md:w-full max-md:mx-4">
                                 <span className="absolute left-4 h-6 flex items-center pr-3 border-r border-gray-300">
                                 <svg xmlns="http://ww50w3.org/2000/svg" className="w-4 fill-current" viewBox="0 0 35.997 36.004">
                                    <path id="Icon_awesome-search" data-name="search" d="M35.508,31.127l-7.01-7.01a1.686,1.686,0,0,0-1.2-.492H26.156a14.618,14.618,0,1,0-2.531,2.531V27.3a1.686,1.686,0,0,0,.492,1.2l7.01,7.01a1.681,1.681,0,0,0,2.384,0l1.99-1.99a1.7,1.7,0,0,0,.007-2.391Zm-20.883-7.5a9,9,0,1,1,9-9A8.995,8.995,0,0,1,14.625,23.625Z"></path>
                                 </svg>
                                 </span>
                                 <input type="search" name="leadingIcon" id="leadingIcon" value={search} placeholder="Search department or employee name here" onChange={handleSearchPosition}  className="w-full pl-14 pr-4 py-2.5 rounded-xl text-sm text-gray-600 outline-none border border-gray-300 focus:border-[#0984e3] transition"/>
                                
                           </div>
                           {checkboxState.length > 0 && (
                                    <button className="btn  text-white btn-sm lg:mt-8 max-md:w-full btn-error" onClick={deleteDepartment}>
                                       {checkboxState.length > 1? "Delete all": "Delete"}
                                       </button>
                                 )}
                        </div>
                       
                        <div className="flex-shrink-0 flex justify-center items-center gap-3">
                        <div className='shadow-md p-1 bg-[#0984e3] rounded-md text-white cursor-pointer transition-all ease-in opacity-75 hover:opacity-100'  onClick={()=>document.getElementById('my_modal_5').showModal()}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                            </svg>
                        </div>
                          <span className='font-bold opacity-70'>NEW DEPARTMENT</span>
                        </div>
                     </div>
                     <div className="flex flex-col mt-8">
                        <div className="overflow-x-auto rounded-lg">
                           <div className="align-middle inline-block min-w-full">
                              <div className="shadow overflow-hidden sm:rounded-lg">
                                 <div className="overflow-x-auto">
                                 <table className="table">
                                    {/* head */}
                                    <thead>
                                       <tr>
                                          {choose === "ALL" && (
                                       <th className='tracking-wider'>
                                          <label>
                                             <input type="checkbox" className="checkbox" checked={checkHead} value={checkHead}   onChange={handleCheckAll}/>
                                          </label>
                                       </th>
                                          )}
                                       <th className='tracking-wider'>Department</th>
                                       <th className='tracking-wider'>Employees</th>
                                       <th className='tracking-wider'>Remarks</th>
                                       <th className='tracking-wider'>Action</th>
                                       </tr>
                                    </thead>
                                    <tbody>
                      
                                     {load ? (
                                            <tr>
                                            <td className="p-4 whitespace-nowrap text-sm font-normal text-gray-900" colSpan="4">
                                               <div className='ml-5 flex items-center gap-2 '>
                                                 <span className="loading loading-ring loading-lg text-primary"></span>
                                                  <span className="font-bold opacity-80">Loading for company department...</span>
                                               </div>
                                            </td>
             
                                         </tr>
                                       ): departments?.length ? departments.map((de, i)=>{
                                          return (
                                             <tr key={i}>
                                                {choose === "ALL" && (
                                                <td className='whitespace-nowrap'>
                                                   
                                                   <label>
                                                      <input type="checkbox" id={de.id}  checked={checkboxState.some(d => parseInt(d.id) === parseInt(de.id))}  className="checkbox" onChange={handleCheckboxChange} />
                                                   </label>
                                             
                                                </td>
                                             )}
                                             <td className="font-bold uppercase  whitespace-nowrap">{de.department}</td>
                                             <td>
                                                <div className="flex items-center gap-3">
                                                   {de.position === "CHOOSE DEPARTMENT HEAD" || de.position === "NO EMPLOYEE'S" ? (
                                                      <>
                                                      </>
                                                   ): (
                                                      <div className="avatar">
                                                      <div className="mask mask-squircle w-12 h-12">
                                                         <img srcSet={de.employee_image? de.employee_image : "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg"} alt="Avatar Tailwind CSS Component" />
                                                      </div>
                                                      </div>
                                                   )}
                                                   
                                                   <div>
                                                   <div className={`font-bold uppercase  whitespace-nowrap`}>{de.employee_name}</div>
                                                   <div className={`text-sm opacity-50  whitespace-nowrap ${de.position === "CHOOSE DEPARTMENT HEAD" || de.position === "NO EMPLOYEE'S" ? "text-red-500" : "text-gray-900"} `}>{de.position}</div>
                                                   </div>
                                                </div>
                                             </td>
                                            
                                        
                                             <td>
                                                 {choose === "ALL" && de.total_employees > 0 && (
                                                   <>
                                                  <span className=" opacity-80 text-sm   whitespace-nowrap">{de.total_employees > 0 ?  `${emp_de_id === de.id && ` ${de.total_employees - 1 === 0 ? "You're the only": "You and"}` || `There ${de.total_employees > 1 ? " are ":" is "}`} ${emp_de_id === de.id ? parseInt(de.total_employees) - 1 === 0 ? "": de.total_employees - 1  : de.total_employees} employee${de.total_employees > 1 ? "'s" : ""} in this department.`: "Add new employees now."}</span> 
                                                  <br/>
                                                   </>
                                                 )}
                                              
                                                <span className={`${de.remarks === "HAS EMPLOYEE" || de.remarks === "NO EMPLOYEE'S"  ? "text-red-500  font-bold" : "text-blue-900"} ${de.total_employees !== undefined && "mt-2"} badge font-bold badge-ghost badge-sm  whitespace-nowrap`}>{de.remarks}</span>
                                             </td>

                                             <td className="p-4 whitespace-nowrap text-sm font-semibold text-gray-900 flex gap-2">
                                           
                                                   <div onClick={()=> showDepartment(de.id)}>
                                                   <svg  xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5 text-[#0984e3] cursor-pointer transition-all opacity-75 hover:opacity-100">
                                                      <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                                                   </svg>
                                                   </div>
                                                 
                                             </td>
                                             </tr>
                                           
                                          )
                                       }):  (
                                          <tr>
                                             <td className="p-4 whitespace-nowrap text-sm font-normal text-gray-900" colSpan="4">
                                                <div className='ml-5'>
                                                   <span className="font-bold opacity-80">{choose === "ALL" ? "No department found!" : "No employee found!"}</span>
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
                     </div>

                     <div className="join w-full justify-end mt-6">
                  {pagination.length > 0  && pagination.map((p, i) => {
                        return (
                           <button key={i} disabled={p.url ? false:true}   className={`join-item btn ${p.active ? "btn-active bg-[#0984e3] text-white  hover:bg-[#0984e3]" : ""} `}   dangerouslySetInnerHTML={{ __html: p.label }} onClick={()=> handleUrlPaginate(p.url)}></button>
                        )
                  })}

                  </div>
            </div>

            <dialog id="my_modal_5" className="modal sm:modal-middle">
        <div className="modal-box">
            <h3 className="font-bold text-lg">New Department</h3>
            <form onSubmit={addDepartment} method="dialog">
               <label className="form-control w-full ">
               <div className="label">
                  <span className="label-text">Department name:</span>
               </div>
               <input value={department} onChange={(e)=> setDepartment(e.target.value)} type="text" placeholder="Input Company Department here" className="input input-bordered w-full"   />
               <p  className="text-red text-xs italic mt-2 text-red-500 ml-2 error-message">{error && error['department']}</p>
               </label>
                  {show && (
                  <label className="form-control w-full mt-2">
                  <div className="label">
                     <span className="label-text">Department Head:</span>
                  
                  </div>
                  <select value={employee_id || "NO EMPLOYEE TO THIS DEPARTMENT"} className="select select-bordered w-full" onChange={(e)=> setEmployeeId(e.target.value)}>
                    
                     {!empData.length && (
                        <option>NO EMPLOYEE TO THIS DEPARTMENT</option>
                         )
                     }
                     {empData.length > 0 &&  <option value="">Select Employee head here</option>}
                     {empData.map((emp, i) => {
                        
                        return (
                           <option key={i} value={emp.user_id}>{emp.employee_name}</option>
                        )
                     })}
                  
                  </select>
                  </label>
                  )}
            
            <div className="modal-action">
                <button type='submit' className="btn bg-[#0984e3] hover:bg-[#0984e3] text-white w-[30%]"> { _id ? 'Submit' : 'Create'}</button>
                <button type='button' className="btn shadow" onClick={() => {
                  setDepartment("");
                  setDepartmentId("");
                  document.getElementById('my_modal_5').close();
                  setEmployeeId("")
                  setShow(false)
                  setEmpData([])
             
                }}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
            </div>
            </form>
        </div>
    </dialog>
      </div> 

  )
}

export default Department