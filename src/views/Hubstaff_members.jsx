import React, { useEffect ,useState} from 'react'
import { Link } from 'react-router-dom';
import moment from 'moment-timezone';
import 'moment-timezone/builds/moment-timezone-with-data';
import axios from 'axios';
import { hubStaffClient } from '../axiosClient';



function Hubstaff_members() {


   const [organizations, setOrganizations] = useState([])
   const [organization_id, setOrganization_id] = useState("")
   const [hubstaff_code, setHubstaff_code] =  useState("")
   const [members, setMembers] = useState([]);
   const [load, setLoading] = useState(false);



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
        handleAttendance(result.data.organizations[0].id);
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


 





   const handleAttendance = (id) => {

      setLoading(true);
      const memberURL = `/organizations/${id}/members?page_limit=10`; 

    
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    };
    
    hubStaffClient.get(memberURL, config)
        .then(response => {
          console.log(response);
            response.data.members.map(m => {
              fetchUserData(m.user_id, response.data.members);
            })
        })
        .catch(error => {
            console.error('Error:', error);
    });


    const fetchUserData = (id, members) => {
      hubStaffClient.get(`/users/${id}`, config)
        .then(response => {
           setLoading(false);
            const member = members.find(m => m.user_id === id);
            member.user = response.data.user;
            setMembers([...members]);
        })
        .catch(error => {
            console.error('Error:', error);
    });
    }
    
 
  }


  
 
   
  return (
    <div className="ml-auto mb-6 lg:w-[75%] xl:w-[80%] 2xl:w-[85%]">
          <div className=" shadow rounded-lg p-4 sm:p-6 xl:p-8 m-5">
              <h1 className='my-5 ml-2 uppercase font-bold text-center'>HUBSTAFF OFFICIAL MEMBERS</h1>
               <div className="mb-4 flex items-center justify-between">
               <div role="tablist" className="tabs tabs-boxed">
                  {organizations.map((org)=> {
                     return (
                        <a role="tab" key={org.id} className={`tab ${org.id === organization_id ?  "bg-[#00b894]" : ""} ${org.id === organization_id ?  "text-white" : "text-gray-500"}  font-bold`} onClick={()=> {
                           setOrganization_id(org.id)
                           handleAttendance(org.id)
                        }}>{org.name}</a>
                     )
                  })}

          

               </div>
               </div>
           
               <div className="flex flex-col mt-8">
                  <div className="overflow-x-auto rounded-lg">
                     <div className="align-middle inline-block min-w-full">
                        <div className="shadow overflow-hidden sm:rounded-lg">
                           <table className="min-w-full divide-y divide-gray-200">
                              <thead>
                                 <tr>
                                    
                                      <th scope="col" className="p-4 text-left text-xs font-medium  text-gray-500 uppercase tracking-wider">
                                       USER ID
                                     </th>
                                       <th scope="col" className="p-4 text-left text-xs font-medium  text-gray-500 uppercase tracking-wider">
                                       Employee Name
                                     </th>
   
                                    <th scope="col" className="p-4 text-left text-xs font-medium  text-gray-500 uppercase tracking-wider">
                                      Email
                                    </th>
                                    <th scope="col" className="p-4 text-left text-xs font-medium  text-gray-500 uppercase tracking-wider">
                                      Role
                                    </th>
                                    <th scope="col" className="p-4 text-left text-xs font-medium  text-gray-500 uppercase tracking-wider">
                                      Time-zone
                                    </th>
                                    <th scope="col" className="p-4 text-left text-xs font-medium  text-gray-500 uppercase tracking-wider">
                                      Status
                                    </th>
                                    
                                 </tr>
                              </thead>
                                <tbody>
                                      {load ? (
                                           <tr>
                                           <td className="p-4 whitespace-nowrap text-sm font-normal text-gray-900" colSpan="4">
                                              <div className='ml-5 flex items-center gap-2 '>
                                                <span className="loading loading-ring loading-lg text-primary"></span>
                                                 <span className="font-bold opacity-80">Loading for hubstaff members...</span>
                                              </div>
                                           </td>
                                        </tr>
                                       ) :  members.length ? 
                                       members.map((m, i)=>{
                                          return (
                                       <tr key={i}>
                                                   <td  className="p-4 whitespace-nowrap text-sm  text-gray-500 font-bold">
                                                {m?.user_id}
                                             </td>
                                                <td  className="p-4 whitespace-nowrap capitalize text-sm  text-gray-500 font-bold">
                                                {m?.user?.name}
                                             </td>

                                             <td className="p-4 whitespace-nowrap text-sm  text-gray-500 font-bold">
                                             {m?.user?.email}
                                             </td>
                                             <td className={`p-4 whitespace-nowrap uppercase text-sm font-bold ${m?.membership_role === "user" ? "text-green-500": "text-blue-500"} `}>
                                             {m?.membership_role}
                                             </td>
                                             <td className="p-4 whitespace-nowrap text-sm font-bold text-gray-500">
                                              {m?.user?.time_zone}
                                             </td>
                                             <td className="p-4 whitespace-nowrap text-sm font-bold uppercase text-blue-500">
                                             {m?.user?.status}
                                             </td>
                                          </tr>
                                          )
                                       }) : (
                                        <tr>
                                        <td className="p-4 whitespace-nowrap text-sm font-normal text-gray-900" colSpan="4">
                                           <div className='ml-5'>
                                              <span className="font-bold opacity-80">No position found!</span>
                                           </div>
                                        </td>
                                     </tr>
                                       )} 
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

export default Hubstaff_members