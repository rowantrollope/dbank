import React, { Component } from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Identicon from 'react-identicons';
import dbank from '../dbank.png';

class MyNav extends Component {

    render() {
        return (
            <Navbar bg="primary" variant="dark" expand="lg">
                <img src={dbank} className="App-logo" alt="logo" height="32"/>
                <Navbar.Brand>
                    le Banco Digital
                </Navbar.Brand>
                <Navbar.Toggle />
                <Navbar.Collapse className="justify-content-end">
                    <Navbar.Text>
                        Account number: <a href="#login">{this.props.account}  </a>
                        <Identicon string='{this.props.account}' size="20" />
                        { /*this.props.account
                            ? <img
                                className="ml-2"
                                width='30'
                                height='30'
                                src={`data:image/png;base64,${new Identicon(this.props.account, 30).toString()}`}
                                alt=""
                            />
                            : <span></span>
                        */} 
                    </Navbar.Text>
                </Navbar.Collapse>
            </Navbar>
        )
    }
}

export default MyNav;
