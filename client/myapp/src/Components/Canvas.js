import React, { Component } from 'react';
import io from 'socket.io-client';

class Canvas extends Component {

  constructor(props) {
    super(props);
    this.state = {page: 0, canvas: null, x: 0, y: 0};
  }

  componentDidMount() {
    const canvas2 = this.refs.canvas;
    this.state.canvas = canvas2;
    }

    _onMouseMove(e) {

        this.drawLine(this.state.x, this.state.y, e.nativeEvent.offsetX, e.nativeEvent.offsetY, 'black', true);
        this.setState({ x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY });
        // this.setState({x: e.clientX||e.touches[0].clientX});
        // this.setState({y: e.clientY||e.touches[0].clientY});
        // current.x = ;
        // current.y = ;
        console.log(this.state)
    }

    drawLine(x0, y0, x1, y1, color, emit){
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

    updateCanvas() {
        const ctx = this.refs.canvas.getContext('2d');
        // ctx.fillRect(0,0, 100, 100);
        // ctx.addEventListener
        // ctx.addEventListener('mousemove', this.onMouseMove, false);
    }

  render() {
    return (
      <div id="container" >
          <canvas ref="canvas" id="imageView" onMouseMove={this._onMouseMove.bind(this)} style={{"border": "1px solid black"}}>
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
