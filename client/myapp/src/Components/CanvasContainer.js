import React, { Component } from 'react';
import io from 'socket.io-client';
import ColorPicker from './ColorPicker';
import Canvas from './Canvas'

class CanvasContainer extends Component {
    //stores state for canvas and color picker
    render() {
        return (
            <div>
                <ColorPicker />
                <Canvas />
            </div>
        );
    }
}

export default CanvasContainer;
