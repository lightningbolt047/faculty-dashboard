import TextareaAutosize from '@material-ui/core/TextareaAutosize';
import EditIcon from '@material-ui/icons/Edit';
import CheckIcon from '@material-ui/icons/Check';
import IconButton from '@material-ui/core/IconButton';
import {useState} from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';

export default function EditableTextArea({accordionID,studentID,mentorDiaryText,textAreaHelpText,handleTextChange,handleSubmit,advisorAllocationID}){

    const [editing,setEditing]=useState(false);
    const [loading,setLoading]=useState(false);



    return (
        <div>
            <TextareaAutosize id={`mentoringTextArea${accordionID}`} rowsMin={5} className="txtArea" placeholder={textAreaHelpText} disabled={!editing} value={mentorDiaryText} onChange={event=>handleTextChange(accordionID,event)} />
            <IconButton id={`mentoringTextAreaBtn${accordionID}`} onClick={async ()=>{
                if(editing){
                    setLoading(true);
                    await handleSubmit(studentID,accordionID,advisorAllocationID);
                    setLoading(false);
                    setEditing(false);
                    return;
                }
                setEditing(true);
    
            }}>
                {!editing && <EditIcon color="secondary"/>}
                {editing && !loading && <CheckIcon color="secondary"/>}
                {editing && loading && <CircularProgress size={24} color="secondary"/>}
            </IconButton>
        </div>
    );
}