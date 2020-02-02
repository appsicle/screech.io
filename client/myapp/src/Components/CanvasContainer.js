import React, { Component } from 'react';
// import { Redirect } from 'react-router-dom';
import Canvas from './Canvas';
import Table from './Table';
import MicRecorder from 'mic-recorder-to-mp3';
// import Button from '@material-ui/core/Button';
import Timer from 'react-compound-timer';
import io from 'socket.io-client';

const playTime = 30000;
const Mp3Recorder = new MicRecorder({ bitRate: 128 });


class CanvasContainer extends Component {
  socket = io("localhost:4000");
  constructor(props) {
    super(props);
    this.state = {
      color: 'red',
      isRecording: false,
      blobURL: '',
      isBlocked: false,
      stopped: false,
      gotColor: false,
    };
  }

  componentDidMount() {
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
    this.setState({ stopped: true });
  };


  // renderRedirect = () => {
  //   if (this.state.redirect) {
  //     return <Redirect to="/"></Redirect>
  //   }
  // }

  render() {
    return (<div className="game-container">
      <div>
        <Timer
          initialTime={playTime}
          direction="backward"
          checkpoints={[
            {
              time: 0,
              callback: this.stop,
            }
          ]}
        >
          <div className="timer">
            <Timer.Seconds /> seconds left
          </div>
        </Timer>
        <div className="colors"></div>
        <Table className="table" username={this.props.username}></Table>
      </div>
      <Canvas className="canvas" color={this.state.color} stopped={this.state.stopped} audioPlayer={<audio src={this.state.blobURL} controls="controls" />} />
    </div>);
  }
}

export default CanvasContainer;
