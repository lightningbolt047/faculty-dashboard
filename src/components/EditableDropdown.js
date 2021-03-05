import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';

export default function EditableDropdown({fieldLabel,secQuestions,selectedQn,defaultIndex,handleValueChange}){

    return (
        <div>
            <Select autoWidth={true} defaultValue={defaultIndex} onChange={(event)=>handleValueChange(event)}>
                {secQuestions.map((text,index)=>{
                    return (
                        <MenuItem key={index} value={index}>{text}</MenuItem>
                    );
                })}
            </Select>
        </div>
    );
}