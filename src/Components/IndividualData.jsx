import React, { useEffect, useState } from 'react'

export const IndividualData = ({individualExcelData}) => {
    console.log(individualExcelData);
    const [excelData,setExcelData]=useState([])
   useEffect(()=>{
    setExcelData(individualExcelData)
   })
    return (
        <>
           {!excelData?<ul>not found</ul>:<tr>
            {excelData.map((v)=>(
                <ul className='word-wrap'>{v}</ul>
            ))}
            </tr>
            }
        </>
    )
}
