import React, { Component } from 'react';
import io from 'socket.io-client';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import CanvasContainer from './CanvasContainer'

class Display extends Component {
  socket = io("http://3b2e338d.ngrok.io/");
  constructor(props) {
    super(props);
    this.state = {
      page: 0,
      input: "",
    };
    this.submitClicked = this.submitClicked.bind(this);
  }

  submitClicked() {
    this.setState({page: 1});
    this.nameSocketSend();
  }

  getName = (e) => {
    this.setState({
      input: e.target.value
    });
  }

  nameSocketSend() {
    this.socket.emit(
      "username",
      {input: this.state.input}
    );
  };

  render(){
    let dis;
    if(this.state.page === 0){
      dis = (<Grid
        container
        direction="row"
        justify="row"
        alignItems="center"
      >
        <Grid item xs = {12} style={{marginBottom: "100px"}}>
          <h1>SCREECH IO</h1>
        </Grid>
        <Grid item xs = {12} style={{marginBottom: "20px"}}>
          {/* <h2 style={{display: "inline"}}>Login:</h2><TextField style={{display: "inline"}}/> */}
          <h2 style={{display: "inline"}}>Login:</h2><TextField onChange={this.getName} style={{display: "inline"}}/>
        </Grid>
        <Grid item xs = {12}>
          <Button onClick={this.submitClicked}>Submit</Button>
        </Grid>
      </Grid>)
    }else{
      dis = <CanvasContainer username={this.state.input}/>
    }
    return(
      <div>
        {dis}
      </div>
    );
  }
}

export default Display;
