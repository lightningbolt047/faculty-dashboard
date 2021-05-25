

// const cloudBackendURL='http://ec2-35-175-181-113.compute-1.amazonaws.com:4000';
// const localBackendURL='http://localhost:4000';
const backendService = async (reqType, endpoint, reqBody, authToken, dbID) => {
    const reqOptions={
        method:reqType,
        headers:{'Content-Type':'application/json','authtoken':authToken,'dbid':dbID},
        body:reqType==='GET'?null:JSON.stringify(reqBody)
    }
    let response= await fetch(window.env.BACKEND_URL+endpoint,reqOptions);
    let data=await response.json();
    data.statusCode=response.status;
    return data;
}
 
export default backendService;