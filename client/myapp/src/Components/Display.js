import React, { Component } from 'react';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
// import Login from './Components/Login';
import Canvas from './Canvas';

class Display extends Component {
  constructor(props) {
    super(props);
    this.state = {page: 0};
    this.submitClicked = this.submitClicked.bind(this);
  }

  submitClicked(){
    this.setState({page: 1});
  }

  render(){
    let dis;
    if(this.state.page === 0){
      dis = (<Grid
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
          <Button onClick={this.submitClicked}>Submit</Button>
        </Grid>
      </Grid>)
    }else{
      dis = <Canvas/>
    }
    return(
      <div>
        {dis}
      </div>
    );
  }
}

export default Display;
