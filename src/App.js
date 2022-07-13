import {useState,useRef, useEffect} from 'react'
import {Data} from './Components/Data'
import * as XLSX from 'xlsx'

const App=()=> {
  const [dataValue,setDatavalue]=useState(null)
  const dragItem = useRef();
  const dragOverItem = useRef();
  const [excelFile, setExcelFile]=useState(null);
  const [excelFileError, setExcelFileError]=useState(null);  
  const [excelData, setExcelData]=useState(null);
  const [excalListData, setExcalListData]=useState([]);

  const [value,setValue]=useState(null);
  const dragStart = (e, position) => {
    dragItem.current = position;
    console.log(e.target.innerHTML);
  };
 
  const dragEnter = (e, position) => {
    dragOverItem.current = position;
  };

    const drop = (e) => {
    const copyListItems = [...excelData];
    const dragItemContent = copyListItems[dragItem.current];
    copyListItems.splice(dragItem.current, 1);
    setExcalListData([...excalListData,e.target.innerHTML])
    dragItem.current = null;
    dragOverItem.current = null;
    setExcelData(copyListItems);
  };

  const drag=(e)=>{
    const copyListItems = [...excalListData];
    const dragItemContent = copyListItems[dragItem.current];
    copyListItems.splice(dragItem.current, 1);
    setExcelData ([...excelData,dragItemContent])
    dragItem.current = null;
    dragOverItem.current = null;
    setExcalListData(copyListItems);
  }
  // submit
  const fileType=['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'];
  const handleFile = (e)=>{
    let selectedFile = e.target.files[0];
    if(selectedFile){
      if(selectedFile&&fileType.includes(selectedFile.type)){
        let reader = new FileReader();
        reader.readAsArrayBuffer(selectedFile);
        reader.onload=(e)=>{
          setExcelFileError(null);
          setExcelFile(e.target.result);
        } 
      }
      else{
        setExcelFileError('Please select only excel file types');
        setExcelFile(null);
      }
    }
    else{
      console.log('plz select your file');
    }
  }
  function convertToJson(csv){
    var lines = csv.split("\n");
    var result = [];
    var headers = lines[0].split(",");
    for (var i = 1; i < lines.length; i++) {
      var obj = {};
      var currentline = (lines[i].replace(/, |"/g, " ")).split(",");
      console.log(currentline);
      for (var j = 0; j < headers.length; j++) {
        obj[headers[j]] = currentline[j];
      }
      result.push(obj);
    }
    return JSON.stringify(result); //JSON
  }
  // submit function
  const handleSubmit=(e)=>{
    e.preventDefault();
    if(excelFile!==null){
      const workbook = XLSX.read(excelFile,{type:'buffer'});
      const worksheetName = workbook.SheetNames[0];
      const worksheet=workbook.Sheets[worksheetName];
      const dataa = XLSX.utils.sheet_to_csv(worksheet, { header: 1 });
      console.log(dataa);
      const data = JSON.parse(convertToJson(dataa));
      // console.log(convertToJson(dataa))
      // const data = XLSX.utils.sheet_to_json(worksheet);
      setValue(data)
      setExcelData(Object.keys(data[0]));
     
    }
    else{
      setExcelData(null);
    }
  }
  useEffect(()=>{
    let aa={}
    const updatevalue=excalListData.map((e)=>{
        // console.log(e);
      let data=value.map((v)=>{
        // console.log(v);
        return v[e]
      })
      aa[e]=data
    })
    setDatavalue(aa);
    // console.log(aa,"================================");
  },[excalListData])
  return (
    <div className="d-flex flex-row">
      {/* upload file section */}
      {excelData===null?<div className='form'>
        <form className='form-group' autoComplete="off"
        onSubmit={handleSubmit}>
          <label><h5>Upload Excel file</h5></label>
          <br></br>
          <input type='file' className='form-control'
          onChange={handleFile} required></input>                  
          {excelFileError&&<div className='text-danger'
          style={{marginTop:5+'px'}}>{excelFileError}</div>}
          <button type='submit' className='btn btn-success'
          style={{marginTop:5+'px'}}>Submit</button>
        </form>
      </div>:
      <div className='viewer'>
        {excelData===null&&<>No file selected</>}
        {excelData!==null&&(
          <div className='table-responsive' style={{position:"fixed"}}>
            <table className='table '>
              <thead>
                <tr>
                  {excelData.map((data,index)=>( 
                    <ul className='m-0 text-uppercase' 
                    style={{ fontSize:'17px'}} 
                            onDragStart={(e) => dragStart(e, index)}
                            onDragEnter={(e) => dragEnter(e,index)}
                            onDragEnd={drop}
                            key={index} draggable>{data}
                    </ul>
            
                  ))}                 
                </tr>
              </thead>
            </table>            
          </div>
        )}       
      </div>}
      <div className="bg-primary   p-3">
      <div className='table-responsive'>
            <table className='table '>
              <thead>
                <tr>
                  {excalListData.map((data,index)=>( 
                    <th className='m-0 text-uppercase'
                    style={{ fontSize:'17px'}} 
                            onDragStart={(e) => dragStart(e, index)}
                            onDragEnter={(e) => dragEnter(e,index)}
                            onDragEnd={drag}
                            key={index} draggable>{data}
                    </th>
                  ))}                 
                </tr>
              </thead>
              <tbody>
                <Data keys={dataValue}/>
              </tbody>
            </table>            
          </div>
      </div>
  </div>
  );
}

export default App;
