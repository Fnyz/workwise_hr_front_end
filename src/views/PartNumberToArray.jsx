import React, { useEffect, useRef, useState } from 'react'
import * as XLSX from 'xlsx/xlsx.mjs';
import newSKU from "../../newSKU.json";
import updatedSKU from "../../updatedSKU.json";


function PartNumberToArray() {

  

    const xlRef = useRef(null);
    const [file, setFile] = useState(null);
    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        const allowedExtensions = ["xls", "xlsx"];
        const extension = selectedFile.name.split(".").pop().toLowerCase();
      
        if (allowedExtensions.indexOf(extension) === -1) {
          setFile(null);
          xlRef.current.value = "";
          alert("Only Excel files (xls, xlsx) are allowed.");
       
          return;
        }

        setFile(selectedFile)
    
    
      };


     
    const parseExcelFile = () => {
        const reader = new FileReader();
        reader.onload = (e) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const excelData = XLSX.utils.sheet_to_json(sheet, { header: 1 });
    
        const [headers, ...rows] = excelData;
        const parsedData = rows.map(row => Object.fromEntries(headers.map((header, index) => [header, row[index]])));
       
         const insertData = parsedData.filter(item => item['Not Allowed'] !== true).map(item => item['Part Number'])
        //  const dataToRemove = parsedData.filter(item => item['Not Allowed'] === true).map(item => typeof item['Part Number'] === "number" ?  parseInt(item['Part Number']): item['Part Number'] )
     

        let dt  = [...newSKU];

        
        insertData.forEach(item => {
          
            if (!dt.includes(item)) {
                dt.push(item);
            }
        });

        // console.log("Updated array1:", dt);
        console.log(updatedSKU);

 


         
        };
        reader.readAsArrayBuffer(file);
    }
  return (
    <div>
        <div className="flex-shrink-0 flex justify-center items-center gap-3 mt-5" >
          <input ref={xlRef}  type="file" onChange={handleFileChange} className=" opacity-85 file-input file-input-md w-full max-w-xs file-input-success file:text-white text-gray-400" />
          <button type='button' onClick={parseExcelFile} className="btn btn-success text-white opacity-85">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 7.5h-.75A2.25 2.25 0 0 0 4.5 9.75v7.5a2.25 2.25 0 0 0 2.25 2.25h7.5a2.25 2.25 0 0 0 2.25-2.25v-7.5a2.25 2.25 0 0 0-2.25-2.25h-.75m0-3-3-3m0 0-3 3m3-3v11.25m6-2.25h.75a2.25 2.25 0 0 1 2.25 2.25v7.5a2.25 2.25 0 0 1-2.25 2.25h-7.5a2.25 2.25 0 0 1-2.25-2.25v-.75" />
            </svg>
          </button>

          <div>
         
          </div>
        </div>
    </div>
  )
}

export default PartNumberToArray