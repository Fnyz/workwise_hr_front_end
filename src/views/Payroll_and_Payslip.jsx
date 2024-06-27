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
  const [editNow, setEditNow] = useState(true);
  const [checkboxState, setCheckboxState] = useState([]);
  const [checkHead, setCheckboxHead] = useState(false);

  useEffect(() => {
    calculateDateRange();
  }, []);


  useEffect(()=>{
    getListOfEmployee();
    getAllRates();
    setEditNow(true);
    // getListOfPayroll();
 },[])

 const handleCheckboxChange = (e) => {
  setCheckboxHead(false)
  const checkboxId = e.target.id;
  const isChecked = e.target.checked;

  if (isChecked) {
    
   const res = compensations.find(cop =>  parseInt(cop.compe_id) === parseInt(checkboxId));
  
   if(!res.payroll_id){
    swal({
      title: "Oooops!",
      text: `Please fill out some information for the payslip issued for employee name: ${res.employee_name}`,
      icon: "error",
      dangerMode: true,
    })
   
    return;
   }

  

   const { 
    comp_bi_monthly,
    comp_night_diff,
    comp_allowance,
    comp_number_of_mins,
    comp_number_of_days,
    comp_holiday_or_ot,
    comp_comission,
    comp_sss,
    comp_phic,
    comp_hdmf,
    comp_withholding,
    comp_sss_loan,
    comp_hdmf_loan,
    comp_ar,
    comp_other_deduction,
    comp_loans_deduction,
    comp_retro,
    comp_others_additional,
    comp_hdmf_mp,
    comp_pay_roll_dates_begin,
    comp_pay_roll_dates_end,
    payslip_id

  } = res;
 



  let per_hour_day = (comp_bi_monthly / 21.75).toFixed(2);
     
  const total_minutes = (per_hour_day / 8 * comp_number_of_mins);
  const total_days = (per_hour_day * comp_number_of_days);
  const deductions_lwop = total_minutes + total_days;

    const totalEarn = comp_bi_monthly + comp_allowance  + comp_night_diff + comp_holiday_or_ot + (comp_retro + comp_others_additional) + comp_comission; 
      const totalDeduc = deductions_lwop + comp_withholding + comp_sss + comp_phic + comp_hdmf + comp_sss_loan + comp_hdmf_loan + comp_loans_deduction + comp_ar + comp_other_deduction; 
      const totalNetPay = parseFloat(totalEarn) - parseFloat(totalDeduc);
    
   
    setCheckboxState(prevIds => [...prevIds,
      {
        payroll_id: res.compe_id,
        earnings_per_month:comp_bi_monthly,
        earnings_allowance:comp_allowance,
        earnings_night_diff:comp_night_diff,
        earnings_holiday:comp_holiday_or_ot,
        earnings_retro:comp_retro + comp_others_additional,
        earnings_commission:comp_comission,
        deductions_lwop:deductions_lwop,
        deductions_holding_tax:comp_withholding,
        deductions_sss_contribution:comp_sss,
        deductions_phic_contribution:comp_phic,
        deductions_hmo:comp_hdmf_mp,
        deductions_sss_loan:comp_sss_loan,
        deductions_hmo_loan:comp_hdmf_loan,
        deductions_employee_loan:comp_loans_deduction + comp_ar,
        deductions_others:comp_other_deduction,
        deductions_hdmf_contribution:comp_hdmf,
        earnings_total:totalEarn,	
        deductions_total:totalDeduc,
        payslip_netPay:totalNetPay,
        pay_period_begin:comp_pay_roll_dates_begin,
        pay_period_end:comp_pay_roll_dates_end
      }
    ]);

   } else {
   setCheckboxState(prevIds => prevIds?.filter(d => parseInt(d.payroll_id) !== parseInt(checkboxId)));
   }

};


  const handleCheckAll  = (e) => {
  setCheckboxHead(prev => !prev)
  if(e.target.checked){
    setCheckboxState(
      
      compensations.filter(d => {
      if(!d.payroll_id){
        setCheckboxHead(false);
      
        swal({
          title: "Oooops!",
          text: `Please fill out some information for the payslip issued for employee name: ${employee_name}`,
          icon: "error",
          dangerMode: true,
        })
        return;
       }

      if(d.pay_period_begin !== payload.pay_roll_dates_begin && d.pay_period_end !== payload.pay_roll_dates_end){
        return d;
      }
    
    }).map(d => {
      const { 
        comp_bi_monthly,
        comp_night_diff,
        comp_allowance,
        comp_number_of_mins,
        comp_number_of_days,
        comp_holiday_or_ot,
        comp_comission,
        comp_sss,
        comp_phic,
        comp_hdmf,
        comp_withholding,
        comp_sss_loan,
        comp_hdmf_loan,
        comp_ar,
        comp_other_deduction,
        comp_loans_deduction,
        comp_retro,
        comp_others_additional,
        comp_hdmf_mp,
        comp_pay_roll_dates_begin,
        comp_pay_roll_dates_end,
        payslip_id,
        employee_name,
        pay_period_begin,
        pay_period_end
      } = d;

      let per_hour_day = (comp_bi_monthly / 21.75).toFixed(2);
       
      const total_minutes = (per_hour_day / 8 * comp_number_of_mins);
      const total_days = (per_hour_day * comp_number_of_days);
      const deductions_lwop = total_minutes + total_days;
        
        const totalEarn = comp_bi_monthly + comp_allowance  + comp_night_diff + comp_holiday_or_ot + (comp_retro + comp_others_additional) + comp_comission; 
        const totalDeduc = deductions_lwop + comp_withholding + comp_sss + comp_phic + comp_hdmf + comp_sss_loan + comp_hdmf_loan + comp_loans_deduction + comp_ar + comp_other_deduction; 
        const totalNetPay = parseFloat(totalEarn) - parseFloat(totalDeduc);
  
                  return {
                    payroll_id: d.compe_id,
                    earnings_per_month:comp_bi_monthly,
                    earnings_allowance:comp_allowance,
                    earnings_night_diff:comp_night_diff,
                    earnings_holiday:comp_holiday_or_ot,
                    earnings_retro:comp_retro + comp_others_additional,
                    earnings_commission:comp_comission,
                    deductions_lwop:deductions_lwop,
                    deductions_holding_tax:comp_withholding,
                    deductions_sss_contribution:comp_sss,
                    deductions_phic_contribution:comp_phic,
                    deductions_hdmf_contribution:comp_hdmf,
                    deductions_hmo:comp_hdmf_mp,
                    deductions_sss_loan:comp_sss_loan,
                    deductions_hmo_loan:comp_hdmf_loan,
                    deductions_employee_loan:comp_loans_deduction + comp_ar,
                    deductions_others:comp_other_deduction,
                    earnings_total:totalEarn,	
                    deductions_total:totalDeduc,
                    payslip_netPay:totalNetPay,
                    pay_period_begin:comp_pay_roll_dates_begin,
                    pay_period_end:comp_pay_roll_dates_end
          
          }
     
    })
    
    )
  }else{
    setCheckboxState([]);
  }

  }



  
  




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


  

  const total_minutes = (per_hour_day / 8 * tardines_minutes);
  const total_days = (per_hour_day * tardines_days);
  const totalAmount = (bi_montly + night_diff + holiday_OT + incentive) - (total_minutes + total_days + sss + phic + hdmf);
  const totalNetPay = (parseFloat(totalAmount) + parseFloat(retro_others) + parseFloat(allowance)) - (parseFloat(withholding) + parseFloat(sss_loan) + parseFloat(ar_others))

  
  setPayload({
    ...payload,
    amount: bi_montly,
    tardines_total_minutes: parseFloat(total_minutes),
    tardines_total_days: parseFloat(total_days),
    taxable_income: parseFloat(totalAmount),
    totalNetPay: parseFloat(totalNetPay)
  })
}

