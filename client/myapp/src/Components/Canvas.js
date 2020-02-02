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

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

class Canvas extends Component {
  socket = io("localhost:4000");

  constructor(props) {
    super(props);

    this.state = {
      pitch: 0,
      _pitchLast: 0,
      decibel: 0 ,
      last_x: 0,
      last_y: 0,
      angle: 45,
      userLastPoint : {x: 0, y: 0, color: this.props.color},
      calledSCFunction: false,
      image: null,
      dialogOpen: false,
      lineWidth: 4,

    };
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
  }

  handleOpen = () => {
    this.setState({dialogOpen: true});
  }

  handleClose = () => {
    this.setState({dialogOpen: false});
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
        _this.state.lineWidth = 4 + (_this.state.decibel * 0.3);

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



        _this.sendInput(_this.state.last_x + x_change, _this.state.last_y + y_change, _this.props.color, _this.state.lineWidth);
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

  kys = () => {
    if(!this.state.calledSCFunction){
      const canvas = this.refs.canvas;
      var img    = canvas.toDataURL("image/png");
      this.socket.removeAllListeners("line");
      this.setState({image: img});
      this.setState({calledSCFunction: true});
      this.setState({dialogOpen: true});
    }
  }

  render() {
    if(this.props.stopped){
      // console.log("here");
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
        <DialogContent style={{overflow: 'hidden'}}>
          <DialogContentText id="alert-dialog-slide-description">
            blah blah this color won.
            Display percentages.
            Take a look at your recording and screenshot!
            <img src={this.state.image}/>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <a href={this.state.image} download>
            <Button onClick={this.handleClose} color="primary">
              Download
            </Button>
          </a>
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
