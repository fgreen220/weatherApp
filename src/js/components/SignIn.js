import React, { Fragment } from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';

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

  return (
    <Fragment>
      <h1 style={{backgroundColor:'#3f51b5', margin:0, padding:'2rem', color:'white'}}>Sign In</h1>
      <Container style={{height:'80vh', display:'flex', alignItems:'center',
      justifyContent:'center', maxWidth:'50%'}} component="main" maxWidth={false}>
        <div className={classes.paper}>
          <form className={classes.form} noValidate 
          onSubmit={(e) => {
            e.preventDefault();
            e.persist();
            props.signInHandler(username, password);
            }
          }>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="username"
              label="Username"
              name="username"
              autoComplete="username"
              autoFocus
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
            >
              Sign In
            </Button>
            <Button
              id='guest-user-button'
              fullWidth
              variant="contained"
              color='primary'
              classes={{contained:classes.contained}}
              onClick={() => props.guestUserLoginHandler()}
              >
              Continue as Guest
            </Button>
          </form>
        </div>
      </Container>
    </Fragment>
  );
}