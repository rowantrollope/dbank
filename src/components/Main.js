import React, { Component } from 'react';
//import { Text, StyleSheet } from "react-native";
import { Badge, Alert, Container, Tabs, Tab, Row, Col, Card } from 'react-bootstrap'
import './App.css';

class Main extends Component {

  render() {
    return (  
      <Container className="container-fluid mt-5 flex-column">
         <Row>
          <Col className="col-md-6">
            <Card border="primary">
              <Card.Header as="h5">User Account<br/>
              </Card.Header>
              <Card.Body>
                <Card.Text >
                  Account Number: { shortenAddress(this.props.account) }<br/><br/>
                  ETH Balance: { window.web3.utils.fromWei(this.props.walletBalance_ETH, 'Ether') } <br/>
                  DBC Balance: { window.web3.utils.fromWei(this.props.walletBalance_DBC, 'Ether') } <br/>
                  Has Staked: { this.props.isDeposited ? "Yes" : "No" } <br/>
                  Has Borrowed: { this.props.isBorrowed ? "Yes" : "No" } <br/>
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col className="col-md-6">
            <Card border="danger">
              <Card.Header as="h5">Bank Account</Card.Header>
              <Card.Body>
                <Card.Text>
                  Account Number: { shortenAddress(this.props.dBankAddress) } <br/><br/>
                  ETH Staked: { window.web3.utils.fromWei(this.props.dBankStakedBalance_ETH, 'Ether') } <br/>
                  ETH Collateral: { window.web3.utils.fromWei(this.props.dBankCollateralBalance_ETH, 'Ether') } <br/>
                  ETH Balance: { window.web3.utils.fromWei(this.props.dBankBalance_ETH, 'Ether') } <br/>
                  DBC Balance: { window.web3.utils.fromWei(this.props.dBankBalance_DBC, 'Ether') } <br/>
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>
        <Row>
          <Col className="col-lg-12 d-flex text-center">
            <div className="content mr-auto ml-auto">
              <Tabs defaultActiveKey="profile" id="uncontrolled-tab-example">
                
                <Tab eventKey="stake" title="Stake" disabled={this.props.isDeposited}>
                  <div>
                    <br/>
                    How much do you want to stake? <br/>
                    (min. amount is 0.01 ETH) <br/>
                    (1 stake is possible at the time) <br/><br/>

                    <form onSubmit={(e) => {
                        e.preventDefault()
                        let amount = window.web3.utils.toWei(this.depositAmount.value, 'Ether')
                        this.props.deposit(amount)
                      }}>
                      <div className='form-group mr-sm-2'>
                        <input
                          id='depositAmount'
                          step="0.01"
                          type='number'
                          ref={(input) => { this.depositAmount = input }}
                          className="form-control form-control-md"
                          placeholder='amount...'
                          required />
                      </div>
                      <button type='submit' className='btn btn-primary'>STAKE</button>
                    </form>
                  </div>
                </Tab>

                <Tab eventKey="withdraw" title="Withdraw" disabled={!this.props.isDeposited}>
                  <br/>
                  Do you want to withdraw + take interest?<br/><br/>
                  <div>
                    <button type='submit' className='btn btn-primary' onClick={(e) => this.props.withdraw(e)}>WITHDRAW</button>
                  </div>
                </Tab>

                <Tab eventKey="borrow" title="Borrow" disabled={this.props.isBorrowed}>
                  <div>
                    <br></br>
                    Do you want to borrow tokens? <br/>
                    (You'll get 50% of collateral, in Tokens) <br/>
                    Type collateral amount (in ETH)<br/><br/>
                    <form onSubmit={(e) => {
                        e.preventDefault()
                        let amount = window.web3.utils.toWei(this.borrowAmount.value, 'Ether')
                        this.props.borrow(amount)
                        }}>
                      <div className='form-group mr-sm-2'>
                      <input
                          id='borrowAmount'
                          step="0.01"
                          type='number'
                          ref={(input) => { this.borrowAmount = input }}
                          className="form-control form-control-md"
                          placeholder='amount...'
                          required />
                      </div>
                      <button type='submit' className='btn btn-primary'>BORROW</button>
                    </form>
                  </div>
                </Tab>
                
                <Tab eventKey="payOff" title="Payoff" disabled={!this.props.isBorrowed}>
                  <div>
                    <br/>
                    Do you want to payoff the loan? <br/>
                    (You'll receive your collateral - fee) <br/><br/>
                    <button type='submit' className='btn btn-primary' onClick={(e) => this.props.payOff(e)}>PAYOFF</button>
                  </div>
                </Tab>

                <Tab eventKey="Buy DBC" title="BuyDBC">
                  <div>
                    <br/>
                    Buy DBC <br/>
                    <form onSubmit={(e) => {
                        e.preventDefault()
                        let amount;
                        amount = this.buyAmount.value.toString();
                        amount = window.web3.utils.toWei(amount, 'Ether')
                        this.props.buyDBC(amount)
                        }}>
                     <div className='form-group mr-sm-2'>
                      <input
                          id='buyAmount'
                          step="0.01"
                          type='number'
                          ref={(input) => { this.buyAmount = input }}
                          className="form-control form-control-md"
                          placeholder='amount...'
                          required />
                      </div>
                      <button type='submit' className='btn btn-primary'>BUY</button>
                    </form>
                  </div>
                </Tab>

                <Tab eventKey="Sell DBC" title="SellDBC">
                  <div>
                    <br/>
                    Sell DBC <br/>
                    <form onSubmit={(e) => {
                        e.preventDefault()
                        let amount
                        amount = this.sellAmount.value.toString(); 
                        amount = window.web3.utils.toWei(amount, 'Ether')
                        this.props.sellDBC(amount)
                        }}>
                     <div className='form-group mr-sm-2'>
                      <input
                          id='buyAmount'
                          step="0.01"
                          type='number'
                          ref={(input) => { this.sellAmount = input }}
                          className="form-control form-control-md"
                          placeholder='amount...'
                          required />
                      </div>
                      <button type='submit' className='btn btn-primary'>SELL</button>
                    </form>
                  </div>
                </Tab>

              </Tabs>
            </div>
          </Col>
        </Row>
      </Container>
    );
  }
}

function shortenAddress(address) {

  return address.substr(0, 6) + '\u2026' + address.substr(address.length-4, 4);
}
export default Main;
