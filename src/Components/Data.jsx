import React, { useEffect, useState } from 'react'
import { IndividualData } from './IndividualData'

export const Data = ({keys}) => {
    const [excelData,setExcelData]=useState(null)
    const [key ,setKeys]=useState([])
    let value = keys
    // console.log(value,"--------------------------------");
    useEffect(()=>{
        let data=[]
      for(let i in keys){
        data.push(i)
      }
      console.log(data);
        setKeys(data)
        setExcelData(value)
    },[keys])
    // console.log(excelData["Name"],"----------------------++++++++++++++++----------");
    return (
        <>
        {key.map((v)=>( 
        <th>
            <IndividualData individualExcelData={excelData[v]}/>
        </th>   
        ))}
        </>
    )
}
