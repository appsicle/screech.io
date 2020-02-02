import React, { Component } from 'react';
import io from 'socket.io-client';

class Canvas extends Component {
  socket = io("localhost:4000");

  constructor(props) {
    // color = props.color;
    console.log('prop color is '+ props.color);
    super(props);

    this.state = {
      // page: 0, 
      // canvas: null,
      userLastPoint : {x: 0, y: 0, color: this.props.color},
    };
  }

  componentDidMount() {
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
      this.socket.emit("line",
        {x0: this.state.userLastPoint.x, y0: this.state.userLastPoint.y,
        x1: e.nativeEvent.offsetX, y1: e.nativeEvent.offsetY, 
        color: this.props.color});

      this.setState({userLastPoint : {x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY}});
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

  attachSound(){
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

    function samplePitch(_this, analyserNode, sampleRate) {
        let data = new Float32Array(analyserNode.fftSize);
        analyserNode.getFloatTimeDomainData(data);
        let [pitch, clarity] = findPitch(data, sampleRate);
      
        if (clarity > 0.80 && pitch > 50 && pitch < 1000 && Math.abs(pitch - _this.state._pitchLast) < 10){
            _this.setState({..._this.state, clarity: clarity, pitch: pitch});
        }
        _this.setState({..._this.state, _pitchLast: pitch});  
    };
    this.interval2 = setInterval(() => samplePitch(this, analyserNode, audioContext.sampleRate), 80);
  }

  render() {
    return (
      <div id="container" >
        <canvas ref="canvas" id="imageView" onMouseMove={this._onMouseMove.bind(this)} style={{ "borderLeft": "1px solid black" }}>

        </canvas>
      </div>
    );
  }
}

export default Canvas;
