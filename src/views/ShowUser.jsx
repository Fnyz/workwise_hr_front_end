import React, { useEffect, useRef, useState } from 'react'
import DatePicker from "react-datepicker";
import { useParams, useNavigate    } from 'react-router-dom'
import axiosClient from '../axiosClient';
import moment from 'moment';
import { Portal } from "react-overlays";


const CalendarContainer = ({ children }) => {
  const el = document.getElementById("calendar-portal");
  return <Portal container={el}>{children}</Portal>;
};


function ShowUser() {

  const navigate = useNavigate();
  const [_roll_id, setRoll_id] = useState("");
  const [payload, setPayload] = useState({});
  const {id} =  useParams();
  const [total_leaves_have, setTotalLeaves_have] = useState(null);
  const [startDate, setStartDate] = useState(new Date());
  const [loader, setloader] = useState(false);
  const [allrole, setRole] = useState([])
  const [error, setError] = useState(null);
  const [empData, setEmpData] = useState({
    employee_id: id,
    employee_position: [],
    position_id:'',
    employee_start_date: "",
    employee_email: "",
    employee_end_date: "",
    employee_pag_ibig: "",
    employee_sss: "",
    employee_philhealth: "",
    employee_name: "",
    employee_address: "",
    employee_provincial_address: "",
    employee_birthdate: new Date(),
    employee_date_birth: new Date(),
    employee_birth_place: "",
    employee_civil_status: "Single",
    employee_spouse: "Yes",
    employee_name_of_spouse: "",
    employee_company: "",
    employee_father: "",
    employee_mother: "",
    employee_tin:"",
    employee_dependent: [
      {
        name: "",
        relationship:"",
        age: "",
        date_of_birth: new Date(),
      }
    ],
    employee_educational_background: [
      {
        school: "",
        degree: "",
        years_attended: "",
        type:"Elementary",
      },
      {
        school: "",
        degree: "",
        years_attended: "",
        type:"High School",
      },
      {
        school: "",
        degree: "",
        years_attended: "",
        type:"College",
      },
      {
        school: "",
        degree: "",
        years_attended: "",
        type:"Vocational",
      },
    ],
    employee_history: [
      {
        company:"",
        position:"",
        salary:"",
        length_of_service:"",
        reason_for_leaving:""
      }
    ],
    employee_reference: [
      {
        name: "",
        occupation:"",
        address: "",
        contact: "",
      }
    ],
    employee_case_emergency: {
      name: "",
      relationship: "",
      address: "",
      contact: "",
    },
  });


  const getListOfPayroll = () => {
    axiosClient.get("/rates")
    .then((data)=>{
      
      const res = data.data.find(d => d.emp_id === id);
      if(!res){
        setRoll_id("");
        return null;
      }

         
        setRoll_id(res.compe_id);
     
        const {
          rates_night_diff,
          rates_basic_salary,
          rates_thirteenth_pay,
          rates_review_adjustments,
          rates_account_num,
          rates_acount_name,
          rates_allowance
        } = res;

        const val = {
          'basic_night_diff': rates_night_diff,
          'basic_salary': rates_basic_salary,
          'basic_allowance': rates_allowance,
          'thirteenth_pay': rates_thirteenth_pay,
          'review_adjustments': rates_review_adjustments,
          'account_number': rates_account_num,
          'bank_name': rates_acount_name,
      };

      

      const total_montly = val.basic_salary + val.basic_night_diff + val.basic_allowance;
      const bi_montly = val.basic_salary / 2 
      const night_diff = val.basic_night_diff / 2
      const allowance = val.basic_allowance / 2 
      const daily = val.basic_salary / 21.75
      const hourly = daily / 8
      const hourly_rate = (2.1 / 100) * hourly

        setPayload({
          ...payload,
          ...val,
          total_montly,
          bi_montly,
          night_diff,
          allowance,
          daily,
          hourly,
          hourly_rate,

        })


    })
  }



  const handleSubmitPayroll = (e) => {
    e.preventDefault();

    const data = {
      'employee_id': id,
      'rates_review_adjustments':payload.review_adjustments,
      'rates_night_diff': parseFloat(payload.basic_night_diff),
      'rates_basic_salary': parseFloat(payload.basic_salary),
      'rates_allowance': parseFloat(payload.basic_allowance),
      'rates_thirteenth_pay': parseFloat(payload.thirteenth_pay),
      'rates_account_num': payload.account_number,
      'rates_acount_name':payload.bank_name,
  };
 

  
  if(_roll_id){
    axiosClient.put(`/rates/${_roll_id}?${new URLSearchParams(data).toString()}`)
    .then((res)=>{
      getListOfPayroll();
      setPayload({});
      document.getElementById('employee_payroll').close();
      swal({
        title: "Good job!",
        text: res.data.message,
        icon: "success",
        button: "Okay!",
      });
    })
    .catch((err)=>{
      const {response} = err;
      if(response &&  response.status  === 422){
       setError(response.data.errors)
       setTimeout(() => {
         setError(null)
       }, 2000);
      }
    })
    return;
  }


    axiosClient.post('/rates', data )
    .then((res)=>{
    
      getListOfPayroll();
      setPayload({});
      document.getElementById('employee_payroll').close();
      swal({
        title: "Good job!",
        text: res.data.message,
        icon: "success",
        button: "Okay!",
      });
      
    })
    .catch((err)=>{
      const {response} = err;
      if(response &&  response.status  === 422){
       setError(response.data.errors)
       setTimeout(() => {
         setError(null)
       }, 2000);
      }
    })   
  }

  const calculateData = () => {

    const basic_salary = parseFloat(payload?.basic_salary) || 0;
    const basic_night_diff = parseFloat(payload?.basic_night_diff) || 0;
    const basic_allowance = parseInt(payload?.basic_allowance) || 0;
    let bi_montly = parseInt(payload?.bi_montly) || 0;
    let night_diff = parseInt(payload?.night_diff) || 0;
    let allowance = parseInt(payload?.allowance) || 0;
    let daily = parseInt(payload?.daily) || 0;
    let hourly = parseInt(payload?.hourly) || 0;
    let hourly_rate = parseInt(payload?.hourly_rate) || 0;
  

    
    const total_montly = basic_salary + basic_night_diff + basic_allowance;
    bi_montly = basic_salary / 2 
    night_diff = basic_night_diff / 2
    allowance = basic_allowance / 2 
    daily = basic_salary / 21.75
    hourly = daily / 8
    hourly_rate = (2.1 / 100) * hourly
 
    setPayload({
      ...payload,
      total_montly,
      bi_montly,
      night_diff,
      allowance,
      daily,
      hourly,
      hourly_rate
    })

  }
  


  const calculateSlip = () => {

    const bi_montly = parseFloat(payload?.bi_montly) || 0;
    const per_hour_day = parseFloat(payload?.per_hour_day) || 0;
    const tardines_minutes = parseInt(payload?.tardines_minutes) || 0;
    const tardines_days = parseInt(payload?.tardines_days) || 0;
  
    const night_diff = parseFloat(payload?.night_diff) || 0;
    const holiday_OT = parseFloat(payload?.holiday_OT) || 0;
    const incentive = parseFloat(payload?.incentive) || 0;
  
    const sss = parseFloat(payload?.sss) || 0;
    const phic = parseFloat(payload?.phic) || 0;
    const hdmf = parseFloat(payload?.hdmf) || 0;
  
    const withholding = parseFloat(payload?.withholding) || 0;
    const sss_loan = parseFloat(payload?.sss_loan) || 0;
    const ar_others = parseFloat(payload?.ar_others) || 0;
    const retro_others = parseFloat(payload?.retro_others) || 0;
    const allowance = parseFloat(payload?.allowance) || 0;
  
  
    
  
    const total_minutes = per_hour_day / 8 * tardines_minutes;
    const total_days = per_hour_day * tardines_days;
  
  
    const totalAmount = (bi_montly + night_diff + holiday_OT + incentive) - (total_minutes + total_days + sss + phic + hdmf);
  
    const totalNetPay = (parseFloat(totalAmount) + parseFloat(retro_others) + parseFloat(allowance)) - (parseFloat(withholding) + parseFloat(sss_loan) + parseFloat(ar_others))
  
  
    
    setPayload({
      ...payload,
      amount: bi_montly,
      tardines_total_minutes: parseFloat(total_minutes),
      tardines_total_days: parseFloat(total_days),
      taxable_income: parseFloat(totalAmount),
      total_net_pay: parseFloat(totalNetPay)
    })
  }

  const handleDelete = () => {
    
    swal({
      title: "Are you sure?",
      text: "Once deleted, you will not be able to recover this employee?",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    })
    .then((willDelete) => {
      if (willDelete) {
        if(total_leaves_have > 0) {
          swal({
            text: `${empData.employee_name}, leave application in the database so you're not allowed to delete this data.`,
            icon: "error",
            dangerMode: true,
          })
          return;
        }
        
        axiosClient.delete(`/employee/${id}`)
        .then(() => {
          swal({
            title: "Good job!",
            text: `${empData.employee_name} data is deleted successfully.`,
            icon: "success",
            button: "Okay!",
          });
         navigate('/employees');
        })
       .catch((err) => {
         console.error(err);
       })
     
        
      } else {
        swal({
         title: "Oooops!",
         text: `${empData.employee_name} data is not deleted in database.`,
         icon: "error",
         dangerMode: true,
       })
      }
    });


    
  }


  const addMoreData = (choose) => {
    var data;
    switch (choose) {
      case "Dependents":
        data = {
          ...empData,
           employee_dependent: [
              ...empData.employee_dependent,
             {
               name: "",
               relationship:"",
               age: "",
               date_of_birth: new Date(),
             }
           ]
         }
        break;

        case "Educational_history":
        data = {
          ...empData,
           employee_history: [
              ...empData.employee_history,
             {
              company:"",
              position:"",
              salary:"",
              length_of_service:"",
              reason_for_leaving:""
             }
           ]
         }
        break;

        case "Reference":
        data = {
          ...empData,
           employee_reference: [
              ...empData.employee_reference,
             {
              name: "",
              occupation:"",
              address: "",
              contact: "",
             }
           ]
         }
        break;
    
      default:
        break;
    }
    setEmpData(data)
  }

 
  const removeData = (choose, id = null) => {
    var removeData;

    switch (choose) {
      case "Dependents":
        if(empData.employee_dependent.length === 1){
          return;
        }
        removeData = {
          ...empData,
           employee_dependent: [
            ...empData.employee_dependent.filter((d, i) => i !== id),
           ]
         }
        break;

        case "Educational_history":

          if(empData.employee_history.length === 1){
            return;
          }

          removeData = {
            ...empData,
             employee_history: [
              ...empData.employee_history.filter((d, i) => i !== id)
             ]
           }
          break;

          case "Reference":

          if(empData.employee_reference.length === 1){
            return;
          }

          removeData = {
            ...empData,
             employee_reference: [
              ...empData.employee_reference.filter((d, i) => i !== id)
             ]
           }
          break;
    
      default:
        break;
    }
   
    setEmpData(removeData)
  }
 

  useEffect(()=>{
  getListOfPayroll()
   setloader(true);
    Promise.all([getDataList('position'), getDataList('department'), getDataList('employee')])
      .then((dt) => {
      
        axiosClient.get(`/employee/${id}`)
        .then(({data : {data}})=>{
          setloader(false);


          let allRoles = ['EMPLOYEE', 'HR', 'ADMIN'];
          
          setRole(allRoles);
    
          setEmpData({...empData,
            employee_provincial_address: data.employee_provincial_address ,
            employee_birthdate: data.employee_birthdate,
            employee_date_birth: data.employee_date_birth,
            employee_birth_place: data.employee_birth_place,
            employee_civil_status: data.employee_civil_status,
            employee_spouse: data.employee_spouse  ,
            employee_name_of_spouse:  data.employee_name_of_spouse,
            employee_company: data.employee_company ,
            employee_father: data.employee_father ,
            employee_mother: data.employee_mother ,
            employee_pag_ibig: data.employee_pag_ibig,
            employee_sss: data.employee_sss,
            employee_philhealth: data.employee_philhealth,
            employee_tin: data.employee_tin,
            employee_address:data.employee_address,
            employee_position:dt[0].data,
            employee_department:dt[1].data.data,
            employee_name: data?.employee_name,
            employee_start_date: data?.employee_start_date,
            employee_gender:data?.employee_gender,
            employee_age:data?.employee_age,
            employee_height:data?.employee_height,
            employee_weight:data?.employee_weight,
            employee_email: !data.employee_email  ? "" : data.employee_email,
            employee_id:data?.employee_id,
            employee_role: data?.employee_role,
            employee_dependent: !data.employee_dependents.length ? empData.employee_dependent : data.employee_dependents,
            employee_educational_background: !data.employee_educational_background.length ? empData.employee_educational_background : data?.employee_educational_background,
            employee_history: !data.employee_employment_history.length ? empData.employee_history : data?.employee_employment_history ,
            employee_reference: !data.employee_character_reference.length ? empData.employee_reference : data?.employee_character_reference,
            employee_image: data?.employee_image, 
            position_id:data?.position_id,  
            department_id:data?.department_id,
            employee_case_emergency: data?.employee_person_to_notify,
            employee_reason_for_leaving:data.employee_reason_for_leaving || "",
            employee_status:data.employee_status
          })

          setTotalLeaves_have(data.total_leaves_have)
          setStartDate(data.employee_start_date);
        })
        .catch((e)=>{
          console.log(e);
        })
      
      })
      .catch((err) => {
          console.error(err);
      });
 },[])


  const getDataList = async (path) => {

 

    try {
      const res = await axiosClient.get(`/${path}`, {
        params:{
          data:"ALL",
          all:true,
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


  const handleSubmitData = () => {
    
    if(empData.employee_image_url){
      empData.employee_image = empData.employee_image_url;
      delete empData.employee_image_url;
    }

    if(empData.employee_position){
      delete empData.employee_position
    }
    if(empData.employee_department){
      delete empData.employee_department
    }

  
    const params = {
      ...empData,
      employee_image: empData.employee_image || "",
      employee_birthdate: empData.employee_birthdate ? empData.employee_birthdate : "",
      employee_date_birth: empData.employee_date_birth ? empData.employee_date_birth :"",
      employee_age:parseInt(empData.employee_age) || "",
      employee_height:parseFloat(empData?.employee_height) || "",
      employee_weight:parseFloat(empData?.employee_weight) || "",
      employee_educational_background: JSON.stringify(empData.employee_educational_background),
      employee_dependents: JSON.stringify(empData.employee_dependent.filter(de => de.name || de.relationship || de.age)),
      employee_employment_history: JSON.stringify(empData.employee_history.filter(de => de.company || de.position || de.salary || de.length_of_service || de.reason_for_leaving)),
      employee_character_reference: JSON.stringify(empData.employee_reference.filter(de => de.name || de.occupation || de.address || de.contact)),
      employee_person_to_notify: JSON.stringify(empData.employee_case_emergency),
      action: 'Employee_update_data'
    };


    const config = {
      headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
      }
      };

 
      const queryString = new URLSearchParams(params).toString();
      axiosClient.put(`/employee/${id}`, queryString, config)
      .then(()=>{

        swal({
          title: "Good job!",
          text: `${empData.employee_name} (${empData.employee_role}) data is updated successfully.`,
          icon: "success",
          button: "Okay!",
        });

        navigate("/employees");
      })
      .catch((err)=>{
          const {response} = err;
          if(response &&  response.status  === 422){
          console.log(response.data)
          }
      })
      return;
  }


  return (
    <>
    <div  className="ml-auto mb-6 lg:w-[75%] xl:w-[80%] 2xl:w-[85%] ">
      
      {loader && (
        <div className='ml-5'>
          <span className="loading loading-ring loading-lg text-primary"></span>
        </div>
      )}
      {!loader && (
  <div className="bg-white shadow rounded-lg p-4 sm:p-6 xl:p-8 m-5">
  <h2 className="card-title font-bold ">EMPLOYEE INFORMTION SHEET</h2>
  <div className='flex items-center gap-5 mt-9 max-md:flex-col'>
  <div className="avatar ">
      <div className="w-24 rounded-sm shadow">
        <img src={empData.employee_image ? typeof empData.employee_image === "object" ? URL.createObjectURL(empData.employee_image) : empData.employee_image  : "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg"} />
      </div>
  </div>
  <div className="flex-shrink-0 flex gap-3 flex-col" >
      <input type="file" className=" file-input file-input-sm w-full max-w-xs file-input-primary opacity-70  file:text-white text-gray-400"  onChange={(e)=>{
              const file = e.target.files[0]; 
               const reader = new FileReader();
               reader.onload = () => {
                  setEmpData({...empData, employee_image:e.target.files[0], employee_image_url: reader.result})
               };
               reader.readAsDataURL(file);
         }} />
        <button type='button' className="btn btn-success text-white btn-sm text-[12px]" onClick={()=>{
          document.getElementById('employee_payroll').showModal();
          
          getListOfPayroll();
        }}>
          {_roll_id ? (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-4">
            <path d="M21.731 2.269a2.625 2.625 0 0 0-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 0 0 0-3.712ZM19.513 8.199l-3.712-3.712-8.4 8.4a5.25 5.25 0 0 0-1.32 2.214l-.8 2.685a.75.75 0 0 0 .933.933l2.685-.8a5.25 5.25 0 0 0 2.214-1.32l8.4-8.4Z" />
            <path d="M5.25 5.25a3 3 0 0 0-3 3v10.5a3 3 0 0 0 3 3h10.5a3 3 0 0 0 3-3V13.5a.75.75 0 0 0-1.5 0v5.25a1.5 1.5 0 0 1-1.5 1.5H5.25a1.5 1.5 0 0 1-1.5-1.5V8.25a1.5 1.5 0 0 1 1.5-1.5h5.25a.75.75 0 0 0 0-1.5H5.25Z" />
          </svg>
          
          ): (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-4">
          <path fillRule="evenodd" d="M12 3.75a.75.75 0 0 1 .75.75v6.75h6.75a.75.75 0 0 1 0 1.5h-6.75v6.75a.75.75 0 0 1-1.5 0v-6.75H4.5a.75.75 0 0 1 0-1.5h6.75V4.5a.75.75 0 0 1 .75-.75Z" clipRule="evenodd" />
        </svg>
        
          )}
          {_roll_id ? "VIEW EMPLOYEE RATE DETAILS": "ADD EMPLOYEE RATE"}
        </button>
         
    </div>
  
  </div>
  {_roll_id && (
  <div className='mt-5'>
    <div className='flex items-center gap-2'>
    <h2 className="card-title text-sm">Account Name:</h2>
    <p className=' text-blue-500 font-semibold'>{payload.bank_name && payload.bank_name}</p>
    </div>
    <div className='flex items-center gap-2'>
    <h2 className="card-title text-sm">Account Number:</h2>
    <p className=' text-red-500 font-semibold'>{payload.account_number && payload.account_number
}</p>
    </div>
  </div>
  )}
  <div className="divider"></div> 
  <div className='flex gap-5 mt-2 max-md:flex-col'>
    <label className={`form-control w-full ${_roll_id ? "": "mt-5"}`}>
        <div className="label">
          <span className="label-text font-semibold">Position:</span>
        </div>
        <label className="form-control w-full">
         <select value={empData.position_id} className="select select-bordered" onChange={(e)=> setEmpData({...empData, position_id: e.target.value})}>
            <option disabled defaultValue>CHOOSE HERE...</option>
            {empData.employee_position?.length ? empData.employee_position.map((pos)=>{
               return <option key={pos.position_id} value={pos.position_id}>{pos.position}</option>
            }):  <option disabled defaultValue>POSITION LIST IS EMPTY</option>}
         </select>
      </label>  
    </label>
    <label className="form-control w-full ">
        <div className="label">
          <span className="label-text font-semibold">Date Hired:</span>
        </div>
        <DatePicker  className="input input-bordered mt-2 flex items-center gap-2 w-full"  selected={startDate}  onChange={(date) => setStartDate(date)} />
    </label>
  </div>

  <div className='flex gap-5 max-md:flex-col'>
    <label className="form-control w-full  mt-2 ">
        <div className="label">
          <span className="label-text font-semibold">Email address:</span>
        </div>
        <input type="email" autoComplete='none' disabled={!empData.employee_email } value={empData.employee_email || ""} placeholder="Type here..." className="input input-bordered w-full" onChange={(e)=> setEmpData({...empData, employee_email: e.target.value})} />   
    </label>
    <label className="form-control w-full  mt-2">
      <div className="label">
        <span className="label-text font-semibold">SSS no:</span>
      </div>
      <input type="number" value={empData.employee_sss} placeholder="Type here..." className="input input-bordered w-full" onChange={(e)=> setEmpData({...empData, employee_sss: e.target.value})} />   
    </label>

  </div>

   <div className='flex gap-5 max-md:flex-col'>
  <label className="form-control w-full mt-2">
      <div className="label">
        <span className="label-text font-semibold">PhilHealth no:</span>
      </div>
      <input type="number" value={empData.employee_philhealth} placeholder="Type here..." className="input input-bordered w-full " onChange={(e)=> setEmpData({...empData, employee_philhealth: e.target.value})}/>   
  </label>

  <label className="form-control w-full mt-2">
      <div className="label">
        <span className="label-text font-semibold">TIN no:</span>
      </div>
      <input type="number" value={empData.employee_tin} placeholder="Type here..." className="input input-bordered w-full " onChange={(e)=> setEmpData({...empData, employee_tin: e.target.value})} />   
  </label>
  <label className="form-control w-full mt-2">
      <div className="label">
        <span className="label-text font-semibold">Pag-ibig no:</span>
      </div>
      <input type="number" value={empData.employee_pag_ibig } placeholder="Type here..." className="input input-bordered w-full " onChange={(e)=> setEmpData({...empData, employee_pag_ibig: e.target.value})} />   
  </label>
  </div> 


  <h2 className="card-title mt-7">I. PERSONAL INFORMATION</h2>

  <div>
  <label className="form-control w-full mt-2">
      <div className="label">
        <span className="label-text font-semibold">Employee ID:</span>
      </div>
      <input type="text" value={empData.employee_id || ""} placeholder="Type here..." className="input input-bordered w-full " onChange={(e)=> setEmpData({...empData, employee_id: e.target.value})} />   
  </label>
  <label className="form-control w-full mt-2">
      <div className="label">
        <span className="label-text font-semibold">Name:</span>
      </div>
      <input type="text" value={empData.employee_name || ""} placeholder="Type here..." className="input input-bordered w-full " onChange={(e)=> setEmpData({...empData, employee_name: e.target.value})} />   
  </label>
  <label className="form-control w-full  mt-2">
      <div className="label">
        <span className="label-text font-semibold">Employee role</span>
      </div>
      <select value={empData.employee_role || ""} className="select select-bordered" onChange={(e)=> setEmpData({...empData, employee_role:e.target.value})}>
                  <option  defaultValue>Select here</option>
                  {allrole && allrole.map(r => {
                    return (
                      <option key={r} value={r}>{r}</option>
                    )
                  })}
      </select>   
  </label>
  <label className="form-control w-full  mt-2">
      <div className="label">
        <span className="label-text font-semibold">Department</span>
      </div>
      <select value={empData.department_id} className="select select-bordered" onChange={(e)=> setEmpData({...empData, department_id: e.target.value})}>
            <option disabled defaultValue>CHOOSE HERE</option>
            {empData.employee_department?.length ? empData.employee_department.map((de)=>{
               return <option key={de.id} value={de.id}>{de.department} ({de.total_employees})</option>
            }):  <option disabled defaultValue>DEPARTMENT LIST IS EMPTY</option> }
         </select>  
  </label>
  <label className="form-control w-full mt-2">
      <div className="label">
        <span className="label-text font-semibold">Current Address:</span>
      </div>
      <input value={empData.employee_address} type="text" placeholder="Type here..." className="input input-bordered w-full " onChange={(e)=> setEmpData({...empData, employee_address: e.target.value})} />   
  </label>

  <label className="form-control w-full mt-2">
      <div className="label">
        <span className="label-text font-semibold">Provincial Address:</span>
      </div>
      <input type="text" value={empData.employee_provincial_address}  placeholder="Type here..." className="input input-bordered w-full " onChange={(e)=> setEmpData({...empData, employee_provincial_address: e.target.value})}/>   
  </label>
 
 
  </div>

  <div className='flex gap-5'>
    <label className="form-control w-full mt-2">
        <div className="label">
          <span className="label-text font-semibold">Birth Date:</span>
        </div>
        <DatePicker  className="input input-bordered flex items-center gap-2 w-full" placeholderText='Select Date here...'  selected={empData?.employee_birthdate}  onChange={(date)=> setEmpData({...empData, employee_birthdate:date}) } />
    </label>
    <label className="form-control w-full  mt-2">
      <div className="label">
        <span className="label-text font-semibold">Birth Place:</span>
      </div>
      <input type="text" value={empData.employee_birth_place}  placeholder="Type here..." className="input input-bordered w-full" onChange={(e) => setEmpData({...empData, employee_birth_place:e.target.value})} />   
  </label>
  </div>

  <div className='flex gap-5 max-md:flex-col'>
    <label className="form-control w-full mt-2">
        <div className="label">
          <span className="label-text font-semibold">Age</span>
        </div>
        <input type="text" value={empData.employee_age || ""}  placeholder="Type here..." className="input input-bordered w-full" onChange={(e) => setEmpData({...empData, employee_age:e.target.value})} /> 
    </label>
    <label className="form-control w-full  mt-2">
      <div className="label">
        <span className="label-text font-semibold">Sex</span>
      </div>
      <select value={empData.employee_gender || ""} className="select select-bordered" onChange={(e)=> setEmpData({...empData, employee_gender:e.target.value})}>
                  <option  defaultValue>Select here</option>
                  <option value="M">MALE</option>
                  <option value="F">FEMALE</option>
      </select>   
  </label>
  <label className="form-control w-full  mt-2">
      <div className="label">
        <span className="label-text font-semibold">Weight</span>
      </div>
      <input type="number" value={empData.employee_weight || ""}  placeholder="Type here..." className="input input-bordered w-full" onChange={(e) => setEmpData({...empData, employee_weight:e.target.value})} />   
  </label>
  <label className="form-control w-full  mt-2">
      <div className="label">
        <span className="label-text font-semibold">Height</span>
      </div>
      <input type="number" value={empData.employee_height || ""}  placeholder="Type here..." className="input input-bordered w-full" onChange={(e) => setEmpData({...empData, employee_height:e.target.value})} />   
  </label>
  </div>

  <div className='flex gap-5 mt-2 max-md:flex-col'>
      <label className="form-control w-full">
        <div className="label">
          <span className="label-text font-semibold">Civil Status:</span>
        </div>

        <div className='flex gap-2 items-center '>
          <input type="radio" name="radio-1" className="radio"
          checked={empData.employee_civil_status === "Single"}
          value="Single"
          onChange={() =>  setEmpData({...empData, employee_civil_status: "Single"})}
          />
          <span className="label-text max-md:text-[12px]">Single</span>
          <input type="radio" name="radio-1" className="radio"
          value="Married"
          checked={empData.employee_civil_status === "Married"}
          onChange={() =>  setEmpData({...empData, employee_civil_status: "Married"})}
          />
          <span className="label-text max-md:text-[12px]">Married</span>
          
        <input type="radio" name="radio-1" className="radio" 
          value="Separated"
          checked={empData.employee_civil_status === "Separated"}
          onChange={() =>  setEmpData({...empData, employee_civil_status: "Separated"})}
        />
        <span className="label-text max-md:text-[12px]">Separated</span>
        <input type="radio" name="radio-1" className="radio"
          value="Widow(er)"
         checked={empData.employee_civil_status === "Widow(er)"}
         onChange={() =>  setEmpData({...empData, employee_civil_status: "Widow(er)"})}
        />
        <span className="label-text max-md:text-[12px]">Widow(er)</span>
        </div>
    </label>
    <label className="form-control w-full mt-2">
          <div className="label">
            <span className="label-text font-semibold">Spouse Employed:</span>
          </div>
          <div className='flex gap-2 items-center'>
            <span className="label-text">Yes</span>
            <input type="radio" name="radio-2" className="radio" 
              checked={empData.employee_spouse === "Yes"}
              value="Yes"
              onChange={() =>  setEmpData({...empData, employee_spouse: "Yes"})}
            />
            <span className="label-text">No</span>
            <input type="radio" name="radio-2" className="radio"
            checked={empData.employee_spouse === "No"}
            value="No"
            onChange={() =>  setEmpData({...empData, employee_spouse: "No"})}
            />
          </div>
      </label>
  </div>

  <div className='flex gap-5'>
    <label className="form-control w-full mt-2">
        <div className="label">
          <span className="label-text font-semibold">Name of Spouse:</span>
        </div>
        <input type="text" value={empData.employee_name_of_spouse} placeholder="Type here..." autoComplete='false' className="input input-bordered w-full" onChange={(e) => setEmpData({...empData, employee_name_of_spouse: e.target.value}) } />   
    </label>
    <label className="form-control w-full  mt-2">
      <div className="label">
        <span className="label-text font-semibold">Date of Birth:</span>
      </div>
      <DatePicker  className="input input-bordered flex items-center gap-2 w-full"  placeholderText='Select Date here...' selected={empData.employee_date_birth}  onChange={(date)=> setEmpData({...empData, employee_date_birth:date}) }  />
  
  </label>
  </div>

  <div className='flex gap-5'>
  
    <label className="form-control w-full  mt-2">
      <div className="label">
        <span className="label-text font-semibold">Name of Company:</span>
      </div>
      <input type="text" value={empData.employee_company} placeholder="Type here..." className="input input-bordered w-full" onChange={(e)=> setEmpData({...empData, employee_company: e.target.value}) } />   
  </label>
  </div>

  <div className='flex gap-5'>
    <label className="form-control w-full mt-2">
        <div className="label">
          <span className="label-text font-semibold">Father's Name:</span>
        </div>
        <input value={empData.employee_father} type="text" placeholder="Type here..." className="input input-bordered w-full" onChange={(e)=> setEmpData({...empData, employee_father: e.target.value})} />   
    </label>
    <label className="form-control w-full  mt-2">
      <div className="label">
        <span className="label-text font-semibold">Mother's Name:</span>
      </div>
      <input type="text" value={empData.employee_mother} placeholder="Type here..." className="input input-bordered w-full" onChange={(e)=> setEmpData({...empData, employee_mother: e.target.value})}/>   
  </label>
  </div>

  <h2 className="card-title mt-7">Dependents:</h2>
  <p className=' opacity-65 text-sm mt-2'>(For single; Please write down your parents name)</p>
  <div className="overflow-x-auto">
  <table className="table">

    <thead>
      <tr>
        <th className='tracking-wider'>Name</th>
        <th className='tracking-wider'>Relationship</th>
        <th className='tracking-wider'>Age</th>
        <th className='tracking-wider'>Date of Birth</th>
        <th className='flex gap-2 justify-center tracking-wider'>
        <div onClick={()=> addMoreData("Dependents")} className=' flex w-12 justify-center items-center p-2 rounded-md bg-[#0984e3] text-white transition-all opacity-70 hover:opacity-100 cursor-pointer'>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15"  />
            </svg>
          </div>
          
        </th>
      </tr>
    </thead>
    <tbody>
      {empData.employee_dependent.length &&  empData.employee_dependent.map((de, i) => {
        return (
          <tr key={i} className='whitespace-nowrap'>
          <td className='whitespace-nowrap'><input type="text" value={de.name} placeholder="Type here" className="input-md input w-full " onChange={(e)=>{
            const updateData = [...empData.employee_dependent];
            updateData[i].name = e.target.value;
            setEmpData({...empData, employee_dependent: updateData});
          }} /></td>
          <td className='whitespace-nowrap '><input type="text" value={de.relationship}  placeholder="Type here" className="input-md input w-full " onChange={(e)=>{
            const updateData = [...empData.employee_dependent];
            updateData[i].relationship = e.target.value;
            setEmpData({...empData, employee_dependent: updateData});
          }} /></td>
          <td className='whitespace-nowrap '><input type="number" value={de.age}  placeholder="Type here" className="input-md input w-full" onChange={(e)=>{
            const updateData = [...empData.employee_dependent];
            updateData[i].age = e.target.value;
            setEmpData({...empData, employee_dependent: updateData});
          }} /></td>
          <td className='whitespace-nowrap '>
            <DatePicker  value={moment(de.date_of_birth).format('L') || new Date()} className="  input input-bordered flex items-center gap-2 w-full " selected={de.date_of_birth}  onChange={(date)=> {
            const updateData = [...empData.employee_dependent];
            updateData[i].date_of_birth = date;
            setEmpData({...empData, employee_dependent: updateData});
          } }
          popperContainer={CalendarContainer}
         
          />
          </td>
          <td className='flex justify-center'>
          <div onClick={()=> removeData("Dependents", i)}  className={`${ empData.employee_dependent.length > 1 ? "cursor-pointer hover:opacity-100" : "cursor-not-allowed "} border flex w-12 justify-center items-center p-2 rounded-md bg-red-700 text-white transition-all opacity-70 `}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
            </div>
          </td>
        </tr>
        )
      })}       
    </tbody>
  </table>


  

  
  </div>


  <h2 className="card-title mt-7">II. EDUCATIONAL BACKGROUND</h2>
  <div className="overflow-x-auto mt-2">
  <table className="table">

    <thead>
      <tr>
        <th className='tracking-wider'></th>
        <th className='tracking-wider '>School</th>
        <th className='tracking-wider '>Years Attended</th>
        <th className='tracking-wider '>Degree</th>
      </tr>
    </thead>
    <tbody>
      {empData.employee_educational_background && empData.employee_educational_background.map((ed , i)=>{
        return (
          <tr key={i}>
          <td className='whitespace-nowrap font-semibold'>
            {ed.type}
          </td>
          <td className='whitespace-nowrap'><input value={ed.school} type="text" placeholder="Type here" className="input-md input w-full " onChange={(e)=>{
            const updatePayloadEd = [...empData.employee_educational_background];
            updatePayloadEd[i].school = e.target.value;
            setEmpData({...empData, employee_educational_background: updatePayloadEd});
          }} /></td>
          <td className='whitespace-nowrap'><input value={ed.years_attended} type="text" placeholder="Type here" className="input-md input w-full " 
          onChange={(e)=>{
            const updatePayloadEd = [...empData.employee_educational_background];
            updatePayloadEd[i].years_attended = e.target.value;
            setEmpData({...empData, employee_educational_background: updatePayloadEd});
          }}
          /></td>
          <td className='whitespace-nowrap'><input value={ed.degree} type="text" placeholder="Type here" className="input-md input w-full " 
          onChange={(e)=>{
            const updatePayloadEd = [...empData.employee_educational_background];
            updatePayloadEd[i].degree = e.target.value;
            setEmpData({...empData, employee_educational_background: updatePayloadEd});
          }}
          /></td>
        </tr>
        )
      })}
  
    </tbody>
  </table>
  </div>

  <h2 className="card-title mt-7">III. EMPLOYMENT HISTORY</h2>
  <p className=' opacity-65 text-sm mt-2'>(A. Previous Employment)</p>
  <div className="overflow-x-auto mt-2">
  <table className="table">

    <thead>
      <tr>
        <th className='tracking-wider'>Company/Location</th>
        <th className='tracking-wider'>Position</th>
        <th className='tracking-wider'>Salary</th>
        <th className='tracking-wider'>Length of Service</th>
        <th className='tracking-wider'>Reason for Leaving</th>
        <th className='flex justify-center items-center gap-2'>
          <div onClick={()=> addMoreData("Educational_history")} className='border w-12 flex justify-center items-center p-2 rounded-md bg-[#00b894] text-white transition-all opacity-70 hover:opacity-100 cursor-pointer'>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15"  />
            </svg>
          </div>
        
        </th>
      </tr>
    </thead>
    <tbody>
      {empData.employee_history.map((eh, i)=>{
        return (
          <tr key={i}>
          
            <td className='whitespace-nowrap'><input type="text" value={eh.company} placeholder="Type here" className="input-md input w-full "  onChange={(e)=>{
            const updatePayloadEd = [...empData.employee_history];
            updatePayloadEd[i].company = e.target.value;
            setEmpData({...empData, employee_history: updatePayloadEd});
          }} /></td>
            <td className='whitespace-nowrap'><input type="text" value={eh.position} placeholder="Type here" className="input-md input w-full " onChange={(e)=>{
            const updatePayloadEd = [...empData.employee_history];
            updatePayloadEd[i].position = e.target.value;
            setEmpData({...empData, employee_history: updatePayloadEd});
          }}/></td>
            <td className='whitespace-nowrap'><input type="text" value={eh.salary} placeholder="Type here" className="input-md input w-full " onChange={(e)=>{
            const updatePayloadEd = [...empData.employee_history];
            updatePayloadEd[i].salary = e.target.value;
            setEmpData({...empData, employee_history: updatePayloadEd});
          }}/></td>
            <td className='whitespace-nowrap'><input type="text" value={eh.length_of_service} placeholder="Type here" className="input-md input w-full " onChange={(e)=>{
            const updatePayloadEd = [...empData.employee_history];
            updatePayloadEd[i].length_of_service = e.target.value;
            setEmpData({...empData, employee_history: updatePayloadEd});
          }} /></td>
            <td className='whitespace-nowrap'><input type="text" value={eh.reason_for_leaving} placeholder="Type here" className="input-md input w-full " onChange={(e)=>{
            const updatePayloadEd = [...empData.employee_history];
            updatePayloadEd[i].reason_for_leaving = e.target.value;
            setEmpData({...empData, employee_history: updatePayloadEd});
          }}/></td>
            <td className='flex justify-center whitespace-nowrap'>
              <div onClick={()=> removeData("Educational_history", i)} className={`border flex justify-center w-12 items-center p-2 rounded-md bg-red-700 text-white transition-all opacity-70 ${ empData.employee_history.length > 1 ? "cursor-pointer hover:opacity-100" : "cursor-not-allowed "}`}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              </div>
            </td>
        </tr>  
        )
      })}
    </tbody>
  </table>
  </div>

  <h2 className="card-title mt-7">IV. CHARACTER REFERENCE</h2>
  <p className=' opacity-65 text-sm mt-2'>(Not Related To You)</p>
  <div className="overflow-x-auto mt-2">
  <table className="table">

    <thead>
      <tr>
        <th className='tracking-wider'>Name</th>
        <th className='tracking-wider'>Occupation</th>
        <th className='tracking-wider'>Address</th>
        <th className='tracking-wider'>Contact #</th>
        <th className='flex justify-center items-center tracking-wider gap-2'>
          <div onClick={()=> addMoreData("Reference")} className=' w-12 border flex justify-center items-center p-2 rounded-md bg-[#00b894] text-white transition-all opacity-70 hover:opacity-100 cursor-pointer'>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15"  />
            </svg>
          </div>
          
        </th>
      </tr>
    </thead>
    <tbody>
      {empData.employee_reference.map((er, i)=>{
          return (
            <tr key={i} className='whitespace-nowrap'>
              <td className='whitespace-nowrap'><input type="text" value={er.name} placeholder="Type here" className="input-md input w-full " onChange={(e)=>{
                const updatePayloadEd = [...empData.employee_reference];
                updatePayloadEd[i].name = e.target.value;
                setEmpData({...empData, employee_reference: updatePayloadEd});
              }} /></td>
              <td className='whitespace-nowrap'><input type="text" value={er.occupation} placeholder="Type here" className="input-md input w-full " onChange={(e)=>{
                const updatePayloadEd = [...empData.employee_reference];
                updatePayloadEd[i].occupation = e.target.value;
                setEmpData({...empData, employee_reference: updatePayloadEd});
              }}/></td>
              <td className='whitespace-nowrap'><input type="text" value={er.address} placeholder="Type here" className="input-md input w-full " onChange={(e)=>{
                const updatePayloadEd = [...empData.employee_reference];
                updatePayloadEd[i].address = e.target.value;
                setEmpData({...empData, employee_reference: updatePayloadEd});
              }} /></td>
              <td className='whitespace-nowrap'><input type="number" value={er.contact} placeholder="Type here" className="input-md input w-full " onChange={(e)=>{
                const updatePayloadEd = [...empData.employee_reference];
                updatePayloadEd[i].contact = e.target.value;
                setEmpData({...empData, employee_reference: updatePayloadEd});
              }} /></td>
              <td className='flex justify-center whitespace-nowrap'>
                <div onClick={()=> removeData("Reference", i)} className={`w-12 border flex justify-center items-center p-2 rounded-md bg-red-700 text-white transition-all opacity-70 ${empData.employee_reference.length > 1 ? "cursor-pointer hover:opacity-100": "cursor-not-allowed"}`}>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                  </svg>
                </div>
                
              </td>
            </tr>
          )
        }
      )}
      
    
    </tbody>
  </table>
  </div>

  <h2 className="card-title mt-7">V. PERSON TO NOTIFY IN CASE OF EMERGENCY</h2>
  <div className="overflow-x-auto mt-2">


  <table className="table">

    <thead>
      <tr>
        <th className='tracking-wider'></th>
        <th className='tracking-wider'></th>
        <th className='tracking-wider'></th>
        <th className='tracking-wider'></th>

      </tr>
    </thead>
    <tbody>

      <tr>
        <td className="w-[10%] font-semibold">Name:</td>
        <td className='whitespace-nowrap'><input type="text" value={empData.employee_case_emergency?.name || ""} placeholder="Type here" className="input-md input w-full " onChange={(e)=>{
          setEmpData({
            ...empData, 
            employee_case_emergency: {
              ...empData.employee_case_emergency,
              name: e.target.value
            }
          })
        }} /></td>
        <td className="w-[10%] font-semibold">Relationship:</td>
        <td className='whitespace-nowrap'><input type="text" value={empData.employee_case_emergency?.relationship || ""} placeholder="Type here" className="input-md input w-full " onChange={(e)=> {
          setEmpData({
            ...empData,
            employee_case_emergency:{
              ...empData.employee_case_emergency,
               relationship: e.target.value
            }
          })
        }}/></td>
      </tr>

      <tr>
        <td className="w-[10%] font-semibold">Address:</td>
        <td className='whitespace-nowrap'><input  type="text" placeholder="Type here" value={empData.employee_case_emergency?.address || ""} className="input-md input w-full " onChange={(e)=>{
          setEmpData({
            ...empData, 
            employee_case_emergency: {
              ...empData.employee_case_emergency,
              address: e.target.value
            }
          })
        }}/></td>
        <td className="w-[10%] font-semibold">Contact Number:</td>
        <td className='whitespace-nowrap'><input  type="text" placeholder="Type here" value={empData.employee_case_emergency?.contact || ""} className="input-md input w-full " onChange={(e)=>{
          setEmpData({
            ...empData, 
            employee_case_emergency: {
              ...empData.employee_case_emergency,
               contact: e.target.value
            }
          })
        }} /></td>
      </tr>
    </tbody>
  </table>


 

  <label className="form-control mt-2">
  <div className="label">
    <span className="label-text font-semibold">Reason for leaving:</span>
  </div>
  <textarea value={empData?.employee_reason_for_leaving === "null" ? "": empData?.employee_reason_for_leaving} className="textarea textarea-bordered h-24" disabled  placeholder="Reason here" onChange={(e)=> {
     setEmpData({
      ...empData, 
      employee_reason_for_leaving:e.target.value
    })
  }}></textarea>
 </label>



  <p className=' opacity-65 text-sm mt-6 '>
    I authorize investigation of any statement made on this application and understand that misrepresentation of any information can
    terminate any employment contract signed. I am willing to abide by the company rules and regulations and other memoranda that
    may issue.
  </p>
      <div className="card-actions justify-end mt-5">
    <button className="btn btn-active btn-error text-white" onClick={handleDelete}>
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6 text-white">
          <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
      </svg>
      DELETE
      </button>
    <button className="btn bg-[#0984e3] hover:bg-[#0984e3] text-white" onClick={handleSubmitData}>SAVE INFORMATION</button>
  </div>
  </div>
</div>
      )}
    
    </div> 


    <dialog id="employee_payroll" className="modal">
        <div className="modal-box w-11/12 max-w-5xl">
        <div className='flex justify-between'>
          <div className='w-full'>
          <h3 className="font-bold text-lg mt-5">EMPLOYEE RATE</h3>
          <span className="label-text opacity-60 text-[12px] font-semibold">Input all the fields below.</span>
          </div>
          <div className='w-full max-w-xs'>
          <label className="form-control w-full max-w-xs">
            <div className="label">
              <span className="label-text font-semibold opacity-70">Date of Review w/ Adjustments</span>
            </div>
            <input type="date" placeholder="Type here" value={payload.review_adjustments} name="review_adjustments" onChange={(e)=> setPayload({...payload, [e.target.name]:e.target.value})}  className="input input-bordered w-full max-w-xs font-bold" />
        </label>
        <p  className="text-red text-xs italic mt-2 text-red-500 ml-2 error-message">{error && error['rates_review_adjustments']}</p>
          </div>
       
        </div>
         
          <form  method="dialog" onSubmit={handleSubmitPayroll} autoComplete="off">
           
           <div className="divider"></div> 
           <div className='flex w-full flex-col gap-4'>
         
            <div className="overflow-x-auto">
            <div className="flex-shrink-0 flex items-center gap-3 ml-2 " >
              <span className='font-bold opacity-70 text-red-500'>Bank Details:</span>             
            </div> 
              <table className="table">
                <thead>
                  <tr>
                    <th>Account Numbers</th>
                    <th>Account Name</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><input type="text" value={payload?.account_number || ""} name="account_number" placeholder="Type here" className="input font-semibold input-bordered w-full" onChange={(e)=> setPayload({...payload, [e.target.name]:e.target.value})} /></td>
                    <td><input type="text" value={payload?.bank_name || ""} name="bank_name" placeholder="Type here" className="input font-semibold input-bordered w-full" onChange={(e)=> setPayload({...payload, [e.target.name]:e.target.value})} /></td>
                  </tr>
                </tbody>
              </table>
            </div>
            

            <div className="overflow-x-auto">
              <table className="table">
                {/* head */}
                <thead>
                  <tr>
                    <th>Basic Salary</th>
                    <th>Night Diff</th>
                    <th>Allowance</th>
                  </tr>
                </thead>
                <tbody>
             
                  <tr >
                    <td><input type="number" min={0} step="0.01" value={payload?.basic_salary || ""} onKeyUp={calculateData}  name='basic_salary' placeholder="0.00" className="font-semibold input input-bordered w-full max-w-xs" onChange={(e)=> setPayload({...payload, [e.target.name]:e.target.value})} /></td>
                    <td><input type="number" min={0} step="0.01"  value={payload?.basic_night_diff || ""} onKeyUp={calculateData} name='basic_night_diff' placeholder="0.00" className="font-semibold input input-bordered w-full max-w-xs" onChange={(e)=> setPayload({...payload, [e.target.name]:e.target.value})}  /></td>
                    <td><input type="number" min={0} step="0.01"   value={payload?.basic_allowance || ""} onKeyUp={calculateData} name='basic_allowance' placeholder="0.00" className="font-semibold input input-bordered w-full max-w-xs" onChange={(e)=> setPayload({...payload, [e.target.name]:e.target.value})} /></td>
                  </tr>
                 
                </tbody>
              </table>
            </div>

    
            <div className='w-full'>
            <div className="flex-shrink-0 flex items-center gap-3 ml-2" >
              <span className='font-bold opacity-70 text-red-500'>EARNINGS:</span>             
            </div>

            <div className="overflow-x-auto">
              <table className="table">
                {/* head */}
                <thead>
                  <tr>
                    <th>Bi-Monthly</th>
                    <th>Night Diff</th>
                    <th>Allowance</th>
                    <th>Daily</th>
                  </tr>
                </thead>
                <tbody>
             
                  <tr >
                    <td><input type="number" disabled min={0} step="0.01"  value={payload?.bi_montly || ""} name='bi_montly' placeholder="0.00" className="font-semibold input input-bordered w-full max-w-xs" onChange={(e)=> setPayload({...payload, [e.target.name]:e.target.value})} onKeyUp={calculateSlip} /></td>
                    <td><input type="number" min={0} step="0.01" disabled   value={payload?.night_diff || ""} name='night_diff' placeholder="0.00" className="font-semibold input input-bordered w-full max-w-xs" onChange={(e)=> setPayload({...payload, [e.target.name]:e.target.value})} /></td>
                    <td><input type="number" min={0} step="0.01" disabled value={payload?.allowance || ""} onKeyUp={calculateSlip}  name='allowance' placeholder="0.00" className="font-semibold input input-bordered w-full max-w-xs" onChange={(e)=> setPayload({...payload, [e.target.name]:e.target.value})} /></td>
                    <td><input type="number" min={0} step="0.01" disabled value={payload?.daily ? payload.daily?.toFixed(2) : "0.00"} onKeyUp={calculateSlip}  name='daily' placeholder="0.00" className="font-semibold input input-bordered w-full max-w-xs" onChange={(e)=> setPayload({...payload, [e.target.name]:e.target.value})} /></td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="overflow-x-auto">
              <table className="table">
                {/* head */}
                <thead>
                  <tr>
                    <th>Hourly</th>
                    <th>13th month</th>
                    <th>2.1%</th>
                  </tr>
                </thead>
                <tbody>
             
                  <tr>
                    <td><input type="number" disabled min="0" step="0.01" onKeyUp={calculateSlip} value={payload?.hourly ? payload.hourly?.toFixed(2) : "0.00"} name='hourly' placeholder="Type here" className="input font-semibold input-bordered w-full max-w-xs" onChange={(e)=> setPayload({...payload, [e.target.name]:e.target.value})} /></td>
                    <td><input type="number"  min="0" step="0.01" onKeyUp={calculateSlip} value={payload?.thirteenth_pay || ""} name='thirteenth_pay' placeholder="0.00" className="input font-semibold input-bordered w-full max-w-xs" onChange={(e)=> setPayload({...payload, [e.target.name]:e.target.value})} /></td>
                    <td><input type="number" disabled min="0" step="0.01" onKeyUp={calculateSlip} value={payload?.hourly_rate ? payload.hourly_rate.toFixed(2) : "0.00"} name='hourly_rate' onChange={(e)=> setPayload({...payload, [e.target.name]:e.target.value})} placeholder="Type here" className="input font-semibold input-bordered w-full max-w-xs"  /></td>
                  </tr>
                 
                </tbody>
              </table>
            </div>
            </div>
           </div>

           <label className="input  flex items-center gap-2">
                  <span className='font-bold opacity-70 uppercase'>Total Monthly:</span> 
                  <input min={0} value={payload.total_montly ? payload.total_montly.toFixed(2) : "0.00"} type="number" disabled className="grow font-semibold text-blue-500" placeholder=""  />
              </label>


   
            <p  className="text-red text-xs italic text-red-500 ml-2 error-message"></p>
            <div className="modal-action">
                <button type='submit' className="btn bg-[#0984e3] hover:bg-[#0984e3] text-white w-[40%]">
                 {_roll_id ? "UPDATE" : "SUBMIT"}
                   </button>
                <button type='button' className="btn btn-error text-white shadow" onClick={()=>{
                   getListOfPayroll()
                   document.getElementById('employee_payroll').close();
                }}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
            </div>
            </form>
       
        </div>
      </dialog>

    
    </>
  )
}

export default ShowUser