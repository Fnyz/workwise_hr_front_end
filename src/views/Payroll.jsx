import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import axiosClient from '../axiosClient';
import moment from 'moment';
import swal from 'sweetalert';


function Payroll() {

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


   useEffect(()=>{
      getListOfPayroll();
      getListOfEmployee();

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

const calculatePayRoll = () => {

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

   const total_minutes = per_hour_day / 8 * tardines_minutes || 0;
   const total_days = per_hour_day * tardines_days || 0;
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

 const calculatePaySlip = () => {
   const earnings_per_month = parseFloat(payload?.earnings_per_month) || 0;
   const earnings_allowance = parseFloat(payload?.earnings_allowance) || 0;
   const earnings_night_diff = parseFloat(payload?.earnings_night_diff) || 0;
   const earnings_holiday = parseFloat(payload?.earnings_holiday) || 0;
   const earnings_retro = parseFloat(payload?.earnings_retro) || 0;
   const earnings_commission = parseFloat(payload?.earnings_commission) || 0;
 
 
   const deductions_lwop = parseFloat(payload?.deductions_lwop) || 0;
   const deductions_holding_tax = parseFloat(payload?.deductions_holding_tax) || 0;
   const deductions_sss_contribution = parseFloat(payload?.deductions_sss_contribution) || 0;
   const deductions_phic_contribution = parseFloat(payload?.deductions_phic_contribution) || 0;
   const deductions_hmo = parseFloat(payload?.deductions_hmo) || 0;
   const deductions_sss_loan = parseFloat(payload?.deductions_sss_loan) || 0;
   const deductions_hmo_loan = parseFloat(payload?.deductions_hmo_loan) || 0;
   const deductions_employee_loan = parseFloat(payload?.deductions_employee_loan) || 0;
   const deductions_others = parseFloat(payload?.deductions_others) || 0;
   const deductions_hdmf_contribution = parseFloat(payload?.deductions_hdmf_contribution) || 0;
 
 
  
   
   const totalEarn = earnings_per_month + earnings_allowance + earnings_night_diff + earnings_holiday + earnings_retro + earnings_commission; 
   const totalDeduc = deductions_lwop + deductions_holding_tax + deductions_sss_contribution + deductions_phic_contribution + deductions_hmo + deductions_sss_loan + deductions_hmo_loan + deductions_employee_loan + deductions_hdmf_contribution + deductions_others; 
   const totalNetPay = parseFloat(totalEarn) - parseFloat(totalDeduc);
 
   setPayload({...payload, 
     earnings_total: parseFloat(totalEarn), 
     deductions_total: parseFloat(totalDeduc),
     payslip_netPay: parseFloat(totalNetPay)
   });
 };
 


 const handleSubmitPayslip = (e) => {
   e.preventDefault();
 
 
   if(_id){
     
     axiosClient.put(`/payslip/${_id}?${new URLSearchParams(payload).toString()}`)
     .then((res)=>{
       setPayload({});
       document.getElementById('employee_payslip').close();
       getListOfPayroll();
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
 

   axiosClient.post('/payslip', {...payload, payroll_id: pay_id } )
   .then((res)=>{
     getListOfPayroll();
     setPayload({});
     setEmployees([]);
     document.getElementById('employee_payslip').close();
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


 const handleSubmitPayroll = (e) => {
   e.preventDefault();
 
   const data = {
     'employee_id': payload.employee_id,
     'comp_bi_monthly':parseFloat(payload.bi_montly) || 0,
     'comp_per_hour_day': parseFloat(payload.per_hour_day) || 0,
     'comp_night_diff': parseFloat(payload.night_diff) || 0,
     'comp_holiday_or_ot': parseFloat(payload.holiday_OT) || 0,
     'comp_comission': parseFloat(payload.incentive) || 0,
     'comp_number_of_mins': parseFloat(payload.tardines_minutes) || 0,
     'comp_number_of_days': parseFloat(payload.tardines_days) || 0,
     'comp_mins': parseFloat(payload.tardines_total_minutes) || 0,
     'comp_days': parseFloat(payload.tardines_total_days) || 0,
     'comp_sss': parseFloat(payload.sss) || 0,
     'comp_phic': parseFloat(payload.phic) || 0,
     'comp_hdmf': parseFloat(payload.hdmf) || 0,
     'comp_withholding': parseFloat(payload.withholding) || 0,
     'comp_sss_loan': parseFloat(payload.sss_loan) || 0,
     'comp_ar': parseFloat(payload.ar_others) || 0,
     'comp_retro': parseFloat(payload.retro_others) || 0,
     'comp_allowance': parseFloat(payload.allowance) || 0,
     'comp_pay_roll_dates': payload.pay_roll_dates,
     'comp_pay_roll_dates_begin': payload.pay_roll_dates_begin,
     'comp_pay_roll_dates_end': payload.pay_roll_dates_end
   };

     axiosClient.put(`/compensation/${pay_id}?${new URLSearchParams(data).toString()}`)
     .then((res)=>{
  
       setPayload({});
       document.getElementById('employee_payroll').close();
       getListOfPayroll();
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
 
 

   
const getListOfPayroll = () => {


   setLoadPage(true)
   axiosClient.get("/compensation")
   .then((data)=>{
     setLoadPage(false)

     const result = data.data.map(data => {
       
       const { 
         comp_night_diff,
         comp_allowance,
         comp_bi_monthly,
         comp_per_hour_day,
         comp_holiday_or_ot,
         comp_comission,
         comp_number_of_mins,
         comp_number_of_days,
         comp_sss,
         comp_phic,
         comp_hdmf,
         comp_withholding,
         comp_sss_loan,
         comp_ar,
         comp_retro,
       } = data;

   
         const total_days = calculateTotalDays(comp_per_hour_day, comp_number_of_days);
         const total_minutes =  calculateTotalMinutes(comp_per_hour_day, comp_number_of_mins);
         const taxable_income = calculateTaxableIncome(
            parseFloat(comp_bi_monthly),
            parseFloat(comp_night_diff),
            parseFloat(comp_holiday_or_ot) || 0,
            parseFloat(comp_comission) || 0,
            parseFloat(total_minutes) || 0,
            parseFloat(total_days) || 0,
            parseFloat(comp_sss) || 0,
            parseFloat(comp_phic) || 0,
            parseFloat(comp_hdmf) || 0
         ); 


         const totalNetPay = calculateNetpay(
         parseFloat(taxable_income), 
         parseFloat(comp_retro) || 0,
         parseFloat(comp_allowance) || 0, 
         parseFloat(comp_withholding) || 0, 
         parseFloat(comp_sss_loan) || 0, 
         parseFloat(comp_ar) || 0)

       
   
     
       return {
         ...data,
         taxable_income,
         totalNetPay,
       }
     })
     

     setCompensations(result)
     const totalAmount = result.reduce((accumulator, currentValue) => {
       accumulator.allTaxableIncome += currentValue.taxable_income;
       accumulator.allNetPay += currentValue.totalNetPay;
       return accumulator;
     }, { allTaxableIncome: 0, allNetPay: 0});
 
     setTotalDataAmount(totalAmount)
     
   })
 }

 const calculateTotalMinutes = (per_hour_day, tardines_minutes) => {
   return per_hour_day / 8 * tardines_minutes
 }
 
 const calculateTotalDays = (per_hour_day, tardines_days) => {
   return per_hour_day * tardines_days;
 }
 
 const calculateTaxableIncome = (
   bi_montly,
   night_diff,
   holiday_OT,
   incentive,
   total_minutes,
   total_days,
   sss,
   phic,
   hdmf
 ) => {
 
   return (bi_montly + night_diff + holiday_OT + incentive) - (total_minutes + total_days + sss + phic + hdmf);
 }
 
 const calculateNetpay = (
   totalAmount,
   retro_others = 0,
   allowance = 0,
   withholding,
   sss_loan = 0,
   ar_others = 0,
 ) => {
     return (parseFloat(totalAmount) + parseFloat(retro_others) + parseFloat(allowance)) - (parseFloat(withholding) + parseFloat(sss_loan) + parseFloat(ar_others))
 }
 

  return (
    <div className="ml-auto mb-6 lg:w-[75%] xl:w-[80%] 2xl:w-[85%]">
    <div className="bg-white shadow rounded-lg p-4 sm:p-6 xl:p-8 m-5">

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
                          <Link to="/paycheck/rates" role="tab" className="tab font-semibold uppercase">Rates</Link>
                          <Link to="/paycheck/payroll" role="tab" className="tab  font-semibold bg-[#3498db] text-white uppercase">Payroll</Link>
                          <Link to="/paycheck/payslip" role="tab" className="tab font-semibold  uppercase">Payslip</Link>
                  </div>

               <div className="mb-4 flex items-center justify-between max-md:flex-col-reverse max-md:gap-6">

              
               </div>
               <div className="flex flex-col mt-8">
               <div className="overflow-x-auto">
                      <table className="table">
                        <thead>
                          <tr>
                
                            <th className='tracking-wider'>NAME'S</th>
                            <th className='tracking-wider'>BANK ACCOUNT</th>
                            <th className='tracking-wider'>TAXABLE INCOME</th>
                            <th className='tracking-wider'>NET PAY</th>
                            <th className='tracking-wider'>PAYDATE</th>
                            <th className='tracking-wider'>ACTION</th>
                     
                          </tr>
                        </thead>
                        <tbody>
                        {loadPage ? (
                                            <tr>
                                            <td className="p-4 whitespace-nowrap text-sm font-normal text-gray-900" colSpan="4">
                                               <div className='ml-5 flex items-center gap-2 '>
                                                 <span className="loading loading-ring loading-lg text-primary"></span>
                                                  <span className="font-bold opacity-80">Loading for employee payroll...</span>
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
                                      <td className="font-semibold text-blue-500">{com.taxable_income && com.taxable_income.toLocaleString('en-PH', { style: 'currency', currency: 'PHP' })}</td>
                                      <td className="font-semibold text-red-500">{com.totalNetPay && com.totalNetPay.toLocaleString('en-PH', { style: 'currency', currency: 'PHP' }) || "0.00"}</td>
                                      <td className="font-semibold uppercase">{moment(com.comp_pay_roll_dates).format("LL") === "Invalid date" ? "No payroll date" : moment(com.comp_pay_roll_dates).format("LL")}</td>
                                      <td className="pt-6 px-2 whitespace-nowrap text-sm font-semibold text-gray-900 flex gap-2 max-md:hidden">
                                      <button type="button" 
                                      onClick={() =>{
                                          setLoad(true)
                                          setPay_id(com?.compe_id)
                                          axiosClient.get(`/compensation/${com.compe_id}`)
                                          .then((data)=>{
                                            setLoad(false)

                                            const datas = {
                                              'employee_name': data.data.data.employee_name,
                                              'position': data.data.data.position,
                                              'employee_role': data.data.data.employee_role,
                                              'employee_id':data.data.data.emp_id,
                                              'emp_id':data.data.data.employee_id,
                                              'amount': data.data.data.comp_bi_monthly,
                                              'bi_montly': data.data.data.comp_bi_monthly ,
                                              'per_hour_day': data.data.data.comp_per_hour_day,
                                              'night_diff': data.data.data.comp_night_diff ,
                                              'holiday_OT': data.data.data.comp_holiday_or_ot,
                                              'incentive': data.data.data.comp_comission,
                                              'tardines_minutes': data.data.data.comp_number_of_mins,
                                              'tardines_days': data.data.data.comp_number_of_days,
                                              'tardines_total_minutes': data.data.data.comp_mins,
                                              'tardines_total_days': data.data.data.comp_days,
                                              'sss': data.data.data.comp_sss,
                                              'phic': data.data.data.comp_phic,
                                              'hdmf': data.data.data.comp_hdmf,
                                              'withholding': data.data.data.comp_withholding,
                                              'sss_loan': data.data.data.comp_sss_loan,
                                              'ar_others': data.data.data.comp_ar,
                                              'retro_others': data.data.data.comp_retro,
                                              'allowance': data.data.data.comp_allowance,
                                              'account_number': data.data.data.rates_account_num,
                                              'bank_name': data.data.data.rates_acount_name,
                                              'pay_roll_dates': data.data.data.comp_pay_roll_dates,
                                              'pay_roll_dates_begin': data.data.data.comp_pay_roll_dates_begin,
                                              'pay_roll_dates_end': data.data.data.comp_pay_roll_dates_end
                                          };

                                         

                                            let totalMinutes = calculateTotalMinutes(datas.per_hour_day.toFixed(2), datas.tardines_minutes)
                                            let totalDays = calculateTotalDays(datas.per_hour_day.toFixed(2), datas.tardines_days)
                                            
                                            
                                            let taxable_income = calculateTaxableIncome(
                                              datas.bi_montly || 0,
                                              datas.night_diff || 0,
                                              datas.holiday_OT || 0,
                                              datas.incentive || 0,
                                              totalMinutes,
                                              totalDays,
                                              datas.sss || 0,
                                              datas.phic || 0,
                                              datas.hdmf || 0
                                            )

                                            let total_net_pay = calculateNetpay(
                                            taxable_income,
                                            !datas.retro_others ? 0 : datas.retro_others,
                                            !datas.allowance ? 0 : datas.allowance,
                                            datas.withholding,
                                            !datas.sss_loan ? 0 : datas.sss_loan,
                                            !datas.ar_others ? 0 : datas.ar_others
                                            )

                                            
                                            setPayload({
                                             ...payload,
                                             ...datas,
                                             per_hour_day: datas.per_hour_day.toFixed(2), 
                                             taxable_income,
                                             total_net_pay
                                           })
                                           

                                           document.getElementById('employee_payroll_details').showModal();

                         

                                          })
                                          .catch((err)=>{
                                             const {response} = err;
                                             if(response &&  response.status  === 422){
                                               console.log(response.data)
                                             }
                                          })
                                     
                                      }} 
                                      >
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
                                      
                                      {com?.payslip_id && (
                                        <>
                                            <span>/</span>
                                            <button onClick={()=> {
                                         setModalLoad(true);
                                       
                                         axiosClient.get(`/payslip/${com.compe_id}`)
                                         .then(pay => {
                                          document.getElementById('employee_slip_info').showModal();
                                          setModalLoad(false);
                                          set_Id(pay.data.pay_id)
                                        setPayload({
                                          ...payload,
                                          ...pay.data,
                                          earnings_per_day_hour:pay.data.comp_per_hour_day
                                        })
                                         })

                                      
                                    }}>
                                 
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6 text-[#0984e3]">
                                      <path fillRule="evenodd" d="M5.625 1.5c-1.036 0-1.875.84-1.875 1.875v17.25c0 1.035.84 1.875 1.875 1.875h12.75c1.035 0 1.875-.84 1.875-1.875V12.75A3.75 3.75 0 0 0 16.5 9h-1.875a1.875 1.875 0 0 1-1.875-1.875V5.25A3.75 3.75 0 0 0 9 1.5H5.625ZM7.5 15a.75.75 0 0 1 .75-.75h7.5a.75.75 0 0 1 0 1.5h-7.5A.75.75 0 0 1 7.5 15Zm.75 2.25a.75.75 0 0 0 0 1.5H12a.75.75 0 0 0 0-1.5H8.25Z" clipRule="evenodd" />
                                      <path d="M12.971 1.816A5.23 5.23 0 0 1 14.25 5.25v1.875c0 .207.168.375.375.375H16.5a5.23 5.23 0 0 1 3.434 1.279 9.768 9.768 0 0 0-6.963-6.963Z" />
                                    </svg>

                                    </button> 
                                        </>
                                      )}

                                      </td>
                                    </tr>
                            )
                          }): (
                           <tr>
                                       <td className="p-4 whitespace-nowrap text-sm font-normal text-gray-900" colSpan="4">
                                          <div className='ml-5'>
                                             <span className="font-bold opacity-80">No employee payroll found!</span>
                                          </div>
                                       </td>
                                    </tr>
                          )}

                        </tbody>
                        <tfoot>
                          <tr>
                            <th></th>
                            <th>TOTAL :</th>
                            <th className='text-blue-500'>{totalDataAmount.allTaxableIncome ? totalDataAmount.allTaxableIncome.toLocaleString('en-PH', { style: 'currency', currency: 'PHP' }) : "0.00"}</th>
                            <th className='text-red-500'>{totalDataAmount.allNetPay ? totalDataAmount.allNetPay.toLocaleString('en-PH', { style: 'currency', currency: 'PHP' }) : "0.00"}</th>
                            <th></th>
                          </tr>
                        </tfoot>
                        
                      </table>
                    </div>

           </div>
          
      </div>


      <dialog id="employee_payroll" className="modal">
        <div className="modal-box w-11/12 max-w-5xl">
        <div className='flex justify-between'>
        <div>
            <h3 className="font-bold text-lg mt-5">EMPLOYEE PAYROLL</h3>
            <span className="label-text opacity-70 text-[12px]">Input all the fields below</span>
        </div>
        <div className="avatar">
            <div className="w-24 rounded">
            <img srcSet={`${payload.employee_image || "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg"}`} alt="Avatar Tailwind CSS Component" /><img src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg" />
         </div>
         </div>
        </div>
        <div>
        </div>
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
                    <span className="label-text font-semibold">Payroll Dates:</span>
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
                    <td><input type="number" min="0" step="0.01" value={payload?.bi_montly || ""} onKeyUp={calculatePayRoll}  name='bi_montly' placeholder="0.00" className="font-semibold input input-bordered w-full max-w-xs" onChange={(e)=> setPayload({...payload, [e.target.name]:e.target.value})} /></td>
                    <td><input type="number" min="0" step="0.01"  value={payload?.per_hour_day || ""} onKeyUp={calculatePayRoll} name='per_hour_day' placeholder="0.00" className="font-semibold input input-bordered w-full max-w-xs" onChange={(e)=> setPayload({...payload, [e.target.name]:e.target.value})}  /></td>
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
                    <td><input type="number" onKeyUp={calculatePayRoll} min="0" step="0.01" value={payload?.night_diff || ""} name='night_diff' placeholder="0.00" className="input font-semibold input-bordered w-full max-w-xs" onChange={(e)=> setPayload({...payload, [e.target.name]:e.target.value})} /></td>
                    <td><input type="number" onKeyUp={calculatePayRoll} min="0" step="0.01" value={payload?.holiday_OT || ""} name='holiday_OT' placeholder="0.00" className="input font-semibold input-bordered w-full max-w-xs" onChange={(e)=> setPayload({...payload, [e.target.name]:e.target.value})} /></td>
                    <td><input type="number" onKeyUp={calculatePayRoll} min="0" step="0.01" value={payload?.incentive || ""} name='incentive' onChange={(e)=> setPayload({...payload, [e.target.name]:e.target.value})} placeholder="0.00" className="input font-semibold input-bordered w-full max-w-xs"  /></td>
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
                    <td><input type="number" min="0" step="0.01" value={payload?.tardines_minutes || ""} name='tardines_minutes' onChange={(e)=> setPayload({...payload, [e.target.name]:e.target.value})}  onKeyUp={calculatePayRoll} placeholder="0.00" className="font-semibold input input-bordered w-full max-w-xs" /></td>
                    <td><input type="number" min="0" step="0.01"  value={payload?.tardines_days || ""} name='tardines_days' onChange={(e)=> setPayload({...payload, [e.target.name]:e.target.value})}  onKeyUp={calculatePayRoll} placeholder="0.00" className="font-semibold input input-bordered w-full max-w-xs" /></td>
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
                    <td><input type="number" min="0" step="0.01" onKeyUp={calculatePayRoll}  value={payload?.sss || ""} name='sss' onChange={(e)=> setPayload({...payload, [e.target.name]:e.target.value})}  placeholder="0.00" className="font-semibold input input-bordered w-full max-w-xs" /></td>
                    <td><input type="number" min="0" step="0.01" onKeyUp={calculatePayRoll}  value={payload?.phic || ""} name='phic' onChange={(e)=> setPayload({...payload, [e.target.name]:e.target.value})}  placeholder="0.00" className="font-semibold input input-bordered w-full max-w-xs" /></td>
                    <td><input type="number" min="0" step="0.01" onKeyUp={calculatePayRoll}  value={payload?.hdmf || ""} name='hdmf' onChange={(e)=> setPayload({...payload, [e.target.name]:e.target.value})}  placeholder="0.00" className="font-semibold input input-bordered w-full max-w-xs" /></td>
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
              step="0.01" value={payload?.withholding || ""} name='withholding' placeholder="Type here" className="input input-bordered w-full font-semibold" onChange={(e)=> setPayload({...payload, [e.target.name]:e.target.value})} onKeyUp={calculatePayRoll}   />
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
                    <td><input type="text" onKeyUp={calculatePayRoll} min="0" step="0.01" value={payload?.sss_loan || ""} name="sss_loan" placeholder="0.00" className="input font-semibold input-bordered w-full max-w-xs" onChange={(e)=> setPayload({...payload, [e.target.name]:e.target.value})} /></td>
                    <td><input type="text" onKeyUp={calculatePayRoll} min="0" step="0.01" value={payload?.ar_others || ""} name="ar_others"  placeholder="0.00" className="input font-semibold input-bordered w-full max-w-xs" onChange={(e)=> setPayload({...payload, [e.target.name]:e.target.value})} /></td>
                    <td><input type="text" onKeyUp={calculatePayRoll} min="0" step="0.01" value={payload?.retro_others || ""} name="retro_others"  placeholder="0.00" className="input font-semibold input-bordered w-full max-w-xs" onChange={(e)=> setPayload({...payload, [e.target.name]:e.target.value})} /></td>
                    <td><input type="text" onKeyUp={calculatePayRoll} min="0" step="0.01" value={payload?.allowance || ""} name="allowance"  placeholder="0.00" className="input font-semibold input-bordered w-full max-w-xs" onChange={(e)=> setPayload({...payload, [e.target.name]:e.target.value})} /></td>
                  </tr>
                 
                </tbody>
              </table>
            </div>
            <div className='flex justify-between mb-5'>
              <label className="input  flex items-center gap-2 ">
                  <span className='font-bold opacity-70'>Taxable Income:</span> 
                  <input  min="0" step="0.01" value={payload.taxable_income ? payload.taxable_income.toFixed(2) : "0.00"} type="number" disabled className="grow font-semibold text-blue-500" placeholder=""  />
              </label>
            <label className="input  flex items-center gap-2">
                  <span className='font-bold opacity-70'>Net Pay:</span> 
                  <input type="number" value={payload.total_net_pay ? payload.total_net_pay.toFixed(2): "0.00"} disabled className="grow font-semibold text-red-500" placeholder=""  />
              </label>
            </div>

            <p  className="text-red text-xs italic text-red-500 ml-2 error-message"></p>
            <div className="modal-action">
                <button type='submit' className="btn bg-[#0984e3] hover:bg-[#0984e3] text-white w-[40%]">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-5">
                  <path d="M21.731 2.269a2.625 2.625 0 0 0-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 0 0 0-3.712ZM19.513 8.199l-3.712-3.712-8.4 8.4a5.25 5.25 0 0 0-1.32 2.214l-.8 2.685a.75.75 0 0 0 .933.933l2.685-.8a5.25 5.25 0 0 0 2.214-1.32l8.4-8.4Z" />
                  <path d="M5.25 5.25a3 3 0 0 0-3 3v10.5a3 3 0 0 0 3 3h10.5a3 3 0 0 0 3-3V13.5a.75.75 0 0 0-1.5 0v5.25a1.5 1.5 0 0 1-1.5 1.5H5.25a1.5 1.5 0 0 1-1.5-1.5V8.25a1.5 1.5 0 0 1 1.5-1.5h5.25a.75.75 0 0 0 0-1.5H5.25Z" />
                  </svg>


                   UPDATE PAYROLL DETAILS
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

      <dialog id="employee_payroll_details" className="modal">
        <div className="modal-box w-11/12 max-w-5xl">
        <h3 className="font-bold text-lg mt-5">EMPLOYEE PAYROLL DETAILS</h3>
        <span className="label-text opacity-70 text-[12px] ">Below are the details of the payroll for the employee.</span>
         
          <form  method="dialog" className='mt-2' autoComplete="off">
           <div className='flex w-full  gap-10'>
              <div className='flex justify-center items-center flex-col w-full'>
                <label className=" w-full  flex items-center gap-2 ">
                    <div className="label ">
                      <span className="label-text font-semibold opacity-70 text-sm">Employee names:</span>
                  </div>
                  <span className='font-bold opacity-70 uppercase text-blue-500 text-[13px]'>{payload?.employee_name} {payload?.position && `/ ${payload?.position}`}</span>             
                </label>

                <label className=" w-full  flex items-center gap-2">
                    <div className="label">
                      <span className="label-text font-semibold opacity-70">Employee ID:</span>
                  </div>
                  <span className='font-bold opacity-70 text-red-500 text-[13px]'>{payload?.employee_id}</span>             
                </label>
                <label className=" w-full flex items-center gap-2">
                  <div className="label">
                    <span className="label-text font-semibold opacity-70">Bank Details:</span>
                  </div>
                  <span className='font-bold opacity-70 ml-1 text-blue-500 text-[13px]'>{payload?.bank_name} - {payload?.account_number}</span> 
                </label>
              </div>
              <div className='flex flex-col items-center w-full'>
              <label className="flex items-center w-full">
                  <div className="label">
                    <span className="label-text font-semibold opacity-70">Paydate:</span>
                  </div>
                  <span className='font-bold opacity-70 ml-1 text-red-500'>{payload?.pay_roll_dates && moment(payload?.pay_roll_dates).format("LL") }</span> 
                </label>
                <label className="flex items-center w-full">
                  <div className="label">
                    <span className="label-text font-semibold opacity-70">Payroll Date Begin:</span>
                  </div>
                  <span className='font-bold opacity-70 ml-1 text-red-500'>{payload?.pay_roll_dates_begin && moment(payload?.pay_roll_dates_begin).format("LL") }</span> 
                </label>
                <label className="flex items-center w-full">
                  <div className="label">
                    <span className="label-text font-semibold opacity-70">Payroll Date End:</span>
                  </div>
                  <span className='font-bold opacity-70 ml-1 text-red-500'>{payload?.pay_roll_dates_end && moment(payload?.pay_roll_dates_end).format("LL") }</span> 
                </label>

           

                
              </div>
           </div>
           
           <div className="divider"></div> 
           <div className='flex w-full flex-col gap-4 mb-5'> 
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
                    <th>Per Hour/day</th>
                    <th>Amount</th>
                  </tr>
                </thead>
                <tbody>
             
                  <tr>
                    <td>
                      <span className='opacity-70 font-semibold'>{(payload?.bi_montly )?.toLocaleString('en-PH', { style: 'currency', currency: 'PHP' }) || "0.00"}</span>    
                    </td>
                    <td>
                      <span className='opacity-70 font-semibold'>{(payload?.per_hour_day )?.toLocaleString('en-PH', { style: 'currency', currency: 'PHP' }) || "0.00"}</span>  
                      </td>
                    <td>
                       <span className='opacity-70 font-semibold'>{(payload?.amount )?.toLocaleString('en-PH', { style: 'currency', currency: 'PHP' }) || "0.00"}</span>    
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="overflow-x-auto mb-3">
            <div className='w-full'>
            <div className="flex-shrink-0 flex items-center gap-3 ml-2 mb-3" >
              <span className='font-bold opacity-70 text-red-500'>DEDUCTIONS : </span>             
            </div>
            <span className=' text-sm opacity-60 ml-2'>( Absent/Tardiness )</span>     
            <div className="overflow-x-auto mb-4">
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
                    <td>
                      <span className='opacity-70 font-semibold'>{payload?.tardines_minutes || "0.00"}</span>
                    </td>
                    <td>
                      <span className='opacity-70 font-semibold'>{payload?.tardines_days || "0.00"}</span>
                    </td>
                    <td>
                      <span className='opacity-70 font-semibold'>{payload?.tardines_total_minutes?.toLocaleString('en-PH', { style: 'currency', currency: 'PHP' })}</span>
                    </td>
                    <td>
                     <span className='opacity-70 font-semibold'>{payload?.tardines_total_days?.toLocaleString('en-PH', { style: 'currency', currency: 'PHP' })}</span>
                    </td>
                  </tr>
                 
                </tbody>
              </table>
            </div>
            <span className=' text-sm opacity-60 ml-2 '>( Government Contribution )</span>     
            <div className="overflow-x-auto ">
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
                    <td>
                    <span className='opacity-70 font-semibold'>{payload?.sss?.toLocaleString('en-PH', { style: 'currency', currency: 'PHP' }) || "0.00"}</span>
                      </td>
                    <td>
                    <span className='opacity-70 font-semibold'>{payload?.phic?.toLocaleString('en-PH', { style: 'currency', currency: 'PHP' }) || "0.00"}</span>
                      </td>
                    <td>
                    <span className='opacity-70 font-semibold'>{payload?.hdmf?.toLocaleString('en-PH', { style: 'currency', currency: 'PHP' }) || "0.00"}</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className='flex justify-around items-center mb-2 mt-7 '>
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

                  <tr>
                    <td>
                      <span className='opacity-70 font-semibold'>{(payload?.sss_loan )?.toLocaleString('en-PH', { style: 'currency', currency: 'PHP' }) || "0.00"}</span>    
                    </td>
                    <td>
                      <span className='opacity-70 font-semibold'>{(payload?.ar_others )?.toLocaleString('en-PH', { style: 'currency', currency: 'PHP' }) || "0.00"}</span>  
                      </td>
                    <td>
                       <span className='opacity-70 font-semibold'>{(payload?.retro_others )?.toLocaleString('en-PH', { style: 'currency', currency: 'PHP' }) || "0.00"}</span>    
                    </td>
                    <td>
                       <span className='opacity-70 font-semibold'>{(payload?.allowance )?.toLocaleString('en-PH', { style: 'currency', currency: 'PHP' }) || "0.00"}</span>    
                    </td>

                  </tr>
                 
                 
                </tbody>
              </table>
            </div>

            <div className='flex justify-between mt-5'>
            <label className="input  flex items-center gap-2 ">
                  <span className='font-bold opacity-70'>Withholding Tax:</span> 
                  <span className='opacity-70 font-semibold text-blue-700'>{payload?.withholding?.toLocaleString('en-PH', { style: 'currency', currency: 'PHP' })}</span>
              </label>
              <label className="input  flex items-center gap-2 ">
                  <span className='font-bold opacity-70'>Taxable Income:</span> 
                  <span className='opacity-70 font-semibold text-blue-700'>{payload?.taxable_income?.toLocaleString('en-PH', { style: 'currency', currency: 'PHP' })}</span>
              </label>
            <label className="input  flex items-center gap-2">
                  <span className='font-bold opacity-70'>Net Pay:</span> 
                  <span className='opacity-70 font-semibold text-red-700'>{payload?.total_net_pay?.toLocaleString('en-PH', { style: 'currency', currency: 'PHP' })}</span>
              </label>
            </div>
            </div>
            </div>

            </div>
           
           </div>
          
            <div className="modal-action mt-8">
              {!compDetails?.payslip_id && (
                <button type='button' className="btn btn-success
                 text-white w-[25%] flex"
                onClick={()=>{
                  const data = {
                    earnings_per_day_hour: parseFloat(payload.per_hour_day),
                    earnings_per_month: parseFloat(payload.bi_montly),
                    earnings_allowance: parseFloat(payload.allowance),
                    earnings_night_diff: parseFloat(payload.night_diff),
                    earnings_holiday: parseFloat(payload.holiday_OT),
                    earnings_retro: parseFloat(payload.retro_others),
                    earnings_commission: parseFloat(payload.incentive),
                    deductions_holding_tax: parseFloat(payload.withholding),
                    deductions_sss_contribution: parseFloat(payload.sss),
                    deductions_phic_contribution: parseFloat(payload.phic),
                    deductions_sss_loan: parseFloat(payload.sss_loan),
                    deductions_hdmf_contribution:parseFloat(payload.hdmf),
                    pay_period_begin: payload.pay_roll_dates_begin,
                    pay_period_end: payload.pay_roll_dates_end
                }


               

                  const totalEarn = 
                  data.earnings_per_month + 
                  data.earnings_allowance +
                  data.earnings_night_diff + 
                  data.earnings_holiday + 
                  data.earnings_retro + 
                  data.earnings_commission; 

                  const totalDeduc = 
                  data.deductions_holding_tax + 
                  data.deductions_sss_contribution + 
                  data.deductions_phic_contribution + 
                  data.deductions_sss_loan + 
                  data.deductions_hdmf_contribution;

                  const totalNetPay = parseFloat(totalEarn) - parseFloat(totalDeduc);
                
                 setPayload({
                  ...payload,
                  ...data,
                  earnings_total: parseFloat(totalEarn), 
                  deductions_total: parseFloat(totalDeduc),
                  payslip_netPay: parseFloat(totalNetPay)
                 })
          
                  document.getElementById('employee_payslip').showModal();
                  document.getElementById('employee_payroll_details').close();
                 
                }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-5">
                    <path fillRule="evenodd" d="M5.625 1.5c-1.036 0-1.875.84-1.875 1.875v17.25c0 1.035.84 1.875 1.875 1.875h12.75c1.035 0 1.875-.84 1.875-1.875V12.75A3.75 3.75 0 0 0 16.5 9h-1.875a1.875 1.875 0 0 1-1.875-1.875V5.25A3.75 3.75 0 0 0 9 1.5H5.625ZM7.5 15a.75.75 0 0 1 .75-.75h7.5a.75.75 0 0 1 0 1.5h-7.5A.75.75 0 0 1 7.5 15Zm.75 2.25a.75.75 0 0 0 0 1.5H12a.75.75 0 0 0 0-1.5H8.25Z" clipRule="evenodd" />
                    <path d="M12.971 1.816A5.23 5.23 0 0 1 14.25 5.25v1.875c0 .207.168.375.375.375H16.5a5.23 5.23 0 0 1 3.434 1.279 9.768 9.768 0 0 0-6.963-6.963Z" />
                  </svg>
                   ISSUED PAYSLIP
                   </button>
              )}


                  <button className="btn bg-[#0984e3] hover:bg-[#0984e3] text-white" 
                    onClick={()=>{
                     document.getElementById('employee_payroll').showModal();
                     document.getElementById('employee_payroll_details').close();
                    }}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-5">
                  <path d="M21.731 2.269a2.625 2.625 0 0 0-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 0 0 0-3.712ZM19.513 8.199l-3.712-3.712-8.4 8.4a5.25 5.25 0 0 0-1.32 2.214l-.8 2.685a.75.75 0 0 0 .933.933l2.685-.8a5.25 5.25 0 0 0 2.214-1.32l8.4-8.4Z" />
                  <path d="M5.25 5.25a3 3 0 0 0-3 3v10.5a3 3 0 0 0 3 3h10.5a3 3 0 0 0 3-3V13.5a.75.75 0 0 0-1.5 0v5.25a1.5 1.5 0 0 1-1.5 1.5H5.25a1.5 1.5 0 0 1-1.5-1.5V8.25a1.5 1.5 0 0 1 1.5-1.5h5.25a.75.75 0 0 0 0-1.5H5.25Z" />
                  </svg>
                   EDIT PAYROLL DETAILS
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


      <dialog id="employee_payslip" className="modal">
      <div className="modal-box w-11/12 max-w-5xl mb-5">
      <div className='flex justify-between  items-center'>
         <div className='w-full mb-2'>
          <h3 className="font-bold text-lg ">EMPLOYEE PAYSLIP</h3>
          <span  className="label-text opacity-70 text-[12px]">Input all the fields below.</span>
         </div>
         <div className='flex w-full gap-2 justify-end'>
                <button type='button' className="btn btn-success text-white w-[50%]" onClick={handleSubmitPayslip}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-5">
                  <path fillRule="evenodd" d="M5.625 1.5H9a3.75 3.75 0 0 1 3.75 3.75v1.875c0 1.036.84 1.875 1.875 1.875H16.5a3.75 3.75 0 0 1 3.75 3.75v7.875c0 1.035-.84 1.875-1.875 1.875H5.625a1.875 1.875 0 0 1-1.875-1.875V3.375c0-1.036.84-1.875 1.875-1.875Zm6.905 9.97a.75.75 0 0 0-1.06 0l-3 3a.75.75 0 1 0 1.06 1.06l1.72-1.72V18a.75.75 0 0 0 1.5 0v-4.19l1.72 1.72a.75.75 0 1 0 1.06-1.06l-3-3Z" clipRule="evenodd" />
                  <path d="M14.25 5.25a5.23 5.23 0 0 0-1.279-3.434 9.768 9.768 0 0 1 6.963 6.963A5.23 5.23 0 0 0 16.5 7.5h-1.875a.375.375 0 0 1-.375-.375V5.25Z" />
                </svg>
                   SUBMIT PAYSLIP
                   </button>
                <button type='button' className="btn shadow btn-error text-white" onClick={()=>{
                   setPayload({});
                   document.getElementById('employee_payslip').close();
                }}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
            </div>
      </div>
        <form  method="dialog" autoComplete="off">
           <div className='flex w-full gap-4'>
              <div className='flex justify-center items-center flex-col w-full mb-2'>
                <label className="form-control w-full ">
                    <div className="label">
                      <span className="label-text font-semibold opacity-70">Employee name:</span>
                  </div>
                  <span className='font-bold opacity-70 uppercase text-blue-500'>{payload?.employee_name} {payload?.position && `/ ${payload?.position}`}</span>           
                </label>

                <label className="form-control w-full ">
                    <div className="label">
                      <span className="label-text font-semibold opacity-70">Employee ID:</span>
                  </div>
                  <span className='font-bold opacity-70 uppercase text-red-500'>{payload?.employee_id}</span>            
                </label>
                
              </div>
              <div className='w-full'>
              <label className="form-control w-full ">
                  <div className="label">
                    <span className="label-text font-semibold opacity-70">Pay Period Begin Date:</span>
                  </div>
                  <input type="date" value={payload.pay_period_begin || ""} placeholder="Input here..." className="input font-semibold input-bordered w-full input-sm" onChange={(e)=> {
                    setPayload({...payload, pay_period_begin: e.target.value})
                  }} />
                </label>
                <p  className="text-red text-xs italic mt-2 text-red-500 ml-2 error-message">{error && error['pay_period_begin']}</p>
                <label className="form-control w-full ">
                  <div className="label">
                    <span className="label-text font-semibold opacity-70">Pay Period End Date:</span>
                  </div>
                  <input type="date" value={payload.pay_period_end || ""} placeholder="Input here..." className="input font-semibold input-bordered w-full input-sm" onChange={(e)=> {
                    setPayload({...payload, pay_period_end: e.target.value})
                  }} />
                </label>
                <p  className="text-red text-xs italic mt-2 text-red-500 ml-2 error-message">{error && error['pay_period_end']}</p>
              </div>
           </div>
           <div className="divider"></div> 
           <div className='flex w-full gap-4'>
            <div className='w-full'>
            <p className="font-bold text-center text-md text-blue-700 opacity-70">EARNINGS</p>
            <div className='my-2 flex flex-col gap-3'>
              <label className="input input-bordered flex items-center gap-2 font-semibold">
                Per Month:
                <input type="number" min="0" step="0.01" value={payload?.earnings_per_month || ""} name='earnings_per_month' className="grow font-semibold" placeholder="0.00" onChange={(e)=> setPayload({...payload, [e.target.name]:e.target.value})}  onKeyUp={calculatePaySlip}  />
              </label>
              <label className="input input-bordered flex items-center gap-2 font-semibold">
                Per Day/Hour:
                <input type="number"  min="0" step="0.01" value={payload?.earnings_per_day_hour || ""} name='earnings_per_day_hour' className="grow font-semibold" placeholder="0.00" onChange={(e)=> setPayload({...payload, [e.target.name]:e.target.value})} onKeyUp={calculatePaySlip}  />
              </label>
              <label className="input input-bordered flex items-center gap-2 font-semibold">
                Allowance:
                <input type="number"  min="0" step="0.01" value={payload?.earnings_allowance || ""} name='earnings_allowance' className="grow font-semibold" placeholder="0.00" onChange={(e)=> setPayload({...payload, [e.target.name]:e.target.value})}  onKeyUp={calculatePaySlip} />
              </label>
              <label className="input input-bordered flex items-center gap-2  font-semibold">
                Night Diff:
                <input type="number"  min="0" step="0.01" value={payload?.earnings_night_diff || ""} name='earnings_night_diff' className="grow font-semibold" placeholder="0.00" onChange={(e)=> setPayload({...payload, [e.target.name]:e.target.value})} onKeyUp={calculatePaySlip} />
              </label>
              <label className="input input-bordered flex items-center gap-2 font-semibold">
                Holiday:
                <input type="number"  min="0" step="0.01" value={payload?.earnings_holiday || ""} name='earnings_holiday' className="grow font-semibold" placeholder="0.00" onChange={(e)=> setPayload({...payload, [e.target.name]:e.target.value})} onKeyUp={calculatePaySlip} />
              </label>
              <label className="input input-bordered flex items-center gap-2 font-semibold">
                Retro/Others:
                <input type="number"  min="0" step="0.01" value={payload?.earnings_retro || ""} name='earnings_retro' className="grow font-semibold" placeholder="0.00" onChange={(e)=> setPayload({...payload, [e.target.name]:e.target.value})} onKeyUp={calculatePaySlip} />
              </label>
              <label className="input input-bordered flex items-center gap-2 font-semibold">
               Bonus/Commission:
                <input type="number"  min="0" step="0.01" value={payload?.earnings_commission || ""} name='earnings_commission' className="grow font-semibold" placeholder="0.00" onChange={(e)=> setPayload({...payload, [e.target.name]:e.target.value})} onKeyUp={calculatePaySlip} />
              </label>
              <label className="input  flex items-center gap-2">
              </label>
              <label className="input  flex items-center gap-2">
              </label>
              <label className="input  flex items-center gap-2">
              </label>
              <label className="input flex items-center gap-2">
                 <span className='font-bold'>TOTAL EARNINGS:</span> 
                <input type="hidden" value={payload.earnings_total ? payload.earnings_total.toFixed(2) : "0.00"} disabled className="grow font-semibold text-blue-500" placeholder="" onChange={(e)=> setPayload({...payload, earnings_total:e.target.value})}  />
                <span className='text-blue-500 font-semibold'>{(payload?.earnings_total )?.toLocaleString('en-PH', { style: 'currency', currency: 'PHP' }) || "0.00"}</span>  
              </label>
            </div>
             
            </div>
            <div className='w-full'>
            <p className="font-bold text-center text-md text-red-700 opacity-70">DEDUCTIONS</p>
            <div className='my-2 flex flex-col gap-3'>
              <label className="input input-bordered flex items-center gap-2 font-semibold">
               LWOP/Lates/Undertime:
                <input type="number" min="0" step="0.01" value={payload?.deductions_lwop || ""} name='deductions_lwop' className="grow font-semibold" placeholder="0.00" onChange={(e)=> setPayload({...payload, [e.target.name]:e.target.value})} onKeyUp={calculatePaySlip} />
              </label>
              <label className="input input-bordered flex items-center gap-2 font-semibold">
                Withholding Tax:
                <input type="number"  min="0" step="0.01" value={payload?.deductions_holding_tax || ""} name='a' className="grow font-semibold" placeholder="0.00" onChange={(e)=> setPayload({...payload, [e.target.name]:e.target.value})} onKeyUp={calculatePaySlip}  />
              </label>
              <label className="input input-bordered flex items-center gap-2 font-semibold">
                SSS Contribution:
                <input type="number"  min="0" step="0.01" value={payload?.deductions_sss_contribution || ""} name='deductions_sss_contribution' className="grow font-semibold" placeholder="0.00" onChange={(e)=> setPayload({...payload, [e.target.name]:e.target.value})} onKeyUp={calculatePaySlip}  />
              </label>
              <label className="input input-bordered flex items-center gap-2 font-semibold">
               PHIC Contribution:
                <input type="number"  min="0" step="0.01" value={payload?.deductions_phic_contribution || ""} name='deductions_phic_contribution' className="grow font-semibold" placeholder="0.00" onChange={(e)=> setPayload({...payload, [e.target.name]:e.target.value})} onKeyUp={calculatePaySlip}  />
              </label>
              <label className="input input-bordered flex items-center gap-2 font-semibold">
                HDMF Contribution:
                <input type="number"  min="0" step="0.01" value={payload?.deductions_hdmf_contribution || ""} name='deductions_hdmf_contribution' className="grow font-semibold" placeholder="0.00" onChange={(e)=> setPayload({...payload, [e.target.name]:e.target.value})} onKeyUp={calculatePaySlip}  />
              </label>
              <label className="input input-bordered flex items-center gap-2 font-semibold">
               HMO:
                <input type="number"  min="0" step="0.01" value={payload?.deductions_hmo || ""} name='deductions_hmo' className="grow font-semibold" placeholder="0.00" onChange={(e)=> setPayload({...payload, [e.target.name]:e.target.value})} onKeyUp={calculatePaySlip}  />
              </label>
              <label className="input input-bordered flex items-center gap-2 font-semibold">
                SSS Loan:
                <input type="number"  min="0" step="0.01" value={payload?.deductions_sss_loan || ""} name='deductions_sss_loan' className="grow font-semibold" placeholder="0.00" onChange={(e)=> setPayload({...payload, [e.target.name]:e.target.value})} onKeyUp={calculatePaySlip}  />
              </label>
              <label className="input input-bordered flex items-center gap-2 font-semibold">
                HDMF Loan:
                <input type="number"  min="0" step="0.01" value={payload?.deductions_hmo_loan || ""} name='deductions_hmo_loan' className="grow font-semibold" placeholder="0.00" onChange={(e)=> setPayload({...payload, [e.target.name]:e.target.value})} onKeyUp={calculatePaySlip}  />
              </label>
              <label className="input input-bordered flex items-center gap-2 font-semibold">
                Employee Loan:
                <input type="number"  min="0" step="0.01" value={payload?.deductions_employee_loan || ""} name='deductions_employee_loan' className="grow font-semibold" placeholder="0.00" onChange={(e)=> setPayload({...payload, [e.target.name]:e.target.value})} onKeyUp={calculatePaySlip}  />
              </label>
              <label className="input input-bordered flex items-center gap-2 font-semibold">
                Others:
                <input type="number"  min="0" step="0.01" value={payload?.deductions_others || ""} name='deductions_others' className="grow font-semibold" placeholder="0.00" onChange={(e)=> setPayload({...payload, [e.target.name]:e.target.value})} onKeyUp={calculatePaySlip}  />
              </label>
              <label className="input  flex items-center gap-2">
                <span className='font-bold '>TOTAL DEDUCTION:</span> 
                <input type="hidden" disabled className="grow font-semibold text-blue-500" placeholder="0.00" value={payload.deductions_total ? payload.deductions_total.toFixed(2) : "0.00"} onChange={(e)=> setPayload({...payload, deductions_total:e.target.value})} />
                <span className='text-red-500 font-semibold'>{(payload?.deductions_total )?.toLocaleString('en-PH', { style: 'currency', currency: 'PHP' }) || "0.00"}</span>  
              </label>
            </div>
            </div>
           </div>
           <div className="divider"></div> 
           <label className="input  flex items-center gap-2">
                <span className='font-bold'>NET SALARY:</span> 
                <span className='text-red-500 font-semibold'>{(payload?.payslip_netPay )?.toLocaleString('en-PH', { style: 'currency', currency: 'PHP' }) || "0.00"}</span>   
              </label> 
         
            <p  className="text-red text-xs italic text-red-500 ml-2 error-message"></p>
         
            </form>
      </div>
    </dialog> 

    <dialog id="employee_payslip_details" className="modal">
   
   <div className="modal-box w-11/12 max-w-5xl">
   {modalLoad ? (
     <div className="flex flex-col gap-4 w-full">
     <div className="skeleton h-32 w-full"></div>
     <div className="skeleton h-4 w-80"></div>
     <div className="skeleton h-4 w-full"></div>
     <div className="skeleton h-4 w-full"></div>
   </div>
   ): (
     <>
    <h3 className="font-bold text-lg mt-5">EMPLOYEE PAYSLIP</h3>
    <span className="label-text opacity-70 text-[12px]">Input all the fields below</span>
     <form  method="dialog" autoComplete="off" onSubmit={handleSubmitPayslip}>
        <div className='flex w-full gap-4'>
           <div className='flex justify-center items-center flex-col w-full mb-2'>
             <label className="form-control w-full ">
                 <div className="label">
                   <span className="label-text font-semibold opacity-70">Employee name:</span>
               </div>
               <span className='font-bold opacity-70 uppercase text-blue-500'>{payload?.employee_name} {payload?.position && `/ ${payload?.position}`}</span>             
             </label>

             <label className="form-control w-full ">
                 <div className="label">
                   <span className="label-text font-semibold opacity-70">Employee ID:</span>
               </div>
             <input type="text" placeholder="Employee ID" value={payload?.employee_id} disabled className="input font-bold input-bordered w-full " />  
             </label>
             
           </div>
           <div className='w-full'>
           <label className="form-control w-full ">
               <div className="label">
                 <span className="label-text font-semibold opacity-70">Pay Period Begin Date:</span>
               </div>
               <input type="date" value={payload.pay_period_begin || ""} placeholder="Input here..." className="input input-bordered w-full font-semibold" onChange={(e)=> {
                 setPayload({...payload, pay_period_begin: e.target.value})
               }} />
             </label>
             <label className="form-control w-full ">
               <div className="label">
                 <span className="label-text font-semibold opacity-70">Pay Period End Date:</span>
               </div>
               <input type="date" value={payload.pay_period_end || ""} placeholder="Input here..." className="input input-bordered w-full font-semibold" onChange={(e)=> {
                 setPayload({...payload, pay_period_end: e.target.value})
               }} />
             </label>
             <p  className="text-red text-xs italic mt-2 text-red-500 ml-2 error-message">{error && error['pay_period_end'] && "Payslip end date field must be a date after pay period begin." }</p>
           </div>
        </div>
        <div className="divider"></div> 
        <div className='flex w-full gap-4'>
         <div className='w-full'>
         <p className="font-bold text-center text-md text-blue-500">EARNINGS</p>
         <div className='my-2 flex flex-col gap-3 '>
           <label className="input input-bordered  flex items-center gap-2 font-semibold ">
             Per Month:
             <input type="number" min="0" step="0.01" value={payload?.earnings_per_month || ""}  name='earnings_per_month' className="grow  font-semibold" placeholder="0.00" onChange={(e)=> setPayload({...payload, [e.target.name]:e.target.value})}  onKeyUp={calculatePaySlip}  />
           </label>
           <label className="input input-bordered  flex items-center gap-2 font-semibold">
             Per Day/Hour:
             <input type="number"  min="0" step="0.01" value={payload?.earnings_per_day_hour || ""}  name='earnings_per_day_hour' className="grow  font-semibold" placeholder="0.00" onChange={(e)=> setPayload({...payload, [e.target.name]:e.target.value})} onKeyUp={calculatePaySlip}  />
           </label>
           <label className="input input-bordered  flex items-center gap-2 font-semibold">
             Allowance:
             <input type="number"  min="0" step="0.01" value={payload?.earnings_allowance || ""}  name='earnings_allowance' className="grow  font-semibold" placeholder="0.00" onChange={(e)=> setPayload({...payload, [e.target.name]:e.target.value})}  onKeyUp={calculatePaySlip} />
           </label>
           <label className="input input-bordered  flex items-center gap-2 font-semibold">
             Night Diff:
             <input type="number"  min="0" step="0.01" value={payload?.earnings_night_diff || ""}  name='earnings_night_diff' className="grow  font-semibold" placeholder="0.00" onChange={(e)=> setPayload({...payload, [e.target.name]:e.target.value})} onKeyUp={calculatePaySlip} />
           </label>
           <label className="input input-bordered  flex items-center gap-2 font-semibold">
             Holiday:
             <input type="number"  min="0" step="0.01" value={payload?.earnings_holiday || ""}  name='earnings_holiday' className="grow  font-semibold" placeholder="0.00" onChange={(e)=> setPayload({...payload, [e.target.name]:e.target.value})} onKeyUp={calculatePaySlip} />
           </label>
           <label className="input input-bordered flex items-center gap-2 font-semibold">
             Retro/Others:
             <input type="number"  min="0" step="0.01" value={payload?.earnings_retro || ""}  name='earnings_retro' className="grow  font-semibold" placeholder="0.00" onChange={(e)=> setPayload({...payload, [e.target.name]:e.target.value})} onKeyUp={calculatePaySlip} />
           </label>
           <label className="input input-bordered flex items-center gap-2 font-semibold">
            Bonus/Commission:
             <input type="number"  min="0" step="0.01" value={payload?.earnings_commission || ""}  name='earnings_commission' className="grow  font-semibold" placeholder="0.00" onChange={(e)=> setPayload({...payload, [e.target.name]:e.target.value})} onKeyUp={calculatePaySlip} />
           </label>
           <label className="input  flex items-center gap-2">
           </label>
           <label className="input  flex items-center gap-2">
           </label>
           <label className="input  flex items-center gap-2">
           </label>
           <label className="input flex items-center gap-2">
              <span className='font-bold'>TOTAL EARNINGS:</span> 
             <input type="hidden" value={payload.earnings_total ? payload.earnings_total.toFixed(2) : "0.00"} disabled  className="grow font-semibold text-blue-500" placeholder="" onChange={(e)=> setPayload({...payload, earnings_total:e.target.value})}  />
             <span className='text-blue-500 font-semibold'>{(payload?.earnings_total )?.toLocaleString('en-PH', { style: 'currency', currency: 'PHP' }) || "0.00"}</span> 
           </label>
         </div>
          
         </div>
         <div className='w-full'>
         <p className="font-bold text-center text-md text-red-500">DEDUCTIONS</p>
         <div className='my-2 flex flex-col gap-3'>
           <label className="input input-bordered  flex items-center gap-2 font-semibold">
            LWOP/Lates/Undertime:
             <input type="number" min="0" step="0.01" value={payload?.deductions_lwop || ""} name='deductions_lwop' className="grow font-semibold" placeholder="0.00" onChange={(e)=> setPayload({...payload, [e.target.name]:e.target.value})} onKeyUp={calculatePaySlip} />
           </label>
           <label className="input input-bordered flex items-center gap-2 font-semibold">
             Withholding Tax:
             <input type="number"  min="0" step="0.01" value={payload?.deductions_holding_tax || ""} name='deductions_holding_tax' className="grow  font-semibold"  placeholder="0.00" onChange={(e)=> setPayload({...payload, [e.target.name]:e.target.value})} onKeyUp={calculatePaySlip}  />
           </label>
           <label className="input input-bordered flex items-center gap-2 font-semibold">
             SSS Contribution:
             <input type="number"  min="0" step="0.01" value={payload?.deductions_sss_contribution || ""} name='deductions_sss_contribution' className="grow  font-semibold"  placeholder="0.00" onChange={(e)=> setPayload({...payload, [e.target.name]:e.target.value})} onKeyUp={calculatePaySlip}  />
           </label>
           <label className="input input-bordered flex items-center gap-2 font-semibold">
            PHIC Contribution:
             <input type="number"  min="0" step="0.01" value={payload?.deductions_phic_contribution || ""} name='deductions_phic_contribution' className="grow  font-semibold"  placeholder="0.00" onChange={(e)=> setPayload({...payload, [e.target.name]:e.target.value})} onKeyUp={calculatePaySlip}  />
           </label>
           <label className="input input-bordered flex items-center gap-2 font-semibold">
             HDMF Contribution: 
             <input type="number"  min="0" step="0.01" value={payload?.deductions_hdmf_contribution || ""} name='deductions_hdmf_contribution' className="grow  font-semibold"  placeholder="0.00" onChange={(e)=> setPayload({...payload, [e.target.name]:e.target.value})} onKeyUp={calculatePaySlip}  />
           </label>
           <label className="input input-bordered  flex items-center gap-2 font-semibold">
            HMO:
             <input type="number"  min="0" step="0.01" value={payload?.deductions_hmo || ""} name='deductions_hmo' className="grow font-semibold" placeholder="0.00" onChange={(e)=> setPayload({...payload, [e.target.name]:e.target.value})} onKeyUp={calculatePaySlip}  />
           </label>
           <label className="input input-bordered flex items-center gap-2 font-semibold">
             SSS Loan:
             <input type="number"  min="0" step="0.01" value={payload?.deductions_sss_loan || ""} name='deductions_sss_loan' className="grow  font-semibold"  placeholder="0.00" onChange={(e)=> setPayload({...payload, [e.target.name]:e.target.value})} onKeyUp={calculatePaySlip}  />
           </label>
           <label className="input input-bordered flex items-center gap-2 font-semibold">
             HDMF Loan:
             <input type="number"  min="0" step="0.01" value={payload?.deductions_hmo_loan || ""} name='deductions_hmo_loan' className="grow  font-semibold"  placeholder="0.00" onChange={(e)=> setPayload({...payload, [e.target.name]:e.target.value})} onKeyUp={calculatePaySlip}  />
           </label>
           <label className="input input-bordered  flex items-center gap-2 font-semibold">
             Employee Loan:
             <input type="number"  min="0" step="0.01" value={payload?.deductions_employee_loan || ""} name='deductions_employee_loan' className="grow font-semibold" placeholder="0.00" onChange={(e)=> setPayload({...payload, [e.target.name]:e.target.value})} onKeyUp={calculatePaySlip}  />
           </label>
           <label className="input input-bordered  flex items-center gap-2 font-semibold">
             Others:
             <input type="number"  min="0" step="0.01" value={payload?.deductions_others || ""} name='deductions_others' className="grow font-semibold" placeholder="0.00" onChange={(e)=> setPayload({...payload, [e.target.name]:e.target.value})} onKeyUp={calculatePaySlip}  />
           </label>
           <label className="input  flex items-center gap-2">
             <span className='font-bold'>TOTAL DEDUCTION:</span> 
             <input type="hidden" disabled className="grow font-semibold text-blue-500" placeholder="0.00"  value={payload.deductions_total ? payload.deductions_total.toFixed(2) : "0.00"} onChange={(e)=> setPayload({...payload, deductions_total:e.target.value})} />
             <span className='text-red-700 font-semibold'>{(payload?.deductions_total )?.toLocaleString('en-PH', { style: 'currency', currency: 'PHP' }) || "0.00"}</span> 
           </label>
         </div>
         </div>
        </div>
        <div className="divider"></div> 
        <label className="input  flex items-center gap-2">
             <span className='font-bold'>NET SALARY: </span> 
             <input type="hidden" disabled className="grow font-semibold text-red-500" value={payload.payslip_netPay ? payload.payslip_netPay.toFixed(2) : "0.00"} placeholder=""  />
             <span className='text-red-700 font-semibold'>{(payload?.payslip_netPay )?.toLocaleString('en-PH', { style: 'currency', currency: 'PHP' }) || "0.00"}</span> 
           </label>
      
         <p  className="text-red text-xs italic text-red-500 ml-2 error-message"></p>
         <div className="modal-action">
             <button type='submit' className="btn bg-[#0984e3] hover:bg-[#0984e3] text-white w-[30%]">
             <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-5">
                  <path d="M21.731 2.269a2.625 2.625 0 0 0-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 0 0 0-3.712ZM19.513 8.199l-3.712-3.712-8.4 8.4a5.25 5.25 0 0 0-1.32 2.214l-.8 2.685a.75.75 0 0 0 .933.933l2.685-.8a5.25 5.25 0 0 0 2.214-1.32l8.4-8.4Z" />
                  <path d="M5.25 5.25a3 3 0 0 0-3 3v10.5a3 3 0 0 0 3 3h10.5a3 3 0 0 0 3-3V13.5a.75.75 0 0 0-1.5 0v5.25a1.5 1.5 0 0 1-1.5 1.5H5.25a1.5 1.5 0 0 1-1.5-1.5V8.25a1.5 1.5 0 0 1 1.5-1.5h5.25a.75.75 0 0 0 0-1.5H5.25Z" />
                  </svg>
                {_id ? "UPDATE PAYSLIP" : "SUBMIT PAYSLIP"}
                </button>
             <button type='button' className="btn btn-error text-white shadow" onClick={()=>{
                setPayload({});
                set_Id("");
                document.getElementById('employee_payslip_details').close();
             }}>
             <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
             </button>
         </div>
         </form>
     </>
   )}
   </div>
 </dialog>


 
 <dialog id="employee_slip_info" className="modal">
        <div className="modal-box w-11/12 max-w-5xl">
        <div className="w-full flex flex-col justify-center items-center">
         <div className=" w-60 rounded">
            <img src="/onsource_logo.png" />
         </div>
         <p className="label-text opacity-70 text-[12px] font-bold mt-5">OnSource Inc.</p>
         <p className=" opacity-70 text-[12px] font-semibold">Office 10th flr, The Space Bldg. AS Fortuna St., Banilad, Mandaue City, 6014 Cebu.</p>
         </div>
         <div className="divider"></div> 
         <h3 className="font-bold text-lg text-center mt-2 opacity-70">SALARY SLIP</h3>
         <div className="divider"></div> 
          <form  method="dialog" className='mt-5 ' autoComplete="off">
           <div className='flex w-full gap-4 items-center'>
              <div className='flex  flex-col w-full justify-start '>
                <label className="flex items-center gap-2 ">
                    <div className="label">
                      <span className="label-text font-semibold opacity-70">Employee names:</span>
                  </div>
                  <span className='font-bold opacity-70 uppercase text-blue-500 text-sm'>{payload?.employee_name} {payload?.position && `/ ${payload?.position}`}</span>             
                </label>

                <label className="flex items-center gap-2 ">
                    <div className="label">
                      <span className="label-text font-semibold opacity-70 text-sm">Employee ID:</span>
                  </div>
                  <span className='font-bold opacity-70 text-red-500 text-sm'>{payload?.employee_id}</span>             
                </label>
              </div>
              <div className='w-full flex flex-col items-center '>
              <label className=" flex items-center gap-2 ml-3">
                  <div className="label">
                    <span className="label-text font-semibold opacity-70 text-sm">Pay Period Begin Date:</span>
                  </div>
                  <span className='font-bold opacity-70  text-red-500 text-sm'>{payload?.pay_period_begin && moment(payload?.pay_period_begin).format("LL") }</span> 
                </label>

                <label className=" flex items-center gap-2">
                  <div className="label">
                    <span className="label-text font-semibold opacity-70 text-sm">Pay Period End Date:</span>
                  </div>
                  <span className='font-bold opacity-70  text-blue-500 text-sm'>{payload?.pay_period_end && moment(payload?.pay_period_end).format("LL")}</span> 
                </label>

                
              </div>
           </div>
           
           <div className="divider"></div> 
           <div className='flex w-full flex-col gap-4 mb-7'> 
            <div className='w-full'>
            <div className="flex-shrink-0 flex items-center gap-3 ml-2 mb-3" >
              <span className='font-bold opacity-70 text-blue-500'>EARNINGS : </span>             
            </div>

            <div className="overflow-x-auto mb-3">
              <table className="table">
                <thead>
                  <tr>
                     <th>Per-Month</th>
                    <th>Per Day/Hour</th>
                    <th>Allowance</th>
                    <th>Night Diff.</th>
                  </tr>
                </thead>
                <tbody>
             
                  <tr>
                    <td>
                      <span className='opacity-70 font-semibold'>{(payload?.earnings_per_month )?.toLocaleString('en-PH', { style: 'currency', currency: 'PHP' }) || "0.00"}</span>    
                    </td>
                    <td>
                      <span className='opacity-70 font-semibold'>{(payload?.earnings_per_day_hour )?.toLocaleString('en-PH', { style: 'currency', currency: 'PHP' }) || "0.00"}</span>  
                      </td>
                    <td>
                       <span className='opacity-70 font-semibold'>{(payload?.earnings_allowance )?.toLocaleString('en-PH', { style: 'currency', currency: 'PHP' }) || "0.00"}</span>    
                    </td>
                    <td>
                       <span className='opacity-70 font-semibold'>{(payload?.earnings_night_diff )?.toLocaleString('en-PH', { style: 'currency', currency: 'PHP' }) || "0.00"}</span>    
                    </td>

                  </tr>
                </tbody>
              </table>
            </div>

            <div className="overflow-x-auto mb-3">
              <table className="table">
                <thead>
                  <tr>
             
                    <th>Holiday</th>
                    <th>Retro/Others</th>
                    <th>Bonus/Commission</th>
                    
                  </tr>
                </thead>
                <tbody>
             
                  <tr>
                    <td>
                      <span className='opacity-70 font-semibold'>{(payload?.earnings_night_diff )?.toLocaleString('en-PH', { style: 'currency', currency: 'PHP' }) || "0.00"}</span>    
                    </td>
                    <td>
                      <span className='opacity-70 font-semibold'>{(payload?.earnings_holiday )?.toLocaleString('en-PH', { style: 'currency', currency: 'PHP' }) || "0.00"}</span>  
                      </td>
                    <td>
                       <span className='opacity-70 font-semibold'>{(payload?.earnings_retro )?.toLocaleString('en-PH', { style: 'currency', currency: 'PHP' }) || "0.00"}</span>    
                    </td>
                    <td>
                       <span className='opacity-70 font-semibold'>{(payload?.earnings_commission )?.toLocaleString('en-PH', { style: 'currency', currency: 'PHP' }) || "0.00"}</span>    
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="overflow-x-auto mb-3">
            <div className='w-full'>
            <div className="flex-shrink-0 flex items-center gap-3 ml-2 mb-3" >
              <span className='font-bold opacity-70 text-red-500'>DEDUCTIONS : </span>             
            </div>
          
            <div className="overflow-x-auto mb-4">
              <table className="table">
                {/* head */}
                <thead>
                  <tr>
                    <th>LWO/Lates/Undertime</th>
                    <th>Withholding Tax</th>
                    <th>SSS Contribution</th>
                    <th>PHIC Contribution</th>
                    <th>HDMF Contribution</th>
                  </tr>
                </thead>
                <tbody>
             
                  <tr >
                    <td>
                      <span className='opacity-70 font-semibold'>{payload?.deductions_lwop || "0.00"}</span>
                    </td>
                    <td>
                      <span className='opacity-70 font-semibold'>{payload?.deductions_holding_tax || "0.00"}</span>
                    </td>
                    <td>
                      <span className='opacity-70 font-semibold'>{payload?.deductions_sss_contribution?.toLocaleString('en-PH', { style: 'currency', currency: 'PHP' })}</span>
                    </td>
                    <td>
                     <span className='opacity-70 font-semibold'>{payload?.deductions_phic_contribution?.toLocaleString('en-PH', { style: 'currency', currency: 'PHP' })}</span>
                    </td>
                    <td>
                     <span className='opacity-70 font-semibold'>{payload?.deductions_hdmf_contribution?.toLocaleString('en-PH', { style: 'currency', currency: 'PHP' })}</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
             
            <div className="overflow-x-auto ">
              <table className="table">
                <thead>
                  <tr>
                    <th>HMO</th>
                    <th>SSS Loan</th>
                    <th>HDMF Loan</th>
                    <th>Employee Loan</th>
                    <th>Others</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                    <span className='opacity-70 font-semibold'>{payload?.deductions_hmo?.toLocaleString('en-PH', { style: 'currency', currency: 'PHP' }) || "0.00"}</span>
                      </td>
                    <td>
                    <span className='opacity-70 font-semibold'>{payload?.deductions_sss_loan?.toLocaleString('en-PH', { style: 'currency', currency: 'PHP' }) || "0.00"}</span>
                      </td>
                    <td>
                    <span className='opacity-70 font-semibold'>{payload?.deductions_hmo_loan?.toLocaleString('en-PH', { style: 'currency', currency: 'PHP' }) || "0.00"}</span>
                    </td>
                    <td>
                    <span className='opacity-70 font-semibold'>{payload?.deductions_employee_loan?.toLocaleString('en-PH', { style: 'currency', currency: 'PHP' }) || "0.00"}</span>
                    </td>
                    <td>
                    <span className='opacity-70 font-semibold'>{payload?.deductions_others?.toLocaleString('en-PH', { style: 'currency', currency: 'PHP' }) || "0.00"}</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            <div className='flex justify-between mt-5'>
            <label className="input  flex items-center gap-2 ">
                  <span className='font-bold opacity-70'>Total Earnings:</span> 
                  <span className='opacity-70 font-semibold text-blue-700'>{payload?.earnings_total?.toLocaleString('en-PH', { style: 'currency', currency: 'PHP' })}</span>
              </label>
              <label className="input  flex items-center gap-2 ">
                  <span className='font-bold opacity-70'>Total Deduction:</span> 
                  <span className='opacity-70 font-semibold text-blue-700'>{payload?.deductions_total?.toLocaleString('en-PH', { style: 'currency', currency: 'PHP' })}</span>
              </label>
            <label className="input  flex items-center gap-2">
                  <span className='font-bold opacity-70'>NET Salary:</span> 
                  <span className='opacity-70 font-semibold text-red-700'>{payload?.payslip_netPay?.toLocaleString('en-PH', { style: 'currency', currency: 'PHP' })}</span>
              </label>
            </div>
            </div>
            </div>

            </div>
           
           </div>
          
            <div className="modal-action mt-8">
                  <button className="btn bg-[#0984e3] hover:bg-[#0984e3] text-white" 
                    onClick={()=>{
                     document.getElementById('employee_payslip').showModal();
                     document.getElementById('employee_payroll_details').close();
                    }}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-5">
                  <path d="M21.731 2.269a2.625 2.625 0 0 0-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 0 0 0-3.712ZM19.513 8.199l-3.712-3.712-8.4 8.4a5.25 5.25 0 0 0-1.32 2.214l-.8 2.685a.75.75 0 0 0 .933.933l2.685-.8a5.25 5.25 0 0 0 2.214-1.32l8.4-8.4Z" />
                  <path d="M5.25 5.25a3 3 0 0 0-3 3v10.5a3 3 0 0 0 3 3h10.5a3 3 0 0 0 3-3V13.5a.75.75 0 0 0-1.5 0v5.25a1.5 1.5 0 0 1-1.5 1.5H5.25a1.5 1.5 0 0 1-1.5-1.5V8.25a1.5 1.5 0 0 1 1.5-1.5h5.25a.75.75 0 0 0 0-1.5H5.25Z" />
                  </svg>
                   EDIT PAYSLIP DETAILS
                  </button>
                <button type='button' className="btn btn-error text-white shadow" onClick={()=>{
                   document.getElementById('employee_slip_info').close();
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

export default Payroll