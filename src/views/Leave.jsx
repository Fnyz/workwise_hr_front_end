import React, { useCallback, useEffect, useState } from 'react'
import { ComponentShowHeader } from '../ComponentShowHeader';
import Modal from '../components/Modal';
import axiosClient from '../axiosClient';
import { ComponentDataList } from '../ComponentDataList';
import moment from 'moment';
import { tabs, tabsLinks } from '../utils/utils';
import { useLocation, useNavigate } from 'react-router-dom';

function Leave() {
  const [tabIndex, setTabIndex] = useState(0);
  const [tabIndexChild, setTabIndexChild] = useState(0);
  const [showTabs, setShowTabs] = useState(false);
  const [showButton, setShowButton] = useState(true);
  const [payload, setPayload] = useState({});
  const [buttonLoad, setButtonLoad] = useState(false);
  const [department, setDepartment] = useState([])
  const [data, setData] = useState([]);
  const [department_id, setDepartment_id] = useState("")
  const [leaveData, setLeaveData] = useState([]);
  const [_id, setReuseDataId] = useState("");
  const [load, setModalLoad] = useState(false);
  const [ruleCanAccess, setRuleCanAccess] = useState("");
  const [loadPage, setLoadPage] = useState(false);
  const [employee_data, setEmployee_data] = useState({});
  const [loadTable, setLoadTable] = useState(false);
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const [pagination, setPagination] = useState([]);
  const [search, setSearch] = useState("");
  const [error, setError] = useState(null);



  const index = searchParams.get('index') || null;
  const path_id = searchParams.get('id') || null;
 

  const calculateDays = (stDate, edDate) => {
    const startDate = new Date(stDate);
    const endDate = new Date(edDate);
    const differenceInTime = endDate.getTime() - startDate.getTime();
    const differenceInDays = differenceInTime / (1000 * 3600 * 24);
    return Math.abs(Math.round(differenceInDays))
  };

  const handleSearchPosition =  useCallback((e) => {
    setSearch(e.target.value)
    setData([])
    if(e.target.value){
       switch (tabIndex === 2 ? tabsLinks[tabIndexChild].text : tabs[tabIndex].text) {
        case 'HOLIDAYS':
          
          getHoliday(null, e.target.value);
          break;
        case 'LEAVE TYPE':
         
          getLeaveType(false, null, e.target.value)
          break;
       case 'YOUR LEAVE APPLICATION':
         
          getAllLeave('single', false, null, e.target.value)
          break;
        case "HEAD'S APPLICATION":
         
          getAllLeave('all', false, null, e.target.value)
          break;
        case "DEPARTMENT APPLICATION":
          
          getAllLeave('department_request', true, null, e.target.value)
          break;
        default:
          break;
      }
      
    }else{
      setData([])
      switch (tabIndex === 2 ? tabsLinks[tabIndexChild].text : tabs[tabIndex].text) {
        case 'HOLIDAYS':
          getHoliday();
          break;
        case 'LEAVE TYPE':
          getLeaveType()
          break;
       case 'YOUR LEAVE APPLICATION':
          getAllLeave('single')
          break;
       case "HEAD'S APPLICATION":
            getAllLeave('all')
            break;
       case "DEPARTMENT APPLICATION":
            getAllLeave('department_request', true)
            break;
        default:
          break;
      }
    }
  },[search])
  

  const handleUrlPaginate = (url, path) => {
    if(url){
    
      switch (path) {
        case 'HOLIDAYS':
          getHoliday(`?${url.split("?")[1]}`);
          break;
      case 'LEAVE TYPE':
          getLeaveType(false,`?${url.split("?")[1]}`)
         
          break;
      case 'YOUR LEAVE APPLICATION':
          getAllLeave('single', false, `?${url.split("?")[1]}`)
          break;
      case "HEAD'S APPLICATION":
          getAllLeave('all', false, `?${url.split("?")[1]}`)
          break;
      case "DEPARTMENT APPLICATION":
            getAllLeave('department_request', true, `?${url.split("?")[1]}`)
          break;
        default:
          break;
      }
      
    }
    
 }



 

  const handleShowType = (id) => {

    if(id === 2){
      setShowTabs(true)
      return;
    }else{
      setLoadTable(true)
      setTabIndex(id)
      setShowButton(true)

      switch (parseInt(id)) {
        case 1:
          getLeaveType();
          break;
        default:
          setTabIndex(0)
          getHoliday();
          break;
      }

    }
 
   
  }



  const handleShowTab = (id) => {
    
    setLoadTable(true)
    setTabIndexChild(id)
    setTabIndex(2)
     
    switch (id) {
      case 0:
        setShowButton(false);
        getAllLeave('all')
  
        break;
      case 1:
        setShowButton(true);
        getAllLeave('single');
    
        break;
      case 2:
        setShowButton(false);
        getAllLeave('department_request', true)
        break;
    
      default:
    
        break;
    }

  }

  useEffect(()=>{
    getEmployeeDetails();
    getHoliday()
    setShowButton(true)
 },[])

 


 const getHoliday = async (qry = null, srch = null) => {
  setLoadTable(true);
  try {
    const res = await axiosClient.get(`/holiday${qry ? qry: ""}`,{
      params:{
         search: srch,
      }
   })
    setLoadTable(false);
    setData(res.data.data.map(h => {
      return {...h, number_of_days: calculateDays(h.holiday_start_date, h.holiday_end_date)}
    }))
  
    setPagination(res.data.links)
   
  } catch (err) {
     const {response} = err;
     if(response &&  response.status  === 422){
       console.log(response.data)
     }
  }
 }


 const getLeaveType = async (request = false, qry = null, srch = null) => {
  if(!request){
    setLoadTable(true);
  }

  let change = request ? {
    all_type: true,
  } : {
    search: srch,
   }  


  try {
    const res = await axiosClient.get(`/leave_type${qry ? qry: ""}`,{
      params: change
   })

    setLoadTable(false);
    if(request){
      setLeaveData(res.data.filter(h => h.leave_status !== "INACTIVE"))
      return;
    }
    setData(res.data.data);
    setPagination(res.data.links);

  } catch (err) {
     const {response} = err;
     if(response &&  response.status  === 422){
       console.log(response.data)
     }
  }
 }


const getEmployeeDetails = () => {
  setTabIndex(0)
  setData([])
  setLoadTable(true)
  setLoadPage(true);
  Promise.all([
    getDataList('employee'),
    getDataList('user')
   ])
      .then(async(data) => {
       
        const employee_data = data[0].data.find(emp => emp.employee_email === data[1].email)
     
        try {
          const res = await axiosClient.get(`/department/${employee_data?.department_id}`);
          const department_head_id = res.data.data.employee_id
          setRuleCanAccess(employee_data.employee_role.toUpperCase())
          employee_data['department_head_id'] = department_head_id;
          setEmployee_data(employee_data)
          if(employee_data.employee_role.toUpperCase() === "HR" || employee_data.employee_role.toUpperCase() === "ADMIN"){
            setTabIndexChild(0);
            if(employee_data.id === department_head_id){
              setLoadTable(false)
              setLoadPage(false)
              return;
            }
            if(!index){
              setTabIndex(0)
            }else{
              setTabIndex(index)
              handleShowTab(0);
            }
            setLoadPage(false)
            setLoadTable(false)

          }else{
          
            if(employee_data.id === department_head_id){
                setTabIndex(2);
                handleShowTab(1);
                setLoadTable(false)
                setLoadPage(false)
                return;
            }
  
            setTabIndex(0);
            handleShowTab(1);
            setLoadPage(false)
          }

   
        } catch (err) {
           const {response} = err;
           if(response &&  response.status  === 422){
             console.log(response.data)
           }
        }
  
      })
      .catch((err) => {
          console.error(err);
      });
}





 const getAllLeave = async (type, isDepartmentHead = false, qry = null, srch = null) => {
 
  setLoadTable(true)
   setData([])
  Promise.all([
    getDataList('employee'),
    getDataList('user')
   ])
      .then(async (d) => {
       
       const EmpId = d[0].data.find(emp => emp.employee_email === d[1].email).id;
       const employee_department_id = d[0].data.find(emp => emp.employee_email === d[1].email).department_id

  
     
        try {
          const { data : {data} }= await axiosClient.get(`/leave${qry ? qry : ""}`, {
            params: {
              employee_id: !isDepartmentHead ?  EmpId : employee_data.department_head_id,
              type: type,
              search: srch,
            }
          })
         
      
          setDepartment_id(employee_department_id)
          setLoadTable(false);
          setData(data.data);
          setPagination(data.links)
        

      
        } catch (err) {
           const {response} = err;
           if(response &&  response.status  === 422){
             console.log(response.data)
           }
        }

      })
      .catch((err) => {
          console.error(err);
      });
 }

 const handleRemoveData = (id, path) => {

    axiosClient.delete(`/${path}/${id}`)
      .then(()=>{

          let message = "";

          switch (path) {
            case 'holiday':
              getHoliday();
              message = `${path.charAt(0).toUpperCase() + path.slice(1).toLowerCase()} item is deleted successfully!`;
              break;
          case 'leave_type':
              getLeaveType()
              message = `${path.charAt(0).toUpperCase() + path.slice(1).toLowerCase()} item is deleted successfully!`;
              break;
          case 'leave':
              getAllLeave('single')
              message = `${path.charAt(0).toUpperCase() + path.slice(1).toLowerCase()} item is deleted successfully!`;
              break;
            default:
              break;
          }

          swal({
            title: "Good job!",
            text: message,
            icon: "success",
            button: "Okay!",
          });
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
   
 }





 const showReusableData = (id, param = null, path) => {
   
  
   document.getElementById('my_modal_5').showModal()
   setModalLoad(true)


   axiosClient.get(`/${path}/${id}`, {
     params: {
       data: param 
     }
   })
   .then(({ data : {data} }) => {
    setModalLoad(false)
    let _data;

    switch (path) {
     case "holiday":
  
       _data = {
         name: data.holiday,
         start_date: data.holiday_start_date,
         end_date: data.holiday_end_date,
         year: data.holiday_year
       }
 
       break;
 
     case "leave_type":
  
       _data = {
         name: data.leave_type,
         number_of_days: data.leave_number_of_days,
         status: data.leave_status
       }
       break;
     case "leave":
       
       getLeaveType(true);
       _data = {
         employee_id: data.employee_id,
         head_id: data.employee_approval_id,
         emp_role: data.employee_approval_role,
         leave_type: data.leave_type_id,
         department_head: data.department_head,
         apply_date: data.leave_apply_date,
         start_date: data.leave_start_date,
         end_date: data.leave_end_date,
         leave_reason: data.leave_reason,
         leave_status:data.leave_status,
         leave_image:data.employee_image,
         department_id: data.department_id,
         leave_type_name:data.leave_type
       }
  
       break;
    
     default:
       break;
    }
 

    setPayload({
     ...payload,
     ..._data
   })
    setReuseDataId(data.id)
 
   })
   .catch((err)=>{
      const {response} = err;
      if(response &&  response.status  === 422){
        console.log(response.data.message)
      }
   })
 }
 


  
 const getDataList = async (path) => {
    try {
      const res = await axiosClient.get(`/${path}`, path === "employee" && {
        params: {
          all: true
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



  const handleSubmitPayload = () => {

    setButtonLoad(true);

    let request;
    let _payload;

    
    switch (tabs[tabIndex].text) {
      case 'HOLIDAYS':

        _payload = {
          holiday: payload.name,
          holiday_start_date: payload.start_date,
          holiday_end_date: payload.end_date,
          holiday_year: payload.year
        }
    
        request = _id ? axiosClient.put(`/holiday/${_id}?${new URLSearchParams(_payload).toString()}`) : axiosClient.post('/holiday', _payload);
        break;

        case 'LEAVE TYPE':

        _payload = {
          leave_type: payload.name,
          leave_number_of_days: parseInt(payload.number_of_days),
          leave_status: payload.status,

        }

        request = _id ? axiosClient.put(`/leave_type/${_id}?${new URLSearchParams(_payload).toString()}`) : axiosClient.post('/leave_type', _payload);
        
  
        break;
        case 'LEAVE APPLICATION':

 

        if(payload.days){
          delete payload.days;
        }


          
         _payload = {
          employee_id: payload.employee_id,
          department_id: _id ? payload.department_id : department_id,
          leave_type_id: parseInt(payload.leave_type),
          leave_start_date: payload.start_date,
          leave_end_date: payload.end_date,
          leave_apply_date: payload.apply_date,
          leave_reason : payload.leave_reason,
          leave_status: _id ? payload.leave_status :  "PENDING",
          employee_approval_id: payload.head_id === undefined ? department.employee_id: payload.head_id,
          employee_approval_role:  payload.emp_role === undefined ? department.employee_role : payload.emp_role
         }
        
          
        
         if(parseInt(tabsLinks[tabIndexChild].id) === 2 || parseInt(tabsLinks[tabIndexChild].id) === 0){
          delete _payload.employee_id
          _payload.leave_status_date_time = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
         }

         if(!payload.employee_id){
          alert("DON'T HAVE A DEPARTMENT HEAD , PLEASE CONTACT HR OR ADMIN FOR THAT POSITION.");
          return;
         }
   
         request = _id ? axiosClient.put(`/leave/${_id}?${new URLSearchParams(_payload).toString()}`) : axiosClient.post('/leave',_payload);
        break;
    
      default:
        
        break;
    }

    request.then(({data})=>{
        setButtonLoad(false)
        setPayload({})
        document.getElementById('my_modal_5').close()
        setData([]);
        setReuseDataId("")
 
        swal({
          title: "Good job!",
          text: data.message,
          icon: "success",
          button: "Okay!",
        });

        switch (tabs[tabIndex].text) {
          case 'HOLIDAYS':
            getHoliday()
            break;

         case 'LEAVE TYPE':
            getLeaveType()
            break;

        case 'LEAVE APPLICATION':

          if(parseInt(tabsLinks[tabIndexChild].id) === 0 ){
           getAllLeave("all")
           notifications(parseInt(data.data.id), `leave application is ${data.data.leave_status}`);
          }else if(parseInt(tabsLinks[tabIndexChild].id) === 2){
            getAllLeave('department_request', true)
            notifications(parseInt(data.data.id), `leave application is ${data.data.leave_status}`);
          }else{
            getAllLeave('single');
            notifications(parseInt(data.latest_leave_data.id), "filed a leave application is PENDING");
          }
      
            break;
          default:
            break;
        }
      
    })
    .catch((err)=>{
      const {response} = err;
      if(response &&  response.status  === 422){
        setButtonLoad(false)
        setError(response.data.errors)
        setTimeout(() => {
          setError(null)
        }, 3000);
      
      }
    })
      
       
      
  }


  const notifications = (id, message) => {
    axiosClient.post('/notification', {
      leave_id: id,
      notification_message: message
    });

  }
  

  const ComponentShowTabs = ({
    tabs,
    tabIndex,
    handleShowType,
    tabsLinks,
    tabIndexChild,
    handleShowTab,
    employee_data
  }) => {
    let dataTabs = [];
    let tabsLink = [];

    const employee_current_id = employee_data.id;
    const department_head_id = employee_data.department_head_id;

    let isHead = employee_current_id === department_head_id;
    
  


  
    switch (employee_data.employee_role) {
      case "HR":
      case "ADMIN":
        
         dataTabs = tabs.filter(t => t.accessUserRole.includes(employee_data.employee_role))
         tabsLink = !isHead ?  tabsLinks.filter(d => parseInt(d.id) !== 2) : tabsLinks.slice(0, tabsLinks.length - 1);
      break;
      case "EMPLOYEE":
         dataTabs = tabs.filter(t => t.accessUserRole.includes(employee_data.employee_role))
         tabsLink = !isHead ?  tabsLinks.filter(d => parseInt(d.id) == 1) :  tabsLinks.slice(1);
      break;
      default:
        break;
    }

 

  

 
  
    return dataTabs.map((tab) => {
      return (
        <div role="tab" tabIndex={0}  key={tab.id} className={`tab ${tab.id === tabIndex  && "bg-[#0984e3] text-white"} dropdown dropdown-bottom  whitespace-nowrap  font-bold`} 
        onClick={()=> {
          handleShowType(tab.id)
          if(tab.id !== 2){
            setSearch("")
          }
        }}
        >
          <span className=' max-md:text-[11px]'>{tab.id === 2 ? tabsLink.find(d =>  parseInt(d.id) === parseInt(tabIndexChild))?.text : tab?.text}</span>
          {tab.id === 2 &&  (
           
            <ul  className="dropdown-content text-black  z-[1] menu mt-3 ml-10 p-2 shadow bg-base-100 rounded-box w-60 max-md:mr-20">
              {tabsLink.map((tab,i)=>{
                return (
                  <li  key={i} className={`${tabIndexChild === tab.id ? "bg-[#0984e3] rounded-box text-white " : "text-black"} `} onClick={()=> {
                     setSearch("")
                    handleShowTab(tab.id)
                  }} ><a>{tab?.text}</a></li>
                )
              })}
              
            </ul>
      
          )}
   
        </div>
      )
    })

  }


 

  if(loadPage){
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

 
  return (
    <>
    <div className="ml-auto mb-6 lg:w-[75%] xl:w-[80%] 2xl:w-[85%]">
    <div className="bg-white shadow rounded-lg p-4 sm:p-6 xl:p-8 m-5">
                <div className=' max-md:flex max-md:flex-col-reverse'>
          
                 <div className="relative flex gap-2 items-center  focus-within:text-[#0984e3] lg:mb-7 max-md:mt-2">
                                 <span className="absolute left-4 h-6 flex items-center pr-3 border-r border-gray-300">
                                 <svg xmlns="http://ww50w3.org/2000/svg" className="w-4 fill-current" viewBox="0 0 35.997 36.004">
                                    <path id="Icon_awesome-search" data-name="search" d="M35.508,31.127l-7.01-7.01a1.686,1.686,0,0,0-1.2-.492H26.156a14.618,14.618,0,1,0-2.531,2.531V27.3a1.686,1.686,0,0,0,.492,1.2l7.01,7.01a1.681,1.681,0,0,0,2.384,0l1.99-1.99a1.7,1.7,0,0,0,.007-2.391Zm-20.883-7.5a9,9,0,1,1,9-9A8.995,8.995,0,0,1,14.625,23.625Z"></path>
                                 </svg>
                                 </span>
                                 <input type="search"  name="leadingIcon" value={search} onChange={handleSearchPosition} id="leadingIcon" placeholder={`Search ${tabIndex === 2 ? tabsLinks[tabIndexChild].text === "YOUR LEAVE APPLICATION" ? "leave type or leave status": "employee name, leave type or leave status" : tabs[tabIndex].text.toLowerCase()} here`} className="w-full pl-14 pr-4 py-2.5 rounded-xl text-sm text-gray-600 outline-none border border-gray-300 focus:border-[#0984e3] transition"/>
                                
                </div>

               <div className="mb-4 flex items-center justify-between max-md:flex-col-reverse max-md:gap-6">
                <div role="tablist" className="tabs tabs-boxed">
                    <ComponentShowTabs 
                    emp_role={ruleCanAccess} 
                    tabs={tabs} 
                    setShowTabs={setShowTabs} 
                    tabIndex={tabIndex}
                    handleShowType={handleShowType}
                    showTabs={showTabs}
                    tabsLinks={tabsLinks}
                    tabIndexChild={tabIndexChild} 
                    handleShowTab={handleShowTab}
                    employee_data={employee_data}
                    />
                </div>
          
                  {showButton && (
                  <div className="flex-shrink-0 flex justify-center items-center gap-3" onClick={()=>  {
                    document.getElementById('my_modal_5').showModal()
                    if(parseInt(tabIndex) === 2) {
                      setModalLoad(true)
                      if(!department_id) {
                        return alert("You don't have a department please update your account and add a department.");
                      }

                    
                      let fetCher;
                    
                      if(employee_data.department_head_id === employee_data.id){
                        fetCher = axiosClient.get(`/department/${department_id}`, {
                          params: {
                            type: "get_hr_and_admin"
                          }
                        }) 
                      }else{
                        fetCher =  axiosClient.get(`/department/${department_id}`)
                      }
                   
      
                     
                      Promise.all([
                        fetCher,
                        getDataList('employee'),
                        getDataList('user')
                       ])
                        .then((data) => {
                             setModalLoad(false)
                             const EmpId = data[1].data.find(emp => emp.employee_email === data[2].email).id;
                             setDepartment(data[0].data.data)
                             setPayload({...payload, department_head: data[0].data.data.department_status,  
                              employee_id: EmpId,
                              hris_hr_or_admin: Array.isArray(data[0].data.data) ? data[0].data.data.filter(d => d.head_id !== employee_data.department_head_id) : []
                            });
                       
                             getLeaveType(true) 
                         
                          })
                          .catch((err) => {
                              console.error(err);
                          });
                       
                      
                    }

      
                  }}>
                  <div className='shadow-md p-1 bg-[#0984e3] rounded-md text-white cursor-pointer transition-all ease-in opacity-75 hover:opacity-100'>
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                      </svg>
                  </div>
                        <span className='font-bold opacity-70'>ADD {tabIndex === 2 ? tabsLinks[tabIndexChild]?.text : tabs[tabIndex]?.text}</span> 
                  </div>
                  )}
                </div>
               </div>
               {loadTable && (
                    <div className="mb-6 mt-5 lg:w-[75%] xl:w-[80%] 2xl:w-[85%]">
                          <div className='ml-5 flex items-center gap-2'>
                              <span className="loading loading-ring loading-lg text-primary"></span><span className=' opacity-70 text-sm font-semibold'>Loading table....</span>
                          </div>
                    </div>  
                )}
               <div className="flex flex-col mt-8">
                  <div className="overflow-x-auto rounded-lg">
                     <div className="align-middle inline-block min-w-full">
                        <div className="shadow overflow-hidden sm:rounded-lg">
                           <table className="min-w-full divide-y divide-gray-200 table">

                              <thead className="bg-gray-50">
                            
                               {!loadTable && (<ComponentShowHeader ind={tabIndex} chilIn = {tabIndexChild}/>)} 
                              </thead>
                              <tbody className="bg-white">
                              
                               {!loadTable && (
                                  <ComponentDataList ind={tabIndex} 
                                  chilIn = {tabIndexChild} 
                                  data={data} 
                                  id={path_id}
                                  tabs={tabs}
                                  moment={moment}
                                  showReusableData={showReusableData} 
                                  department_id={department_id}
                                  handleRemoveData={handleRemoveData}
                                  />
                               )} 
                              </tbody>
                           </table>
                        </div>
                     </div>
              </div>
              <div className="join w-full justify-end mt-6">
                  {pagination.length > 0  && pagination.map((p, i) => {
                        return (
                           <button key={i} disabled={p.url ? false:true}   className={`join-item btn ${p.active ? "btn-active bg-[#0984e3] text-white  hover:bg-[#0984e3]" : ""} `}   dangerouslySetInnerHTML={{ __html: p.label }} onClick={()=> handleUrlPaginate(p.url, tabIndex === 2 ? tabsLinks[tabIndexChild].text : tabs[tabIndex].text)}></button>
                        )
                  })}

                  </div>
           </div>
      </div>
</div> 
    <Modal 
    title={tabs[tabIndex].text}
    childtitle={tabsLinks[tabIndexChild].text}
    payload={payload}
    data_id = {_id}
    setReuseDataId={setReuseDataId}
    department={department}
    setPayload={setPayload}
    handleSubmitPayload={handleSubmitPayload}
    data={leaveData}
    load={load}
    error={error}
    setError={setError}
    buttonLoad={buttonLoad}
    />
    </>
  )
}

export default Leave