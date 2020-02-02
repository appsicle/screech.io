import React, { Component } from 'react';
import io from 'socket.io-client';

class Canvas extends Component {
  socket = io("localhost:3000");

  state = {
    // [{x0, y0, x1, y1, color}, ...]
    lines: [],
    // {u1: {x, y, color}}
    userLastPoint = {},
  };

  attachSocketReceiver = () => {
    this.socket.on(
      "message",
      (data) => {
        let temp = this.state.userLastPoint;
        temp[user] = {x, y, color};

        this.setState({
          lines: [...this.state.lines, {
            x0: this.state.userLastPoint[user].x,
            y0: this.state.userLastPoint[user].y,
            x1: x,
            y1: y,
            color: color,
          },],
          userLastPoint: temp,
        })
      }
    );
  }

  sendToSocket = (x, y, user, color) => {
    this.socket.emit(
      {x, y, user, color}
    );
  }

  // componentDidMount() {
  //   // this.socket.on()

  // }

  render() {
    return (
      <div id="container">
          <canvas id="imageView">
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
