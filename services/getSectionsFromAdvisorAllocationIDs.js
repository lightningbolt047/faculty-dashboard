const AdvisorAllocation=require('../models/advisorAllocationSchema');

module.exports=async (advisorAllocationIDs)=>{
    if(typeof advisorAllocationIDs==='undefined' || advisorAllocationIDs.length===0){
        throw 'Invalid AdvisorAllocationIDs';
    }
    let sections=[];
    for(const advisorAllocationID of advisorAllocationIDs){
        let advisorAllocationDocument=await AdvisorAllocation.findById(advisorAllocationID);
        sections.push(advisorAllocationDocument.section);
    }
    return sections;
}