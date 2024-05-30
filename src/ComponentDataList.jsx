export const ComponentDataList = ({ind, chilIn, data, moment, showReusableData, department_id, id, handleRemoveData}) => {
 

  const duration = (start_date, end_date) => {
    const currentDate = new Date(start_date);
    const endDate = new Date(end_date);
    const differenceInMs = endDate - currentDate;
    const millisecondsInHour  =1000 * 60 * 60;
    const millisecondsInDay = millisecondsInHour * 24;
    const remainingHours = Math.floor(differenceInMs / millisecondsInHour);
    const remainingDays = Math.floor(differenceInMs / millisecondsInDay);
    return `${remainingHours} hours in ${remainingDays} days`;
  }


  
    if(!data.length){
     return (
      <tr>
          <td className="p-4 whitespace-nowrap text-sm font-semibold text-gray-900">
          No data found!
          </td>
      </tr>
     )
    }
    



    switch (ind) {
     
      case 1:
        return data.length && data.map((l, i)=>{
            return (
            <tr key={i}>
            <td className="whitespace-nowrap">
              <div className="flex items-center gap-3">
                <div>
                  <div className="font-bold uppercase">{l.leave_type}</div>
                  <div className="text-sm opacity-50"> {l.leave_number_of_days} {l.leave_number_of_days > 1 ? "days": "day"} for this leave</div>
                </div>
              </div>
            </td>
            <td>
              <span className={`badge badge-ghost badge-sm font-bold ${l.leave_status === "ACTIVE" ? "text-blue-500": "text-red-500"}`}>{l.leave_status}</span>
            </td>
            <td className="p-4 whitespace-nowrap text-sm font-semibold text-gray-900 flex gap-2" >
              <div onClick={()=> handleRemoveData(l.id, 'leave_type')}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5 text-red-600 cursor-pointer transition-all opacity-75 hover:opacity-100">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                </svg>
              </div>
              <span>/</span>
              <div onClick={() => showReusableData(l.id, null, 'leave_type')}>
                <svg  xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5 text-[#0984e3] cursor-pointer transition-all opacity-75 hover:opacity-100">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                </svg>
              </div>    
            </td>
          </tr>
     
            )
         })

       case 2:

        if(chilIn === 0) {
          return data?.length > 0 && data.map((l, i)=>{
            return (
            <tr key={i} className={`${l.leave_id === parseInt(id) ? "bg-base-200": ""}`}>
             
            <td className=" whitespace-nowrap ">
              <div className="flex items-center gap-3">
                <div className="avatar">
                  <div className="mask mask-squircle w-12 h-12">
                    <img src={l.employee_image ? l.employee_image : "https://img.daisyui.com/tailwind-css-component-profile-2@56w.png"} alt="Avatar Tailwind CSS Component" />
                  </div>
                </div>
                <div>
                  <div className="font-bold uppercase">{l.employee_name}</div>
                  <div className="text-sm opacity-50">{l.employee_id}</div>
                </div>
              </div>
            </td>
            <td className=" whitespace-nowrap ">
             <span className="font-semibold uppercase">{l.leave_type}</span>
              <br/>
              <span className="badge badge-ghost badge-sm opacity-70">Apply on {moment(l.leave_apply_date).format("LL")}.</span>
            </td>
            <td className=" whitespace-nowrap ">{moment(l.leave_start_date).format("LL")}</td>
            <td className=" whitespace-nowrap ">{moment(l.leave_end_date).format("LL")}</td>
            <td className=" whitespace-nowrap "> {duration(l.leave_start_date, l.leave_end_date)}</td>
            <td className=" whitespace-nowrap ">
              <span className={`badge badge-ghost badge-sm p-2 font-semibold ${l.leave_status === "PENDING" || l.leave_status === "DISAPPROVED" ? "text-red-500" : "text-blue-500"}`}>{l.leave_status}</span>
            </td>
            <td className="p-4 whitespace-nowrap text-sm font-semibold mt-2 text-gray-900 flex gap-2">
                     <div onClick={()=> showReusableData(l.leave_id, department_id, 'leave')}>
                     <svg  xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5 text-[#0984e3] cursor-pointer transition-all opacity-75 hover:opacity-100">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                     </svg>
                     </div>
                   
            </td>
            </tr>
     
            )
         })
      
        }else if(chilIn === 1){

          return data?.length && data.map((l, i)=>{
            return (
            <tr key={i} className={`${l.leave_id === parseInt(id) ? "bg-base-200": ""}`}>
            <td className=" whitespace-nowrap ">
              <div className="flex items-center gap-3">
                <div className="avatar">
                  <div className="mask mask-squircle w-12 h-12">
                    <img src={l.employee_image ? l.employee_image : "https://img.daisyui.com/tailwind-css-component-profile-2@56w.png"} alt="Avatar Tailwind CSS Component" />
                  </div>
                </div>

                <div>
                  <div className="font-bold uppercase ">{l.employee_name}</div>
                  <div className={`text-sm badge badge-ghost badge-sm `}> Your application is {moment(l.leave_status_date_time).format("LL") === "Invalid date" ? " not checked yet which is currently " : ""} <span className={`font-semibold ${l.leave_status === "PENDING" || l.leave_status === "DISAPPROVED" ? "text-red-500" : "text-blue-500"} mr-1 ml-1`}> {l.leave_status}. </span> {moment(l.leave_status_date_time).format("LL") === "Invalid date" ? "" : `on ${moment(l.leave_status_date_time).calendar()}`}</div>
                </div>
              </div>
            </td>
            {l.leave_type ? (
            <td className=" whitespace-nowrap ">
              <span className="font-semibold uppercase">{l.leave_type}</span>
              <br/>
              <span className="badge badge-ghost badge-sm">Apply on {moment(l.leave_apply_date).format("LL")}</span>
            </td>
            ): (
            <td className=" whitespace-nowrap ">
               <span className="badge badge-ghost badge-sm text-red-500 font-semibold"> DELETED TYPE PLEASE CHOOSE OTHER TYPE</span>
            </td>
            )}
            <td className=" whitespace-nowrap "> {moment(l.leave_start_date).format("LL")}</td>
            <td className=" whitespace-nowrap "> {moment(l.leave_end_date).format("LL")}</td>
            <td className=" whitespace-nowrap "> {duration(l.leave_start_date, l.leave_end_date)}</td>
            <td className="p-4 whitespace-nowrap text-sm font-semibold text-gray-900 flex gap-2">
                     
                     {l.leave_status !== "APPROVED" && (
                      <>
              
                     <div onClick={() => showReusableData(l.leave_id, department_id, 'leave')}>
                      <svg  xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5 text-[#0984e3] cursor-pointer transition-all opacity-75 hover:opacity-100">
                          <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                      </svg>
                     </div>
                      </>
                     )}
                   
               </td>
            </tr>


     
            )
         })
            
        }else{
          return data?.length && data.map((l, i)=>{
         
            return (
            <tr key={i}>
               <td className=" whitespace-nowrap ">
                <div className="flex items-center gap-3">
                  <div className="avatar">
                    <div className="mask mask-squircle w-12 h-12">
                      <img src={l.employee_image ? l.employee_image : "https://img.daisyui.com/tailwind-css-component-profile-2@56w.png"} alt="Avatar Tailwind CSS Component" />
                    </div>
                  </div>
                  <div>
                  <div className="font-bold">{l.employee_name} ({l.employee_role}) </div>
                  <div className="text-sm opacity-50">{l.employee_id}</div>
                </div>
                </div>
              </td>

              <td>
                <span className="font-semibold">{l.department}</span>
                <br/>
                <span className="badge badge-ghost badge-sm opacity-80">{l.position}</span>
            </td>
               
          
            <td>
             <span className="font-semibold uppercase">{l.leave_type}</span>
              <br/>
              <span className="badge badge-ghost badge-sm opacity-70">Apply on {moment(l.leave_apply_date).format("LL")}</span>
            </td>
  
               <td className="p-4 whitespace-nowrap text-sm font-semibold text-gray-500 ">
                {moment(l.leave_start_date).format("LL")}
               </td>
               <td className="p-4 whitespace-nowrap text-sm font-semibold text-gray-500">
                {moment(l.leave_end_date).format("LL")}
               </td>
               <td className="p-4 whitespace-nowrap text-sm font-semibold text-gray-500">
                 {duration(l.leave_start_date, l.leave_end_date)}
               </td>
               <td>
               <span className={`badge badge-ghost badge-sm font-bold ${l.leave_status === "PENDING" || l.leave_status === "DISAPPROVED" ? "text-red-500" : "text-blue-500"}`}>{l.leave_status}</span>
             </td>
               <td className="p-4 whitespace-nowrap text-sm font-semibold text-gray-900 flex gap-2">
                     <div  onClick={() => showReusableData(l.leave_id, department_id, 'leave')}>
                     <svg  xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5 text-[#0984e3] cursor-pointer transition-all opacity-75 hover:opacity-100">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                     </svg>
                     </div>
                   
               </td>
            </tr>
     
            )
         })
        }
         
      default:
        return data.length && data.map((h, i)=>{
          return (
            <tr key={i}>
            <td className="whitespace-nowrap">
              <div className="flex items-center gap-3">
                <div>
                  <div className="font-bold uppercase"> {h.holiday}</div>
                  <div className="text-sm opacity-50">{moment(h.holiday_start_date).format("LL")}</div>
                </div>
              </div>
            </td>
            <td className="whitespace-nowrap">
              <span className="badge badge-ghost badge-sm font-semibold">{moment(h.holiday_end_date).format("LL")}</span>
            </td>
            <td className="font-bold opacity-80 whitespace-nowrap">{h.number_of_days} {`day${h.number_of_days > 1 ? "'s":""}`}</td>
            <td className="font-semibold whitespace-nowrap">   {moment(h.holiday_year).format("MMMM, YYYY")}</td>
            <td className="p-4 whitespace-nowrap text-sm font-semibold text-gray-900 flex gap-2">
              <div onClick={()=> handleRemoveData(h.id, 'holiday')}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5 text-red-600 cursor-pointer transition-all opacity-75 hover:opacity-100">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                </svg>
              </div>
              <span>/</span>
              <div onClick={() => showReusableData(h.id, null, 'holiday')}>
                <svg  xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5 text-[#0984e3] cursor-pointer transition-all opacity-75 hover:opacity-100">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                </svg>
              </div>
                 
             </td>
          </tr>

   
          )
       })
      
    }
  }
