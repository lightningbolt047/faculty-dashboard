
const backendQuery = async (reqType,endpoint,reqBody,authToken,dbID) => {
    const reqOptions={
        method:reqType,
        headers:{'Content-Type':'application/json','authtoken':authToken,'dbid':dbID},
        body:reqType==='GET'?null:JSON.stringify(reqBody)
    }
    let response= await fetch('http://localhost:4000'+endpoint,reqOptions);
    let data=await response.json();
    data.statusCode=response.status;
    return data;
}
 
export default backendQuery;