const getAllRates = () => {
  setLoadPage(true)
  axiosClient.get("/rates")
  .then((data)=>{
    setLoadPage(false)
 
    let result = data.data.map(dt => {

      const { 
        rates_night_diff,
        rates_basic_salary,
        rates_allowance,
        comp_number_of_mins,
        comp_number_of_days,
        comp_holiday_or_ot,
        comp_comission,
        comp_sss,
        comp_phic,
        comp_hdmf,
        comp_withholding,
        comp_sss_loan,
        comp_hdmf_loan,
        comp_hdmf_mp,
        comp_ar,
        comp_other_deduction,
        comp_loans_deduction,
        comp_retro,
        comp_others_additional,
        payslip_id

      } = dt;
      
    

      let total_montly = rates_basic_salary + rates_night_diff + rates_allowance;
      let bi_montly = rates_basic_salary / 2 
      let night_diff = rates_night_diff / 2
      let allowance = rates_allowance / 2 
      let per_hour_day = (rates_basic_salary / 21.75).toFixed(2);
      let hourly = per_hour_day / 8
      let hourly_rate = (2.1 / 100) * hourly

     let total_minutes =  calculateTotalMinutes(per_hour_day, comp_number_of_mins)
     let total_days = calculateTotalDays(per_hour_day, comp_number_of_days)

     
      let taxable_income = calculateTaxableIncome(
        parseFloat(bi_montly),
        parseFloat(night_diff),
        parseFloat(comp_holiday_or_ot) || 0,
        parseFloat(comp_comission) || 0,
        parseFloat(total_minutes) || 0,
        parseFloat(total_days) || 0,
        parseFloat(comp_sss) || 0,
        parseFloat(comp_phic) || 0,
        parseFloat(comp_hdmf) || 0,
     ); 



     let totalNetPay = calculateNetpay(
     parseFloat(taxable_income), 
     parseFloat(comp_retro + comp_others_additional) || 0,
     parseFloat(allowance) || 0,
     parseFloat(comp_withholding) || 0, 
     parseFloat(comp_sss_loan) || 0, 
     parseFloat(comp_ar + comp_other_deduction + comp_loans_deduction) || 0,
     parseFloat(comp_hdmf_loan) || 0,
     parseFloat(comp_hdmf_mp) || 0)

  

    
      return {
        ...dt,
        total_montly,
        bi_montly,
        night_diff,
        allowance,
        hourly_rate,
        per_hour_day,
        hourly,
        taxable_income,
        totalNetPay,
        holiday_OT: comp_holiday_or_ot,
        incentive: comp_comission,
        tardines_minutes:comp_number_of_mins,
        tardines_days:comp_number_of_days,
        tardines_total_minutes:total_minutes,
        tardines_total_days:total_days,
        sss:comp_sss,
        phic:comp_phic,
        hdmf:comp_hdmf,
        withholding:comp_withholding,
        sss_loan:comp_sss_loan,
        hdmf_loan:comp_hdmf_loan,
        hdmf_mp:comp_hdmf_mp,
        ar_deduction: comp_ar,
        other_deduction: comp_other_deduction,
        loans_deduction: comp_loans_deduction,
        retro_additional: comp_retro,
        others_additional: comp_others_additional,
      }
    })


    setCompensations(result)
  
     const totalAmount = result.reduce((accumulator, currentValue) => {
       accumulator.allTaxableIncome += currentValue.taxable_income;
       accumulator.allNetPay += currentValue.totalNetPay;
       accumulator.allDeductions += 
       currentValue.tardines_total_minutes +  
       currentValue.tardines_total_days +
       currentValue.sss +
       currentValue.phic +
       currentValue.hdmf +
       currentValue.sss_loan +
       currentValue.hdmf_loan +
       currentValue.hdmf_mp;
       return accumulator;
     }, { allTaxableIncome: 0, allNetPay: 0, allDeductions: 0});
 
     setTotalDataAmount(totalAmount)
    
  })
}


