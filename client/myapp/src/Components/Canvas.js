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
      userLastPoint : {x: 0, y: 0, color: props.color},
    };
  }

  componentDidMount() {
    // this.state.canvas = this.refs.canvas;
    this.attachSocketReceiver();
    // this.socket.emit("line", {x0: 0, y0: 0,
    //   x1: 100, y1: 100, 
    //   color: "red"});
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
    const context = canvas.getContext("2d")
    context.beginPath();
    context.lineCap = 'round';
    context.moveTo(x0, y0);
    context.lineTo(x1, y1);
    context.strokeStyle = color;
    context.lineWidth = 4;
    context.stroke();
    context.closePath();

    // if (!emit) { return; }
    // var w = canvas.width;
    // var h = canvas.height;
    //
    // socket.emit('drawing', {
    //   x0: x0 / w,
    //   y0: y0 / h,
    //   x1: x1 / w,
    //   y1: y1 / h,
    //   color: color
    // });
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
        this.drawLine(data.x0, data.y0, data.x1, data.y1);
      }
    );
  }

  render() {
    return (
      <div id="container" >
        <canvas ref="canvas" id="imageView" onMouseMove={this._onMouseMove.bind(this)} style={{ "border": "1px solid black" }}>
          <p>Unfortunately, your browser is currently unsupported by our web application. We are sorry for the
              inconvenience. Please use one of the supported browsers listed below, or draw the image you want using
                  an offline tool.</p>
          <p>Supported browsers: <a href="https://www.opera.com">Opera</a>, <a
            href="http://www.mozilla.com">Firefox</a>, <a href="http://www.apple.com/safari">Safari</a>, and <a
              href="http://www.konqueror.org">Konqueror</a>.</p>
        </canvas>
      </div>
    );
  }
}

export default Canvas;
