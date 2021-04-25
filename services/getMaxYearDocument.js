module.exports=(documentList)=>{
    if(documentList.length===0){
        throw "Empty List";
    }

    let maxYear=documentList[0].year;
    let latestDocument=documentList[0];
    for(const yearDocument of documentList){
        if(yearDocument.year>maxYear){
            maxYear=yearDocument.year;
            latestDocument=yearDocument;
        }
    }
    return latestDocument;
}