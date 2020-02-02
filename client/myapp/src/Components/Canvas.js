import React, { Component } from 'react';
import io from 'socket.io-client';
import DecibelMeter from 'decibel-meter';
import { findPitch } from 'pitchy';  


class Canvas extends Component {
  socket = io("http://3b2e338d.ngrok.io");

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
      lineWidth: 4,

    };
  }

  componentDidMount() {
    
    
    const canvas = this.refs.canvas;
    
    const context = canvas.getContext("2d");
    const sidebar = document.querySelector('.colors');
    context.canvas.width = window.innerWidth - sidebar.offsetWidth;
    context.canvas.height = window.innerHeight - 10;
    // context.lineWidth = 500;

    context.beginPath();
    context.moveTo(canvas.offsetWidth/2, canvas.offsetHeight/2);
    context.lineTo(canvas.offsetWidth/2, canvas.offsetHeight/2);
    context.closePath();


    this.state.last_x = canvas.offsetWidth/2;
    this.state.last_y = canvas.offsetHeight/2;
    this.attachSound();
    this.attachSocketReceiver();


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
    // console.log("here3", width);
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
        _this.setState({lineWidth: 4 + (_this.state.decibel * 0.5)});
        // console.log(JSON.stringify(_this.state, null, 2));

        let data = new Float32Array(analyserNode.fftSize);
        
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
        // _this.sendInput(_this.state.last_x + x_change, _this.state.last_y + y_change, _this.props.color, 4);
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

  render() {
    return (
      <div id="container" >
        
        <canvas ref="canvas" id="imageView" style={{ "borderLeft": "1px solid black" }}>
        </canvas>
        <p id="pitch">pitch = {this.state.pitch}</p>
        <p id="pitch">angle = {this.state.angle}</p>
       <p id="decibel">volume = {this.state.decibel}</p>
       <p id="x_last">{this.state.x_last}</p>
       <p id="y_last">{this.state.y_last}</p>
      </div>
    );
  }
}

export default Canvas;
