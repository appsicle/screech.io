import React, { Component } from 'react'

class ColorPicker extends Component {
    componentDidMount() {
        console.log('adfa')
    }
    render() {
        return (
            <div className="colors">
                <div className="color black"></div>
                <div className="color red"></div>
                <div className="color green"></div>
                <div className="color blue"></div>
                <div className="color yellow"></div>
            </div>
        );
    }
}

export default ColorPicker;