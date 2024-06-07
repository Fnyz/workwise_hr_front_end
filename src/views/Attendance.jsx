import React, { useEffect ,useState} from 'react'
import { Link } from 'react-router-dom';
import moment from 'moment-timezone';
import 'moment-timezone/builds/moment-timezone-with-data';
import axios from 'axios';
import { hubStaffClient } from '../axiosClient';



function Attendance() {


   const [organizations, setOrganizations] = useState([])
   const [organization_id, setOrganization_id] = useState("")
   const [hubstaff_code, setHubstaff_code] =  useState("")


   const [startDate, setStartDate] = useState('');
   const [endDate, setEndDate] = useState('');
   const [currentTime, setCurrentTime] = useState(null);
   const [timeZone, setTimeZone] = useState('America/Phoenix');


   useEffect(()=>{
    if(!localStorage.getItem("HUBSTAFF_ACCESS_AND_REFRESH_TOKEN")){
       const queryParams = new URLSearchParams(window.location.search);
       const authorizationCode = queryParams.get('code');
       setHubstaff_code(authorizationCode)
       if(authorizationCode){
         document.getElementById('my_access_hubstaff').showModal()
       }
    }else{
      hubStaffClient.get('/organizations')
      .then(result => {
        setOrganizations(result.data.organizations);
        setOrganization_id(result.data.organizations[0].id)
      })
    }

   },[])


  
async function getAccessToken() {
   try {
        const tokenEndpoint = 'https://account.hubstaff.com/access_tokens';

        const data = {
            grant_type: 'authorization_code',
            code: hubstaff_code,
            redirect_uri: 'http://localhost:3000/attendance',
            scope: 'openid'
          };
                                       
          const headers = {
             'Authorization': `Basic ${btoa(`${import.meta.env.VITE_API_HUBSTAFF_CLIENT_ID}:${import.meta.env.VITE_API_HUBSTAFF_CLIENT_SECRET}`)}`,
             'Content-Type': 'application/x-www-form-urlencoded'
          };
                                    
            axios.post(tokenEndpoint, new URLSearchParams(data).toString(), { headers })
            .then(response => {
              localStorage.setItem("HUBSTAFF_ACCESS_AND_REFRESH_TOKEN", JSON.stringify(response.data));
              document.getElementById('my_access_hubstaff').close();
              window.location.reload();
            })
   } catch (error) {
     console.error('Error fetching access token:', error);
     localStorage.removeItem("HUBSTAFF_ACCESS_AND_REFRESH_TOKEN");
     window.location.href = '/dashboard';
     throw error;
   }
 }


 





    const handleStartDateChange = (e) => {
      setStartDate(e.target.value);
    };
  
    const handleEndDateChange = (e) => {
      setEndDate(e.target.value);
    };
 

   const handleAttendance = (id) => {


    //1744512

      const startDateISO8601 = new Date(startDate).toISOString();
      const endDateISO8601 = new Date(endDate).toISOString();

      console.log(startDateISO8601, endDateISO8601)


      const baseURL = `/organizations/${id}/attendance_shifts`; 

      const params = {
        'date[start]': startDateISO8601,
        'date[stop]': endDateISO8601,
        'user_id': '1744512',
        include: 'users',

    };
    
    const config = {
        headers: {
            'Content-Type': 'application/json'
        },
        params: params
    };
    
    hubStaffClient.get(baseURL, config)
        .then(response => {
            console.log('Response data:', response.data);
        })
        .catch(error => {
            console.error('Error:', error);
        });
    

 
  }





   
  return (
    <div className="ml-auto mb-6 lg:w-[75%] xl:w-[80%] 2xl:w-[85%]">
          <div className=" shadow rounded-lg p-4 sm:p-6 xl:p-8 m-5">

          <div className="mb-5 flex gap-2">
          <input
        type="date"
        placeholder="Start Date"
        value={startDate}
        className="input input-bordered w-full max-w-xs"
        onChange={handleStartDateChange}
      />
      <input
        type="date"
        placeholder="End Date"
        value={endDate}
        className="input input-bordered w-full max-w-xs"
        onChange={handleEndDateChange}
      />


    </div>



               <div className="mb-4 flex items-center justify-between">
               <div role="tablist" className="tabs tabs-boxed">
                  {organizations.map((org)=> {
                     return (
                        <a role="tab" key={org.id} className={`tab ${org.id === organization_id ?  "bg-[#00b894]" : ""}  text-white font-bold`} onClick={()=> {
                           setOrganization_id(org.id)
                           handleAttendance(org.id)
                        }}>{org.name}</a>
                     )
                  })}

          

               </div>
   
                  <div className="flex-shrink-0 flex justify-center items-center gap-3">
              
                  <Link to='/attendance/addNewAttendance' className='shadow-md p-1 bg-[#00b894] rounded-md text-white cursor-pointer transition-all ease-in opacity-75 hover:opacity-100'  >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                      </svg>
                  </Link>
                    <span className='font-bold opacity-70'>Add Attendance</span>
                  </div>
               </div>
           
               <div className="flex flex-col mt-8">
                  <div className="overflow-x-auto rounded-lg">
                     <div className="align-middle inline-block min-w-full">
                        <div className="shadow overflow-hidden sm:rounded-lg">
                           <table className="min-w-full divide-y divide-gray-200">
                              <thead>
                                 <tr>
                                    
                                       <th scope="col" className="p-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                       Employee Name
                                     </th>
   
                                    <th scope="col" className="p-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                      Time-in
                                    </th>
                                    <th scope="col" className="p-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                      Time-out
                                    </th>
                                    <th scope="col" className="p-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                      Render Time
                                    </th>
                                    <th scope="col" className="p-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                      Field
                                    </th>
                                    <th scope="col" className="p-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                     Date Created
                                    </th>
                                    <th scope="col" className="p-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                     Remarks
                                    </th>
                                    <th scope="col" className="p-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                     Action
                                    </th>
                                 </tr>
                              </thead>
                              <tbody>
                                       {/* {!attendance.length && (
                                          <tr>
                                             <td className="p-4 whitespace-nowrap text-sm font-normal text-gray-900" colSpan="4">
                                                <div className='ml-5'>
                                                    <span>No data found!</span>
                                                </div>
                                             </td>
                                          </tr>
                                       )}
                                       {attendance && attendance.map((at, i)=>{
                                          return (
                                     
                                       
                                       <tr key={i}>
                                                {tabIndex === 1 && (
                                                <td  className="p-4 whitespace-nowrap text-sm  text-gray-500 font-bold">
                                                {at.employee_name}
                                             </td>
                                             )}

                                             <td className="p-4 whitespace-nowrap text-sm  text-gray-500 font-bold">
                                                {moment(at.attendance_time_in).format("h:mm:ss a")}
                                             </td>
                                             <td className="p-4 whitespace-nowrap text-sm font-bold text-gray-500">
                                            
                                               {moment(at.attendance_time_out).format("h:mm:ss a")}
                                             </td>
                                             <td className="p-4 whitespace-nowrap text-sm font-bold text-gray-500">
                                               {at.render}
                                             </td>
                                             <td className="p-4 whitespace-nowrap text-sm font-bold text-gray-500">
                                               {at.attendance_field}
                                             </td>
                                             <td className="p-4 whitespace-nowrap text-sm font-bold text-gray-500">
                                               {at.attendance_date}
                                             </td>
                                             <td className={`p-4 ${at.attendance_remarks === "TIME OUT" || at.attendance_remarks === "UNDERTIME" ? "text-red-500" : "text-blue-500"} whitespace-nowrap text-sm font-bold `}>
                                               {at.attendance_remarks}
                                             </td>
                                             {tabIndex === 0 && at.attendance_date === attdance_date  && (
                                             <td className="p-4 whitespace-nowrap text-sm flex gap-2">
                                                <Link to={`/attendance/updateNewAttendance/${at.id}`}>
                                                      <svg  xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5 text-[#0984e3] cursor-pointer transition-all opacity-75 hover:opacity-100">
                                                         <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                                                      </svg>
                                                </Link>
                                             </td>
                                             )}
                                          </tr>
                                    
                                   
                                          )
                                       })} */}
                              </tbody>
                           </table>
                        </div>
                     </div>
                  </div>
               </div>
      </div>

      <dialog id="my_access_hubstaff" className="modal">
            <div className="modal-box">
              <form method="dialog">
                <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2" onClick={()=> window.location.href = "/dashboard"}>✕</button>
              </form>
              <h3 className="font-bold text-lg">Hello from WorkwiseHR.</h3>
              <p className="py-2 opacity-70 text-sm">To get your access key please click the button below.</p>
                <button className="btn mt-2 text-black bg-white hover:opacity-100" onClick={()=> getAccessToken()}>
                 <img src="hubstafflogo-removebg-preview.png" className="w-10 opacity-70" />
                  <span className="opacity-70">GET ACCESS KEY FOR HUBSTAFF</span>
                </button>
            </div>
   </dialog>

  
</div> 
  )
}

export default Attendance