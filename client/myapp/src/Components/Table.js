import React, { Component } from 'react';
import io from 'socket.io-client';
import {serverAddress} from '../properties'
import Grid from '@material-ui/core/Grid';


class Table extends Component {
    // socket = io("localhost:4000");
    constructor(props) {
        super(props);
        this.state = {
            players: [],
        };
        this.socket = this.props.socket;
        // console.log("<<<", this.props.username);
    }

    componentDidMount() {
        this.userJoinSocket();
    }

    userJoinSocket = () => {
        this.socket.on(
            "listen_for_usernames",
            (data) => {
                
                // let usernames = data.map((datum) => {
                //     // console.log("here1", datum);
                //     return datum.username;
                //     // return 
                // });
                // // let usernames = data;
                // console.log("here2", usernames);
                this.setState({players: data});
            }
        );
        this.socket.emit("get_usernames");
    }

    // renderTableData() {
    //     return this.state.players.map((player, index) => {
    //         return (
    //             <tr key={index}>
    //                 <td>{player}</td>
    //             </tr>
    //         );
    //     });
// }

        renderTableData() {
            return this.state.players.map((player, index) => {
                return (
                    <Grid item xs = {6} style={{marginBottom: "0px"}}>
                        <p class="dot" style={{backgroundColor:player.color}}/>
                        <p style={{marginTop: "0px"}}>{player.username}</p>
                    </Grid>                
                );
            });
        }
    

    render() {
        // {console.log(this.state.players)}
        return (
            <div className="player-header">
                <p>Current Players:</p>
                <Grid container xs = {12} 
                    direction="row"
                    justify="row"
                    alignItems="center"            
                    style={{marginBottom: "0px"}}>
                        {this.renderTableData()}  
                </Grid>
            </div>
        );
    }
}

export default Table
