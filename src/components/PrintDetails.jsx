import React, { forwardRef, useEffect } from 'react'
export const PrintData = forwardRef((props, ref) => {
    const {empData} = props;
    
  
    const status = ['Single', 'Married', 'Separated', 'Window(er)'];

    return (
           <div className="flex flex-col mt-1 mx-8 mb-3" ref={ref} >
                        <div>
                            <h2 className="card-title">EMPLOYEE INFORMATION SHEET</h2>
                        </div>

                        <div className='flex '>
                            <div className="flex-1">
                                <div className='flex gap-2 mt-3 items-center'>
                                    <h2 className=' font-bold'>Position:</h2>
                                    <p className='font-medium  opacity-70'>{empData.employee_position}</p>
                                </div>
                                <div className='flex gap-2 mt-3 items-center'>
                                    <h2 className=' font-bold'>Date Hired:</h2>
                                    <p className='font-medium opacity-70'>{empData.employee_start_date}</p>
                                </div>
                                <div className='flex gap-2 mt-3 items-center'>
                                    <h2 className=' font-bold'>Mobile No:</h2>
                                    <p className='font-medium  opacity-70'>0{empData.employee_phone}</p>
                                </div>
                                <div className='flex gap-2 mt-3 items-center'>
                                    <h2 className=' font-bold'>Email Address:</h2>
                                    <p className='font-medium  opacity-70'>{empData.employee_email}</p>
                                </div>
                                <div className='flex gap-2 mt-3 items-center'>
                                    <h2 className=' font-bold'>SSS No:</h2>
                                    <p className='font-medium  opacity-70'>{empData.employee_sss &&  empData.employee_sss.match(/.{1,3}/g).join("-") || "None"}</p>
                                </div>
                                <div className='flex gap-2 mt-3 items-center'>
                                    <h2 className=' font-bold'>Pag-ibig No:</h2>
                                    <p className='font-medium opacity-70'>{empData.employee_pag_ibig && empData.employee_pag_ibig.match(/.{1,3}/g).join("-") || "None"}</p>
                                </div>
                                <div className='flex gap-2 mt-3 items-center'>
                                    <h2 className=' font-bold'>Philhealth No:</h2>
                                    <p className='font-medium opacity-70'>{empData.employee_philhealth && empData.employee_philhealth.match(/.{1,3}/g).join("-") || "None"}</p>
                                </div>
                                <div className='flex gap-2 mt-3 items-center'>
                                    <h2 className=' font-bold'>TIN:</h2>
                                    <p className='font-medium opacity-70'>{empData.employee_tin && empData.employee_tin.match(/.{1,3}/g).join("-") || "None"}</p>
                                </div>
                            </div>
                            <div className="flex-1 flex  justify-end overflow-hidden ">
                                <div className="avatar border p-2 rounded shadow-md max-md:rounded-none max-md:shadow-none max-md:border-none">
                                    <div className=" w-80 rounded h-80 object-cover max-md:w-40 max-md:h-40">
                                        <img src={`${empData.employee_image || "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg"}`}  />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h2 className="card-title mt-5 mb-2">I. PERSONAL INFORMATION</h2>
                        </div>

                       
                        <div className='flex gap-2 mt-3'>
                            <h2 className=' font-bold'>Name:</h2>
                            <p className='font-medium opacity-70'>{empData.employee_name}</p>
                        </div>
                        <div className='flex gap-2 mt-3'>
                            <h2 className=' font-bold'>Current Address:</h2>
                            <p className='font-medium opacity-70'>{empData.employee_address}</p>
                        </div>
                        <div className='flex gap-2 mt-3'>
                            <h2 className=' font-bold'>Provincial Address:</h2>
                            <p className='font-medium opacity-70'>{empData.employee_provincial_address || "None"}</p>
                        </div>
                        <div className='flex  gap-10 mt-3'>
                          <div className='flex gap-2'>
                              <h2 className=' font-bold'>Birth Date:</h2>
                              <p className='font-medium opacity-70'>{empData.employee_birthdate === "Invalid date" ? "None": empData.employee_birthdate}</p>
                          </div>
                          <div className='flex gap-2'>
                              <h2 className=' font-bold'>Birth Place:</h2>
                              <p className='font-medium opacity-70'>{empData.employee_birth_place || "None"}</p>
                          </div>
                        </div>

                        <div className='flex gap-10 mt-3'>
                          <div className='flex gap-2'>
                              <h2 className=' font-bold'>Age:</h2>
                              <p className='font-medium opacity-70'>20</p>
                          </div>
                          <div className='flex gap-2'>
                              <h2 className=' font-bold'>Sex:</h2>
                              <p className='font-medium opacity-70'>Female</p>
                          </div>
                          <div className='flex gap-2'>
                              <h2 className=' font-bold'>Weight:</h2>
                              <p className='font-medium opacity-70'>25.5g</p>
                          </div>
                          <div className='flex gap-2'>
                              <h2 className=' font-bold'>Height:</h2>
                              <p className='font-medium opacity-70'>100g</p>
                          </div>
                        </div>
                        <div className='flex gap-5 mt-3'>
                          <div className='flex gap-2'>
                              <h2 className=' font-bold'>Civil Status:</h2>
                              <p className='font-medium opacity-70'></p>
                          </div>
                          {status.map((c, i)=> {
                            return (
                                <div className='flex gap-1' key={i}>
                                    <p className='font-medium opacity-70'>{c === empData.employee_civil_status ? 
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z" />
                                  </svg>
                                  
                                    : "___"}</p>
                                    <h2 className=' font-bold'>{c}</h2>
                                </div>
                            )
                          })}
                         
                        </div>
                        <div className='flex gap-10 mt-3'>
                          <div className='flex gap-2'>
                              <h2 className=' font-bold'>Name of Spouse:</h2>
                              <p className='font-medium opacity-70'>{empData.employee_name_of_spouse}</p>
                          </div>
                          <div className='flex gap-2'>
                              <h2 className=' font-bold'>Date of Birth:</h2>
                              <p className='font-medium opacity-70'>{empData.employee_date_birth}</p>
                          </div>
                        </div>

                        <div className='flex gap-10 mt-3'>
                          <div className='flex gap-2'>
                              <h2 className=' font-bold'>Spouse Employed?</h2>
                              <div className='flex gap-1'>
                                <p className='font-medium opacity-70'>____</p>
                                <h2 className=' font-bold'>Yes</h2>
                              </div>
                              <div className='flex gap-1'>
                                <p className='font-medium opacity-70'>___</p>
                                <h2 className=' font-bold'>No</h2>
                              </div>
                          </div>
                          <div className='flex gap-2'>
                              <h2 className=' font-bold'>Name of Company:</h2>
                              <p className='font-medium opacity-70'>{empData.employee_company || "None"}</p>
                          </div>
                        </div>

                        <div className='flex gap-10 mt-3'>
                          <div className='flex gap-2'>
                              <h2 className=' font-bold'>Father's Name:</h2>
                              <p className='font-medium opacity-70'>{empData.employee_father || "None"}</p>
                          </div>
                          <div className='flex gap-2'>
                              <h2 className=' font-bold'>Mother's Name:</h2>
                              <p className='font-medium opacity-70'>{empData.employee_mother || "None"}</p>
                          </div>
                        </div>
                       
                        <div className='mt-6'>
                            <h2 className="card-title">Dependents:</h2>
                            <p className=' opacity-70 text-sm'>(For Single; Please write down your parents name)</p>

                            <div className="overflow-x-auto">
                                <table className="table table-zebra mt-2">
                                    {/* head */}
                                    <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Relationship</th>
                                        <th>Age</th>
                                        <th>Date of Birth</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {empData.employee_dependent.map((d, i) => {
                                        return (
                                            <tr key={i}>
                                                <td className=' opacity-70 text-sm'>{d.name || "None"}</td>
                                                <td className=' opacity-70 text-sm'>{d.relationship || "None"}</td>
                                                <td className=' opacity-70 text-sm'>{d.age || "None"}</td>
                                                <td className=' opacity-70 text-sm'>{"None"}</td>
                                            </tr>
                                        )
                                    })}
                                
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <div className='mt-10'>
                            <h2 className="card-title">II. EDUCATIONAL BACKGROUND</h2>
                         
                            <div className="overflow-x-auto">
                                <table className="table table-zebra mt-2">
                                    {/* head */}
                                    <thead>
                                    <tr>
                                        <th></th>
                                        <th>School</th>
                                        <th>Years Attended</th>
                                        <th>Degree</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {empData.employee_educational_background.map((ed, i) => {
                                        return (
                                            <tr key={i}>
                                                <td className=' font-medium opacity-80'>{ed.type}</td>
                                                <td className=' opacity-70 text-sm'>{ed.school || "None"}</td>
                                                <td className=' opacity-70 text-sm'>{ed.years_attended || "None"}</td>
                                                <td className=' opacity-70 text-sm'>{ed.degree || "None"}</td>
                                            </tr>
                                        )
                                    })}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <div className='mt-10'>
                            <h2 className="card-title">III. EMPLOYMENT HISTORY</h2>
                            <p className=' opacity-70 text-sm'>(A. Previous Employment)</p>
                            <div className="overflow-x-auto">
                                <table className="table table-zebra mt-2">
                                    {/* head */}
                                    <thead>
                                    <tr>
                                        <th>Company/Location</th>
                                        <th>Position</th>
                                        <th>Salary</th>
                                        <th>Length of Service</th>
                                        <th>Reason for Leaving</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {empData.employee_history.length && empData.employee_history.map((em, i) => {
                                        return (
                                            <tr key={i}>
                                                <td className=' opacity-80 text-sm'>{em.company || "None"}</td>
                                                <td className=' opacity-80 text-sm'>{em.position || "None"}</td>
                                                <td className=' opacity-70 text-sm'>{em.salary || "None"}</td>
                                                <td className=' opacity-70 text-sm'>{em.length_of_service || "None"}</td>
                                                <td className=' opacity-70 text-sm'>{em.reason_for_leaving || "None"}</td>
                                            </tr>
                                        )
                                    })}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <div className='mt-10'>
                            <h2 className="card-title">IV. CHARACTER REFERENCE</h2>
                            <p className=' opacity-70 text-sm'>(Not Related To You)</p>
                            <div className="overflow-x-auto">
                                <table className="table table-zebra mt-2">
                                    {/* head */}
                                    <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Occupation</th>
                                        <th>Address</th>
                                        <th>Contact Number</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {empData.employee_reference.map((em, i) => {
                                        return (
                                            <tr key={i}>
                                                <td className=' opacity-80 text-sm'>{em.name || "None"}</td>
                                                <td className=' opacity-80 text-sm'>{em.occupation || "None"}</td>
                                                <td className=' opacity-70 text-sm'>{em.address || "None"}</td>
                                                <td className=' opacity-70 text-sm'>{em.contact || "None"}</td>
                                            </tr>
                                        )
                                    })}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <div className='mt-10'>
                            <h2 className="card-title">V. PERSON TO NOTIFY IN CASE OF EMERGENCY</h2>
                            <div className="overflow-x-auto">
                                <table className="table table-zebra mt-2">
                                    {/* head */}
                                    <thead>
                                    <tr>
                                        <th></th>
                                        <th></th>
                                        <th></th>
                                        <th></th>
                                      
                                    </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td className=' opacity-80 text-sm'>Name</td>
                                            <td className=' opacity-80 text-sm'>{empData.employee_case_emergency.name || "None"}</td>
                                            <td className=' opacity-80 text-sm'>Relationship</td>
                                            <td className=' opacity-80 text-sm'>{empData.employee_case_emergency.relationship || "None"}</td>
                                        </tr>
                                        <tr>
                                            <td className=' opacity-80 text-sm'>Address</td>
                                            <td className=' opacity-80 text-sm'>{empData.employee_case_emergency.address || "None"}</td>
                                            <td className=' opacity-80 text-sm'>Contact Number</td>
                                            <td className=' opacity-80 text-sm'>{empData.employee_case_emergency.contact || "None"}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <p className='mt-6 opacity-70 font-medium text-sm'>
                        I authorize investigation of any statement made on this application and understand that misrepresentation of any information can
                        terminate any employment contract signed. I am willing to abide by the company rules and regulations and other memoranda that
                        may issue.
                        </p>

                        <div className='w-full mt-24 flex justify-end'>
                            <div className=' border-t-2'>
                                <h2 className=' font-medium opacity-80'>
                                    SIGNATURE OVER PRINTED NAME/ DATE
                                </h2>
                            </div>
                        </div>
                     </div>
        
    )
  })
