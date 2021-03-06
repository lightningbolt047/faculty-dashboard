import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';

export default function EditableDropdown({fieldLabel,secQuestions,defaultIndex,handleValueChange}){

    console.log(defaultIndex);

    return (
        <div>
            <FormControl>
                <Select autoWidth={true} defaultValue={defaultIndex} onChange={(event)=>handleValueChange(event)}>
                    {secQuestions.map((text,index)=>{
                        return (
                            <MenuItem key={index} value={index}>{text}</MenuItem>
                        );
                    })}
                </Select>
            </FormControl>
        </div>
    );
}