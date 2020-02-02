import React, { Component } from 'react';
import io from 'socket.io-client';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';


import CanvasContainer from './CanvasContainer'
import {serverAddress} from '../properties'
import Lobby from './Lobby'

class Display extends Component {
  socket = io(serverAddress);
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
    // this.nameSocketSend();
  }

  nextPage(){
    this.setState({page: 2});
  }

  getName = (e) => {
    this.setState({
      input: e.target.value
    });
  }

  // nameSocketSend() {
  //   this.socket.emit(
  //     "username",
  //     {input: this.state.input}
  //   );
  // };

  render(){
    let dis;
    if(this.state.page === 0){
      dis = (<Grid
        container
        direction="row"
        justify="center"
        alignItems="center"
      >
        <Grid item xs = {12} style={{marginBottom: "50px"}}>
          <h1>SCREECH.IO</h1>
        </Grid>
        <Grid
        container
        direction="row"
        justify="center"
        alignItems="center"
      >

        <Paper elevation={3}>
        <Box width={1}> 
          <Grid item xs = {12} style={{marginBottom: "0px"}}>
            <h2>Login</h2>
          </Grid>
          <Grid item xs = {12} style={{marginBottom: "20px"}}>
            <div style={{padding: "0px 40px 20px"}}>
              <h3 style={{display: "inline"}}>Name: </h3><TextField onChange={this.getName} style={{display: "inline"}}/>
            </div>
          </Grid>
          <Grid item xs = {12}>
            <Button onClick={this.submitClicked} style={{marginBottom: "20px"}}>Join Lobby</Button>
          </Grid>
          </Box>

        </Paper>
        
      </Grid>
      </Grid>)
    }else if (this.state.page === 1){
      dis = <Lobby username={this.state.input} socket={this.socket} nextPage={this.nextPage.bind(this)} />
    }
    else{
      dis = <CanvasContainer username={this.state.input} socket={this.socket}/>
    }
    return(
      <div>
        {dis}
      </div>
    );
  }
}

export default Display;
