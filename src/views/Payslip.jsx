import React from 'react'

function Payslip() {
  return (
    <div className="ml-auto mb-6 lg:w-[75%] xl:w-[80%] 2xl:w-[85%]">
    <div className="bg-white shadow rounded-lg p-4 sm:p-6 xl:p-8 m-5">
               <div className="mb-4 flex items-center justify-between max-md:flex-col-reverse max-md:gap-6">
                  
                
               </div>
               <div className="flex flex-col mt-8">
                  <div className="overflow-x-auto rounded-lg">
                     <div className="align-middle inline-block min-w-full">
                        <div className="shadow overflow-hidden sm:rounded-lg">
                         
                           <div className="overflow-x-auto">
                              <table className="table">
                                 {/* head */}
                                 <thead>
                                    <tr>
                                    <th className='tracking-wider'>PAYSLIP DATES</th>
                                    <th className='tracking-wider'>TAXABL INCOME</th>
                                    <th className='tracking-wider'>NET PAY</th>
                                    <th className='tracking-wider'>ACTION</th>
                                    </tr>
                                 </thead>
                                 <tbody>
                               
                                 </tbody>
                              </table>
                           </div>

                        </div>
                     </div>
              </div>

           </div>
          
      </div>
      
</div> 
  )
}

export default Payslip