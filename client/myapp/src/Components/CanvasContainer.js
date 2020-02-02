import React, { Component } from 'react';
import Canvas from './Canvas'

class CanvasContainer extends Component {
    constructor(props) {
        super(props);
        this.state = { color: 'black' };
        // this.handleClick = this.handleClick.bind(this);
    }

    chooseColor(color) {
        this.setState({color: color})
        // this.state.color = color;
        console.log(this.state.color);
        // pass color to parent
    }

    render() {
        return (
            <div>
                <div className="colors">
                    <div className="color black" onClick={() => this.chooseColor('black')}></div>
                    <div className="color red" onClick={() => this.chooseColor('red')}></div>
                    <div className="color green" onClick={() => this.chooseColor('green')}></div>
                    <div className="color blue" onClick={() => this.chooseColor('blue')}></div>
                    <div className="color yellow" onClick={() => this.chooseColor('yellow')}></div>
                </div>
                <Canvas color={this.state.color}/>
            </div>

        );
    }
}

export default CanvasContainer;
