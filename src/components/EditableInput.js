import TextField from '@material-ui/core/TextField';
import EditIcon from '@material-ui/icons/Edit';
import CheckIcon from '@material-ui/icons/Check';
import IconButton from '@material-ui/core/IconButton';
import {useState} from 'react';

export default function EditableInput({fieldLabel,textValue,inputSize,handleValueChange}){

    const [editing,setEditing]=useState(false);

    return (
        <div>
            <TextField variant="outlined" disabled={!editing} label={fieldLabel} size={inputSize} value={textValue} onChange={(event)=>{handleValueChange(event)}} color="secondary"/>
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