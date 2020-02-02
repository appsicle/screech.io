import React, { Component } from 'react';
import io from 'socket.io-client';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Card from '@material-ui/core/Card';
import { findPitch } from 'pitchy';


import TextField from '@material-ui/core/TextField';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import { sizing } from '@material-ui/system';

import {serverAddress} from '../properties'


class Lobby extends Component {
    // socket = io(serverAddress);

    constructor(props){
        super(props);
        this.state = {
            players: [],
            pitch: 0
        };
        this.socket = this.props.socket;
        this.attachSockets();
        this.attachSound();

    }

    attachSockets = () => {
        this.socket.on(
            "listen_for_usernames",
            (data) => {
                console.log("here", data);
                if (!this.state.gotColor) {
                    this.setState({color: data[data.length - 1].color})
                    this.state.gotColor = true;
                }
                this.setState({players: data});
            }
        );
        this.socket.on(
            "game_start",
            (data) => {
                console.log("Game signal recieved");
                this.props.nextPage();
                // this.socket.disconnect();
            }
        )
        this.socket.emit("notify_new_user", this.props.username);
    }

    attachSound = () => {
        // attach pitch
        let audioContext = new (window.AudioContext || window.webkitAudioContext)();
        let analyserNode = audioContext.createAnalyser();
        navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
            let sourceNode = audioContext.createMediaStreamSource(stream);
            sourceNode.connect(analyserNode);
        });

        function samplePitch(_this, analyserNode, sampleRate) {
            let data = new Float32Array(analyserNode.fftSize);
            _this.state.lineWidth = 30 + (_this.state.decibel * 0.3);
        
            analyserNode.getFloatTimeDomainData(data);
            let [pitch, clarity] = findPitch(data, sampleRate);
            if (clarity > .80){
                _this.setState({pitch: pitch}); 
                console.log(_this.state.pitch);

            }
            
        };
    
        this.interval3 = setInterval(() => samplePitch(this, analyserNode, audioContext.sampleRate), 100);
    }

    signalStart(){
        this.socket.emit("game_start");
    }

    getPitch = () => {
        return this.state.pitch;
    }

    renderTableData() {

        return this.state.players.map((player, index) => {
            return (
                <Grid item xs = {4} style={{marginBottom: "0px"}}>
                    <p class="dot" style={{backgroundColor:player.color}}/>
                    <p style={{marginTop: "0px"}}>{player.username}</p>
                </Grid>                
            );
        });
    }

    render(){
        return(<Grid
            container
            direction="column"
            justify="row"
            alignItems="center"
          >
              
            <Grid item xs = {12} style={{marginBottom: "0px"}}>
              <h1>SCREECH.IO</h1>
            </Grid>
            <Card elevation={3}>
            <Grid item xs = {12} style={{marginBottom: "0px"}}>
                <div style={{margin: "0px 150px"}}>
                <h2 >Lobby</h2>
                </div>
            </Grid>
            <Grid container xs
            direction="row"
            justify="space-between"
            alignItems="center"            
            style={{marginBottom: "0px"}}>
                    {this.renderTableData()}  
            </Grid>
            <Grid item xs = {12}>
              <Button onClick={this.signalStart.bind(this)}>Start</Button>
            </Grid>
            </Card>
            <Grid container xs
                direction="column"
                // typography={fontFamily: [Roboto]}
                justify="space-between"
                alignItems="center"            
                style={{marginBottom: "0px"}}>
                    <p style={{fontWeight: 600}}>Hey Buddy! Welcome to the Lobby. While you are waiting here, let me teach you how to play! </p>
                    <p>This is a game that you can play with your voice!</p>
                    <p>Try to move the text below with your voice!</p>
                    <p>Talk in a high tone to go left!</p>
                    <p>Talk in a low tone to go right!</p>
                    <p>Try to get more of your color on the screen that your opponent(s) to win!</p>
            </Grid>
          </Grid>);
    }
}

export default Lobby;