import React, { Component } from 'react';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

class Login extends Component {
  render(){
    return(
      <Grid
        container
        direction="row"
        justify="row"
        alignItems="center"
      >
        <Grid item xs = {12}>
          <h1>SCREECH IO</h1>
        </Grid>
        <Grid item xs = {12}>
          <h2 style={{display: "inline"}}>Login:</h2><TextField style={{display: "inline"}}/>
        </Grid>
        <Grid item xs = {12}>
          <Button>Submit</Button>
        </Grid>
      </Grid>
    );
  }
}

export default Login;
