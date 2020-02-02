import React, { Component } from 'react';
import Canvas from './Canvas';
import Table from './Table';
import MicRecorder from 'mic-recorder-to-mp3';
import Button from '@material-ui/core/Button';
import io from 'socket.io-client';
// import panda from '../images/panda.png';
// import gary from '../images/gary-snail.jpeg';
// import circle from '../images/circle.png';
// import square from '../images/square.png';
// import triangle from '../images/triangle.png';
// import shrek from '../images/shrek.png';
// import flower from '../images/flower.png';

// let images = [panda, gary, circle, square, triangle, shrek, flower];
// let image = images[Math.floor(Math.random()*images.length)];
const Mp3Recorder = new MicRecorder({ bitRate: 128 });

class CanvasContainer extends Component {
    socket = io("localhost:4000");
    constructor(props) {
        super(props);
        this.state = {
          color: 'black',
          isRecording: false,
          blobURL: '',
          isBlocked: false,
          gotColor: false,
        };
    }

    componentDidMount(){
      navigator.getUserMedia({ audio: true },
        () => {
          console.log('Permission Granted');
          this.setState({ isBlocked: false });
        },
        () => {
          console.log('Permission Denied');
          this.setState({ isBlocked: true })
        },
      );

      this.userColorSocket();

      this.start();
    }

    userColorSocket = () => {
        this.socket.on(
            "listen_for_usernames",
            (data) => {
                if (!this.state.gotColor) {
                    this.setState({color: data[data.length - 1].color})
                    this.state.gotColor = true;
                }
            }
        );
        // this.socket.emit("notify_new_user", this.props.username);
    }

    chooseColor(color) {
        this.setState({ color: color })
        // this.state.color = color;
        console.log(this.state.color);
    }

    start = () => {
      if (this.state.isBlocked) {
        console.log('Permission Denied');
      } else {
        Mp3Recorder
          .start()
          .then(() => {
            this.setState({ isRecording: true });
          }).catch((e) => console.error(e));
      }
    };

    stop = () => {
      Mp3Recorder
        .stop()
        .getMp3()
        .then(([buffer, blob]) => {
          const blobURL = URL.createObjectURL(blob)
          this.setState({ blobURL, isRecording: false });
        }).catch((e) => console.log(e));
    };

    render() {
        return (
            <div className="game-container">
                <div>
                    {/* {/* <div className="color-header">Pick a color</div> */}
                    <div className="colors">
                        {/* <div className="color black" onClick={() => this.chooseColor('black')}></div>
                        <div className="color red" onClick={() => this.chooseColor('red')}></div>
                        <div className="color green" onClick={() => this.chooseColor('green')}></div>
                        <div className="color blue" onClick={() => this.chooseColor('blue')}></div>
                        <div className="color yellow" onClick={() => this.chooseColor('darkorange')}></div>
                        <div className="color brown" onClick={() => this.chooseColor('brown')}></div>
                        <div className="color purple" onClick={() => this.chooseColor('purple')}></div>
                        <div className="color gold" onClick={() => this.chooseColor('gold')}></div>
                        <div className="color teal" onClick={() => this.chooseColor('teal')}></div> */}
                        {/* <div className="color pink" onClick={() => this.chooseColor('pink')}></div>
                        <div className="color fuchia" onClick={() => this.chooseColor('fuchia')}></div>
                        <div className="color dimgray" onClick={() => this.chooseColor('dimgray')}></div> */}
                    </div>
                    {/* <p>Try to draw this!</p>
                    <img src={image}></img> */}
                    {/*<button onClick={this.start} disabled={this.state.isRecording}>
                      Record
                    </button>*/}
                    <Table className="table" username={this.props.username}></Table>
                    <Button onClick={this.stop} disabled={!this.state.isRecording}>
                      Done
                    </Button>
                    <audio src={this.state.blobURL} controls="controls" />
                </div>
                <Canvas className="canvas" color={this.state.color}/>
            </div>

        );
    }
}

export default CanvasContainer;
