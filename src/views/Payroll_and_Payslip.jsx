import { useEffect,useState } from 'react';
import axiosClient from '../axiosClient';
import moment from 'moment';
import swal from 'sweetalert';


function Compensation() {


  const [employees, setEmployees] = useState([]);
  const [employee_id, setEmpId] = useState("");
  

  useEffect(()=>{
    Promise.all([getDataList('employee')])
      .then((data) => {
        setEmployees(data[0].data)
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


  

  return (
    <div>
      <div className="ml-auto mb-6 lg:w-[75%] xl:w-[80%] 2xl:w-[85%]">
          <div className="bg-white shadow rounded-lg p-4 sm:p-6 xl:p-8 m-5">
                     <div className="mb-4 flex items-center  gap-5 max-md:flex-col-reverse max-md:gap-6">
                        <div className="flex-shrink-0 flex justify-center items-center gap-3" >
                        <div className='shadow-md p-1 bg-[#0984e3] rounded-md text-white cursor-pointer transition-all ease-in opacity-75 hover:opacity-100' onClick={()=>{
                           document.getElementById('employee_payslip').showModal();
                        }}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                            </svg>
                        </div>
                          <span className='font-bold opacity-70'>PAYSLIP</span>
                        </div>

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
            </div>
            
      </div> 

 


    
    <dialog id="employee_payslip" className="modal">
      <div className="modal-box w-11/12 max-w-5xl">
       <h3 className="font-bold text-lg mt-5">EMPLOYEE PAYSLIP</h3>
       <span className="label-text opacity-70 text-[12px]">Input all the fields below</span>
        <form  method="dialog" autoComplete="off">
           <div className='flex w-full gap-4'>
              <div className='flex justify-center items-center flex-col w-full mb-2'>
                <label className="form-control w-full ">
                    <div className="label">
                      <span className="label-text">Choose employee name:</span>
                  </div>
                    <select className="select select-bordered" onChange={(e) => {
                      if(e.target.value === "Pick one here"){
                        setEmpId("Pick employee please");
                      }else{
                        setEmpId(e.target.value)
                      }
                    }}>
                      <option selected>Pick one here</option>
                      {employees?.map(emp => {
                        return (
                          <option key={emp.id} value={emp.id}>{emp.employee_name} ({emp.position})</option>
                        )
                      })}
                    </select>
                </label>

                <label className="form-control w-full ">
                    <div className="label">
                      <span className="label-text">Choose employee name:</span>
                  </div>
                <input type="text" placeholder="Employee ID" value={employee_id} disabled className="input input-bordered w-full" />  
                </label>
                
              </div>
              <div className='w-full'>
              <label className="form-control w-full ">
                  <div className="label">
                    <span className="label-text">Pay Period Begin Date:</span>
                  </div>
                  <input type="date" placeholder="Input here..." className="input input-bordered w-full " />
                </label>
                <label className="form-control w-full ">
                  <div className="label">
                    <span className="label-text">Pay Period End Date:</span>
                  </div>
                  <input type="date" placeholder="Input here..." className="input input-bordered w-full " />
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
                <input type="number" className="grow" placeholder="Input here..." />
              </label>
              <label className="input input-bordered flex items-center gap-2">
                Per Day/Hour:
                <input type="number" className="grow" placeholder="Input here..." />
              </label>
              <label className="input input-bordered flex items-center gap-2">
                Allowance:
                <input type="number" className="grow" placeholder="Input here..." />
              </label>
              <label className="input input-bordered flex items-center gap-2">
                Night Diff:
                <input type="number" className="grow" placeholder="Input here..." />
              </label>
              <label className="input input-bordered flex items-center gap-2">
                Holiday:
                <input type="number" className="grow" placeholder="Input here..." />
              </label>
              <label className="input input-bordered flex items-center gap-2">
                Retro/Others:
                <input type="number" className="grow" placeholder="Input here..." />
              </label>
              <label className="input input-bordered flex items-center gap-2">
               Bonus/Commission:
                <input type="number" className="grow" placeholder="Input here..." />
              </label>
              <label className="input  flex items-center gap-2">

                <input type="hidden" className="grow" placeholder="Input here..." />
              </label>
              <label className="input  flex items-center gap-2">
 
                <input type="hidden" className="grow" placeholder="Input here..." />
              </label>
              <label className="input flex items-center gap-2">
                 <span className='font-bold'>TOTAL EARNINGS:</span> 
                <input type="number" disabled className="grow" placeholder="" />
              </label>
            </div>
             
            </div>
            <div className='w-full'>
            <p className="font-bold text-center text-md">DEDUCTIONS</p>
            <div className='my-2 flex flex-col gap-3'>
              <label className="input input-bordered flex items-center gap-2">
               LWOP/Lates/Undertime:
                <input type="number" className="grow" placeholder="Input here..." />
              </label>
              <label className="input input-bordered flex items-center gap-2">
                Withholding Tax:
                <input type="number" className="grow" placeholder="Input here..." />
              </label>
              <label className="input input-bordered flex items-center gap-2">
                SSS Contribution:
                <input type="number" className="grow" placeholder="Input here..." />
              </label>
              <label className="input input-bordered flex items-center gap-2">
               PHIC Contribution:
                <input type="number" className="grow" placeholder="Input here..." />
              </label>
              <label className="input input-bordered flex items-center gap-2">
               HMO:
                <input type="number" className="grow" placeholder="Input here..." />
              </label>
              <label className="input input-bordered flex items-center gap-2">
                SSS Loan:
                <input type="number" className="grow" placeholder="Input here..." />
              </label>
              <label className="input input-bordered flex items-center gap-2">
                HDMF Loan:
                <input type="number" className="grow" placeholder="Input here..." />
              </label>
              <label className="input input-bordered flex items-center gap-2">
                Employee Loan:
                <input type="number" className="grow" placeholder="Input here..." />
              </label>
              <label className="input input-bordered flex items-center gap-2">
                Others:
                <input type="number" className="grow" placeholder="Input here..." />
              </label>
              <label className="input  flex items-center gap-2">
                <span className='font-bold'>TOTAL DEDUCTION:</span> 
                <input type="number" disabled className="grow" placeholder="" />
              </label>
            </div>
            </div>
           </div>
           <div className="divider"></div> 
           <label className="input  flex items-center gap-2">
                <span className='font-bold'>NET SALARY:</span> 
                <input type="number" disabled className="grow" placeholder="" />
              </label>
         
            <p  className="text-red text-xs italic text-red-500 ml-2 error-message"></p>
            <div className="modal-action">
                <button type='submit' className="btn bg-[#0984e3] hover:bg-[#0984e3] text-white w-[40%]">
                   SUBMIT PAYSLIP
                   </button>
                <button type='button' className="btn shadow" onClick={()=>{
                   document.getElementById('employee_payslip').close();
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
         
          <form  method="dialog" autoComplete="off">
           <div className='flex w-full gap-4'>
              <div className='flex justify-center items-center flex-col w-full mb-2'>
                <label className="form-control w-full ">
                    <div className="label">
                      <span className="label-text">Choose employee name:</span>
                  </div>
                    <select className="select select-bordered" onChange={(e) => {
                      if(e.target.value === "Pick one here"){
                        setEmpId("Pick employee please");
                      }else{
                        setEmpId(e.target.value)
                      }
                    }}>
                      <option selected>Pick one here</option>
                      {employees?.map(emp => {
                        return (
                          <option key={emp.id} value={emp.id}>{emp.employee_name} ({emp.position})</option>
                        )
                      })}
                    </select>
                </label>

                <label className="form-control w-full ">
                    <div className="label">
                      <span className="label-text">Employee ID:</span>
                  </div>
                <input type="text" placeholder="Employee ID" value={employee_id} disabled className="input input-bordered w-full" />  
                </label>
                
              </div>
              <div className='w-full'>
              <label className="form-control w-full ">
                  <div className="label">
                    <span className="label-text">Payroll Dates:</span>
                  </div>
                  <input type="date" placeholder="Input here..." className="input input-bordered w-full " />
                </label>
           
              </div>
           </div>
           <div className="divider"></div> 
           <div className='flex w-full flex-col gap-4'>
            <div className='w-full'>
            <div className="flex-shrink-0 flex items-center gap-3 ml-2 mb-3" >
              <span className='font-bold opacity-70'>EARNINGS</span>             
              <div className='shadow-md p-1 bg-[#0984e3] rounded-md text-white cursor-pointer transition-all ease-in opacity-75 hover:opacity-100' onClick={()=>{
                  document.getElementById('employee_payslip').showModal();
                }}>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                  </svg>
                </div>
            </div>

            <div className="overflow-x-auto">
              <table className="table">
                {/* head */}
                <thead>
                  <tr>
                    <th>Bi-Monthly</th>
                    <th>Per Hour/day</th>
                    <th>Night  Differential</th>
                    <th>Holiday/OT</th>
                    <th>Commission/Incentive/ Bonus/ Others</th>
                  </tr>
                </thead>
                <tbody>
             
                  <tr >
                    <td><input type="text" placeholder="Type here" className="input input-bordered w-full max-w-xs" /></td>
                    <td><input type="text" placeholder="Type here" className="input input-bordered w-full max-w-xs" /></td>
                    <td><input type="text" placeholder="Type here" className="input input-bordered w-full max-w-xs" /></td>
                    <td><input type="text" placeholder="Type here" className="input input-bordered w-full max-w-xs" /></td>
                    <td><input type="text" placeholder="Type here" className="input input-bordered w-full max-w-xs" /></td>
                  </tr>
                 
                </tbody>
              </table>
            </div>
            {/* <div className='my-2 flex flex-col gap-3'>
              <label className="input input-bordered flex items-center gap-2">
                Per Month:
                <input type="number" className="grow" placeholder="Input here..." />
              </label>
              <label className="input input-bordered flex items-center gap-2">
                Per Day/Hour:
                <input type="number" className="grow" placeholder="Input here..." />
              </label>
              <label className="input input-bordered flex items-center gap-2">
                Allowance:
                <input type="number" className="grow" placeholder="Input here..." />
              </label>
              <label className="input input-bordered flex items-center gap-2">
                Night Diff:
                <input type="number" className="grow" placeholder="Input here..." />
              </label>
              <label className="input input-bordered flex items-center gap-2">
                Holiday:
                <input type="number" className="grow" placeholder="Input here..." />
              </label>
              <label className="input input-bordered flex items-center gap-2">
                Retro/Others:
                <input type="number" className="grow" placeholder="Input here..." />
              </label>
              <label className="input input-bordered flex items-center gap-2">
               Bonus/Commission:
                <input type="number" className="grow" placeholder="Input here..." />
              </label>
              <label className="input  flex items-center gap-2">

                <input type="hidden" className="grow" placeholder="Input here..." />
              </label>
              <label className="input  flex items-center gap-2">
 
                <input type="hidden" className="grow" placeholder="Input here..." />
              </label>
             
            </div> */}
             
            </div>
            <div className='w-full'>
            <div className="flex-shrink-0 flex items-center gap-3 ml-2 mb-3" >
              <span className='font-bold opacity-70'>DEDUCTIONS</span>             
              <div className='shadow-md p-1 bg-[#0984e3] rounded-md text-white cursor-pointer transition-all ease-in opacity-75 hover:opacity-100' onClick={()=>{
                  document.getElementById('employee_payslip').showModal();
                }}>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                  </svg>
                </div>
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
                    <td><input type="text" placeholder="Type here" className="input input-bordered w-full max-w-xs" /></td>
                    <td><input type="text" placeholder="Type here" className="input input-bordered w-full max-w-xs" /></td>
                    <td><input type="text" placeholder="Type here" className="input input-bordered w-full max-w-xs" /></td>
                    <td><input type="text" placeholder="Type here" className="input input-bordered w-full max-w-xs" /></td>
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
                    <td><input type="text" placeholder="Type here" className="input input-bordered w-full max-w-xs" /></td>
                    <td><input type="text" placeholder="Type here" className="input input-bordered w-full max-w-xs" /></td>
                    <td><input type="text" placeholder="Type here" className="input input-bordered w-full max-w-xs" /></td>
                  </tr>
                </tbody>
              </table>
            </div>
            </div>
           </div>
           <div className="divider"></div> 

         
            <p  className="text-red text-xs italic text-red-500 ml-2 error-message"></p>
            <div className="modal-action">
                <button type='submit' className="btn bg-[#0984e3] hover:bg-[#0984e3] text-white w-[40%]">
                   SUBMIT PAYSLIP
                   </button>
                <button type='button' className="btn shadow" onClick={()=>{
                   document.getElementById('employee_payslip').close();
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