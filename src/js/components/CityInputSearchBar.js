import React from 'react';
import { TextField, InputAdornment, Button } from '@material-ui/core';
import { Search } from '@material-ui/icons';

const CityInputSearchBar = (props) => {
  return(
    <div style={{backgroundColor:'gray'}}>
      <p style={{textShadow:'none', fontWeight:400, textAlign:'center'}}>Enter city</p>
      {  
        props.addCityClicked && props.isLoggedIn ?
          <div style={{display:'flex', margin:'0 1rem'}}>
            <form style={{width:'100%'}} id='city-input-form'>
              <TextField 
                autoFocus={true}
                InputProps={{
                startAdornment: (
                  <InputAdornment position='start'>
                      <Search />
                  </InputAdornment>
                )
              }} 
              style={{width:'100%'}} onChange={() => {
                props.cityInputHandler(event);
              console.log(event.target.value);
              }}/>
            </form>
            <Button style={{color:'white', marginLeft:'0.25rem'}} onClick={() => props.cancelButtonDrawerCloseHandler()}>Cancel</Button>
          </div>
          : null   
      }
    </div>
  );
}

export default CityInputSearchBar;