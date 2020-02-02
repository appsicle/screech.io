import React, { Component } from 'react';
import io from 'socket.io-client';

class Table extends Component {
    socket = io("http://3b2e338d.ngrok.io");
    constructor(props) {
        super(props);
        this.state = {
            players: [],
        };
        // console.log("<<<", this.props.username);
    }

    componentDidMount() {
        this.userJoinSocket();
    }

    userJoinSocket = () => {
        this.socket.on(
            "listen_for_usernames",
            (data) => {
                let usernames = data.map((datum) => {
                    // console.log("here1", datum);
                    return datum.username;
                    // return 
                });
                // let usernames = data;
                // console.log("here2", usernames);
                this.setState({players: usernames});
            }
        );
        this.socket.emit("notify_new_user", this.props.username);
    }

    renderTableData() {
        return this.state.players.map((player, index) => {
            return (
                <tr key={index}>
                    <td>{player}</td>
                </tr>
            );
        });
    }

    render() {
        // {console.log(this.state.players)}
        return (
            <div className="player-header">
                <p>Current Players:</p>
                <table id="players">
                    <tbody>
                        {this.renderTableData()}
                    </tbody>
                </table>
            </div>
        );
    }
}

export default Table
