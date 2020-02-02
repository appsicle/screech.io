import React, { Component } from 'react';
import io from 'socket.io-client';

class Canvas extends Component {

  constructor(props) {
    super(props);
    this.state = { page: 0, canvas: null, x: 0, y: 0 };
  }

  componentDidMount() {
    const canvas = this.refs.canvas
    const context = canvas.getContext("2d");

    const sidebar = document.querySelector('.colors');
    context.canvas.width = window.innerWidth - sidebar.offsetWidth;
    context.canvas.height = window.innerHeight - 10;
  }

  _onMouseMove(e) {
    if (this.state.x === 0 && this.state.y === 0) {
      this.state.x = e.nativeEvent.offsetX;
      this.state.y = e.nativeEvent.offsetY;
    }
    this.drawLine(this.state.x, this.state.y, e.nativeEvent.offsetX, e.nativeEvent.offsetY, this.props.color, true);
    this.setState({ x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY });
  }

  drawLine(x0, y0, x1, y1, color, emit) {
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

  updateCanvas() {
    const ctx = this.refs.canvas.getContext('2d');
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
