import React, { Component } from 'react';
import Canvas from './Canvas'

import panda from '../images/panda.png';
import gary from '../images/gary-snail.jpeg';
import circle from '../images/circle.png';
import square from '../images/square.png';
import triangle from '../images/triangle.png';
import shrek from '../images/shrek.png';
import flower from '../images/flower.png';

let images = [panda, gary, circle, square, triangle, shrek, flower];
let image = images[Math.floor(Math.random()*images.length)];


class CanvasContainer extends Component {
    constructor(props) {
        super(props);
        this.state = { color: 'black' };
    }

    chooseColor(color) {
        this.setState({ color: color })
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
                        <div className="color brown" onClick={() => this.chooseColor('brown')}></div>
                        <div className="color purple" onClick={() => this.chooseColor('purple')}></div>
                        <div className="color gold" onClick={() => this.chooseColor('gold')}></div>
                        <div className="color teal" onClick={() => this.chooseColor('teal')}></div>
                        <div className="color pink" onClick={() => this.chooseColor('pink')}></div>
                        <div className="color fuchia" onClick={() => this.chooseColor('fuchia')}></div>
                        <div className="color dimgray" onClick={() => this.chooseColor('dimgray')}></div>
                    </div>
                    <p>Try to draw this!</p>
                    <img src={image}></img>
                </div>
                <Canvas className="canvas" color={this.state.color} />
            </div>

        );
    }
}

export default CanvasContainer;
