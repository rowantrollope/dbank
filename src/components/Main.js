import React, { Component } from 'react';
//import { Text, StyleSheet } from "react-native";
import { Badge, Alert, Button, Container, Tabs, Tab, Row, Col, Card, Nav } from 'react-bootstrap'
import { tokens, ether, fromWei, shortenAddress } from './myHelpers' 
import AccountCard from "./AccountCard"

class Main extends Component {

  render() {
    return (  
      <Container className="container-fluid mt-5 pd-5 flex-column">
         <Row>
          <Col className="col-md-6">
            <AccountCard account={this.props.account} 
              walletBalance_ETH={this.props.walletBalance_ETH}
              walletBalance_DBC={this.props.walletBalance_DBC}
              isDeposited={this.props.isDeposited}
              isBorrowed={this.props.isBorrowed}
              />
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
        <Row className="pd-1">
          <Col>
          <br/>
          </Col>
        </Row>
        <Row>
          <Col className="col-md-12">
            <Card border="primary"> <Card.Header as="h5">Account Activities</Card.Header>
              <Card.Body>
                <Tab.Container id="left-tabs" >
                  <Row>
                    <Col sm={2}>
                      <Nav variant="pills" className="flex-column" defaultActiveKey="buyDBC">
                        <Nav.Item eventKey="buyDBC">
                          <Nav.Link eventKey="buyDBC">Buy DBC</Nav.Link>  
                        </Nav.Item>  
                        <Nav.Item>
                          <Nav.Link eventKey="sellDBC">Sell DBC</Nav.Link>  
                        </Nav.Item>  
                        <Nav.Item>
                          <Nav.Link eventKey="stake" disabled={this.props.isDeposited}>Stake</Nav.Link>  
                        </Nav.Item>  
                        <Nav.Item>
                          <Nav.Link eventKey="withdraw" disabled={!this.props.isDeposited}>Withdraw</Nav.Link>  
                        </Nav.Item>  
                        <Nav.Item>
                          <Nav.Link eventKey="borrow" disabled={this.props.isBorrowed}>Borrow</Nav.Link>  
                        </Nav.Item>  
                        <Nav.Item>
                          <Nav.Link eventKey="payOff" disabled={!this.props.isBorrowed}>Pay Off</Nav.Link>  
                        </Nav.Item>  
                      </Nav>                    
                    </Col>
                    <Col sm={10}>
                    <Tab.Content>
                      <Tab.Pane eventKey="stake">
                        <h3>Stake ETH</h3>
                        How much do you want to stake? <br/>
                        (min. amount is 0.01 ETH - 1 Stake possible at this time) <br/>
                        <br/>
                        <form class="form-inline" onSubmit={(e) => {
                            e.preventDefault()
                            let amount = window.web3.utils.toWei(this.depositAmount.value, 'Ether')
                            this.props.deposit(amount)
                          }}>
                          <div class="form-group row form-inline">
                            <div class="col-sm-3">                                
                              <div class="input-group mb-2 mr-sm-2">
                                <div class="input-group-prepend">
                                  <div class="input-group-text">ETH</div>
                                </div>

                              <input
                                id='depositAmount'
                                step="0.01"
                                type='number'
                                ref={(input) => { this.depositAmount = input }}
                                class="form-control"
                                placeholder='amount...'
                                required />

                              </div>                                  
                            </div>
                            <div class="col-sm-1">
                                <button type='submit' className='btn btn-primary mb-2'>STAKE</button>
                              </div>                                
                          </div>
                        </form>
                      </Tab.Pane>

                      <Tab.Pane eventKey="withdraw" title="Withdraw">
                      <h3>Withdraw Staked ETH</h3>
                        Do you want to withdraw + take interest?<br/><br/>
                        <div>
                          <Button variant="success" type='submit' onClick={(e) => this.props.withdraw(e)}>WITHDRAW</Button>
                        </div>
                      </Tab.Pane>

                      <Tab.Pane eventKey="borrow">
                          <h3>Borrow DBC</h3>
                          Enter the amount of collateral in ETH. You'll get 50% of collateral in DBC.<br/><br/>
                          <form class="form-inline" onSubmit={(e) => {
                            e.preventDefault()
                            let amount = window.web3.utils.toWei(this.borrowAmount.value, 'Ether')
                            this.props.deposit(amount)
                          }}>
                          <div class="form-group row form-inline">
                            <div class="col-sm-3">                                
                              <div class="input-group mb-2 mr-sm-2">
                                <div class="input-group-prepend">
                                  <div class="input-group-text">ETH</div>
                                </div>

                              <input
                                id='borrowAmount'
                                step="0.01"
                                type='number'
                                ref={(input) => { this.borrowAmount = input }}
                                class="form-control"
                                placeholder='amount...'
                                required />

                              </div>                                  
                            </div>
                            <div class="col-sm-1">
                                <Button variant="success" type='submit'>BORROW</Button>
                              </div>                                
                          </div>
                        </form>
                      </Tab.Pane>
                      
                      <Tab.Pane eventKey="payOff">
                          <h3>Pay off borrowed DBC</h3><br/>
                          Do you want to payoff the loan? <br/>
                          (You'll receive your collateral - fee) <br/><br/>
                          <Button variant="success" type='submit' onClick={(e) => this.props.payOff(e)}>PAYOFF</Button>
                      </Tab.Pane>

                      <Tab.Pane eventKey="buyDBC">
                        <h3>Buying DBC</h3>
                        Purchase DBC for ETH. Exchange Rate: 1 DBC = 1 ETH.<br/><br/>
                        <form class="form-inline" onSubmit={(e) => {
                          e.preventDefault()
                          let amount = window.web3.utils.toWei(this.buyAmount.value, 'Ether')
                          this.props.buyDBC(amount)
                        }}>
                          <div class="form-group row form-inline">
                            <div class="col-sm-3">                                
                              <div class="input-group mb-2 mr-sm-2">
                                <div class="input-group-prepend">
                                  <div class="input-group-text">ETH</div>
                                </div>

                                <input
                                  id='buyAmount'
                                  step="0.01"
                                  type='number'
                                  ref={(input) => { this.buyAmount = input }}
                                  class="form-control"
                                  placeholder='amount...'
                                  required />

                              </div>                                  
                            </div>
                            <div class="col-sm-1">
                              <Button variant="success" type='submit' className='btn btn-primary mb-2'>BUY</Button>
                            </div>                                
                          </div>
                        </form>
                      </Tab.Pane>

                      <Tab.Pane eventKey="sellDBC">
                        <h3>Selling DBC</h3>
                        Sell DBC for ETH. Exchange Rate: 1 DBC = 1 ETH.<br/><br/>
                        <form class="form-inline" onSubmit={(e) => {
                          e.preventDefault()
                          let amount = window.web3.utils.toWei(this.sellAmount.value, 'Ether')
                          this.props.sellDBC(amount)
                        }}>
                          <div class="form-group row form-inline">
                            <div class="col-sm-3">                                
                              <div class="input-group mb-2 mr-sm-2">
                                <div class="input-group-prepend">
                                  <div class="input-group-text">DBC</div>
                                </div>

                                <input
                                  id='sellAmount'
                                  step="0.01"
                                  type='number'
                                  ref={(input) => { this.sellAmount = input }}
                                  class="form-control"
                                  placeholder='amount...'
                                  required />

                              </div>                                  
                            </div>
                            <div class="col-sm-1">
                              <Button variant="success" type='submit'>SELL</Button>
                            </div>                                
                          </div>
                        </form>
                      </Tab.Pane>
                    </Tab.Content>
                    </Col>            
                  </Row>
                </Tab.Container>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    );
  }
}

export default Main;
