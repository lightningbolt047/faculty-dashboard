import React from 'react';
import SearchIcon from '@material-ui/icons/Search';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';


export default function SearchBar({searchText,searchHelpText,handleSearchTextChange}){

    return (
        <div className="searchComponent">
            <TextField variant="outlined" color="secondary" size="small" placeholder={searchHelpText} value={searchText} onChange={handleSearchTextChange}
            InputProps={{
                endAdornment: <InputAdornment position="end">
                    <SearchIcon />
                </InputAdornment>
              }}
            />
        </div>
    );
}