const handleSubmitPayslip = (e) => {
  e.preventDefault();

  axiosClient.post('/payslip', {
    payslipData :checkboxState,
  } )
  .then((res)=>{
      swal({
        title: "Good job!",
        text: 'Payslip for employees is sent successfully!',
        icon: "success",
        button: "Okay!",
      });
      setCheckboxState([]);
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
  hdmf_loan = 0,
  hdmf_mp = 0
) => {
    return (parseFloat(totalAmount) + parseFloat(retro_others) + parseFloat(allowance)) - (parseFloat(withholding) + parseFloat(sss_loan) + parseFloat(ar_others) + parseFloat(hdmf_loan) + parseFloat(hdmf_mp))
}



const handleSubmitPayroll = () => {
  

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
    'comp_hdmf_loan': parseFloat(payload.hdmf_loan) ||0,
    'comp_hdmf_mp': parseFloat(payload.hdmf_mp) ||0,

    'comp_ar': parseFloat(payload.ar_deduction) ||0,
    'comp_other_deduction': parseFloat(payload.other_deduction) ||0,
    'comp_loans_deduction': parseFloat(payload.loans_deduction) ||0,

    'comp_retro': parseFloat(payload.retro_additional) ||0,
    
    'comp_others_additional': parseFloat(payload.others_additional) ||0,

    'comp_allowance': parseFloat(payload.allowance) ||0,
    'comp_pay_roll_dates': payload.pay_roll_dates,
    'comp_pay_roll_dates_begin': payload.pay_roll_dates_begin,
    'comp_pay_roll_dates_end': payload.pay_roll_dates_end
  };


  swal({
    title: "Are you sure?",
    text: "Once updated, you will not be able to recover this payroll?",
    icon: "warning",
    buttons: true,
    dangerMode: true,
  })
  .then((willDelete) => {
    if (willDelete) {
      if(payload.payroll_id){

        axiosClient.put(`/compensation/${payload.payroll_id}?${new URLSearchParams({...data, 
        action:"update_existing_payroll",
        rates_id: payload.rates_id
      }).toString()}`)
        .then(()=>{
          getAllRates();
          swal({
            title: "Good job!",
            text: 'Payroll is updated successfully!',
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
    
        axiosClient.post('/compensation', data )
        .then((res)=>{
  
          axiosClient.put(`/rates/${payload.rates_id}?${new URLSearchParams({ 
            rates_night_diff: data.comp_night_diff * 2,
            rates_allowance: data.comp_allowance * 2,
            rates_basic_salary: data.comp_bi_monthly * 2
          }).toString()}`)
            .then((d)=>{
              getAllRates();
              swal({
                title: "Good job!",
                text: 'Payroll is updated successfully!',
                icon: "success",
                button: "Okay!",
              });
            })
          
  
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
  
      
    } else {
      
      swal({
       title: "Oooops!",
       text: `Payroll is not updated, Thank you!`,
       icon: "error",
       dangerMode: true,
     })
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


                        <div role="tablist" className="tabs tabs-boxed w-full max-w-md mb-5">
                          <Link to="/payroll/payroll_summary" role="tab" className="tab  font-semibold bg-[#3498db] text-white uppercase">Payroll Summary</Link>
                          <Link to="/payroll/payslip_history" role="tab" className="tab font-semibold uppercase">Payslip History</Link>
                        </div>
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-7 mt-10">
                        <div className="relative flex flex-col bg-clip-border rounded-xl bg-white text-gray-700 shadow-md">
                                <div className="bg-clip-border mx-4 rounded-xl overflow-hidden bg-gradient-to-tr from-[#e74c3c] to-[#e74c3c] text-white shadow-[#e74c3c]/40 shadow-lg absolute -mt-4 grid h-16 w-16 place-items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6 text-white">
                                      <path d="M10.464 8.746c.227-.18.497-.311.786-.394v2.795a2.252 2.252 0 0 1-.786-.393c-.394-.313-.546-.681-.546-1.004 0-.323.152-.691.546-1.004ZM12.75 15.662v-2.824c.347.085.664.228.921.421.427.32.579.686.579.991 0 .305-.152.671-.579.991a2.534 2.534 0 0 1-.921.42Z" />
                                      <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM12.75 6a.75.75 0 0 0-1.5 0v.816a3.836 3.836 0 0 0-1.72.756c-.712.566-1.112 1.35-1.112 2.178 0 .829.4 1.612 1.113 2.178.502.4 1.102.647 1.719.756v2.978a2.536 2.536 0 0 1-.921-.421l-.879-.66a.75.75 0 0 0-.9 1.2l.879.66c.533.4 1.169.645 1.821.75V18a.75.75 0 0 0 1.5 0v-.81a4.124 4.124 0 0 0 1.821-.749c.745-.559 1.179-1.344 1.179-2.191 0-.847-.434-1.632-1.179-2.191a4.122 4.122 0 0 0-1.821-.75V8.354c.29.082.559.213.786.393l.415.33a.75.75 0 0 0 .933-1.175l-.415-.33a3.836 3.836 0 0 0-1.719-.755V6Z" clipRule="evenodd" />
                                    </svg>

                                </div>
                                <div className="p-4 text-right">
                                    <p className="block antialiased font-sans text-sm leading-normal font-semibold uppercase text-blue-gray-600">TOTAL Net PAY</p>
                                    <h4 className="block antialiased tracking-normal font-sans text-2xl font-normal leading-snug text-blue-gray-900">{totalDataAmount?.allNetPay?.toLocaleString('en-PH', { style: 'currency', currency: 'PHP' }) || "0.00"}</h4>
                                </div>
                                <div className="border-t border-blue-gray-50 p-4 flex gap-2 items-center justify-center">
                                <span className="block antialiased tracking-normal font-sans text-[10px] font-semibold leading-snug text-blue-gray-900 opacity-70">PERIOD:<span className=" text-red-500"> { moment(payload?.pay_roll_dates_begin).format("MMMM DD, YYYY") || ""}</span></span>
                                <span className='text-[10px]'>|</span>
                                <span className="block antialiased tracking-normal font-sans text-[10px] font-semibold leading-snug text-blue-gray-900 opacity-70">PAY DATE: :<span className=" text-red-500"> {moment(payload?.pay_roll_dates_end).format("MMMM DD, YYYY") || "" }</span></span>
                                </div>
                            </div>
                            <div className="relative flex flex-col bg-clip-border rounded-xl bg-white text-gray-700 shadow-md">
                                <div className="bg-clip-border mx-4 rounded-xl overflow-hidden bg-gradient-to-tr from-[#27ae60] to-[#27ae60] text-white shadow-[#27ae60]/40 shadow-lg absolute -mt-4 grid h-16 w-16 place-items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6 text-white">
                                      <path fillRule="evenodd" d="M17.663 3.118c.225.015.45.032.673.05C19.876 3.298 21 4.604 21 6.109v9.642a3 3 0 0 1-3 3V16.5c0-5.922-4.576-10.775-10.384-11.217.324-1.132 1.3-2.01 2.548-2.114.224-.019.448-.036.673-.051A3 3 0 0 1 13.5 1.5H15a3 3 0 0 1 2.663 1.618ZM12 4.5A1.5 1.5 0 0 1 13.5 3H15a1.5 1.5 0 0 1 1.5 1.5H12Z" clipRule="evenodd" />
                                      <path d="M3 8.625c0-1.036.84-1.875 1.875-1.875h.375A3.75 3.75 0 0 1 9 10.5v1.875c0 1.036.84 1.875 1.875 1.875h1.875A3.75 3.75 0 0 1 16.5 18v2.625c0 1.035-.84 1.875-1.875 1.875h-9.75A1.875 1.875 0 0 1 3 20.625v-12Z" />
                                      <path d="M10.5 10.5a5.23 5.23 0 0 0-1.279-3.434 9.768 9.768 0 0 1 6.963 6.963 5.23 5.23 0 0 0-3.434-1.279h-1.875a.375.375 0 0 1-.375-.375V10.5Z" />
                                    </svg>

                                </div>
                                <div className="pr-4 text-right">
                                    <p className="block antialiased font-sans text-[10px] leading-normal font-semibold uppercase text-blue-gray-600">TAXABLE INCOME</p>
                                    <h4 className="block antialiased tracking-normal font-sans text-sm font-normal leading-snug text-blue-gray-900">{totalDataAmount?.allTaxableIncome?.toLocaleString('en-PH', { style: 'currency', currency: 'PHP' }) || "0.00"}</h4>
                                </div>
                                <div className="p-4 text-right">
                                    <p className="block antialiased font-sans text-[10px] leading-normal font-semibold uppercase text-blue-gray-600">TAXABLE DEDUCTIONS</p>
                                    <h4 className="block antialiased tracking-normal font-sans text-sm font-normal leading-snug text-blue-gray-900">{totalDataAmount?.allDeductions?.toLocaleString('en-PH', { style: 'currency', currency: 'PHP' }) || "0.00"}</h4>
                                </div>
                                <div className="border-t border-blue-gray-50 p-2">
                                <div className="text-center">
                                    <p className="block antialiased font-sans text-[12px] leading-normal font-semibold uppercase text-red-500 opacity-70">TAXES & DEDUCTIONS</p>
                                </div>
                                </div>
                            </div>
                        </div>
      
                        <div hidden className="w-full flex gap-4 items-center my-2">
                              <p className="block antialiased font-sans text-sm leading-normal font-semibold uppercase        text-blue-gray-600 mb-2 opacity-70 ml-3">LIST OF EMPLOYEES:</p>
                                 {checkboxState.length > 0 && (
                                    <button className="btn  text-white btn-sm  btn-error" onClick={handleSubmitPayslip} >
                                       {checkboxState.length > 1? "Send Payslip to all": "Send Payslip"}
                                       </button>
                                 )}
                           </div>

                      
                     <div className="overflow-x-auto">
                      <table className="table min-w-full">
                        <thead>
                          <tr>
                
                            <th className='tracking-wider px-10'>EMPLOYEE NAME</th>
                            <th className='tracking-wider px-10'>BI-MONTLY</th>
                            <th className='tracking-wider px-10'>PER DAY/HOUR</th>
                            <th className='tracking-wider px-10'>NIGHT DIFF</th>
                            <th className='tracking-wider px-10'>HOLIDAY/OT</th>
                            <th className='tracking-wider px-10'>COMMISSION/BONUS</th>
                            <th className='tracking-wider px-10'>
                              <span className="text-red-500 ml-40">ABSENT/TARDINESS</span>
                              
                            <th className='tracking-wider pr-10'># mins.</th>
                            <th className='tracking-wider px-10'># days.</th>
                            <th className='tracking-wider px-10'>mins.</th>
                            <th className='tracking-wider '>days</th>
                            </th>
                            <th className='tracking-wider px-10'>
                              <span className="text-red-500 ml-40">GOVERNMENT CONTRIBUTION</span>
                              <th className='tracking-wider px-10'>SSS</th>
                              <th className='tracking-wider px-10'>PHIC</th>
                              <th className='tracking-wider px-10'>HDMF</th>
                            </th>
                            <th className='tracking-wider px-10'>TAXABLE INCOME</th>
                            <th className='tracking-wider px-10'>WITHHOLDING TAX</th>
                            <th className='tracking-wider px-10'>
                              <span className="text-red-500 ml-40">OTHER PAYMENTS AND DEDUCTIONS</span>
                              <th className='tracking-wider pr-10 '>SSS LOAN</th>
                              <th className='tracking-wider px-10 '>HDMF LOAN</th>
                              <th className='tracking-wider px-10 '>HDMF MP2</th>
                              <th className='tracking-wider px-10 '>AR</th>
                              <th className='tracking-wider px-10 '>OTHERS</th>
                              <th className='tracking-wider px-10 '>LOANS</th>
                            </th>
                            <th className='tracking-wider px-10'>
                              <span className="text-red-500 ml-40">ADDITIONAL</span>
                               <th className='tracking-wider px-10'>RETRO</th>
                               <th className='tracking-wider px-10'>OTHERS</th>
                               <th className='tracking-wider px-10'>ALLOWANCE</th>
                            </th>
                            <th className='tracking-wider px-10'>NET PAY</th>
                            <th className='tracking-wider px-10'>
                              <span className="text-red-500 ml-40">UNION BANK DETAILS</span>
                              <th className='tracking-wider px-10'>ACCOUNT NUMBER</th>
                              <th className='tracking-wider px-10'>ACCOUNT NAME</th>
                            </th>
                            <th className='tracking-wider px-10'>ACTION</th>
                            <th className='tracking-wider'>
                            
                              <label>
                                <input type="checkbox" className="checkbox" checked={checkHead}   onChange={handleCheckAll}/>
                              </label>
                           </th>
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
                                       <input type="number" min="0" step="0.01" value={!editNow && payload.employee_id == com.emp_id ? payload?.bi_montly : com?.bi_montly} disabled={!editNow && payload.employee_id == com.emp_id ? false: true}  name="bi_montly"  onChange={(e)=> setPayload({...payload, [e.target.name]:e.target.value})} onKeyUp={calculateSlip} placeholder="0.00" class="font-semibold  input input-bordered input-sm w-full max-w-xs whitespace-nowrap" />
                                      </td>
                                       <td className='whitespace-nowrap'>
                                       <input type="number" min="0" step="0.01" value={!editNow && payload.employee_id == com.emp_id ? payload.per_hour_day : com?.per_hour_day} disabled={!editNow && payload.employee_id == com.emp_id ? false: true } name="per_hour_day" onChange={(e)=> setPayload({...payload, [e.target.name]:e.target.value})} onKeyUp={calculateSlip} placeholder="0.00" class="font-semibold input input-bordered input-sm w-full max-w-xs whitespace-nowrap" />
                                      </td>
                                      <td className='whitespace-nowrap'>
                                       <input type="number" min="0" step="0.01" value={!editNow && payload.employee_id == com.emp_id ?  payload.night_diff : com?.night_diff} disabled={!editNow && payload.employee_id == com.emp_id ? false: true} name="night_diff" onChange={(e)=> setPayload({...payload, [e.target.name]:e.target.value})} onKeyUp={calculateSlip} placeholder="0.00" class="font-semibold input input-bordered input-sm w-full max-w-xs whitespace-nowrap" />
                                      </td>
                                      <td className='whitespace-nowrap'>
                                       <input type="number" min="0" step="0.01" value={!editNow && payload.employee_id == com.emp_id ? payload.holiday_OT: com?.holiday_OT} disabled={!editNow && payload.employee_id == com.emp_id ? false: true} name="holiday_OT" onChange={(e)=> setPayload({...payload, [e.target.name]:e.target.value})} onKeyUp={calculateSlip} placeholder="0.00" class="font-semibold input input-bordered input-sm w-full max-w-xs whitespace-nowrap" />
                                      </td>
                                      <td className='whitespace-nowrap'>
                                       <input type="number" min="0" step="0.01" value={!editNow && payload.employee_id == com.emp_id ? payload.incentive : com?.incentive} disabled={!editNow && payload.employee_id == com.emp_id ? false: true} name="incentive" onChange={(e)=> setPayload({...payload, [e.target.name]:e.target.value})} onKeyUp={calculateSlip} placeholder="0.00" class="font-semibold input input-bordered input-sm w-full max-w-xs whitespace-nowrap" />
                                      </td>
                                      <td className='whitespace-nowrap flex gap-2 items-center'>
                                       <input type="number" min="0" step="0.01" value={!editNow && payload.employee_id == com.emp_id ? payload.tardines_minutes : com?.tardines_minutes } disabled={!editNow && payload.employee_id == com.emp_id ? false: true} name="tardines_minutes" onChange={(e)=> setPayload({...payload, [e.target.name]:e.target.value})} onKeyUp={calculateSlip} placeholder="0.00" class="font-semibold mb-4 input input-bordered input-sm w-full max-w-xs whitespace-nowrap" />
                                       <input type="number" min="0" step="0.01" value={!editNow && payload.employee_id == com.emp_id ? payload.tardines_days: com?.tardines_days} disabled={!editNow && payload.employee_id == com.emp_id ? false: true} name="tardines_days" onChange={(e)=> setPayload({...payload, [e.target.name]:e.target.value})} onKeyUp={calculateSlip} placeholder="0.00" class="font-semibold mb-4 input input-bordered input-sm w-full max-w-xs whitespace-nowrap" />
                                       <input type="number" min="0" step="0.01" value={!editNow && payload.employee_id == com.emp_id ? payload.tardines_total_minutes?.toFixed(2) || "" : com?.tardines_total_minutes} disabled={!editNow && payload.employee_id == com.emp_id ? false: true} name="tardines_total_minutes" onChange={(e)=> setPayload({...payload, [e.target.name]:e.target.value})} onKeyUp={calculateSlip} placeholder="0.00" class="font-semibold mb-4 input input-bordered input-sm w-full max-w-xs whitespace-nowrap" />
                                       <input type="number" min="0" step="0.01" value={!editNow && payload.employee_id == com.emp_id ? payload.tardines_total_days?.toFixed(2) || "" : com?.tardines_total_days } disabled={!editNow && payload.employee_id == com.emp_id ? false: true} name="tardines_total_days" onChange={(e)=> setPayload({...payload, [e.target.name]:e.target.value})} onKeyUp={calculateSlip} placeholder="0.00" class="font-semibold mb-4 input input-bordered input-sm w-full max-w-xs whitespace-nowrap" />
                                      </td>
                                      <td className='whitespace-nowrap'>
                                        <td className='whitespace-nowrap '>
                                        <input type="number" min="0" step="0.01" value={!editNow && payload.employee_id == com.emp_id ? payload.sss : com?.sss} disabled={!editNow && payload.employee_id == com.emp_id ? false: true} name="sss" onChange={(e)=> setPayload({...payload, [e.target.name]:e.target.value})} onKeyUp={calculateSlip} placeholder="0.00" class="font-semibold input input-bordered input-sm w-full max-w-xs whitespace-nowrap" />
                                        </td>
                                        <td className='whitespace-nowrap'>
                                        <input type="number" min="0" step="0.01" value={!editNow && payload.employee_id == com.emp_id ? payload.phic: com?.phic} disabled={!editNow && payload.employee_id == com.emp_id ? false: true} name="phic" onChange={(e)=> setPayload({...payload, [e.target.name]:e.target.value})} onKeyUp={calculateSlip} placeholder="0.00" class="font-semibold input input-bordered input-sm w-full max-w-xs whitespace-nowrap" />
                                        </td>
                                        <td className='whitespace-nowrap'>
                                        <input type="number" min="0" step="0.01" value={!editNow && payload.employee_id == com.emp_id ? payload.hdmf : com?.hdmf} disabled={!editNow && payload.employee_id == com.emp_id ? false: true} name="hdmf" onChange={(e)=> setPayload({...payload, [e.target.name]:e.target.value})} onKeyUp={calculateSlip} placeholder="0.00" class="font-semibold input input-bordered input-sm w-full max-w-xs whitespace-nowrap" />
                                        </td>

                                      </td>
                                    
                                      <td className='whitespace-nowrap'>
                                      <span className="font-semibold opacity-75 text-red-500 ml-6">{!editNow && payload.employee_id == com.emp_id ?  payload?.taxable_income?.toLocaleString('en-PH', { style: 'currency', currency: 'PHP' }): com?.taxable_income?.toLocaleString('en-PH', { style: 'currency', currency: 'PHP' })}</span>
                                      </td>
                                      <td className='whitespace-nowrap'>
                                       <input type="number" min="0" step="0.01" value={!editNow && payload.employee_id == com.emp_id ?  payload.withholding : com?.withholding} disabled={!editNow && payload.employee_id == com.emp_id ? false: true} name="withholding" onChange={(e)=> setPayload({...payload, [e.target.name]:e.target.value})} onKeyUp={calculateSlip} placeholder="0.00" class="font-semibold input input-bordered input-sm w-full max-w-xs whitespace-nowrap" />
                                      </td>
                                      <td className='whitespace-nowrap'>
                                        <td className='whitespace-nowrap '>
                                        <input type="number" min="0" step="0.01" value={!editNow && payload.employee_id == com.emp_id ? payload.sss_loan:  com?.sss_loan} disabled={!editNow && payload.employee_id == com.emp_id ? false: true} name="sss_loan" onChange={(e)=> setPayload({...payload, [e.target.name]:e.target.value})} onKeyUp={calculateSlip} placeholder="0.00" class="font-semibold input input-bordered input-sm w-full max-w-xs whitespace-nowrap" />
                                        </td>
                                        <td className='whitespace-nowrap'>
                                        <input type="number" min="0" step="0.01" value={!editNow && payload.employee_id == com.emp_id ? payload.hdmf_loan : com?.hdmf_loan } disabled={!editNow && payload.employee_id == com.emp_id ? false: true} name="hdmf_loan" onChange={(e)=> setPayload({...payload, [e.target.name]:e.target.value})} onKeyUp={calculateSlip} placeholder="0.00" class="font-semibold input input-bordered input-sm w-full max-w-xs whitespace-nowrap" />
                                        </td>
                                        <td className='whitespace-nowrap'>
                                        <input type="number" min="0" step="0.01" value={!editNow && payload.employee_id == com.emp_id ?  payload.hdmf_mp  : com?.hdmf_mp} disabled={!editNow && payload.employee_id == com.emp_id ? false: true} name="hdmf_mp" onChange={(e)=> setPayload({...payload, [e.target.name]:e.target.value})} onKeyUp={calculateSlip} placeholder="0.00" class="font-semibold input input-bordered input-sm w-full max-w-xs whitespace-nowrap" />
                                        </td>
                                        <td className='whitespace-nowrap'>
                                        <input type="number" min="0" step="0.01" value={!editNow && payload.employee_id == com.emp_id ?  payload.ar_deduction : com?.ar_deduction} disabled={!editNow && payload.employee_id == com.emp_id ? false: true} name="ar_deduction" onChange={(e)=> setPayload({...payload, [e.target.name]:e.target.value})} onKeyUp={calculateSlip} placeholder="0.00" class="font-semibold input input-bordered input-sm w-full max-w-xs whitespace-nowrap" />
                                        </td>
                                        <td className='whitespace-nowrap'>
                                        <input type="number" min="0" step="0.01" value={!editNow && payload.employee_id == com.emp_id ?  payload.other_deduction : com?.other_deduction} disabled={!editNow && payload.employee_id == com.emp_id ? false: true} name="other_deduction" onChange={(e)=> setPayload({...payload, [e.target.name]:e.target.value})} onKeyUp={calculateSlip} placeholder="0.00" class="font-semibold input input-bordered input-sm w-full max-w-xs whitespace-nowrap" />
                                        </td>
                                         <td className='whitespace-nowrap'>
                                        <input type="number" min="0" step="0.01" value={!editNow && payload.employee_id == com.emp_id ?  payload.loans_deduction : com?.loans_deduction} disabled={!editNow && payload.employee_id == com.emp_id ? false: true} name="loans_deduction" onChange={(e)=> setPayload({...payload, [e.target.name]:e.target.value})} onKeyUp={calculateSlip} placeholder="0.00" class="font-semibold input input-bordered input-sm w-full max-w-xs whitespace-nowrap" />
                                        </td>
                                      </td>
                                      <td className='whitespace-nowrap flex gap-2'>
                                        <input type="number" min="0" step="0.01" value={!editNow && payload.employee_id == com.emp_id ?  payload.retro_additional : com?.retro_additional} disabled={!editNow && payload.employee_id == com.emp_id ? false: true} name="retro_additional" onChange={(e)=> setPayload({...payload, [e.target.name]:e.target.value})} onKeyUp={calculateSlip} placeholder="0.00" class="font-semibold input input-bordered input-sm w-full max-w-xs whitespace-nowrap" />
                                        <input type="number" min="0" step="0.01" value={!editNow && payload.employee_id == com.emp_id ?  payload.others_additional : com?.others_additional} disabled={!editNow && payload.employee_id == com.emp_id ? false: true} name="others_additional" onChange={(e)=> setPayload({...payload, [e.target.name]:e.target.value})} onKeyUp={calculateSlip} placeholder="0.00" class="font-semibold input input-bordered input-sm w-full max-w-xs whitespace-nowrap" />
                                        <input type="number" min="0" step="0.01" value={!editNow && payload.employee_id == com.emp_id ?   payload.allowance : com?.allowance} disabled={!editNow && payload.employee_id == com.emp_id ? false: true} name="allowance" onChange={(e)=> setPayload({...payload, [e.target.name]:e.target.value})} onKeyUp={calculateSlip} placeholder="0.00" class="font-semibold input input-bordered input-sm w-full max-w-xs whitespace-nowrap" />
                                      </td>
                                      
                                      <td className='whitespace-nowrap'>
                                      <span className="font-semibold opacity-75 text-red-500 ml-4">{!editNow && payload.employee_id == com.emp_id ? payload.totalNetPay?.toLocaleString('en-PH', { style: 'currency', currency: 'PHP' }) : com?.totalNetPay?.toLocaleString('en-PH', { style: 'currency', currency: 'PHP' })}</span>
                                      </td>
                                  
                                      <td className='whitespace-nowrap'>
                                        <td className='whitespace-nowrap px-10'>
                                        <span className="font-semibold opacity-75 pl-5">{com?.rates_account_num}</span>
                                        </td>
                                        <td className='whitespace-nowrap px-10'>
                                        <span className="font-semibold opacity-75 pl-5">{com?.rates_acount_name}</span>
                                        </td>
                                      </td>
                                      
                                      <td className="pt-6 px-2 whitespace-nowrap text-sm font-semibold text-gray-900 flex gap-2 ">
                                      <button type="button" className="ml-10" onClick={() =>{
                                          setEditNow((prev)=> !prev);
                                          setPayload({
                                            ...payload,
                                            employee_id: com.emp_id,
                                            bi_montly: com.bi_montly, 
                                            per_hour_day: com.per_hour_day,
                                            night_diff: com.night_diff,
                                            allowance: com.allowance,
                                            taxable_income:com.taxable_income,
                                            totalNetPay: com.totalNetPay,
                                            holiday_OT:com.holiday_OT,
                                            incentive:com.incentive,
                                            tardines_minutes:com.tardines_minutes,
                                            tardines_days:com.tardines_days,
                                            tardines_total_minutes:com.tardines_total_minutes,
                                            tardines_total_days:com.tardines_total_days,
                                            sss:com.sss,
                                            phic:com.phic,
                                            hdmf:com.hdmf,
                                            withholding:com.withholding,
                                            sss_loan:com.sss_loan,
                                            hdmf_loan:com.hdmf_loan,
                                            hdmf_mp:com.hdmf_mp,

                                            ar_deduction: com.ar_deduction,
                                            other_deduction: com.other_deduction,
                                            loans_deduction: com.loans_deduction,
                                            retro_additional: com.retro_additional,
                                            others_additional: com.others_additional,

                                            payroll_id:com.payroll_id,
                                            rates_id: com.compe_id
                                          })

                                          if(!editNow){
                                            handleSubmitPayroll();
                                          }
                                      }} >
                                        
                                      {!editNow && payload.employee_id === com.emp_id ? (
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-red-700 cursor-pointer transition-all opacity-75 hover:opacity-100">
                                          <path fillRule="evenodd" d="M8.603 3.799A4.49 4.49 0 0 1 12 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 0 1 3.498 1.307 4.491 4.491 0 0 1 1.307 3.497A4.49 4.49 0 0 1 21.75 12a4.49 4.49 0 0 1-1.549 3.397 4.491 4.491 0 0 1-1.307 3.497 4.491 4.491 0 0 1-3.497 1.307A4.49 4.49 0 0 1 12 21.75a4.49 4.49 0 0 1-3.397-1.549 4.49 4.49 0 0 1-3.498-1.306 4.491 4.491 0 0 1-1.307-3.498A4.49 4.49 0 0 1 2.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 0 1 1.307-3.497 4.49 4.49 0 0 1 3.497-1.307Zm7.007 6.387a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z" clipRule="evenodd" />
                                        </svg>

                                      ):(
                                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-blue-700 cursor-pointer transition-all opacity-75 hover:opacity-100">
                                        <path d="M21.731 2.269a2.625 2.625 0 0 0-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 0 0 0-3.712ZM19.513 8.199l-3.712-3.712-8.4 8.4a5.25 5.25 0 0 0-1.32 2.214l-.8 2.685a.75.75 0 0 0 .933.933l2.685-.8a5.25 5.25 0 0 0 2.214-1.32l8.4-8.4Z" />
                                        <path d="M5.25 5.25a3 3 0 0 0-3 3v10.5a3 3 0 0 0 3 3h10.5a3 3 0 0 0 3-3V13.5a.75.75 0 0 0-1.5 0v5.25a1.5 1.5 0 0 1-1.5 1.5H5.25a1.5 1.5 0 0 1-1.5-1.5V8.25a1.5 1.5 0 0 1 1.5-1.5h5.25a.75.75 0 0 0 0-1.5H5.25Z" />
                                      </svg>
                                      )}

                                      </button> 
                                    
                                      </td>
                                      <td className='whitespace-nowrap'>
                                        {com.pay_period_begin === payload.pay_roll_dates_begin && com.pay_period_end === payload.pay_roll_dates_end ? (
                                              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6 text-green-700 mb-3">
                                              <path fillRule="evenodd" d="M9 1.5H5.625c-1.036 0-1.875.84-1.875 1.875v17.25c0 1.035.84 1.875 1.875 1.875h12.75c1.035 0 1.875-.84 1.875-1.875V12.75A3.75 3.75 0 0 0 16.5 9h-1.875a1.875 1.875 0 0 1-1.875-1.875V5.25A3.75 3.75 0 0 0 9 1.5Zm6.61 10.936a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 14.47a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z" clipRule="evenodd" />
                                              <path d="M12.971 1.816A5.23 5.23 0 0 1 14.25 5.25v1.875c0 .207.168.375.375.375H16.5a5.23 5.23 0 0 1 3.434 1.279 9.768 9.768 0 0 0-6.963-6.963Z" />
                                            </svg>
                                        ):(
                                         
                                          <label>
                                            <input type="checkbox" id={com.compe_id} checked={checkboxState.some(d => parseInt(d.payroll_id) === parseInt(com.compe_id))}  className="checkbox" onChange={handleCheckboxChange} />
                                           </label>

                                        )}
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