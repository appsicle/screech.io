import React, { Component } from 'react';
import io from 'socket.io-client';
import DecibelMeter from 'decibel-meter';
import { findPitch } from 'pitchy';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import {serverAddress} from '../properties'



const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

class Canvas extends Component {
  // socket = io(serverAddress);

  constructor(props) {
    super(props);

    this.state = {
      pitch: 0,
      _pitchLast: 0,
      decibel: 0 ,
      last_x: 0,
      last_y: 0,
      angle: 45,
      userLastPoint : {x: 0, y: 0, color: 'black'},
      calledSCFunction: false,
      image: null,
      dialogOpen: false,
      lineWidth: 30,
      colorData: [],
      winner: '',
      color: 'black'
    };

    this.socket = this.props.socket;
    this.calculateColors = this.calculateColors.bind(this);
  }

  componentDidMount() {
    const canvas = this.refs.canvas;

    const context = canvas.getContext("2d");
    const sidebar = document.querySelector('.colors');
    context.canvas.width = window.innerWidth - sidebar.offsetWidth;
    context.canvas.height = window.innerHeight - 10;
    context.lineWidth = 500;

    context.beginPath();
    context.moveTo(canvas.offsetWidth/2, canvas.offsetHeight/2);
    context.lineTo(canvas.offsetWidth/2, canvas.offsetHeight/2);
    context.closePath();

    this.state.last_x = canvas.offsetWidth/2;
    this.state.last_y = canvas.offsetHeight/2;
    this.attachSound();
    this.attachSocketReceiver();
    this.userColorSocket();

  }

  handleOpen = () => {
    this.setState({dialogOpen: true});
  }

  handleClose = () => {
    this.setState({dialogOpen: false});
    this.props.socket.emit("kill");
    window.location.reload();
  }

  drawLine(x0, y0, x1, y1, color, width) {
    // console.log(x0,y0,x1,y1);
    const canvas = this.refs.canvas
    const context = canvas.getContext("2d");
    context.beginPath();
    context.lineCap = 'round';
    context.moveTo(x0, y0);
    context.lineTo(x1, y1);
    context.strokeStyle = color;
    // context.lineWidth = 4;
    context.lineWidth = width;
    context.stroke();
    context.closePath();
  }

  attachSocketReceiver = () => {
    this.socket.on(
      "line",
      (data) => {
        this.drawLine(data.x0, data.y0, data.x1, data.y1, data.color, data.width);
      }
    );
  }

  userColorSocket = () => {
    this.socket.on(
        "get_color",
        (data) => {
              console.log(">>>>>>", data);
              this.setState({color: data});
            }
    );
    this.socket.emit("get_color", this.props.username);
    // console.log(">><<<", this.props.username);
    }

  sendInput = (x, y, color, width) => {
    this.socket.emit("line",
        {x0: this.state.userLastPoint.x, y0: this.state.userLastPoint.y,
        x1: x, y1: y, color, width});

      this.setState({userLastPoint : {x, y}});
  }

