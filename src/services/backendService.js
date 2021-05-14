

const cloudBackendURL='https://faculty-dash-backend.herokuapp.com:443';
// const localBackendURL='http://localhost:4000';
const backendService = async (reqType, endpoint, reqBody, authToken, dbID) => {
    const reqOptions={
        method:reqType,
        headers:{'Content-Type':'application/json','authtoken':authToken,'dbid':dbID},
        body:reqType==='GET'?null:JSON.stringify(reqBody)
    }
    let response= await fetch(cloudBackendURL+endpoint,reqOptions);
    let data=await response.json();
    data.statusCode=response.status;
    return data;
}
 
export default backendService;