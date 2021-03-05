import globalVariables from './globalVariables';

const backendQuery = async (reqType,endpoint,reqBody) => {
    const reqOptions={
        method:reqType,
        headers:{'Content-Type':'application/json','authtoken':globalVariables.USER_AUTH_TOKEN},
        body:reqType==='GET'?null:JSON.stringify(reqBody)
    }
    var response= await fetch('http://localhost:4000'+endpoint,reqOptions);
    var data=await response.json();
    data.statusCode=response.status;
    return data;
}
 
export default backendQuery;