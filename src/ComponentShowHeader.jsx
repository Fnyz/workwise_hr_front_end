export const ComponentShowHeader = ({ind, chilIn}) => {
   
    switch (ind) {
      case 1:
        return (
          <tr>
          <th scope="col" className="p-4 text-left text-xs font-medium text-gray-500  tracking-wider">
            LEAVE TYPE
          </th>
          <th scope="col" className="p-4 text-left text-xs font-medium text-gray-500  tracking-wider">
            STATUS
          </th>
          <th scope="col" className="p-4 text-left text-xs font-medium text-gray-500  tracking-wider">
            ACTION
          </th>
       </tr>
        )

       case 2:

        if(chilIn === 0) {
            return (
              <tr>
                <th scope="col" className="p-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  EMPLOYEE NAME
                </th>
                <th scope="col" className="p-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  LEAVE TYPE
                </th>
                <th scope="col" className="p-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  START DATE
                </th>
                <th scope="col" className="p-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  END DATE
                </th>
                <th scope="col" className="p-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  DURATION
                </th>
                <th scope="col" className="p-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  STATUS
                </th>
                <th scope="col" className="p-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ACTION
                </th>
              
             </tr>
              )
      
        }else if(chilIn === 1){
            return (
                <tr>
                  <th scope="col" className="p-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    PERSON TO APPROVED
                  </th>
                  <th scope="col" className="p-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    LEAVE TYPE
                  </th>

                  <th scope="col" className="p-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    START DATE
                  </th>
                  <th scope="col" className="p-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    END DATE
                  </th>
                  <th scope="col" className="p-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    DURATION
                  </th>
                  <th scope="col" className="p-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ACTION
                  </th>
             </tr>
              )
        }else{
          return (
            <tr>
              <th scope="col" className="p-4 text-left text-xs font-medium text-gray-500  tracking-wider">
                EMPLOYEE NAME
              </th>
              <th scope="col" className="p-4 text-left text-xs font-medium text-gray-500  tracking-wider">
                DEPARTMENT & POSITION
              </th>
              <th scope="col" className="p-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                LEAVE TYPE
              </th>

              <th scope="col" className="p-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                START DATE
              </th>
              <th scope="col" className="p-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                END DATE
              </th>
              <th scope="col" className="p-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                DURATION
              </th>
              <th scope="col" className="p-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                STATUS
              </th>
              <th scope="col" className="p-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ACTION
              </th>
            
           </tr>
            )
        }
         
      default:
        return (
             <tr>
               <th className="p-4 text-left text-xs font-medium text-gray-500  tracking-wider">Holiday</th>
               <th className="p-4 text-left text-xs font-medium text-gray-500  tracking-wider">End date</th>
               <th className="p-4 text-left text-xs font-medium text-gray-500  tracking-wider">Days</th>
               <th className="p-4 text-left text-xs font-medium text-gray-500  tracking-wider">Year</th>
               <th className="p-4 text-left text-xs font-medium text-gray-500  tracking-wider">Action</th>
             </tr>
          
          )
      
    }
  }
