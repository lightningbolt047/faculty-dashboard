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