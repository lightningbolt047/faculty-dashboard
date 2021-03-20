import TextareaAutosize from '@material-ui/core/TextareaAutosize';
import EditIcon from '@material-ui/icons/Edit';
import CheckIcon from '@material-ui/icons/Check';
import IconButton from '@material-ui/core/IconButton';
import {useState} from 'react';

export default function EditableTextArea(key,mentorDiaryText, handleTextChange){

    const [editing,setEditing]=useState(false);

    return (
        <div>
            <TextareaAutosize rowsMin={5} className="txtArea" disabled={!editing} value={mentorDiaryText} onChange={event=>handleTextChange(key,event)} />
            <IconButton onClick={()=>{
                if(editing){
                    setEditing(false);
                    return;
                }
                setEditing(true);
    
            }}>
                {!editing && <EditIcon color="secondary"/>}
                {editing && <CheckIcon color="secondary"/>}
            </IconButton>
        </div>
    );
}