import React, { Component } from 'react';
import Navbar from 'react-bootstrap/Navbar';
//import Identicon from 'react-identicons';
import dbank from '../dbank.png';

class MyNav extends Component {

    render() {
        return (
            <Navbar style={styles.myNav} bg="primary" variant="dark" expand="lg">
                    <img src={dbank} className="App-logo" alt="logo" height="32"/>
                <Navbar.Brand style={styles.myNav}>
                    le Banco Digital
                </Navbar.Brand>
                <Navbar.Toggle />
                <Navbar.Collapse className="justify-content-end">
                    <Navbar.Text>
                        Account number: <a href="#login">{this.props.account}  </a>
                    </Navbar.Text>
                </Navbar.Collapse>
            </Navbar>
        )
    }
}
const styles = {
    myNav: {
        paddingLeft: "1vw",
        paddingRight: "1vw",
    }
}
export default MyNav;
