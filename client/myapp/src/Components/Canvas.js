import React, { Component } from 'react';
import io from 'socket.io-client';
import DecibelMeter from 'decibel-meter';
import { findPitch } from 'pitchy';  

class Canvas extends Component {
  socket = io("localhost:4000");

  constructor(props) {
    // color = props.color;
    console.log('prop color is '+ props.color);
    super(props);

    this.state = {
      pitch: 0,
      _pitchLast: 0,
      decibel: 0 ,
      last_x: 150,
      last_y: 150,
      // page: 0, 
      // canvas: null,
      userLastPoint : {x: 0, y: 0, color: this.props.color},
    };
  }

  componentDidMount() {
    this.attachSound();
    this.attachSocketReceiver();
    const canvas = this.refs.canvas;
    const context = canvas.getContext("2d");
    const sidebar = document.querySelector('.colors');
    context.canvas.width = window.innerWidth - sidebar.offsetWidth;
    context.canvas.height = window.innerHeight - 10;
  }

  _onMouseMove(e) {
      // if(this.state.x === 0 && this.state.y === 0){
      //   this.state.x = e.nativeEvent.offsetX;
      //   this.state.y = e.nativeEvent.offsetY;
      // }
      // this.drawLine(this.state.x, this.state.y, e.nativeEvent.offsetX, e.nativeEvent.offsetY, this.props.color, true);
      // this.setState({ x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY });
      // this.setState({x: e.clientX||e.touches[0].clientX});
      // this.setState({y: e.clientY||e.touches[0].clientY});
      // current.x = ;
      // current.y = ;
      // console.log(this.state)

      // console.log("stuff");
      // this.socket.emit("line",
      //   {x0: this.state.userLastPoint.x, y0: this.state.userLastPoint.y,
      //   x1: e.nativeEvent.offsetX, y1: e.nativeEvent.offsetY, 
      //   color: this.props.color});

      // this.setState({userLastPoint : {x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY}});

      this.sendInput(e.nativeEvent.offsetX, e.nativeEvent.offsetY, this.props.color);
  }

  drawLine(x0, y0, x1, y1, color) {
    const canvas = this.refs.canvas
    const context = canvas.getContext("2d");
    context.beginPath();
    context.lineCap = 'round';
    context.moveTo(x0, y0);
    context.lineTo(x1, y1);
    context.strokeStyle = color;
    context.lineWidth = 4;
    context.stroke();
    context.closePath();
  }

  // updateCanvas() {
  //   const ctx = this.refs.canvas.getContext('2d');
  //   // ctx.fillRect(0,0, 100, 100);
  //   // ctx.addEventListener
  //   // ctx.addEventListener('mousemove', this.onMouseMove, false);
  // }

  attachSocketReceiver = () => {
    this.socket.on(
      "line",
      (data) => {
        // console.log(data);
        this.drawLine(data.x0, data.y0, data.x1, data.y1, data.color);
      }
    );
  }

  sendInput = (x, y, color) => {
    this.socket.emit("line",
        {x0: this.state.userLastPoint.x, y0: this.state.userLastPoint.y,
        x1: x, y1: y, color});

      this.setState({userLastPoint : {x, y}});
  }

  attachSound = () => {
    // attach decibel
    const meter = new DecibelMeter('unique-id');
    meter.listenTo(0, (dB, percent, value) => this.setState({...this.state, decibel: Math.floor(dB+100)*15}));

    // attach pitch
    let audioContext = new (window.AudioContext || window.webkitAudioContext)();
    let analyserNode = audioContext.createAnalyser();
    navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
        let sourceNode = audioContext.createMediaStreamSource(stream);
        sourceNode.connect(analyserNode); 
    });

    function samplePitch(_this, analyserNode, sampleRate) {
        let data = new Float32Array(analyserNode.fftSize);
        analyserNode.getFloatTimeDomainData(data);
        let [pitch, clarity] = findPitch(data, sampleRate);
      
        let y_change;
        let x_change;
        if (clarity > 0.80 && pitch > 50 && pitch < 1000 && Math.abs(pitch - _this.state._pitchLast) < 30){
            _this.setState({..._this.state, clarity: clarity, pitch: pitch});
            y_change = Math.sin((pitch-200)/2.2222) * 5;
            x_change = Math.cos((pitch-200)/2.2222) * 5;
        }
        y_change = 5;
        x_change = 5;
        // _this.sendInput(_this.state.pitch, _this.state.decibel, _this.props.color);
        _this.sendInput(_this.last_x + x_change, _this.last_y + y_change, _this.props.color);

        _this.setState({..._this.state, _pitchLast: pitch, last_x: _this.last_x + x_change, last_y: _this.last_y + y_change});  

        // _this.setState({..._this.state, _pitchLast: pitch});  
    };

    this.interval2 = setInterval(() => samplePitch(this, analyserNode, audioContext.sampleRate), 100);

    // this.interval3 = setInterval(() => this.sendInput(this.state.pitch, this.state.decibel, this.props.color), 100);
  }

  render() {
    return (
      <div id="container" >
        <canvas ref="canvas" id="imageView" onMouseMove={this._onMouseMove.bind(this)} style={{ "borderLeft": "1px solid black" }}>
        </canvas>
        <p id="pitch">{this.state.pitch}</p>
       <p id="decibel">{this.state.decibel}</p>
       <p id="x_last">{this.state.x_last}</p>
       <p id="y_last">{this.state.y_last}</p>
      </div>
    );
  }
}

export default Canvas;
