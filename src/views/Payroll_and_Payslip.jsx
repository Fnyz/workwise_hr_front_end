import { useEffect,useState } from 'react';
import axiosClient from '../axiosClient';
import moment from 'moment';
import swal from 'sweetalert';
import { Link } from 'react-router-dom'

function Compensation() {

  const [employees, setEmployees] = useState([]);
  const [payload, setPayload] = useState({});
  const [compensations, setCompensations] = useState([]);
  const [totalDataAmount, setTotalDataAmount] = useState({});
  const [compDetails, setCompDetails] = useState(null);
  const [load, setLoad]= useState(false);
  const [load1, setLoad1]= useState(false);
  const [pay_id, setPay_id] = useState("");
  const [_id, set_Id] = useState("");
  const [_roll_id, setRoll_id] = useState("");
  const [error, setError] = useState(null);
  const [loadPage, setLoadPage] = useState(false);
  const [modalLoad, setModalLoad] = useState(false);


  useEffect(() => {
    calculateDateRange();
  }, []);


  useEffect(()=>{
    getListOfEmployee();
    getAllRates();
 },[])

 const getListOfEmployee = () => {
    Promise.all([getDataList('position'), getDataList('department', 'ALL'), getDataList('user'), getDataList('employee')])
    .then((data) => {
        setEmployees(data[3].data);
    })
    .catch((err) => {
        console.error(err);
    });
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

const getAllRates = () => {
  setLoadPage(true)
  axiosClient.get("/rates")
  .then((data)=>{
    setLoadPage(false)
 
    const result = data.data.map(data => {

      const { 
        rates_night_diff,
        rates_basic_salary,
        rates_allowance
      } = data;
  
      const total_montly = rates_basic_salary + rates_night_diff + rates_allowance;
      const bi_montly = rates_basic_salary / 2 
      const night_diff = rates_night_diff / 2
      const allowance = rates_allowance / 2 
      const daily = rates_basic_salary / 21.75
      const hourly = daily / 8
      const hourly_rate = (2.1 / 100) * hourly

      
    
      return {
        ...data,
        total_montly,
        bi_montly,
        night_diff,
        allowance,
        hourly_rate,
        daily,
        hourly
      }
    })

   

   

    setCompensations(result)
  

    const totalAmount = result.reduce((accumulator, currentValue) => {
      accumulator.allBasicSalary += currentValue.rates_basic_salary;
      accumulator.allNightDiff += currentValue.rates_night_diff;
      accumulator.allTotalMonthly += currentValue.total_montly;
      accumulator.allBiMonthly += currentValue.bi_montly;
      return accumulator;
    }, { allBasicSalary: 0, allNightDiff: 0 , allTotalMonthly: 0, allBiMonthly: 0 });

    setTotalDataAmount(totalAmount)
    
  })
}


const handleSubmitPayroll = (e) => {
  e.preventDefault();

  const data = {
    'employee_id': payload.employee_id,
    'comp_bi_monthly':parseFloat(payload.bi_montly) ||0,
    'comp_per_hour_day': parseFloat(payload.per_hour_day) ||0,
    'comp_night_diff': parseFloat(payload.night_diff) ||0,
    'comp_holiday_or_ot': parseFloat(payload.holiday_OT) ||0,
    'comp_comission': parseFloat(payload.incentive) ||0,
    'comp_number_of_mins': parseFloat(payload.tardines_minutes) ||0,
    'comp_number_of_days': parseFloat(payload.tardines_days) ||0,
    'comp_mins': parseFloat(payload.tardines_total_minutes) ||0,
    'comp_days': parseFloat(payload.tardines_total_days) ||0,
    'comp_sss': parseFloat(payload.sss) ||0,
    'comp_phic': parseFloat(payload.phic) ||0,
    'comp_hdmf': parseFloat(payload.hdmf) ||0,
    'comp_withholding': parseFloat(payload.withholding) ||0,
    'comp_sss_loan': parseFloat(payload.sss_loan) ||0,
    'comp_ar': parseFloat(payload.ar_others) ||0,
    'comp_retro': parseFloat(payload.retro_others) ||0,
    'comp_allowance': parseFloat(payload.allowance) ||0,
    'comp_pay_roll_dates': payload.pay_roll_dates,
    'comp_pay_roll_dates_begin': payload.pay_roll_dates_begin,
    'comp_pay_roll_dates_end': payload.pay_roll_dates_end,
  };


    axiosClient.post('/compensation', data )
    .then((res)=>{
      setPayload({});
      document.getElementById('employee_payroll').close();
      getAllRates();
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


const calculateDateRange = () => {
  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();
  let dayOfMonth;
  if (currentMonth === 0 || currentMonth === 2 || currentMonth === 4 || currentMonth === 6 || currentMonth === 7 || currentMonth === 9 || currentMonth === 11) {
    dayOfMonth = 31;
  } else if (currentMonth === 1) {
    const isLeapYear = (currentYear % 4 === 0 && currentYear % 100 !== 0) || currentYear % 400 === 0;
    dayOfMonth = isLeapYear ? 29 : 28;
  } else {
    dayOfMonth = 30;
  }
  
  const payDateOfMonth = new Date(currentYear, currentMonth, dayOfMonth);

  let start, end;
  if (payDateOfMonth) {
    start = new Date(currentYear, currentMonth, 6);
    end = new Date(currentYear, currentMonth, 20);
  } else {
    start = new Date(currentYear, currentMonth - 1, 21);
    end = new Date(currentYear, currentMonth, 5);
  }

  const formatDate = (date) => {
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0'); 
    const dd = String(date.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  };
  
  const start_date = formatDate(start);
  const end_date = formatDate(end);
  const payDate = formatDate(payDateOfMonth);

  setPayload({
   ...payload,
   pay_roll_dates_begin: start_date,
   pay_roll_dates_end: end_date,
    pay_roll_dates: payDate
  })

};







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


  

  return (
    <div>
      <div className="ml-auto mb-6 lg:w-[75%] xl:w-[80%] 2xl:w-[85%]">
          <div className="bg-white shadow rounded-lg p-4 sm:p-6 xl:p-8 m-2">

                     <div className='w-full mb-10'>
                           <div hidden className="block w-full">
                                 <div className="relative flex gap-2 items-center  w-[70%] max-md:w-full  focus-within:text-[#0984e3]">
                                 <span className="absolute left-4 h-6 flex items-center pr-3 border-r border-gray-300 ">
                                 <svg xmlns="http://ww50w3.org/2000/svg" className="w-4 fill-current" viewBox="0 0 35.997 36.004">
                                    <path id="Icon_awesome-search" data-name="search" d="M35.508,31.127l-7.01-7.01a1.686,1.686,0,0,0-1.2-.492H26.156a14.618,14.618,0,1,0-2.531,2.531V27.3a1.686,1.686,0,0,0,.492,1.2l7.01,7.01a1.681,1.681,0,0,0,2.384,0l1.99-1.99a1.7,1.7,0,0,0,.007-2.391Zm-20.883-7.5a9,9,0,1,1,9-9A8.995,8.995,0,0,1,14.625,23.625Z"></path>
                                 </svg>
                                 </span>
                                 <input type="search"  name="leadingIcon" id="leadingIcon" placeholder="Search employee payroll here"   className="w-full pl-14 pr-4 py-2.5 rounded-xl text-sm text-gray-600 outline-none border border-gray-300 focus:border-[#0984e3] transition"/>
                                 {/* {checkboxState.length > 0 && (
                                    <button className="btn  text-white btn-sm  btn-error" onClick={removePosition} >
                                    {checkboxState.length > 1? "Delete all": "Delete"}
                                    </button>
                                    )} */}
                           </div>
                                 
                          
                      
                      </div>
                        </div>

                        <div role="tablist" className="tabs tabs-boxed w-full max-w-xs mb-5">
                          <Link to="/paycheck/rates" role="tab" className="tab font-semibold bg-[#3498db] text-white uppercase">Rates</Link>
                          <Link to="/paycheck/payroll" role="tab" className="tab  font-semibold uppercase">Payroll</Link>
                          <Link to="/paycheck/payslip" role="tab" className="tab font-semibold uppercase">Payslip</Link>
                        </div>
      
                     
                     <div className="overflow-x-auto">
                      <table className="table">
                        <thead>
                          <tr>
                
                            <th className='tracking-wider'>NAME'S</th>
                            <th className='tracking-wider'>BANK ACCOUNT</th>
                            <th className='tracking-wider'>BASIC SALARY</th>
                            <th className='tracking-wider'>NIGHT DIFF</th>
                            <th className='tracking-wider'>BI-MONTHLY SALARY</th>
                            <th className='tracking-wider'>TOTAL MONTHLY</th>
                            <th className='tracking-wider'>REVIEW ADJUSTMENT DATE</th>
                            <th className='tracking-wider'>ACTION</th>
                          </tr>
                        </thead>
                        <tbody>
                        {loadPage ? (
                                            <tr>
                                            <td className="p-4 whitespace-nowrap text-sm font-normal text-gray-900" colSpan="4">
                                               <div className='ml-5 flex items-center gap-2 '>
                                                 <span className="loading loading-ring loading-lg text-primary"></span>
                                                  <span className="font-bold opacity-80">Loading for employee rates...</span>
                                               </div>
                                            </td>
             
                                         </tr>
                                       ):  compensations.length  ?  
                           compensations.map((com, i)=> {
                            return (
                                    <tr key={i}>
                                
                                      <td className='whitespace-nowrap'>
                                        <div className="flex items-center gap-3">
                                          <div className="avatar">
                                            <div className="mask mask-squircle w-12 h-12">
                                            <img srcSet={`${com.employee_image || "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg"}`} alt="Avatar Tailwind CSS Component" />
                                            </div>
                                          </div>
                                          <div>
                                        
                                            <div className="font-bold uppercase">{com.employee_name} {com.position && `/ ${ com.position}`}</div>
                                            <div className="text-sm opacity-50">{com.employee_email || com.employee_id} </div>
                                          </div>
                                        </div>
                                      </td>
                                      <td className='whitespace-nowrap'>
                                        <span className="font-semibold opacity-75">{com.rates_acount_name}</span>
                                        <br/>
                                        <span className="badge badge-ghost badge-sm"> {com.rates_account_num}</span>
                                      </td>
                                      <td className="font-semibold text-blue-500">{com.rates_basic_salary && com.rates_basic_salary.toLocaleString('en-PH', { style: 'currency', currency: 'PHP' })}</td>
                                      <td className="font-semibold text-red-500">{com.rates_night_diff && com.rates_night_diff.toLocaleString('en-PH', { style: 'currency', currency: 'PHP' }) || "0.00"}</td>
                                      <td className="font-semibold text-red-500">{com.bi_montly && com.bi_montly.toLocaleString('en-PH', { style: 'currency', currency: 'PHP' })}</td>
                                      <td className="font-semibold text-red-500">{com.total_montly && com.total_montly.toLocaleString('en-PH', { style: 'currency', currency: 'PHP' })}</td>
                                      <td className="font-semibold uppercase">{moment(com.rates_review_adjustments).format("LL")}</td>
                                      <td className="pt-6 px-2 whitespace-nowrap text-sm font-semibold text-gray-900 flex gap-2 max-md:hidden">
                                      <button type="button" onClick={() =>{
                                          setLoad(true)
                                          setPay_id(com?.compe_id)
                                          axiosClient.get(`/rates/${com.compe_id}`)
                                          .then((data)=>{
                                            setLoad(false)
                                            calculateDateRange()

                                            document.getElementById('employee_payroll_details').showModal();
                                            const {
                                                rates_basic_salary
                                              } = data.data.data;
                                          
                                           
                                        
                                            const daily = rates_basic_salary / 21.75
                                            const hourly = daily / 8
                                            const hourly_rate = (2.1 / 100) * hourly

                                    
                                             setCompDetails({...data.data.data, 
                                              hourly, 
                                              hourly_rate, 
                                              daily, 
                                            });
                                          })
                                          .catch((err)=>{
                                             const {response} = err;
                                             if(response &&  response.status  === 422){
                                               console.log(response.data)
                                             }
                                          })
                                     
                                      }} >
                                        {load && pay_id == com?.compe_id ? (
                                            <span className="loading loading-spinner loading-sm text-[#0984e3]"></span>
                                        ): (
                                  
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-green-500 cursor-pointer transition-all opacity-75 hover:opacity-100">
                                        <path d="M11.625 16.5a1.875 1.875 0 1 0 0-3.75 1.875 1.875 0 0 0 0 3.75Z" />
                                        <path fillRule="evenodd" d="M5.625 1.5H9a3.75 3.75 0 0 1 3.75 3.75v1.875c0 1.036.84 1.875 1.875 1.875H16.5a3.75 3.75 0 0 1 3.75 3.75v7.875c0 1.035-.84 1.875-1.875 1.875H5.625a1.875 1.875 0 0 1-1.875-1.875V3.375c0-1.036.84-1.875 1.875-1.875Zm6 16.5c.66 0 1.277-.19 1.797-.518l1.048 1.048a.75.75 0 0 0 1.06-1.06l-1.047-1.048A3.375 3.375 0 1 0 11.625 18Z" clipRule="evenodd" />
                                        <path d="M14.25 5.25a5.23 5.23 0 0 0-1.279-3.434 9.768 9.768 0 0 1 6.963 6.963A5.23 5.23 0 0 0 16.5 7.5h-1.875a.375.375 0 0 1-.375-.375V5.25Z" />
                                        </svg>

                                      
                                        )}
                                      </button> 
                                    
                                      </td>
                                    </tr>


                            )
                          }): (
                            <tr>
                                       <td className="p-4 whitespace-nowrap text-sm font-normal text-gray-900" colSpan="4">
                                          <div className='ml-5'>
                                             <span className="font-bold opacity-80">No employee rates found!</span>
                                          </div>
                                       </td>
                                    </tr>
                          )}

                        </tbody>
                        <tfoot>
                          <tr>
                            <th></th>
                            <th>TOTAL :</th>
                            <th className='text-blue-500'>{totalDataAmount.allBasicSalary ? totalDataAmount.allBasicSalary.toLocaleString('en-PH', { style: 'currency', currency: 'PHP' }) : "0.00"}</th>
                            <th className='text-blue-500'>{totalDataAmount.allNightDiff ? totalDataAmount.allNightDiff.toLocaleString('en-PH', { style: 'currency', currency: 'PHP' }) : "0.00"}</th>
                            <th className='text-red-500'>{totalDataAmount.allBiMonthly ? totalDataAmount.allBiMonthly.toLocaleString('en-PH', { style: 'currency', currency: 'PHP' }) : "0.00"}</th>
                            <th className='text-red-500'>{totalDataAmount.allTotalMonthly ? totalDataAmount.allTotalMonthly.toLocaleString('en-PH', { style: 'currency', currency: 'PHP' }) : "0.00"}</th>
                            <th></th>
                          </tr>
                        </tfoot>
                        
                      </table>
                    </div>
            </div>
            
      </div> 
  
      <dialog id="employee_payroll_details" className="modal">
        <div className="modal-box w-11/12 max-w-5xl">
        <div className="w-full flex flex-col justify-center items-center">
         <div className=" w-60 rounded">
            <img src="/onsource_logo.png" />
         </div>
         <p className="label-text opacity-70 text-[12px] font-bold mt-5">OnSource Inc.</p>
         <p className=" opacity-70 text-[12px] font-semibold">Office 10th flr, The Space Bldg. AS Fortuna St., Banilad, Mandaue City, 6014 Cebu.</p>
         </div>
         <div className="divider"></div> 
        <h3 className="font-bold text-lg mt-5 text-center my-4 opacity-70">EMPLOYEE RATE DETAILS</h3>
        <div className="divider"></div> 
          <form  method="dialog" className='mt-2' autoComplete="off">
           <div className='flex w-full gap-4'>
              <div className='flex justify-center items-center flex-col w-full'>
                <label className="form-control w-full ">
                    <div className="label">
                      <span className="label-text font-semibold opacity-70">Employee names:</span>
                  </div>
                  <span className='font-bold opacity-70 uppercase text-blue-500'>{compDetails?.employee_name} {compDetails?.position && `/ ${compDetails?.position}`}</span>             
                </label>

                <label className="form-control w-full ">
                    <div className="label">
                      <span className="label-text font-semibold opacity-70">Employee ID:</span>
                  </div>
                  <span className='font-bold opacity-70 text-red-500'>{compDetails?.employee_id}</span>             
                </label>
              </div>
              <div className='w-full'>
              <label className="form-control w-full">
                  <div className="label">
                    <span className="label-text font-semibold opacity-70">Review Adjustment Date:</span>
                  </div>
                  <span className='font-bold opacity-70 ml-1 text-red-500'>{compDetails?.rates_review_adjustments && moment(compDetails?.rates_review_adjustments).format("LL") }</span> 
                </label>

                <label className="form-control w-full">
                  <div className="label">
                    <span className="label-text font-semibold opacity-70">Bank Details:</span>
                  </div>
                  <span className='font-bold opacity-70 ml-1 text-blue-500'>{compDetails?.rates_acount_name} / {compDetails?.rates_account_num}</span> 
                </label>

                
              </div>
           </div>
           
           <div className="divider"></div> 
           <div className='flex w-full flex-col gap-4 mb-5'> 
            <div className='w-full'>
            <div className="flex-shrink-0 flex items-center gap-3 ml-2 mb-3" >
              <span className='font-bold opacity-70 text-blue-500'>BASIC SALARY DETAILS : </span>             
            </div>

            <div className="overflow-x-auto mb-3">
              <table className="table">
                <thead>
                  <tr>
                    <th>Basic</th>
                    <th>Night Differential</th>
                    <th>Allowance</th>
                  </tr>
                </thead>
                <tbody>
             
                  <tr>
                    <td>
                      <span className='opacity-70 font-semibold'>{compDetails?.rates_basic_salary?.toLocaleString('en-PH', { style: 'currency', currency: 'PHP' }) || "0.00"}</span>    
                    </td>
                    <td>
                      <span className='opacity-70 font-semibold'>{(compDetails?.rates_night_diff)?.toLocaleString('en-PH', { style: 'currency', currency: 'PHP' }) || "0.00"}</span>  
                      </td>
                    <td>
                       <span className='opacity-70 font-semibold'>{(compDetails?.rates_allowance)?.toLocaleString('en-PH', { style: 'currency', currency: 'PHP' }) || "0.00"}</span>    
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

           

            </div>
           
           </div>

       
           <div className='flex w-full flex-col gap-4 mb-7'> 
            <div className='w-full'>
            <div className="flex-shrink-0 flex items-center gap-3 ml-2 mb-3" >
              <span className='font-bold opacity-70 text-blue-500'>EARNINGS : </span>             
            </div>

            <div className="overflow-x-auto mb-3">
              <table className="table">
                <thead>
                  <tr>
                    <th>Bi-Monthly</th>
                    <th>Night Differential </th>
                    <th>Allowance</th>
                  </tr>
                </thead>
                <tbody>
             
                  <tr>
                    <td>
                      <span className='opacity-70 font-semibold'>{(compDetails?.rates_basic_salary / 2)?.toLocaleString('en-PH', { style: 'currency', currency: 'PHP' }) || "0.00"}</span>    
                    </td>
                    <td>
                      <span className='opacity-70 font-semibold'>{(compDetails?.rates_night_diff / 2)?.toLocaleString('en-PH', { style: 'currency', currency: 'PHP' }) || "0.00"}</span>  
                      </td>
                    <td>
                       <span className='opacity-70 font-semibold'>{(compDetails?.rates_allowance / 2)?.toLocaleString('en-PH', { style: 'currency', currency: 'PHP' }) || "0.00"}</span>    
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="overflow-x-auto mb-3">
              <table className="table">
                <thead>
                  <tr>
                    <th>Daily</th>
                    <th>Hourly</th>
                    <th>13th month</th>
                    <th>2.1 %</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <span className=' opacity-70 font-semibold'>{compDetails?.daily?.toLocaleString('en-PH', { style: 'currency', currency: 'PHP' }) || "0.00"}</span>
                    </td>
                    <td>
                      <span className=' opacity-70 font-semibold'>{compDetails?.hourly?.toLocaleString('en-PH', { style: 'currency', currency: 'PHP' }) || "0.00"}</span>
                    </td>
                    <td>
                      <span className=' opacity-70 font-semibold'>{compDetails?.rates_thirteenth_pay?.toLocaleString('en-PH', { style: 'currency', currency: 'PHP' }) || "0.00"}</span>
                    </td>
                    <td>
                      <span className=' opacity-70 font-semibold'>{compDetails?.hourly_rate.toFixed(2) || "0.00"}</span>
                    </td>
                  </tr>
                 
                </tbody>
              </table>
            </div>

            </div>
           
           </div>
          
            <div className="modal-action mt-8">
                  <button className="btn bg-[#0984e3] hover:bg-[#0984e3] text-white" 
                    onClick={()=>{
                                        
                                          document.getElementById('employee_payroll_details').close();
                                            setLoad1(true);
                                            setRoll_id(compDetails.compe_id);
                                          axiosClient.get(`/rates/${compDetails.compe_id}`)
                                          .then((data)=>{
                                            setLoad1(false);

                                             const datas = {
                                              'employee_name': data.data.data.employee_name,
                                              'position': data.data.data.position,
                                              'employee_role': data.data.data.employee_role,
                                              'employee_id':data.data.data.emp_id,
                                              'emp_id':data.data.data.employee_id,
                                              'amount': data.data.data.rates_basic_salary / 2,
                                              'bi_montly': data.data.data.rates_basic_salary / 2,
                                              'per_hour_day': data.data.data.rates_basic_salary / 21.75,
                                              'night_diff': data.data.data.rates_night_diff / 2,
                                              'allowance': data.data.data.rates_allowance / 2,
                                              'account_number': data.data.data.rates_account_num,
                                              'bank_name': data.data.data.rates_acount_name,
                                          };


                                        const taxable_income = datas.bi_montly + datas.night_diff;
                                        const total_net_pay =  parseFloat(taxable_income) + parseFloat(datas.allowance);

                            
                                            setPayload({
                                              ...payload,
                                              ...datas,
                                              per_hour_day: datas.per_hour_day.toFixed(2), 
                                              taxable_income,
                                              total_net_pay
                                            })
                                            

                                            document.getElementById('employee_payroll').showModal();
              
                                          })
                                          .catch((err)=>{
                                              const {response} = err;
                                              if(response &&  response.status  === 422){
                                                console.log(response.data)
                                              }
                                          })
                    }}>
                
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                  </svg>


                    ADD PAYROLL
                  </button>
                <button type='button' className="btn btn-error text-white shadow" onClick={()=>{
                   document.getElementById('employee_payroll_details').close();
                  
                   setPayload({})
                }}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
            </div>
            </form>
       
        </div>
      </dialog>


      <dialog id="employee_payroll" className="modal">
        <div className="modal-box w-11/12 max-w-5xl">
        <h3 className="font-bold text-lg mt-5">EMPLOYEE PAYROLL</h3>
        <span className="label-text opacity-70 text-[12px]">Input all the fields below</span>
          <form  method="dialog" onSubmit={handleSubmitPayroll} autoComplete="off">
          <div className="divider"></div>
           <div className='flex w-full gap-4'>
              <div className='flex justify-center items-center flex-col w-full mb-2'>
                <label className="form-control w-full ">
                    <div className="label">
                      <span className="label-text font-semibold">Employee name:</span>
                  </div>
                     <span className='font-bold opacity-70 uppercase text-blue-500'>{payload?.employee_name || ""} {payload?.position && `/ ${payload?.position}`}</span>     
                </label>

                <label className="form-control w-full ">
                    <div className="label">
                      <span className="label-text font-semibold">Employee ID:</span>
                  </div>
                    <span className='font-bold opacity-70 text-red-500'>{payload.emp_id || ""}</span>     
                </label>
                <label className="form-control w-full mt-2">
                    <div className="label">
                      <span className="label-text font-semibold">Bank Account:</span>
                  </div>
                    <span className='font-bold opacity-70 text-red-500 ml-1'>{payload?.bank_name || ""} / {payload?.account_number || ""}</span>     
                </label>
              </div>
              <div className='w-full'>
              <label className="form-control w-full">
                  <div className="label">
                    <span className="label-text font-semibold">PayDate:</span>
                  </div>
                  <input type="date" value={payload.pay_roll_dates || ""} name='pay_roll_dates' placeholder="Input here..." onChange={(e)=> {
                    setPayload({...payload, [e.target.name]: e.target.value})
                  }} className="input input-bordered input-sm w-full " />
                </label>
                <p  className="text-red text-xs italic mt-2 text-red-500 ml-2 error-message">{error && error['comp_pay_roll_dates'] && "Payroll date is required, please try again!" }</p>
                <label className="form-control w-full">
                  <div className="label">
                    <span className="label-text font-semibold">Payroll Date Begin:</span>
                  </div>
                  <input type="date" value={payload.pay_roll_dates_begin || ""} name='pay_roll_dates_begin' placeholder="Input here..." onChange={(e)=> {
                    setPayload({...payload, [e.target.name]: e.target.value})
                  }} className="input input-bordered input-sm w-full " />
                </label>
                <p  className="text-red text-xs italic mt-2 text-red-500 ml-2 error-message">{error && error['comp_pay_roll_dates_begin'] && "Payroll date is required, please try again!" }</p>
                <label className="form-control w-full">
                  <div className="label">
                    <span className="label-text font-semibold">Payroll Date End:</span>
                  </div>
                  <input type="date" value={payload.pay_roll_dates_end || ""} name='pay_roll_dates_end' placeholder="Input here..." onChange={(e)=> {
                    setPayload({...payload, [e.target.name]: e.target.value})
                  }} className="input input-bordered input-sm w-full " />
                </label>
                <p  className="text-red text-xs italic mt-2 text-red-500 ml-2 error-message">{error && error['comp_pay_roll_dates_end'] && "Payroll date is required, please try again!" }</p>
            

              
           
              </div>
           </div>
           
           <div className="divider"></div> 
           <div className='flex w-full flex-col gap-4'>
            <div className='w-full'>
            <div className="flex-shrink-0 flex items-center gap-3 ml-2 mb-3" >
              <span className='font-bold opacity-70 text-blue-500'>EARNINGS:</span>             
            </div>

            <div className="overflow-x-auto">
              <table className="table">
                {/* head */}
                <thead>
                  <tr>
                    <th>Bi-Monthly</th>
                    <th>Per Hour/day</th>
                    <th>Amount</th>
                  </tr>
                </thead>
                <tbody>
             
                  <tr >
                    <td><input type="number" min="0" step="0.01" value={payload?.bi_montly || ""} onKeyUp={calculateSlip}  name='bi_montly' placeholder="0.00" className="font-semibold input input-bordered w-full max-w-xs" onChange={(e)=> setPayload({...payload, [e.target.name]:e.target.value})} /></td>
                    <td><input type="number" min="0" step="0.01"  value={payload?.per_hour_day ? payload?.per_hour_day : ""} name='per_hour_day' placeholder="0.00" className="font-semibold input input-bordered w-full max-w-xs" onChange={(e)=> setPayload({...payload, [e.target.name]:e.target.value})} onKeyUp={calculateSlip} /></td>
                    <td><input type="number" min="0" step="0.01"   disabled value={payload?.amount || ""} name='amount' placeholder="0.00" className="font-semibold input input-bordered w-full max-w-xs" onChange={(e)=> setPayload({...payload, [e.target.name]:e.target.value})} /></td>
                  </tr>
                 
                </tbody>
              </table>
            </div>

            <div className="overflow-x-auto">
              <table className="table">
                {/* head */}
                <thead>
                  <tr>
                    <th>Night  Differential</th>
                    <th>Holiday/OT</th>
                    <th>Commission/Incentive/ Bonus/ Others</th>
                  </tr>
                </thead>
                <tbody>
             
                  <tr>
                    <td><input type="number" onKeyUp={calculateSlip} min="0" step="0.01" value={payload?.night_diff || ""} name='night_diff' placeholder="0.00" className="input font-semibold input-bordered w-full max-w-xs" onChange={(e)=> setPayload({...payload, [e.target.name]:e.target.value})} /></td>
                    <td><input type="number" onKeyUp={calculateSlip} min="0" step="0.01" value={payload?.holiday_OT || ""} name='holiday_OT' placeholder="0.00" className="input font-semibold input-bordered w-full max-w-xs" onChange={(e)=> setPayload({...payload, [e.target.name]:e.target.value})} /></td>
                    <td><input type="number" onKeyUp={calculateSlip} min="0" step="0.01" value={payload?.incentive || ""} name='incentive' onChange={(e)=> setPayload({...payload, [e.target.name]:e.target.value})} placeholder="0.00" className="input font-semibold input-bordered w-full max-w-xs"  /></td>
                  </tr>
                 
                </tbody>
              </table>
            </div>

            </div>
            <div className='w-full'>
            <div className="flex-shrink-0 flex items-center gap-3 ml-2 mb-3" >
              <span className='font-bold opacity-70 text-red-500'>DEDUCTIONS:</span>             
            </div>
            <span className=' text-sm opacity-60 ml-2'>( Absent/Tardiness )</span>     
            <div className="overflow-x-auto mb-2">
              <table className="table">
                {/* head */}
                <thead>
                  <tr>
                    <th># mins.</th>
                    <th># days</th>
                    <th>mins.</th>
                    <th>days</th>
                  </tr>
                </thead>
                <tbody>
                  <tr >
                    <td><input type="number" min="0" step="0.01" value={payload?.tardines_minutes || ""} name='tardines_minutes' onChange={(e)=> setPayload({...payload, [e.target.name]:e.target.value})}  onKeyUp={calculateSlip} placeholder="0.00" className="font-semibold input input-bordered w-full max-w-xs" /></td>
                    <td><input type="number" min="0" step="0.01"  value={payload?.tardines_days || ""} name='tardines_days' onChange={(e)=> setPayload({...payload, [e.target.name]:e.target.value})}  onKeyUp={calculateSlip} placeholder="0.00" className="font-semibold input input-bordered w-full max-w-xs" /></td>
                    <td><input type="number" min="0" step="0.01"   value={payload?.tardines_total_minutes ? payload?.tardines_total_minutes?.toFixed(2) : "0.00"} disabled  placeholder="0.00" className="input input-bordered w-full max-w-xs font-semibold" /></td>
                    <td><input type="number" min="0" step="0.01"  value={payload?.tardines_total_days ? payload?.tardines_total_days?.toFixed(2) : "0.00"} disabled placeholder="0.00" className="input input-bordered w-full max-w-xs font-semibold" /></td>
                  </tr>
                 
                </tbody>
              </table>
            </div>
            <span className=' text-sm opacity-60 ml-2'>( Government Contribution )</span>     
            <div className="overflow-x-auto">
              <table className="table">
                <thead>
                  <tr>
                    <th>SSS</th>
                    <th>PHIC</th>
                    <th>HDMF</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><input type="number" min="0" step="0.01" onKeyUp={calculateSlip}  value={payload?.sss || ""} name='sss' onChange={(e)=> setPayload({...payload, [e.target.name]:e.target.value})}  placeholder="0.00" className="font-semibold input input-bordered w-full max-w-xs" /></td>
                    <td><input type="number" min="0" step="0.01" onKeyUp={calculateSlip}  value={payload?.phic || ""} name='phic' onChange={(e)=> setPayload({...payload, [e.target.name]:e.target.value})}  placeholder="0.00" className="font-semibold input input-bordered w-full max-w-xs" /></td>
                    <td><input type="number" min="0" step="0.01" onKeyUp={calculateSlip}  value={payload?.hdmf || ""} name='hdmf' onChange={(e)=> setPayload({...payload, [e.target.name]:e.target.value})}  placeholder="0.00" className="font-semibold input input-bordered w-full max-w-xs" /></td>
                  </tr>
                </tbody>
              </table>
            </div>
            </div>
           </div>
           <div className='flex w-full  justify-between items-center mt-3 p-4'>
           <label className="form-control w-full mb-5">
                  <div className="label">
                    <span className="label-text font-semibold opacity-70 ">Withholding Tax:</span>
                  </div>
                  <input type="number" min="0" 
              step="0.01" value={payload?.withholding || ""} name='withholding' placeholder="0.00" className="input input-bordered w-full font-semibold" onChange={(e)=> setPayload({...payload, [e.target.name]:e.target.value})} onKeyUp={calculateSlip}   />
                </label>
            </div>
        
            <div className='flex justify-around items-center my-2'>
            <span className=' text-sm opacity-60'>( Other payments and deductions )</span>     
            <span className=' text-sm opacity-60'>( Additional )</span>     
            </div>
            <div className="overflow-x-auto mb-2">
              <table className="table">
                {/* head */}
                <thead>
                  <tr>
                    <th>SSS Loan</th>
                    <th>AR others</th>
                    <th>Retro/others</th>
                    <th>Allowance</th>
                  </tr>
                </thead>
                <tbody>
                  <tr >
                    <td><input type="text" onKeyUp={calculateSlip} min="0" step="0.01" value={payload?.sss_loan || ""} name="sss_loan" placeholder="0.00" className="input font-semibold input-bordered w-full max-w-xs" onChange={(e)=> setPayload({...payload, [e.target.name]:e.target.value})} /></td>
                    <td><input type="text" onKeyUp={calculateSlip} min="0" step="0.01" value={payload?.ar_others || ""} name="ar_others"  placeholder="0.00" className="input font-semibold input-bordered w-full max-w-xs" onChange={(e)=> setPayload({...payload, [e.target.name]:e.target.value})} /></td>
                    <td><input type="text" onKeyUp={calculateSlip} min="0" step="0.01" value={payload?.retro_others || ""} name="retro_others"  placeholder="0.00" className="input font-semibold input-bordered w-full max-w-xs" onChange={(e)=> setPayload({...payload, [e.target.name]:e.target.value})} /></td>
                    <td><input type="text" onKeyUp={calculateSlip} min="0" step="0.01" value={payload?.allowance || ""} name="allowance"  placeholder="0.00" className="input font-semibold input-bordered w-full max-w-xs" onChange={(e)=> setPayload({...payload, [e.target.name]:e.target.value})} /></td>
                  </tr>
                 
                </tbody>
              </table>
            </div>
            <div className='flex justify-between mb-5'>
              <label className="input  flex items-center gap-2 ">
                  <span className='font-bold opacity-70'>Taxable Income:</span> 
                  <input  min="0" step="0.01" value={payload.taxable_income ? payload.taxable_income.toFixed(2) : "0.00"} type="hidden" disabled className="grow font-semibold text-blue-500" placeholder=""  />
                  <span className='opacity-70 font-semibold text-blue-700'>{(payload?.taxable_income )?.toLocaleString('en-PH', { style: 'currency', currency: 'PHP' }) || "0.00"}</span>    
              </label>
            <label className="input  flex items-center gap-2">
                  <span className='font-bold opacity-70'>Net Pay:</span> 
                  <input type="hidden" value={payload.total_net_pay ? payload.total_net_pay.toFixed(2): "0.00"} disabled className="grow font-semibold text-red-500" placeholder=""  />
                  <span className='opacity-70 font-semibold text-red-500'>{(payload?.total_net_pay )?.toLocaleString('en-PH', { style: 'currency', currency: 'PHP' }) || "0.00"}</span>    
              </label>
            </div>

            <p  className="text-red text-xs italic text-red-500 ml-2 error-message"></p>
            <div className="modal-action">
                <button type='submit' className="btn bg-[#0984e3] hover:bg-[#0984e3] text-white w-[40%]">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-5">
                  <path fillRule="evenodd" d="M5.625 1.5H9a3.75 3.75 0 0 1 3.75 3.75v1.875c0 1.036.84 1.875 1.875 1.875H16.5a3.75 3.75 0 0 1 3.75 3.75v7.875c0 1.035-.84 1.875-1.875 1.875H5.625a1.875 1.875 0 0 1-1.875-1.875V3.375c0-1.036.84-1.875 1.875-1.875ZM12.75 12a.75.75 0 0 0-1.5 0v2.25H9a.75.75 0 0 0 0 1.5h2.25V18a.75.75 0 0 0 1.5 0v-2.25H15a.75.75 0 0 0 0-1.5h-2.25V12Z" clipRule="evenodd" />
                  <path d="M14.25 5.25a5.23 5.23 0 0 0-1.279-3.434 9.768 9.768 0 0 1 6.963 6.963A5.23 5.23 0 0 0 16.5 7.5h-1.875a.375.375 0 0 1-.375-.375V5.25Z" />
                </svg>

                   SUBMIT PAYROLL
                   </button>
                <button type='button' className="btn btn-error text-white shadow" onClick={()=>{
                   document.getElementById('employee_payroll').close();
                   setRoll_id("");
                   setPayload({})
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

export default Compensation