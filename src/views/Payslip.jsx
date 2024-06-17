import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import axiosClient from '../axiosClient';
import moment from 'moment';
import swal from 'sweetalert';

function Payslip() {
   
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
      // getListOfPayslip();
      getListOfEmployee();

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
   

   const getListOfEmployee = () => {
         setLoadPage(true)
         Promise.all([getDataList('position'), getDataList('department', 'ALL'), getDataList('user'), getDataList('employee'), getDataList('payslip')])
         .then((data) => {
            setLoadPage(false)
            setEmployees(data[3].data);
            
            const empId = data[3].data.find( d => d.employee_email?.trim()?.toLowerCase() === data[2].email?.trim()?.toLowerCase())?.id     
        
           const result = data[4].map(data => {
         
               const { 
                  earnings_per_month,
                  earnings_allowance,
                  earnings_night_diff,
                  earnings_holiday,
                  earnings_retro,
                  earnings_commission,
                  deductions_lwop,
                  deductions_holding_tax,
                  deductions_sss_contribution,
                  deductions_phic_contribution,
                  deductions_hmo,
                  deductions_sss_loan,
                  deductions_hmo_loan,
                  deductions_employee_loan,
                  deductions_others,
                  deductions_hdmf_contribution
               } = data;
      
            
               const totalEarn = earnings_per_month + earnings_allowance + earnings_night_diff + earnings_holiday + earnings_retro + earnings_commission; 
               const totalDeduc = deductions_lwop + deductions_holding_tax + deductions_sss_contribution + deductions_phic_contribution + deductions_hmo + deductions_sss_loan + deductions_hmo_loan + deductions_employee_loan + deductions_hdmf_contribution + deductions_others; 
               const totalNetPay = parseFloat(totalEarn) - parseFloat(totalDeduc);
            
            
               return {
                  ...data,
                  totalEarn,
                  totalDeduc,
                  totalNetPay,
               }
            })
            
      
            setCompensations(result)
      
            const totalAmount = result.reduce((accumulator, currentValue) => {
               accumulator.allEarn += currentValue.totalEarn;
               accumulator.allDeduc += currentValue.totalDeduc;
               accumulator.allNetPay += currentValue.totalNetPay;
               return accumulator;
            }, { allEarn: 0, allDeduc: 0, allNetPay: 0});
         
            setTotalDataAmount(totalAmount)

         })
         .catch((err) => {
            console.error(err);
         });
   }

   const getListOfPayslip = () => {


    
      axiosClient.get("/payslip")
      .then((data)=>{
    

     
     
      
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
                          <Link to="/paycheck/payroll" role="tab" className="tab  font-semibold uppercase">Payroll</Link>
                          <Link to="/paycheck/payslip" role="tab" className="tab font-semibold  bg-[#3498db] text-white uppercase">Payslip</Link>
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
                            <th className='tracking-wider'>EARNING'S</th>
                            <th className='tracking-wider'>DEDUCTION'S</th>
                            <th className='tracking-wider'>NET SALARY</th>
                            <th className='tracking-wider'>PAY PERIOD BEGIN DATE</th>
                            <th className='tracking-wider'>PAY PERIOD END DATE</th>
                            <th className='tracking-wider'>ACTION</th>
                     
                          </tr>
                        </thead>
                        <tbody>
                        {loadPage ? (
                                            <tr>
                                            <td className="p-4 whitespace-nowrap text-sm font-normal text-gray-900" colSpan="4">
                                               <div className='ml-5 flex items-center gap-2 '>
                                                 <span className="loading loading-ring loading-lg text-primary"></span>
                                                  <span className="font-bold opacity-80">Loading for employee payslip list...</span>
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
                                      <td className="font-semibold text-blue-500">{com.totalEarn && com.totalEarn.toLocaleString('en-PH', { style: 'currency', currency: 'PHP' })}</td>
                                      <td className="font-semibold text-blue-500">{com.totalDeduc && com.totalDeduc.toLocaleString('en-PH', { style: 'currency', currency: 'PHP' })}</td>
                                      <td className="font-semibold text-red-500">{com.totalNetPay && com.totalNetPay.toLocaleString('en-PH', { style: 'currency', currency: 'PHP' }) || "0.00"}</td>
                                      <td className="font-semibold uppercase">{moment(com.pay_period_begin).format("LL") === "Invalid date" ? "No payroll date" : moment(com.pay_period_begin).format("LL")}</td>
                                      <td className="font-semibold uppercase">{moment(com.pay_period_end).format("LL") === "Invalid date" ? "No payroll date" : moment(com.pay_period_end).format("LL")}</td>
                                      <td className="pt-6 px-2 whitespace-nowrap text-sm font-semibold text-gray-900 flex gap-2 max-md:hidden">
                                      <button type="button" 
                                      onClick={() =>{
                                          setLoad(true)
                                          setPay_id(com?.compe_id)
                                     
                                         axiosClient.get(`/payslip/${com.compe_id}`)
                                         .then(pay => {
                                          document.getElementById('employee_slip_info').showModal();
                                          setLoad(false)
                                          set_Id(pay.data.pay_id)
                                          setPayload({
                                             ...payload,
                                             ...pay.data,
                                             earnings_per_day_hour:pay.data.comp_per_hour_day
                                          })
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
                                      </td>
                                    </tr>
                            )
                          }): (
                           <tr>
                           <td className="p-4 whitespace-nowrap text-sm font-normal text-gray-900" colSpan="4">
                              <div className='ml-5'>
                                 <span className="font-bold opacity-80">No employee payslip found!</span>
                              </div>
                           </td>
                        </tr>
                          )}

                        </tbody>
                        <tfoot>
                          <tr>
                            <th></th>
                            <th>TOTAL :</th>
                            <th className='text-blue-500'>{totalDataAmount.allEarn ? totalDataAmount.allEarn.toLocaleString('en-PH', { style: 'currency', currency: 'PHP' }) : "0.00"}</th>
                            <th className='text-blue-500'>{totalDataAmount.allDeduc ? totalDataAmount.allDeduc.toLocaleString('en-PH', { style: 'currency', currency: 'PHP' }) : "0.00"}</th>
                            <th className='text-red-500'>{totalDataAmount.allNetPay ? totalDataAmount.allNetPay.toLocaleString('en-PH', { style: 'currency', currency: 'PHP' }) : "0.00"}</th>
                            <th></th>
                          </tr>
                        </tfoot>
                        
                      </table>
                    </div>
           </div>
          
      </div>

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
                  <span className='font-bold opacity-70 uppercase text-blue-500 text-[12px]'>{payload?.employee_name} {payload?.position && `/ ${payload?.position}`}</span>             
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

export default Payslip