import React, { Fragment, useState, useEffect } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import { Link as MaterialLink } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { BrowserRouter as Router, Link, Route, Switch } from 'react-router-dom';
import CityTiles from './CityTiles';

const useStyles = makeStyles({
  paper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height:'100%'
  },
  form: {
    width: '100%',
    margin:'2rem 0'
  },
  contained: {
    margin:'1rem 0',
    backgroundColor:'gray'
  }
});

export default function SignIn(props) {
  const classes = useStyles();

  const [usernameEntry, setUsernameEntry] = useState('');
  const [passwordEntry, setPasswordEntry] = useState('');


  const [signupUsernameEntry, setSignupUsernameEntry] = useState('');
  const [signupPasswordEntry, setSignupPasswordEntry] = useState('');

  const [signupUsernameTooltipOpen, setSignupUsernameTooltipOpen] = useState(false);
  const [signupPasswordTooltipOpen, setSignupPasswordTooltipOpen] = useState(false);

  const [entryPage, setEntryPage] = useState('signIn');
  useEffect(() => {
    document.getElementById('signInUsername') ? document.getElementById('signInUsername').focus() : null;
    document.getElementById('signUpUsername') ? document.getElementById('signUpUsername').focus() : null; 
  }, [entryPage])

  const tooltipCloseHandler = () => {
    setSignupUsernameTooltipOpen(() => false);
    setSignupPasswordTooltipOpen(() => false);
  }

  const [usernameTaken, setUsernameTaken] = useState(false);

  const checkUsername = async (usernameValue) => {
    const usernameList = await props.signinUsernameRetriever();
    usernameList.filter(user => user === usernameValue).length >= 1 ?
    setUsernameTaken(() => true) :
    null
  }

  return (
    !props.isLoggedIn ? 
    <Router>
      <Switch>
        <Route path='/citytiles'>
          <CityTiles 
            cities={props.cities}
            currentForecast={props.currentForecast}
            countryCode={props.countryCode}
            cityTileHandler={props.cityTileHandler}
            timezoneHandler={props.timezoneHandler}
            tempInCelsius={props.tempInCelsius}
            deleteCityTileHandler={props.deleteCityTileHandler}
            setTilesScrollTop={props.setTilesScrollTop}
            cityTileClicked={props.cityTileClicked}
            isLoggedIn={props.isLoggedIn}
          />
        </Route>
          <Fragment>
          <Route exact path='/'>
              <div id='signinPage'>
                <h1 style={{backgroundColor:'#3f51b5', margin:0, padding:'2rem', color:'white'}}>Sign In</h1>
                <Container style={{height:'80vh', display:'flex', alignItems:'center',
                justifyContent:'center', maxWidth:'50%', minWidth:'400px'}} component="main" maxWidth={false}>
                  <div className={classes.paper}>
                    <form className={classes.form} noValidate 
                    onSubmit={(e) => {
                      e.preventDefault();
                      e.persist();
                      props.signInHandler(usernameEntry, passwordEntry);
                      setUsernameEntry(() => '');
                      setPasswordEntry(() => '');
                      }
                    }>
                      <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        onChange={event => {
                          event.persist();
                          setUsernameEntry(() => event.target.value);
                        }}
                        value={usernameEntry}
                        label="Username"
                        name="username"
                        autoComplete="username"
                        id='signInUsername'
                        tabIndex='0'
                      />
                      <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Password"
                        type="password"
                        id="password"
                        onChange={event => {
                          event.persist();
                          setPasswordEntry(() => event.target.value);
                        }}
                        value={passwordEntry}
                        autoComplete="current-password"
                      />
                      <div style={{display:'flex', justifyContent:'space-between'}}>
                        <MaterialLink component={Link} to='/signup' style={{cursor:'pointer'}} onClick={() => setEntryPage(() => 'signUp')}>Sign Up</MaterialLink>

                        <MaterialLink
                        style={{cursor:'pointer'}} 
                        onClick={async() => {
                          await props.guestUserLoginHandler();
                          // props.updateLoadedState();
                        }}
                        >
                          Continue as Guest
                        </MaterialLink>
                      </div>
                      <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        classes={{contained:classes.contained}}
                        // style={{margin:'1rem 0 0 0'}}
                      >
                        Sign In
                      </Button>
                    </form>
                  </div>
                </Container>
                <a id='darksky-link' target='_blank' href='https://darksky.net/poweredby/' >
                        <img style={{display:'flex', justifyContent:'center', width:'8vh', height:'4vh', }} 
                        width={'16px'} height={'16px'} src='./assets/darkskyattribution.png' />
                </a>
              </div>
            </Route>

            <Route path='/signup'>
              <div id='signupPage'>
                <h1 style={{backgroundColor:'#3f51b5', margin:0, padding:'2rem', color:'white'}}>Sign Up</h1>
                <Container style={{height:'80vh', display:'flex', alignItems:'center',
                justifyContent:'center', maxWidth:'50%', minWidth:'400px'}} component="main" maxWidth={false} >
                  <div className={classes.paper}>
                    <form className={classes.form} noValidate
                    onSubmit={(e) => {
                      e.preventDefault();
                      e.persist();
                      if(signupUsernameEntry !== '' && signupPasswordEntry !== '' && !usernameTaken) {
                        console.log(signupUsernameEntry, signupPasswordEntry)
                        props.signUpHandler(signupUsernameEntry, signupPasswordEntry);
                        setSignupUsernameEntry(() => '');
                        setSignupPasswordEntry(() => '');
                      }
                      if(signupUsernameEntry === '' && signupPasswordEntry === '') {
                        setSignupUsernameTooltipOpen(() => true);
                        setSignupPasswordTooltipOpen(() => true);
                      }
                      if(signupUsernameEntry === '' && signupPasswordEntry !== '') {
                        setSignupUsernameTooltipOpen(() => true);
                      }
                      if(signupUsernameEntry !== '' && signupPasswordEntry === '') {
                        setSignupPasswordTooltipOpen(() => true);
                      }
                    }
                    }>
                      <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        id="signUpUsername"
                        label="Username"
                        onChange={event => {
                          event.persist();
                          setSignupUsernameEntry(() => event.target.value);
                        }}
                        value={signupUsernameEntry}
                        onFocus={() => usernameTaken ? setUsernameTaken(() => false) : null}
                        onBlur={event => {
                          event.persist();
                          checkUsername(event.target.value);
                        }}
                        name="username"
                        autoComplete="username"
                        tabIndex='0'
                        error={signupUsernameTooltipOpen ? signupUsernameTooltipOpen : usernameTaken}
                        helperText={signupUsernameTooltipOpen ? 'Please enter an username' : usernameTaken ? 'Username taken' : null}
                      />
                      <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Password"
                        onChange={event => {
                          event.persist();
                          setSignupPasswordEntry(() => event.target.value);
                        }}
                        value={signupPasswordEntry}
                        onFocus={signupPasswordTooltipOpen ? tooltipCloseHandler : null}
                        type="password"
                        id="password"
                        autoComplete="current-password"
                        error={signupPasswordTooltipOpen}
                        helperText={signupPasswordTooltipOpen ? 'Please enter a password' : null}
                      />
                      <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        classes={{contained:classes.contained}}
                        // style={{margin:'1rem 0 0 0'}}
                      >
                        Sign Up
                      </Button>
                    </form>
                    <div style={{display:'flex', justifyContent:'center'}}>
                      <MaterialLink component={Link} to='/' style={{cursor:'pointer'}} onClick={() => setEntryPage(() => 'signIn')}>Already have an account? Sign In</MaterialLink>
                    </div>
                  </div>
                </Container>
              </div>
            </Route>
          </Fragment>
      </Switch>
    </Router>
    : null
  );
}