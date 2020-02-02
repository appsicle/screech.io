import React, { Component } from 'react';
import Canvas from './Canvas'
import panda from '../images/panda.png';
import gary from '../images/gary-snail.jpeg';


class CanvasContainer extends Component {
    constructor(props) {
        super(props);
        this.state = { color: 'black' };
    }

    chooseColor(color) {
        this.setState({color: color})
        // this.state.color = color;
        console.log(this.state.color);
    }

    render() {
        return (
            <div className="game-container">
                <div>
                    <div className="color-header">Pick a color</div>
                    <div className="colors">
                        <div className="color black" onClick={() => this.chooseColor('black')}></div>
                        <div className="color red" onClick={() => this.chooseColor('red')}></div>
                        <div className="color green" onClick={() => this.chooseColor('green')}></div>
                        <div className="color blue" onClick={() => this.chooseColor('blue')}></div>
                        <div className="color yellow" onClick={() => this.chooseColor('darkorange')}></div>
                    </div>
                    <img src={gary}></img>
                </div>
                <Canvas className="canvas" color={this.state.color} />
            </div>

        );
    }
}

export default CanvasContainer;
