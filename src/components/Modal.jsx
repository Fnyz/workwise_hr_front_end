import React from 'react'
import moment from 'moment'
function Modal({title, payload, setPayload, handleSubmitPayload,  data, data_id, setReuseDataId, load, childtitle, error, setError, buttonLoad}) {

  return (
    <dialog id="my_modal_5" className="modal">
    <div className="modal-box">
        {load ? (
            <div className='ml-5'>
            <span className="loading loading-ring loading-lg text-success"></span>
            </div>
        ): (
            <>
              <form method="dialog" onClick={()=> {
        setReuseDataId("")
        setPayload({})
      }}>
        <button  className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
      </form>
      <h3 className="font-bold text-lg">{data_id ? 'UPDATE':'ADD'} {title === "LEAVE APPLICATION" ? childtitle : title}</h3>
        <label className="form-control w-full mt-2">
            
            {title === "LEAVE APPLICATION" && childtitle === "YOUR LEAVE APPLICATION" && (
                <>
                 <label className="form-control w-full">
                 <div className="label">
                     <span className="label-text">Leave type:</span>
                 </div>
                 <select value={payload.leave_type || ""} name='leave_type'  className="select select-bordered w-full  uppercase font-semibold opacity-80" onChange={(e)=> {
        
                       const leaveNumberOfDays = e.target.options[e.target.selectedIndex].dataset.numberOfDays;
                       setPayload({...payload, [e.target.name]:e.target.value, days:leaveNumberOfDays , start_date: "", end_date: ""})


                 }}>
                    <option className='cursor-not-allowed' >Select here</option>
                    {data.map((Ltype, i)=>{
                        return <option key={i} value={Ltype.id}  data-number-of-days={Ltype.leave_number_of_days}>{Ltype.leave_type} {`(${Ltype.leave_number_of_days} ${Ltype.leave_number_of_days > 1 ? "days": "day"}) `}</option>
                    })}
                 </select>
                 <p  className="text-red text-xs italic mt-2 text-red-500 ml-2 error-message">{error && error['leave_type_id']}</p>
             </label>
             {payload?.hris_hr_or_admin?.length > 0 ? 
             (
                <>
                <div className="label">
                     <span className="label-text">Choose head for the approval:</span>
                </div>
              
                <select  name="head_id" value={payload.head_id || ""} className="select select-bordered w-full" onChange={(e)=> {
                    let emp_rle = payload.hris_hr_or_admin.find(d => d.head_id === e.target.value)?.emp_role
                    setPayload({...payload, [e.target.name]:e.target.value, emp_role:emp_rle})

                    }}>
                    <option >Select here</option>
                    {payload.hris_hr_or_admin.map((hr,i)=>{
                        return <option key={i} value={hr.head_id}>{hr.employee_full_name}</option>
                    })}
                </select>
                </>
             ):(

                 <label className="form-control w-full">
                     <div className="label">
                         <span className="label-text">Department Head:</span>
                     </div>
                     <input type="text" value={payload.department_head || ""} name='department_head'  className="input input-bordered w-full font-bold" disabled  onChange={(e)=> setPayload({...payload, [e.target.name]:e.target.value})} />
                 </label>
             )}
                </>
            )}

            {title === "HOLIDAYS"  && (
                <>
                    <div className="label">
                        <span className="label-text">{title.charAt(0).toUpperCase() + title.slice(1).toLowerCase()}:</span>
                    </div>
                    <input type="text" value={payload.name || ""} name='name'  placeholder="Type here" className="input input-bordered w-full" onChange={(e)=> setPayload({...payload, [e.target.name]:e.target.value})} />
                    <p  className="text-red text-xs italic mt-2 text-red-500 ml-2 error-message">{error && error['holiday']}</p>
                </>
            )}

            {title === "LEAVE TYPE"  && (
                <>
                    <div className="label">
                        <span className="label-text">{title.charAt(0).toUpperCase() + title.slice(1).toLowerCase()}:</span>
                    </div>
                    <input type="text" value={payload.name || ""} name='name'  placeholder="Type here" className="input input-bordered w-full" onChange={(e)=> setPayload({...payload, [e.target.name]:e.target.value})} />
                    <p  className="text-red text-xs italic mt-2 text-red-500 ml-2 error-message">{error && error['leave_type']}</p>
                </>
            )}

            
        </label>
        {(title === "LEAVE APPLICATION" && childtitle === "YOUR LEAVE APPLICATION") && (
            <label className="form-control w-full">
            <div className="label">
                <span className="label-text">Apply Date:</span>
            </div>
            <input type="date"  value={payload.apply_date || ""} name='apply_date' placeholder="Type here" className="input input-bordered w-full" onChange={(e)=> {
                setPayload({...payload, [e.target.name]:e.target.value})
            }}  />
               <p  className="text-red text-xs italic mt-2 text-red-500 ml-2 error-message">{error && error['leave_apply_date'] }</p>
        </label>
        )}
        
        {title === "HOLIDAYS"  && (
        <>
        <label className="form-control w-full">
            <div className="label">
                <span className="label-text">Start Date:</span>
            </div>
            <input type="date" value={payload.start_date || ""} name="start_date" placeholder="Type here" className="input input-bordered w-full" onChange={(e)=> {              
                setPayload({...payload, [e.target.name]:e.target.value})
            }} />
            <p  className="text-red text-xs italic mt-2 text-red-500 ml-2 error-message">{error && error['holiday_start_date']}</p>
        </label>

        <label className="form-control w-full">
            <div className="label">
                <span className="label-text">End Date:</span>
            </div>
            <input type="date" value={payload.end_date || ""} name="end_date" placeholder="Type here" className="input input-bordered w-full"  onChange={(e)=> setPayload({...payload, [e.target.name]:e.target.value})} />
            <p  className="text-red text-xs italic mt-2 text-red-500 ml-2 error-message">{error && error['holiday_end_date']}</p>
        </label>
        </>
    )}

        {(title === "LEAVE APPLICATION" && childtitle === "YOUR LEAVE APPLICATION")  && (
                <>
                <label className="form-control w-full">
                    <div className="label">
                        <span className="label-text">Start Date:</span>
                    </div>
                    <input type="date" value={payload.start_date || ""} name="start_date" placeholder="Type here" className="input input-bordered w-full" onChange={(e)=> {
                        if(payload.leave_type === "Select here") {
                            setError({
                                leave_type_id: "Leave type id field is required."
                            })
                            setTimeout(() => {
                                setError(null)
                            }, 3000);
                            return;
                        }else{
                            const newDate = new Date(e.target.value);
                            newDate.setDate(newDate.getDate() + payload.days)
                            setPayload({...payload, [e.target.name]:e.target.value, end_date:moment(newDate).format("YYYY-MM-DD")})
                        }
                        
                    }} />
                           <p  className="text-red text-xs italic mt-2 text-red-500 ml-2 error-message">{error && error['leave_start_date'] }</p>
                </label>

                <label className="form-control w-full">
                    <div className="label">
                        <span className="label-text">End Date:</span>
                    </div>
                    <input type="date" value={payload.end_date || ""} name="end_date" placeholder="Type here" className="input input-bordered w-full" onChange={(e)=> setPayload({...payload, [e.target.name]:e.target.value})} />
                    <p  className="text-red text-xs italic mt-2 text-red-500 ml-2 error-message">{error && error['leave_end_date'] }</p>
                </label>

                <label className="form-control w-full">
                    <div className="label">
                        <span className="label-text">Reason to leave:</span>
                    </div>
                <textarea value={payload.leave_reason} name='leave_reason' className="textarea textarea-bordered w-full" placeholder="Bio" onChange={(e)=> setPayload({...payload, [e.target.name]:e.target.value})} ></textarea>
                <p  className="text-red text-xs italic mt-2 text-red-500 ml-2 error-message">{error && error['leave_reason'] }</p>
                </label>
                </>
            )}



        {title === "LEAVE TYPE" && (
            <>
            <label className="form-control w-full">
                <div className="label">
                    <span className="label-text">Number of Days:</span>
                </div>
                <input type="number" value={payload.number_of_days || ""} name="number_of_days" placeholder="Type here" className="input input-bordered w-full" onChange={(e)=> setPayload({...payload, [e.target.name]:e.target.value})} />
                <p  className="text-red text-xs italic mt-2 text-red-500 ml-2 error-message">{error && error['leave_number_of_days']}</p>
            </label>
            <label className="form-control w-full">
                <div className="label">
                    <span className="label-text">Status:</span>
                </div>
                <select value={payload.status || ""} name="status" className="select select-bordered w-full" onChange={(e)=> setPayload({...payload, [e.target.name]:e.target.value})}>
                    <option >Select here</option>
                    <option value="ACTIVE">ACTIVE</option>
                    <option value="INACTIVE">INACTIVE</option>
                </select>
                <p  className="text-red text-xs italic mt-2 text-red-500 ml-2 error-message">{error && error['leave_status']}</p>
            </label>
            </>
        )}

        
        {childtitle === "DEPARTMENT APPLICATION"  && (
            <label className="form-control w-full">
                <div className="avatar my-5 self-center">
                    <div className="w-24 rounded-full ring ring-success ring-offset-base-100 ring-offset-2">
                        <img src={`${payload.leave_image || "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg"}`} />
                    </div>
                </div>

                <div className="stats shadow mt-2">
                    <div className="stat">
                        <div className="stat-figure text-success">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                         <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5m-9-6h.008v.008H12v-.008ZM12 15h.008v.008H12V15Zm0 2.25h.008v.008H12v-.008ZM9.75 15h.008v.008H9.75V15Zm0 2.25h.008v.008H9.75v-.008ZM7.5 15h.008v.008H7.5V15Zm0 2.25h.008v.008H7.5v-.008Zm6.75-4.5h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V15Zm0 2.25h.008v.008h-.008v-.008Zm2.25-4.5h.008v.008H16.5v-.008Zm0 2.25h.008v.008H16.5V15Z" />
                        </svg>
                        </div>
                      
                        <div className="stat-title  font-semibold">Apply date for / <span className='font-bold uppercase'>{payload.leave_type_name}:</span></div>
                        <div className="stat-value text-success text-[25px] opacity-70">{moment(payload.apply_date).format("LL")}</div>
                    </div>
                </div>

                <div className="stats shadow mt-2">
                    <div className="stat">
                        <div className="stat-title  font-semibold">Start date:</div>
                        <div className="stat-value text-success text-[25px] opacity-70">{moment(payload.start_date).format("LL")}</div>
                    </div>

                    <div className="stat">
                        <div className="stat-title  font-semibold">End date:</div>
                        <div className="stat-value text-success text-[25px] opacity-70">{moment(payload.end_date).format("LL")}</div>
                    </div>
                </div>

                <label className="form-control mt-2">
                    <div className="label">
                        <span className="label-text  font-semibold">Reason to leave:</span>
                    </div>
                    <textarea className="textarea textarea-bordered h-24 font-bold capitalize opacity-70" disabled name='leave_reason' value={payload.leave_reason} onChange={(e)=> setPayload({...payload, [e.target.name]:e.target.value})}></textarea>
                </label>

                

                <div className="label mt-2">
                    <span className="label-text font-semibold">UPDATE STATUS</span>
                </div>

                <select value={payload.leave_status}  name="leave_status" className="select select-bordered w-full" onChange={(e)=> setPayload({...payload, [e.target.name]:e.target.value})}>
                    <option >Select here</option>
                    <option value="PENDING">PENDING</option>
                    <option value="DISAPPROVED">DISAPPROVED</option>
                    <option value="APPROVED">APPROVED</option>
                </select>
              
            </label>
        )}


        {childtitle === "HEAD'S APPLICATION" && title === "LEAVE APPLICATION" && (
            <label className="form-control w-full">
                <div className="avatar my-5 self-center">
                    <div className="w-24 rounded-full ring ring-success ring-offset-base-100 ring-offset-2">
                        <img src={`${payload.leave_image || "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg"}`} />
                    </div>
                </div>

                <div className="stats shadow mt-2">
                    <div className="stat">
                        <div className="stat-figure text-success">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                         <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5m-9-6h.008v.008H12v-.008ZM12 15h.008v.008H12V15Zm0 2.25h.008v.008H12v-.008ZM9.75 15h.008v.008H9.75V15Zm0 2.25h.008v.008H9.75v-.008ZM7.5 15h.008v.008H7.5V15Zm0 2.25h.008v.008H7.5v-.008Zm6.75-4.5h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V15Zm0 2.25h.008v.008h-.008v-.008Zm2.25-4.5h.008v.008H16.5v-.008Zm0 2.25h.008v.008H16.5V15Z" />
                        </svg>
                        </div>
                      
                        <div className="stat-title  font-semibold">Apply date for / <span className='font-bold uppercase'>{payload.leave_type_name}:</span></div>
                        <div className="stat-value text-success text-[25px] opacity-70">{moment(payload.apply_date).format("LL")}</div>
                    </div>
                </div>

                <div className="stats shadow mt-2">
                    <div className="stat">
                        <div className="stat-title  font-semibold">Start date:</div>
                        <div className="stat-value text-success text-[25px] opacity-70">{moment(payload.start_date).format("LL")}</div>
                    </div>

                    <div className="stat">
                        <div className="stat-title  font-semibold">End date:</div>
                        <div className="stat-value text-success text-[25px] opacity-70">{moment(payload.end_date).format("LL")}</div>
                    </div>
                </div>

                <label className="form-control mt-2">
                    <div className="label">
                        <span className="label-text  font-semibold">Reason to leave:</span>
                    </div>
                    <textarea className="textarea textarea-bordered h-24 font-bold capitalize opacity-70" disabled name='leave_reason' value={payload.leave_reason} onChange={(e)=> setPayload({...payload, [e.target.name]:e.target.value})}></textarea>
                </label>

                

                <div className="label mt-2">
                    <span className="label-text font-semibold">UPDATE STATUS</span>
                </div>

                <select value={payload.leave_status}  name="leave_status" className="select select-bordered w-full" onChange={(e)=> setPayload({...payload, [e.target.name]:e.target.value})}>
                    <option >Select here</option>
                    <option value="PENDING">PENDING</option>
                    <option value="DISAPPROVED">DISAPPROVED</option>
                    <option value="APPROVED">APPROVED</option>
                </select>
              
            </label>
        )}
      
        
        
        {title === "HOLIDAYS" && (
            <label className="form-control w-full">
                <div className="label">
                    <span className="label-text">Year:</span>
                </div>
                <input value={payload.year || ""} name="year" type="month" placeholder="Type here" className="input input-bordered w-full" onChange={(e)=> setPayload({...payload, [e.target.name]:e.target.value})} />
                <p  className="text-red text-xs italic mt-2 text-red-500 ml-2 error-message">{error && error['holiday_year']}</p>
            </label>
        )}
      
     
        <div className="modal-action w-full">
            <button type='button' className="btn bg-[#0984e3] hover:bg-[#0984e3] text-white w-full" onClick={handleSubmitPayload}>
                {buttonLoad ? (
                    <>
                    <span className="loading loading-spinner loading-sm"></span>
                    PLEASE WAIT..
                    </>
                ): data_id ? 'UPDATE': 'SUBMIT'}
            </button>
        </div>


            </>
        )}
    
    </div>
  </dialog>
  )
}

export default Modal