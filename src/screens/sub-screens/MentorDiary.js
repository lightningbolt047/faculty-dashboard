import AccordionSet from '../../components/AccordionSet';
import backendQuery from '../../services/backendServices';
import {useState,useEffect} from 'react';

var studentsDetails=[];

export default function MentorDiary(){

    const [fetchingData,setFetchingData]=useState(false);
    const [statusCode,setStatusCode]=useState(0);

    const [mentoringDiaries,setMentoringDiaries]=useState([]);
    // const [studentsDetails,setStudentsDetails]=useState([]);



    const getInfoFromBackend=async ()=>{
        setFetchingData(true);
        var responseBody=await backendQuery('GET',`/mentoring/`,
            {},sessionStorage.USER_AUTH_TOKEN,sessionStorage.USER_DB_ID
        );
        // if(responseBody.statusCode===404){

        // }
        console.log(responseBody);
        if(responseBody.statusCode===200){
            studentsDetails=responseBody;
        }
        setStatusCode(responseBody.statusCode);
        setFetchingData(false);
    };


    //eslint-disable-next-line
    useEffect(async ()=>{
        await getInfoFromBackend();
        var mentoringDiariesText=[];
        for(let i=0;i<studentsDetails.length;i++){       
            mentoringDiariesText.push(studentsDetails[i].personalDetails.mentorText);
        }
        setMentoringDiaries(mentoringDiariesText);
    },[]);

    const handleMentorTextChange=(accordionID,event)=>{
        var mentorTexts=mentoringDiaries;
        mentorTexts[accordionID]=event.target.value;
        setMentoringDiaries(mentorTexts);
    }

    const getAccordionUI=()=>{
        return (
            studentsDetails.map((studentItem,index)=>(
                <AccordionSet key={index} studentJSON={studentItem} mentorDairyText={mentoringDiaries[index]} handleMentorTextChange = {handleMentorTextChange}/>
            ))
        );
    }
    


    return (
        <div>
            {statusCode===200 && getAccordionUI()}            
        </div>
        

    );
}