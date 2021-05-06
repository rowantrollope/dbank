import React, { Component } from 'react';
import { Alert, Container, Tabs, Tab, Row, Col } from 'react-bootstrap'
import './App.css';

class Main extends Component {

  render() {
    return (
      <Container className="container-fluid mt-5 flex-column">
        <Row>
          <Col className="col-md-12">
            <Alert variant="success">
              Wallet Balance (ETH): { window.web3.utils.fromWei(this.props.walletBalance_ETH, 'Ether') } <br/>
              Wallet Balance (DBC): { window.web3.utils.fromWei(this.props.walletBalance_DBC, 'Ether') } <br/> <br/>
              Bank Balance (ETH): { window.web3.utils.fromWei(this.props.dBankBalance_ETH, 'Ether') } <br/>
              Deposit Made: { this.props.isDeposited.toString() }
            </Alert>
          </Col>
        </Row>
        <Row>
          <Col className="col-lg-12 d-flex text-center">
            <div className="content mr-auto ml-auto">
              <Tabs defaultActiveKey="profile" id="uncontrolled-tab-example">
                
                <Tab eventKey="deposit" title="Deposit" disabled={this.props.isDeposited}>
                  <div>
                    <br/>
                    How much do you want to deposit? <br/>
                    (min. amount is 0.01 ETH) <br/>
                    (1 deposit is possible at the time) <br/><br/>

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
                      <button type='submit' className='btn btn-primary'>DEPOSIT</button>
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

                <Tab eventKey="borrow" title="Borrow">
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
                
                <Tab eventKey="payOff" title="Payoff">
                  <div>
                    <br/>
                    Do you want to payoff the loan? <br/>
                    (You'll receive your collateral - fee) <br/><br/>
                    <button type='submit' className='btn btn-primary' onClick={(e) => this.props.payOff(e)}>PAYOFF</button>
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

export default Main;
