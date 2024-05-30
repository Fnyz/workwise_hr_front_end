import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import axiosClient from '../axiosClient';
import moment from 'moment';

function Attendance() {
  

   const [attendance, setAttendanceData] = useState([]);
   const [tabIndex, setTabIndex] = useState();
   const [_id, setEmpId] = useState("");
   const [attdance_date, setAttDate] = useState("");
 

   const tabs = [
      {
         text: 'YOUR ATTENDANCE LIST'
      },
      {
         text: 'EMPLOYEE LIST ATTENDANCE'
      }
   ]

   useEffect(()=>{
      getListAttendance();
      setTabIndex(0)
     
   },[])

   const calculateTotalHours = (time_in, time_out) => {
  
      const diffWithoutBreak = moment.duration(moment(time_out).diff(moment(time_in)));
      const diff = moment.duration(diffWithoutBreak.asMilliseconds() - 60 * 60 * 1000);
      const hours = Math.floor(diff.asHours());
      const minutes = Math.floor(diff.asMinutes()) % 60;
      return `${hours} hours ${minutes} minutes`;
  
    };

   const getListAttendance = () => {
      Promise.all([
         getDataList('user'), 
         getDataList('employee'), 
         getDataList('attendance'), 
       ])
         .then((data) => {
         var yesterday = new Date(moment(new Date()).format("L"));
         yesterday.setDate(yesterday.getDate() - 2);

        

          const pastDate = moment(yesterday).format("L");

          const id = data[1].data.find(d => d.employee_email === data[0].email)?.id
          const attendanceArray = data[2].data.filter(d => d.employee_id === id);
          const date = attendanceArray.find(d => d.attendance_date === moment(new Date()).format("L"))?.attendance_date;
          setAttDate(date);
          setAttendanceData(attendanceArray.map(d => {
             return {...d, render: calculateTotalHours(d.attendance_time_in, d.attendance_time_out)}
          }).sort((a, b) => b.id - a.id))
    
           setEmpId(id);


          

           
    
         })
         .catch((err) => {
             console.error(err);
         });
   }

   
  useEffect(()=>{
   getListAttendance();
},[])



   const getDataList = async (path) => {
      try {
        const res = await axiosClient.get(`/${path}`)
        return res.data;
      } catch (err) {
         const {response} = err;
         if(response &&  response.status  === 422){
           console.log(response.data)
         }
      }
   } 
  


   const handleShowAllEmployeeAttedance = (ind) => {
      setAttendanceData([])
      if(ind === 1){
         setTabIndex(1)
          axiosClient.get(`/attendance/employee/${_id}`)
        .then(({data})=>{
         setAttendanceData(data)
   
      })
      .catch((err)=>{
         const {response} = err;
         if(response &&  response.status  === 422){
           console.log(response.data)
         }
      })
      }else{
         setTabIndex(0)
         getListAttendance();
      }
    
   }

   
  return (
    <div className="ml-auto mb-6 lg:w-[75%] xl:w-[80%] 2xl:w-[85%]">
          <div className=" shadow rounded-lg p-4 sm:p-6 xl:p-8 m-5">

               <div className="mb-4 flex items-center justify-between">
               <div role="tablist" className="tabs tabs-boxed">
                  {tabs.map((tab, i)=> {
                     return (
                        <a role="tab" key={i} className={`tab ${tabIndex === i && "bg-[#00b894] text-white"}  font-bold`} onClick={()=> {
                           handleShowAllEmployeeAttedance(i)
                        }}>{tab.text}</a>
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
                                    {tabIndex === 1 && (
                                       <th scope="col" className="p-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                       Employee Name
                                     </th>
                                    )}
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
                                       {!attendance.length && (
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
                                       })}
                              </tbody>
                           </table>
                        </div>
                     </div>
                  </div>
               </div>
      </div>

  
</div> 
  )
}

export default Attendance