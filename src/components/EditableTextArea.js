import TextareaAutosize from '@material-ui/core/TextareaAutosize';
import EditIcon from '@material-ui/icons/Edit';
import CheckIcon from '@material-ui/icons/Check';
import IconButton from '@material-ui/core/IconButton';
import {useState} from 'react';

export default function EditableTextArea(){

    const [editing,setEditing]=useState(false);

    return (
        <div>
            <TextareaAutosize rowsMin={5} disabled={!editing} placeholder="Enter Students Grievences And Acheivements" />
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