import React, { Fragment, useState, useEffect } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import { Link as MaterialLink } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { BrowserRouter as Router, Link, Route, Switch } from 'react-router-dom';

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
  const handleUsernameEntry = (event) => {
    setUsernameEntry(() => event.target.value);
  }

  const [passwordEntry, setPasswordEntry] = useState('');
  const handlePasswordEntry = (event) => {
    setPasswordEntry(() => event.target.value);
  }

  const handleFocus = (targetFocusId) => {
    document.getElementById(targetFocusId).focus();
  }

  const [entryPage, setEntryPage] = useState('signIn');
  useEffect(() => {
    document.getElementById('signInUsername') ? document.getElementById('signInUsername').focus() : null;
    document.getElementById('signUpUsername') ? document.getElementById('signUpUsername').focus() : null; 
  }, [entryPage])


  return (
    <Router>
      <Switch>
      <Route exact path='/'>
          <Fragment>
            <h1 style={{backgroundColor:'#3f51b5', margin:0, padding:'2rem', color:'white'}}>Sign In</h1>
            <Container style={{height:'80vh', display:'flex', alignItems:'center',
            justifyContent:'center', maxWidth:'50%', minWidth:'400px'}} component="main" maxWidth={false}>
              <div className={classes.paper}>
                <form className={classes.form} noValidate 
                onSubmit={(e) => {
                  e.preventDefault();
                  e.persist();
                  props.signInHandler(usernameEntry, passwordEntry);
                  }
                }>
                  <TextField
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    onChange={() => handleUsernameEntry(event)}
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
                    onChange={() => handlePasswordEntry(event)}
                    autoComplete="current-password"
                  />
                  <div style={{display:'flex', justifyContent:'space-between'}}>
                    <MaterialLink component={Link} to='/signup' style={{cursor:'pointer'}} onClick={() => setEntryPage(() => 'signUp')}>Sign Up</MaterialLink>

                    <MaterialLink style={{cursor:'pointer'}} onClick={() => {
                      props.guestUserLoginHandler();
                      // props.updateLoadedState();
                    }}>
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
          </Fragment>
        </Route>

        <Route path='/signup'>
          <h1 style={{backgroundColor:'#3f51b5', margin:0, padding:'2rem', color:'white'}}>Sign Up</h1>
          <Container style={{height:'80vh', display:'flex', alignItems:'center',
          justifyContent:'center', maxWidth:'50%', minWidth:'400px'}} component="main" maxWidth={false}>
            <div className={classes.paper}>
              <form className={classes.form} noValidate 
              onSubmit={(e) => {
                e.preventDefault();
                e.persist();
                console.log(username, password)
                props.signInHandler(username, password);
                }
              }>
                <TextField
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  id="signUpUsername"
                  label="Username"
                  name="username"
                  autoComplete="username"
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
                  autoComplete="current-password"
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
        </Route>

      </Switch>
    </Router>
  );
}