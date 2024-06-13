import { useEffect,useState } from 'react';
import axiosClient from '../axiosClient';
import moment from 'moment';
import swal from 'sweetalert';
import { Link } from 'react-router-dom';


function Compensation() {


  const [employees, setEmployees] = useState([]);
  const [payload, setPayload] = useState({});
  const [compensations, setCompensations] = useState([]);
  const [totalDataAmount, setTotalDataAmount] = useState({});
  const [compDetails, setCompDetails] = useState(null);
  const [load, setLoad]= useState(false);
  const [pay_id, setPay_id] = useState("");
 

  useEffect(()=>{
    getListOfEmployee();
    getListOfPayroll();
 },[])

 const getListOfEmployee = () => {
    Promise.all([getDataList('position'), getDataList('department', 'ALL'), getDataList('user'), getDataList('employee')])
    .then((data) => {
        setEmployees(data[3].data);
        const roles = Array.from(new Set(data[3].data.map(r => r.employee_role)));
    })
    .catch((err) => {
        console.error(err);
    });
 }




 const handleSubmitPayload = (e) => {
  e.preventDefault();
 
  axiosClient.post('/payslip', payload )
  .then((res)=>{
    
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
       console.log(response)
    }
 })
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

const toAmount = () => {
  const bi_montly = parseFloat(payload?.bi_montly) || 0;
  setPayload({
    ...payload,
    amount: parseFloat(bi_montly),
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

const getListOfPayroll = () => {
  axiosClient.get("/compensation")
  .then((data)=>{

   const result = data.data.map(data => {
      const {comp_per_hour_day, 
        comp_number_of_mins, 
        comp_number_of_days,
        comp_bi_monthly,
        comp_night_diff,
        comp_holiday_or_ot,
        comp_comission,
        comp_sss,
        comp_phic,
        comp_hdmf,
        comp_retro,
        comp_allowance,
        comp_withholding,
        comp_sss_loan,
        comp_ar
      } = data;

      let totalMinutes = calculateTotalMinutes(comp_per_hour_day, comp_number_of_mins)
      let totalDays = calculateTotalDays(comp_per_hour_day, comp_number_of_days)
      let taxable_income = calculateTaxableIncome(
        comp_bi_monthly,
        comp_night_diff,
        comp_holiday_or_ot,
        comp_comission,
        totalMinutes,
        totalDays,
        comp_sss,
        comp_phic,
        comp_hdmf
      )
      let totalNetPay = calculateNetpay(
        taxable_income,
        comp_retro,
        comp_allowance,
        comp_withholding,
        comp_sss_loan,
        comp_ar
      )

      return {
        ...data,
        taxable_income,
        totalNetPay,
      }
    })

   

    setCompensations(result)

    const totalAmount = result.reduce((accumulator, currentValue) => {
      accumulator.allTaxAmmount += currentValue.taxable_income;
      accumulator.allTaxNetPay += currentValue.totalNetPay;
      return accumulator;
    }, { allTaxAmmount: 0, allTaxNetPay: 0 });

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
  retro_others,
  allowance,
  withholding,
  sss_loan,
  ar_others
) => {
  return (parseFloat(totalAmount) + parseFloat(retro_others) + parseFloat(allowance)) - (parseFloat(withholding) + parseFloat(sss_loan) + parseFloat(ar_others))
}

const handleSubmitPayroll = (e) => {
  e.preventDefault();

  const data = {
    'employee_id': payload.employee_id,
    'comp_bi_monthly':payload.bi_montly,
    'comp_per_hour_day': payload.per_hour_day,
    'comp_night_diff': payload.night_diff,
    'comp_holiday_or_ot': payload.holiday_OT,
    'comp_comission': payload.incentive,
    'comp_number_of_mins': payload.tardines_minutes,
    'comp_number_of_days': payload.tardines_days,
    'comp_mins': payload.tardines_total_minutes,
    'comp_days': payload.tardines_total_days,
    'comp_sss': payload.sss,
    'comp_phic': payload.phic,
    'comp_hdmf': payload.hdmf,
    'comp_withholding': payload.withholding,
    'comp_sss_loan': payload.sss_loan,
    'comp_ar': payload.ar_others,
    'comp_retro': payload.retro_others,
    'comp_allowance': payload.allowance,
    'comp_account_num': payload.account_number,
    'comp_acount_name': payload.bank_name,
    'comp_pay_roll_dates': payload.pay_roll_dates
};

  axiosClient.post('/compensation', data )
  .then((res)=>{
    
    setPayload({});
    setEmployees([]);
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
      console.log(response)
    }
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


  

  return (
    <div>
      <div className="ml-auto mb-6 lg:w-[75%] xl:w-[80%] 2xl:w-[85%]">
          <div className="bg-white shadow rounded-lg p-4 sm:p-6 xl:p-8 m-5">
                     <div className="mb-4 flex items-end  gap-5 max-md:flex-col-reverse max-md:gap-6">
                        <div className="flex-shrink-0 flex justify-center items-center gap-3" onClick={()=>{
                           document.getElementById('employee_payroll').showModal();
                        }}>
                        <div className='shadow-md p-1 bg-[#0984e3] rounded-md text-white cursor-pointer transition-all ease-in opacity-75 hover:opacity-100'>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                            </svg>
                        </div>
                          <span className='font-bold opacity-70'>PAYROLL</span>
                        </div>
                     </div>

                     <div className="overflow-x-auto">
                      <table className="table">
                        <thead>
                          <tr>
                            {/* <th>
                              <label>
                                <input type="checkbox" className="checkbox" />
                              </label>
                            </th> */}
                            <th className='tracking-wider'>NAME'S</th>
                            <th className='tracking-wider'>BANK ACCOUNT</th>
                            <th className='tracking-wider'>TAXABL INCOME</th>
                            <th className='tracking-wider'>NET PAY</th>
                            <th className='tracking-wider'>PAYROLL DATES</th>
                            <th className='tracking-wider'>ACTION</th>
                          </tr>
                        </thead>
                        <tbody>
                          {compensations.map((com, i)=> {
                            return (
                                    <tr key={i}>
                                      {/* <th>
                                        <label>
                                          <input type="checkbox" className="checkbox" />
                                        </label>
                                      </th> */}
                                      <td className='whitespace-nowrap'>
                                        <div className="flex items-center gap-3">
                                          <div className="avatar">
                                            <div className="mask mask-squircle w-12 h-12">
                                            <img srcSet={`${com.employee_image || "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg"}`} alt="Avatar Tailwind CSS Component" />
                                            </div>
                                          </div>
                                          <div>
                                        
                                            <div className="font-bold">{com.employee_name}</div>
                                            <div className="text-sm opacity-50">{com.employee_email}</div>
                                          </div>
                                        </div>
                                      </td>
                                      <td className='whitespace-nowrap'>
                                        <span className="font-semibold opacity-75">{com.comp_acount_name}</span>
                                        <br/>
                                        <span className="badge badge-ghost badge-sm"> {com.comp_account_num}</span>
                                      </td>
                                      <td className="font-semibold">{com.taxable_income && com.taxable_income.toLocaleString('en-PH', { style: 'currency', currency: 'PHP' })}</td>
                                      <td className="font-semibold text-red-500">{com.totalNetPay && com.totalNetPay.toLocaleString('en-PH', { style: 'currency', currency: 'PHP' })}</td>
                                      <td className="font-semibold ">{com.comp_pay_roll_dates && moment(com.comp_pay_roll_dates).calendar()}</td>
                                      <td className="pt-6 px-2 whitespace-nowrap text-sm font-semibold text-gray-900 flex gap-2 max-md:hidden">
                                      <button type="button" onClick={() =>{
                                          setLoad(true)
                                          setPay_id(com.compe_id)
                                          axiosClient.get(`/compensation/${com.compe_id}`)
                                          .then((data)=>{
                                            setLoad(false)
                                            document.getElementById('employee_payroll_details').showModal();
                                            const {
                                                comp_per_hour_day,
                                                comp_number_of_mins,
                                                comp_number_of_days,                                               
                                                comp_bi_monthly,
                                                comp_night_diff,
                                                comp_holiday_or_ot,
                                                comp_comission,
                                                comp_sss,
                                                comp_phic,
                                                comp_hdmf,
                                                comp_retro,
                                                comp_allowance,
                                                comp_withholding,
                                                comp_sss_loan,
                                                comp_ar
                                              } = data.data.data;
                                            let totalMinutes = calculateTotalMinutes(comp_per_hour_day, comp_number_of_mins)
                                            let totalDays = calculateTotalDays(comp_per_hour_day, comp_number_of_days)
                                            let taxable_income = calculateTaxableIncome(
                                              comp_bi_monthly,
                                              comp_night_diff,
                                              comp_holiday_or_ot,
                                              comp_comission,
                                              totalMinutes,
                                              totalDays,
                                              comp_sss,
                                              comp_phic,
                                              comp_hdmf
                                            )
                                            let totalNetPay = calculateNetpay(
                                              taxable_income,
                                              comp_retro,
                                              comp_allowance,
                                              comp_withholding,
                                              comp_sss_loan,
                                              comp_ar
                                            )
                                             setCompDetails({...data.data.data, totalMinutes, totalDays, taxable_income, totalNetPay });
                                          })
                                          .catch((err)=>{
                                             const {response} = err;
                                             if(response &&  response.status  === 422){
                                               console.log(response.data)
                                             }
                                          })
                                     
                                      }} >
                                        {load && pay_id == com.compe_id ? (
                                            <span className="loading loading-spinner loading-sm text-[#0984e3]"></span>
                                        ): (
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6 text-[#0984e3] cursor-pointer transition-all opacity-75 hover:opacity-100">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m5.231 13.481L15 17.25m-4.5-15H5.625c-.621 0-1.125.504-1.125 1.125v16.5c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Zm3.75 11.625a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
                                        </svg>
                                        )}
                                      </button> 
                                      <span>/</span>
                                      <Link >
                                      <svg  xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6 text-[#0984e3] cursor-pointer transition-all opacity-75 hover:opacity-100">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                                      </svg>
                                      </Link> 
                                      </td>
                                    </tr>
                            )
                          })}

                        </tbody>
                        <tfoot>
                          <tr>
                            <th></th>
                            <th>TOTAL :</th>
                            <th className='text-blue-500'>{totalDataAmount.allTaxAmmount ? totalDataAmount.allTaxAmmount.toLocaleString('en-PH', { style: 'currency', currency: 'PHP' }) : "0.00"}</th>
                            <th className='text-red-500'>{totalDataAmount.allTaxNetPay ? totalDataAmount.allTaxNetPay.toLocaleString('en-PH', { style: 'currency', currency: 'PHP' }) : "0.00"}</th>
                            <th></th>
                          </tr>
                        </tfoot>
                        
                      </table>
                    </div>
            </div>
            
      </div> 

 


    
   <dialog id="employee_payslip" className="modal">
      <div className="modal-box w-11/12 max-w-5xl">
       <h3 className="font-bold text-lg mt-5">EMPLOYEE PAYSLIP</h3>
       <span className="label-text opacity-70 text-[12px]">Input all the fields below</span>
        <form  method="dialog" autoComplete="off" onSubmit={handleSubmitPayload}>
           <div className='flex w-full gap-4'>
              <div className='flex justify-center items-center flex-col w-full mb-2'>
                <label className="form-control w-full ">
                    <div className="label">
                      <span className="label-text">Choose employee name:</span>
                  </div>
                  <span className='font-bold opacity-70'>{compDetails?.employee_name} / {compDetails?.position}</span>             
                </label>

                <label className="form-control w-full ">
                    <div className="label">
                      <span className="label-text">Choose employee name:</span>
                  </div>
                <input type="text" placeholder="Employee ID" value={compDetails.employee_id} disabled className="input input-bordered w-full" />  
                </label>
                
              </div>
              <div className='w-full'>
              <label className="form-control w-full ">
                  <div className="label">
                    <span className="label-text">Pay Period Begin Date:</span>
                  </div>
                  <input type="date" value={payload.pay_period_begin || ""} placeholder="Input here..." className="input input-bordered w-full " onChange={(e)=> {
                    setPayload({...payload, pay_period_begin: e.target.value})
                  }} />
                </label>
                <label className="form-control w-full ">
                  <div className="label">
                    <span className="label-text">Pay Period End Date:</span>
                  </div>
                  <input type="date" value={payload.pay_period_end || ""} placeholder="Input here..." className="input input-bordered w-full " onChange={(e)=> {
                    setPayload({...payload, pay_period_end: e.target.value})
                  }} />
                </label>
              </div>
           </div>
           <div className="divider"></div> 
           <div className='flex w-full gap-4'>
            <div className='w-full'>
            <p className="font-bold text-center text-md">EARNINGS</p>
            <div className='my-2 flex flex-col gap-3'>
              <label className="input input-bordered flex items-center gap-2">
                Per Month:
                <input type="number" min={0} value={payload?.earnings_per_month || ""} name='earnings_per_month' className="grow" placeholder="Input here..." onChange={(e)=> setPayload({...payload, [e.target.name]:e.target.value})}  onKeyUp={calculatePaySlip}  />
              </label>
              <label className="input input-bordered flex items-center gap-2">
                Per Day/Hour:
                <input type="number"  min={0} value={payload?.earnings_per_day_hour || ""} name='earnings_per_day_hour' className="grow" placeholder="Input here..." onChange={(e)=> setPayload({...payload, [e.target.name]:e.target.value})} onKeyUp={calculatePaySlip}  />
              </label>
              <label className="input input-bordered flex items-center gap-2">
                Allowance:
                <input type="number"  min={0} value={payload?.earnings_allowance || ""} name='earnings_allowance' className="grow" placeholder="Input here..." onChange={(e)=> setPayload({...payload, [e.target.name]:e.target.value})}  onKeyUp={calculatePaySlip} />
              </label>
              <label className="input input-bordered flex items-center gap-2">
                Night Diff:
                <input type="number"  min={0} value={payload?.earnings_night_diff || ""} name='earnings_night_diff' className="grow" placeholder="Input here..." onChange={(e)=> setPayload({...payload, [e.target.name]:e.target.value})} onKeyUp={calculatePaySlip} />
              </label>
              <label className="input input-bordered flex items-center gap-2">
                Holiday:
                <input type="number"  min={0} value={payload?.earnings_holiday || ""} name='earnings_holiday' className="grow" placeholder="Input here..." onChange={(e)=> setPayload({...payload, [e.target.name]:e.target.value})} onKeyUp={calculatePaySlip} />
              </label>
              <label className="input input-bordered flex items-center gap-2">
                Retro/Others:
                <input type="number"  min={0} value={payload?.earnings_retro || ""} name='earnings_retro' className="grow" placeholder="Input here..." onChange={(e)=> setPayload({...payload, [e.target.name]:e.target.value})} onKeyUp={calculatePaySlip} />
              </label>
              <label className="input input-bordered flex items-center gap-2">
               Bonus/Commission:
                <input type="number"  min={0} value={payload?.earnings_commission || ""} name='earnings_commission' className="grow" placeholder="Input here..." onChange={(e)=> setPayload({...payload, [e.target.name]:e.target.value})} onKeyUp={calculatePaySlip} />
              </label>
              <label className="input  flex items-center gap-2">
              </label>
              <label className="input  flex items-center gap-2">
              </label>
              <label className="input  flex items-center gap-2">
              </label>
              <label className="input flex items-center gap-2">
                 <span className='font-bold'>TOTAL EARNINGS:</span> 
                <input type="number" value={payload.earnings_total ? payload.earnings_total.toFixed(2) : "0.00"} disabled className="grow" placeholder="" onChange={(e)=> setPayload({...payload, earnings_total:e.target.value})}  />
              </label>
            </div>
             
            </div>
            <div className='w-full'>
            <p className="font-bold text-center text-md">DEDUCTIONS</p>
            <div className='my-2 flex flex-col gap-3'>
              <label className="input input-bordered flex items-center gap-2">
               LWOP/Lates/Undertime:
                <input type="number" min={0} value={payload?.deductions_lwop || ""} name='deductions_lwop' className="grow" placeholder="Input here..." onChange={(e)=> setPayload({...payload, [e.target.name]:e.target.value})} onKeyUp={calculatePaySlip} />
              </label>
              <label className="input input-bordered flex items-center gap-2">
                Withholding Tax:
                <input type="number"  min={0} value={payload?.deductions_holding_tax || ""} name='deductions_holding_tax' className="grow" placeholder="Input here..." onChange={(e)=> setPayload({...payload, [e.target.name]:e.target.value})} onKeyUp={calculatePaySlip}  />
              </label>
              <label className="input input-bordered flex items-center gap-2">
                SSS Contribution:
                <input type="number"  min={0} value={payload?.deductions_sss_contribution || ""} name='deductions_sss_contribution' className="grow" placeholder="Input here..." onChange={(e)=> setPayload({...payload, [e.target.name]:e.target.value})} onKeyUp={calculatePaySlip}  />
              </label>
              <label className="input input-bordered flex items-center gap-2">
               PHIC Contribution:
                <input type="number"  min={0} value={payload?.deductions_phic_contribution || ""} name='deductions_phic_contribution' className="grow" placeholder="Input here..." onChange={(e)=> setPayload({...payload, [e.target.name]:e.target.value})} onKeyUp={calculatePaySlip}  />
              </label>
              <label className="input input-bordered flex items-center gap-2">
                HDMF Contribution:
                <input type="number"  min={0} value={payload?.deductions_hdmf_contribution || ""} name='deductions_hdmf_contribution' className="grow" placeholder="Input here..." onChange={(e)=> setPayload({...payload, [e.target.name]:e.target.value})} onKeyUp={calculatePaySlip}  />
              </label>
              <label className="input input-bordered flex items-center gap-2">
               HMO:
                <input type="number"  min={0} value={payload?.deductions_hmo || ""} name='deductions_hmo' className="grow" placeholder="Input here..." onChange={(e)=> setPayload({...payload, [e.target.name]:e.target.value})} onKeyUp={calculatePaySlip}  />
              </label>
              <label className="input input-bordered flex items-center gap-2">
                SSS Loan:
                <input type="number"  min={0} value={payload?.deductions_sss_loan || ""} name='deductions_sss_loan' className="grow" placeholder="Input here..." onChange={(e)=> setPayload({...payload, [e.target.name]:e.target.value})} onKeyUp={calculatePaySlip}  />
              </label>
              <label className="input input-bordered flex items-center gap-2">
                HDMF Loan:
                <input type="number"  min={0} value={payload?.deductions_hmo_loan || ""} name='deductions_hmo_loan' className="grow" placeholder="Input here..." onChange={(e)=> setPayload({...payload, [e.target.name]:e.target.value})} onKeyUp={calculatePaySlip}  />
              </label>
              <label className="input input-bordered flex items-center gap-2">
                Employee Loan:
                <input type="number"  min={0} value={payload?.deductions_employee_loan || ""} name='deductions_employee_loan' className="grow" placeholder="Input here..." onChange={(e)=> setPayload({...payload, [e.target.name]:e.target.value})} onKeyUp={calculatePaySlip}  />
              </label>
              <label className="input input-bordered flex items-center gap-2">
                Others:
                <input type="number"  min={0} value={payload?.deductions_others || ""} name='deductions_others' className="grow" placeholder="Input here..." onChange={(e)=> setPayload({...payload, [e.target.name]:e.target.value})} onKeyUp={calculatePaySlip}  />
              </label>
              <label className="input  flex items-center gap-2">
                <span className='font-bold'>TOTAL DEDUCTION:</span> 
                <input type="number" disabled className="grow" placeholder="" value={payload.deductions_total ? payload.deductions_total.toFixed(2) : "0.00"} onChange={(e)=> setPayload({...payload, deductions_total:e.target.value})} />
              </label>
            </div>
            </div>
           </div>
           <div className="divider"></div> 
           <label className="input  flex items-center gap-2">
                <span className='font-bold'>NET SALARY:</span> 
                <input type="number" disabled className="grow" value={payload.payslip_netPay ? payload.payslip_netPay.toFixed(2) : "0.00"} placeholder="" />
              </label>
         
            <p  className="text-red text-xs italic text-red-500 ml-2 error-message"></p>
            <div className="modal-action">
                <button type='submit' className="btn bg-[#0984e3] hover:bg-[#0984e3] text-white w-[40%]">
                   SUBMIT PAYSLIP
                   </button>
                <button type='button' className="btn shadow" onClick={()=>{
                   setPayload({});
                   document.getElementById('employee_payslip').close();
                }}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
            </div>
            </form>
      </div>
    </dialog> 

     
   
      <dialog id="employee_payroll_details" className="modal">
        <div className="modal-box w-11/12 max-w-5xl">
        <h3 className="font-bold text-lg mt-5">EMPLOYEE PAYROLL</h3>
        <span className="label-text opacity-70 text-[12px] ">Below are the details of the payroll for the employee.</span>
         
          <form  method="dialog" className='mt-2' autoComplete="off">
           <div className='flex w-full gap-4'>
              <div className='flex justify-center items-center flex-col w-full mb-2'>
                <label className="form-control w-full mb-4">
                    <div className="label">
                      <span className="label-text">Employee name:</span>
                  </div>
                  <span className='font-bold opacity-70'>{compDetails?.employee_name} / {compDetails?.position}</span>             
                </label>

                <label className="form-control w-full ">
                    <div className="label">
                      <span className="label-text">Employee ID:</span>
                  </div>
                  <span className='font-bold opacity-70'>{compDetails?.employee_id}</span>             
                </label>
              </div>
              <div className='w-full'>
              <label className="form-control w-full">
                  <div className="label">
                    <span className="label-text">Payroll Dates:</span>
                  </div>
                  <span className='font-bold opacity-70'>{compDetails?.comp_pay_roll_dates && moment(compDetails?.comp_pay_roll_dates).calendar()}</span> 
                </label>
           
              </div>
           </div>
           <div className="divider"></div> 
           <div className='flex w-full flex-col gap-4'>
            <div className='w-full'>
            <div className="flex-shrink-0 flex items-center gap-3 ml-2 mb-3" >
              <span className='font-bold opacity-70'>EARNINGS : </span>             
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
                      <span className='opacity-70 font-semibold'>{compDetails?.comp_bi_monthly.toLocaleString('en-PH', { style: 'currency', currency: 'PHP' })}</span>    
                    </td>
                    <td>
                      <span className='opacity-70 font-semibold'>{compDetails?.comp_per_hour_day}</span>  
                      </td>
                    <td>
                       <span className='opacity-70 font-semibold'>{compDetails?.comp_bi_monthly.toLocaleString('en-PH', { style: 'currency', currency: 'PHP' })}</span>    
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="overflow-x-auto mb-3">
              <table className="table">
                <thead>
                  <tr>
                    <th>Night  Differential</th>
                    <th>Holiday/OT</th>
                    <th>Commission/Incentive/ Bonus/ Others</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <span className=' opacity-70 font-semibold'>{compDetails?.comp_night_diff.toLocaleString('en-PH', { style: 'currency', currency: 'PHP' })}</span>
                    </td>
                    <td>
                      <span className=' opacity-70 font-semibold'>{compDetails?.comp_holiday_or_ot.toLocaleString('en-PH', { style: 'currency', currency: 'PHP' })}</span>
                    </td>
                    <td>
                      <span className=' opacity-70 font-semibold'>{compDetails?.comp_comission.toLocaleString('en-PH', { style: 'currency', currency: 'PHP' })}</span>
                    </td>
                  </tr>
                 
                </tbody>
              </table>
            </div>

            </div>
            <div className='w-full'>
            <div className="flex-shrink-0 flex items-center gap-3 ml-2 mb-3" >
              <span className='font-bold opacity-70'>DEDUCTIONS : </span>             
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
                    <td>
                      <span className='opacity-70 font-semibold'>{compDetails?.comp_number_of_mins}</span>
                    </td>
                    <td>
                      <span className='opacity-70 font-semibold'>{compDetails?.comp_number_of_days}</span>
                    </td>
                    <td>
                      <span className='opacity-70 font-semibold'>{compDetails?.totalMinutes.toLocaleString('en-PH', { style: 'currency', currency: 'PHP' })}</span>
                    </td>
                    <td>
                     <span className='opacity-70 font-semibold'>{compDetails?.totalDays.toLocaleString('en-PH', { style: 'currency', currency: 'PHP' })}</span>
                    </td>
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
                    <td>
                    <span className='opacity-70 font-semibold'>{compDetails?.comp_sss.toLocaleString('en-PH', { style: 'currency', currency: 'PHP' })}</span>
                      </td>
                    <td>
                    <span className='opacity-70 font-semibold'>{compDetails?.comp_phic.toLocaleString('en-PH', { style: 'currency', currency: 'PHP' })}</span>
                      </td>
                    <td>
                    <span className='opacity-70 font-semibold'>{compDetails?.comp_hdmf.toLocaleString('en-PH', { style: 'currency', currency: 'PHP' })}</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            </div>
           </div>
           <div className='flex w-full  justify-between items-center'>
            <label className=" flex items-center gap-2">
                <span className='font-bold opacity-70'> Withholding Tax: </span> 
                <span className='opacity-70 font-semibold text-blue-500'>{compDetails?.comp_withholding.toLocaleString('en-PH', { style: 'currency', currency: 'PHP' })}</span>
              </label> 
            <label className="input  flex items-center gap-2"> 
                  <span className='font-bold opacity-70'>Taxable Income:</span> 
                  <span className='opacity-70 font-semibold text-blue-500'>{compDetails?.taxable_income.toLocaleString('en-PH', { style: 'currency', currency: 'PHP' })}</span>
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
                    <td>
                       <span className='opacity-70 font-semibold'>{compDetails?.comp_sss_loan.toLocaleString('en-PH', { style: 'currency', currency: 'PHP' })}</span>
                    </td>
                    <td>
                       <span className='opacity-70 font-semibold'>{compDetails?.comp_ar.toLocaleString('en-PH', { style: 'currency', currency: 'PHP' })}</span>
                    </td>
                    <td>
                       <span className='opacity-70 font-semibold'>{compDetails?.comp_retro.toLocaleString('en-PH', { style: 'currency', currency: 'PHP' })}</span>
                    </td>
                    <td>
                       <span className='opacity-70 font-semibold'>{compDetails?.comp_allowance.toLocaleString('en-PH', { style: 'currency', currency: 'PHP' })}</span>
                    </td>
                  </tr>
                 
                </tbody>
              </table>
            </div>
            <div className="divider"></div>
            <label className="input  flex items-center gap-2">
                  <span className='font-bold opacity-70'>Net Pay:</span> 
                  <span className='opacity-70 font-semibold text-red-500'>{compDetails?.totalNetPay.toLocaleString('en-PH', { style: 'currency', currency: 'PHP' })}</span>
              </label>

              <div className="divider"></div>
              <div className="flex-shrink-0 flex items-center gap-3 ml-2 mb-3" >
              <span className='font-bold opacity-70'>Union Bank Details :</span>             
            </div>    
            <div className="overflow-x-auto">
              <table className="table">
                <thead>
                  <tr>
                    <th>Account Numbers</th>
                    <th>Account Name</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <span className='opacity-70 font-semibold'>{compDetails?.comp_account_num}</span>
                    </td>
                    <td>
                      <span className='opacity-70 font-semibold'>{compDetails?.comp_acount_name}</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

         
            <p  className="text-red text-xs italic text-red-500 ml-2 error-message"></p>
            <div className="modal-action">
                <button type='submit' className="btn bg-[#0984e3] hover:bg-[#0984e3] text-white w-[40%]"
                onClick={()=>{
                  const data = {
                    employee_id: compDetails.emp_id,
                    earnings_per_day_hour:compDetails.comp_per_hour_day,
                    earnings_per_month: compDetails.comp_bi_monthly,
                    earnings_allowance: compDetails.comp_allowance,
                    earnings_night_diff: compDetails.comp_night_diff,
                    earnings_holiday: compDetails.comp_holiday_or_ot,
                    earnings_retro: compDetails.comp_retro,
                    earnings_commission: compDetails.comp_comission,
                    deductions_holding_tax: compDetails.comp_withholding,
                    deductions_sss_contribution: compDetails.comp_sss,
                    deductions_phic_contribution: compDetails.comp_phic,
                    deductions_sss_loan: compDetails.comp_sss_loan,
                    deductions_hdmf_contribution:compDetails.comp_hdmf
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
                   ISSUED PAYSLIP
                   </button>
                <button type='button' className="btn shadow" onClick={()=>{
                   document.getElementById('employee_payroll_details').close();
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
           <div className='flex w-full gap-4'>
              <div className='flex justify-center items-center flex-col w-full mb-2'>
                <label className="form-control w-full ">
                    <div className="label">
                      <span className="label-text">Choose employee name:</span>
                  </div>
                    <select className="select select-bordered" onChange={(e) => {
                      if(e.target.value === "Pick one here"){
                        setPayload({...payload, employee_id: "Pick employee please"});
                      }else{
                        const selectedOption = e.target.options[e.target.selectedIndex];
                        const employeeId = selectedOption.dataset.employeeId;
                        
                        setPayload({...payload, employee_id: e.target.value, emp_id: employeeId});
                      }
                    }}>
                      <option defaultValue={""}>Pick one here</option>
                      {employees?.map(emp => {
                        return (
                          <option key={emp.id} value={emp.id} data-employee-id={emp.employee_id}>{emp.employee_name} ({emp.position ? emp.position : emp.employee_role})</option>
                        )
                      })}
                    </select>
                </label>

                <label className="form-control w-full ">
                    <div className="label">
                      <span className="label-text">Employee ID:</span>
                  </div>
                <input type="text" placeholder="Employee ID" value={payload.emp_id} disabled className="input input-bordered w-full" />  
                </label>
              </div>
              <div className='w-full'>
              <label className="form-control w-full">
                  <div className="label">
                    <span className="label-text">Payroll Dates:</span>
                  </div>
                  <input type="date" value={payload.pay_roll_dates || ""} placeholder="Input here..." onChange={(e)=> {
                    setPayload({...payload, pay_roll_dates: e.target.value})
                  }} className="input input-bordered w-full " />
                </label>
           
              </div>
           </div>
           <div className="divider"></div> 
           <div className='flex w-full flex-col gap-4'>
            <div className='w-full'>
            <div className="flex-shrink-0 flex items-center gap-3 ml-2 mb-3" >
              <span className='font-bold opacity-70'>EARNINGS</span>             
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
                    <td><input type="number" min={0} value={payload?.bi_montly || ""} onKeyUp={calculateSlip}  name='bi_montly' placeholder="Type here" className="input input-bordered w-full max-w-xs" onChange={(e)=> setPayload({...payload, [e.target.name]:e.target.value})} /></td>
                    <td><input type="number" min={0}  value={payload?.per_hour_day || ""} name='per_hour_day' placeholder="Type here" className="input input-bordered w-full max-w-xs" onChange={(e)=> setPayload({...payload, [e.target.name]:e.target.value})} onKeyUp={calculateSlip} /></td>
                    <td><input type="number" min={0}   disabled value={payload?.amount || ""} name='amount' placeholder="Type here" className="input input-bordered w-full max-w-xs" onChange={(e)=> setPayload({...payload, [e.target.name]:e.target.value})} /></td>
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
                    <td><input type="number" onKeyUp={calculateSlip} value={payload?.night_diff || ""} name='night_diff' placeholder="Type here" className="input input-bordered w-full max-w-xs" onChange={(e)=> setPayload({...payload, [e.target.name]:e.target.value})} /></td>
                    <td><input type="number" onKeyUp={calculateSlip} value={payload?.holiday_OT || ""} name='holiday_OT' placeholder="Type here" className="input input-bordered w-full max-w-xs" onChange={(e)=> setPayload({...payload, [e.target.name]:e.target.value})} /></td>
                    <td><input type="number" onKeyUp={calculateSlip} value={payload?.incentive || ""} name='incentive' onChange={(e)=> setPayload({...payload, [e.target.name]:e.target.value})} placeholder="Type here" className="input input-bordered w-full max-w-xs"  /></td>
                  </tr>
                 
                </tbody>
              </table>
            </div>

            </div>
            <div className='w-full'>
            <div className="flex-shrink-0 flex items-center gap-3 ml-2 mb-3" >
              <span className='font-bold opacity-70'>DEDUCTIONS</span>             
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
                    <td><input type="number" min={0} value={payload?.tardines_minutes || ""} name='tardines_minutes' onChange={(e)=> setPayload({...payload, [e.target.name]:e.target.value})}  onKeyUp={calculateSlip} placeholder="Type here" className="input input-bordered w-full max-w-xs" /></td>
                    <td><input type="number" min={0}  value={payload?.tardines_days || ""} name='tardines_days' onChange={(e)=> setPayload({...payload, [e.target.name]:e.target.value})}  onKeyUp={calculateSlip} placeholder="Type here" className="input input-bordered w-full max-w-xs" /></td>
                    <td><input type="number" min={0}   value={payload?.tardines_total_minutes ? payload?.tardines_total_minutes?.toFixed(2) : "0.00"} disabled  placeholder="Type here" className="input input-bordered w-full max-w-xs" /></td>
                    <td><input type="number" min={0}  value={payload?.tardines_total_days ? payload?.tardines_total_days?.toFixed(2) : "0.00"} disabled placeholder="Type here" className="input input-bordered w-full max-w-xs" /></td>
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
                    <td><input type="number" onKeyUp={calculateSlip} min={0} value={payload?.sss || ""} name='sss' onChange={(e)=> setPayload({...payload, [e.target.name]:e.target.value})}  placeholder="Type here" className="input input-bordered w-full max-w-xs" /></td>
                    <td><input type="number" onKeyUp={calculateSlip} min={0} value={payload?.phic || ""} name='phic' onChange={(e)=> setPayload({...payload, [e.target.name]:e.target.value})}  placeholder="Type here" className="input input-bordered w-full max-w-xs" /></td>
                    <td><input type="number" onKeyUp={calculateSlip} min={0} value={payload?.hdmf || ""} name='hdmf' onChange={(e)=> setPayload({...payload, [e.target.name]:e.target.value})}  placeholder="Type here" className="input input-bordered w-full max-w-xs" /></td>
                  </tr>
                </tbody>
              </table>
            </div>
            </div>
           </div>
           <div className="divider"></div>
           <div className='flex w-full  justify-between items-center'>
            <label className="input input-bordered flex items-center gap-2">
                <span className='font-bold opacity-70'> Withholding Tax: </span> 
                  <input type="number" min={0} value={payload?.withholding || ""} name='withholding' className="grow" placeholder="Type here..." onChange={(e)=> setPayload({...payload, [e.target.name]:e.target.value})} onKeyUp={calculateSlip}  />
              </label> 
            <label className="input  flex items-center gap-2">
                  <span className='font-bold opacity-70'>Taxable Income:</span> 
                  <input min={0} value={payload.taxable_income ? payload.taxable_income.toFixed(2) : "0.00"} type="number" disabled className="grow" placeholder=""  />
              </label>
            </div>
          
            <div className="divider"></div> 
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
                    <td><input type="text" onKeyUp={calculateSlip} min={0} value={payload?.sss_loan || ""} name="sss_loan" placeholder="Type here" className="input input-bordered w-full max-w-xs" onChange={(e)=> setPayload({...payload, [e.target.name]:e.target.value})} /></td>
                    <td><input type="text" onKeyUp={calculateSlip} min={0} value={payload?.ar_others || ""} name="ar_others"  placeholder="Type here" className="input input-bordered w-full max-w-xs" onChange={(e)=> setPayload({...payload, [e.target.name]:e.target.value})} /></td>
                    <td><input type="text" onKeyUp={calculateSlip} min={0} value={payload?.retro_others || ""} name="retro_others"  placeholder="Type here" className="input input-bordered w-full max-w-xs" onChange={(e)=> setPayload({...payload, [e.target.name]:e.target.value})} /></td>
                    <td><input type="text" onKeyUp={calculateSlip} min={0} value={payload?.allowance || ""} name="allowance"  placeholder="Type here" className="input input-bordered w-full max-w-xs" onChange={(e)=> setPayload({...payload, [e.target.name]:e.target.value})} /></td>
                  </tr>
                 
                </tbody>
              </table>
            </div>
            <div className="divider"></div>
            <label className="input  flex items-center gap-2">
                  <span className='font-bold opacity-70'>Net Pay:</span> 
                  <input type="number" value={payload.total_net_pay ? payload.total_net_pay.toFixed(2): "0.00"} disabled className="grow" placeholder=""  />
              </label>

              <div className="divider"></div>
              <div className="flex-shrink-0 flex items-center gap-3 ml-2 mb-3" >
              <span className='font-bold opacity-70'>Union Bank Details</span>             
            </div>    
            <div className="overflow-x-auto">
              <table className="table">
                <thead>
                  <tr>
                    <th>Account Numbers</th>
                    <th>Name</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><input type="text" value={payload?.account_number || ""} name="account_number" placeholder="Type here" className="input input-bordered w-full" onChange={(e)=> setPayload({...payload, [e.target.name]:e.target.value})} /></td>
                    <td><input type="text" value={payload?.bank_name || ""} name="bank_name" placeholder="Type here" className="input input-bordered w-full" onChange={(e)=> setPayload({...payload, [e.target.name]:e.target.value})} /></td>
                  </tr>
                </tbody>
              </table>
            </div>

         
            <p  className="text-red text-xs italic text-red-500 ml-2 error-message"></p>
            <div className="modal-action">
                <button type='submit' className="btn bg-[#0984e3] hover:bg-[#0984e3] text-white w-[40%]">
                   SUBMIT PAYROLL
                   </button>
                <button type='button' className="btn shadow" onClick={()=>{
                   document.getElementById('employee_payroll').close();
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