  attachSound = () => {
    // attach decibel
    const meter = new DecibelMeter('unique-id');
    meter.listenTo(0, (dB, percent, value) => this.setState({...this.state, decibel: Math.floor(dB+100)}));

    // attach pitch
    let audioContext = new (window.AudioContext || window.webkitAudioContext)();
    let analyserNode = audioContext.createAnalyser();
    navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
        let sourceNode = audioContext.createMediaStreamSource(stream);
        sourceNode.connect(analyserNode);
    });
    let canvas = this.refs.canvas;
    function samplePitch(_this, analyserNode, sampleRate) {
        let data = new Float32Array(analyserNode.fftSize);
        _this.state.lineWidth = 30 + (_this.state.decibel * 0.3);

        // console.log(_this.state.lineWidth);

        analyserNode.getFloatTimeDomainData(data);
        let [pitch, clarity] = findPitch(data, sampleRate);
        let pitch_change = 0;

        let y_change = Math.sin(_this.state.angle+ pitch_change) * 10;
        let x_change = Math.cos(_this.state.angle+ pitch_change) * 10;
        if (_this.state.decibel > 0){
            // console.log('afasdsa');
            pitch_change = (pitch-220)/500;
            if(pitch_change < -.4) {
              pitch_change = -.4;
            }
            if(pitch_change > .4){
              pitch_change = .4;
            }
            y_change = Math.sin(_this.state.angle + pitch_change) * 10;
            x_change = Math.cos(_this.state.angle + pitch_change)  * 10;
            // console.log(x_change);
        }

        // console.log('here1',_this.state.last_x, x_change, _this.state.last_y, y_change)



        _this.sendInput(_this.state.last_x + x_change, _this.state.last_y + y_change, _this.state.color, _this.state.lineWidth);
        _this.setState({..._this.state, angle: _this.state.angle + pitch_change, _pitchLast: pitch, last_x: _this.state.last_x + x_change, last_y: _this.state.last_y + y_change});

        if(_this.state.last_x < 0){
          _this.setState({angle: _this.state.angle + 180})
          // _this.setState({last_x: _this.state.last_x*-1});
        }
        if(_this.state.last_y < 0){
          _this.setState({angle: _this.state.angle + 180})
          // _this.setState({last_y: _this.state.last_y*-1});
        }
        if(_this.state.last_x > canvas.offsetWidth){
          _this.setState({angle:  _this.state.angle + 180})
          // _this.setState({last_x: _this.state.last_x*-1});
        }
        if(_this.state.last_y > canvas.offsetHeight){
          _this.setState({angle:  _this.state.angle + 180})
          // _this.setState({last_y: _this.state.last_y*-1});
        }
    };

    this.interval2 = setInterval(() => samplePitch(this, analyserNode, audioContext.sampleRate), 100);

  }

  _getColorIndicesForCoord = (x, y, width) => {
    var red = y * (width * 4) + x * 4;
    return [red, red + 1, red + 2, red + 3];
  }

  calculateColors(imageData, canvasWidth, canvasHeight){
    let colorSum = {}
    for(let i = 0; i < canvasWidth; i++){
      for(let j = 0; j < canvasHeight; j++){
        var colorIndices = this._getColorIndicesForCoord(i, j, canvasWidth);

        var redIndex = colorIndices[0];
        var greenIndex = colorIndices[1];
        var blueIndex = colorIndices[2];
        var alphaIndex = colorIndices[3];

        var redForCoord = imageData.data[redIndex];
        var greenForCoord = imageData.data[greenIndex];
        var blueForCoord = imageData.data[blueIndex];
        var alphaForCoord = imageData.data[alphaIndex];
        var sum = redForCoord+":" + greenForCoord +":"+ blueForCoord;
        if(sum in colorSum){
          colorSum[sum]++;
        }else{
          colorSum[sum] = 1;
        }
      }
    }

    var colorList = Object.entries(colorSum);
    colorList.sort((a, b) => b[1]-a[1]);
    this.calcuateWinners(colorList);
  }

  calcuateWinners = (colorList) => {
    const colors = { "255:0:0": "red", "0:255:0": "green", "0:0:255":"blue"}
    let winnerList = [];
    let i = 0;
    console.log(colorList);
    while(winnerList.length < 2  && i < colorList.length){
      if(colorList[i][0] == "0:0:0"){
        i++;
        continue;
      }
      if(colorList[i][0] in colors){
        console.log(colorList[i][0]);
        winnerList.push(colors[colorList[i][0]]);
      }
      i++;
    }
    if(winnerList.length == 0){
      winnerList.push("black");
    }
    console.log("winner is: " + winnerList[0]);
    this.setState({winner: winnerList[0]});

  }

  kys = () => {
    if(!this.state.calledSCFunction){
      const canvas = this.refs.canvas;
      const context = canvas.getContext("2d");

      var img = canvas.toDataURL("image/png");
      this.socket.removeAllListeners("line");
      this.setState({image: img});
      this.setState({calledSCFunction: true});
      this.setState({dialogOpen: true});

      this.calculateColors(context.getImageData(0,0, canvas.offsetWidth, canvas.offsetHeight), canvas.offsetWidth, canvas.offsetHeight);

    }
  }

  render() {
    if(this.props.stopped){
      this.kys();
    }
    let display;
    if(this.state.calledSCFunction){
      display = (
        <div>
        <img src={this.state.image}/>
        <Dialog
        fullScreen
        open={this.state.dialogOpen}
        TransitionComponent={Transition}
        keepMounted
        onClose={this.handleClose}
        aria-labelledby="alert-dialog-slide-title"
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle id="alert-dialog-slide-title">{"Game has ended!"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            <h1>Winner is: {this.state.winner}!
            Display percentages.
            Take a look at your recording and screenshot!</h1>
            <img src={this.state.image}/>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <a href={this.state.image} download>
            <Button onClick={this.handleClose} color="primary">
              Download Audio
            </Button>
          </a>
          <span><bold>Click there to play your audio --></bold></span>
          {this.props.audioPlayer}
          <Button onClick={this.handleClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
      </div>
      )
    }else{
      display = (
        <div id="container" >
        <canvas ref="canvas" id="imageView" style={{ "borderLeft": "1px solid black" }}>
        </canvas>
        <p id="pitch">pitch = {this.state.pitch}</p>
        <p id="pitch">angle = {this.state.angle}</p>
       <p id="decibel">volume = {this.state.decibel}</p>
       <p id="x_last">{this.state.x_last}</p>
       <p id="y_last">{this.state.y_last}</p>
       </div>
      )
    }
    return (
      <div>
        {display}
      </div>

    );
  }
}

export default Canvas;
