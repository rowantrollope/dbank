import React, { Component } from 'react';
import Web3 from 'web3';
import Token from '../abis/Token.json'
import dBank from '../abis/dBank.json'
import MyNav from "./MyNav.js";
import Main from "./Main.js";
import { Container, Spinner, Alert, Row, Col } from 'react-bootstrap';

import './App.css';

class App extends Component {

  async componentDidMount() {
    await this.loadBlockchainData(this.props.dispatch)
    this.setState({loading: false})
  }

  async loadBlockchainData(dispatch) {
    
    if(typeof window.ethereum!=='undefined'){
      const web3 = new Web3(window.ethereum)
      const netId = await web3.eth.net.getId()
      const accounts = await web3.eth.getAccounts()
      window.web3 = web3;

      //load accounts
      if(typeof accounts[0] !=='undefined'){
        this.setState({account: accounts[0],  
                       web3})
      } else {
        window.alert('Please login with MetaMask')
      }

      //load contracts
      try {
        const token = new web3.eth.Contract(Token.abi, Token.networks[netId].address)
        const dbank = new web3.eth.Contract(dBank.abi, dBank.networks[netId].address)
        const dBankAddress = dBank.networks[netId].address;
        this.setState({ token, 
                        dbank, 
                        dBankAddress })

      } catch (e) {
        console.log('Error', e)
        window.alert('Error loading contracts')
      }

      // load balances
      try {
        const isDeposited = await this.state.dbank.methods.isDeposited(this.state.account).call(); 
        const isBorrowed = await this.state.dbank.methods.isBorrowed(this.state.account).call(); 
        const dBankStakedBalance_ETH = await this.state.dbank.methods.etherBalanceOf(this.state.account).call();
        const dBankCollateralBalance_ETH = await this.state.dbank.methods.collateralEther(this.state.account).call();
        const walletBalance_ETH = await this.state.web3.eth.getBalance(this.state.account);
        const walletBalance_DBC= await this.state.token.methods.balanceOf(this.state.account).call();
        const dBankBalance_DBC = await this.state.token.methods.balanceOf(this.state.dBankAddress).call();
        const totalETH = await this.state.web3.eth.getBalance(this.state.dBankAddress);
        const dBankBalance_ETH = (totalETH - dBankStakedBalance_ETH - dBankCollateralBalance_ETH).toString();
    
        this.setState({  
          isDeposited, 
          isBorrowed,
          walletBalance_ETH, 
          walletBalance_DBC,
          dBankStakedBalance_ETH,
          dBankCollateralBalance_ETH,
          dBankBalance_ETH,
          dBankBalance_DBC
        })
      } catch (e) {
        console.log('Error', e)
        window.alert('Error Loading balances')
      }

    } else {
      window.alert('Please install MetaMask')
    }
  }
  
  // Update balances and state vars 
  update_balances = async() => {

    const isDeposited = await this.state.dbank.methods.isDeposited(this.state.account).call(); 
    const isBorrowed = await this.state.dbank.methods.isBorrowed(this.state.account).call(); 
    const dBankStakedBalance_ETH = await this.state.dbank.methods.etherBalanceOf(this.state.account).call();
    const dBankCollateralBalance_ETH = await this.state.dbank.methods.collateralEther(this.state.account).call();
    const walletBalance_ETH = await this.state.web3.eth.getBalance(this.state.account);
    const walletBalance_DBC = await this.state.token.methods.balanceOf(this.state.account).call();
    const dBankBalance_DBC = await this.state.token.methods.balanceOf(this.state.dBankAddress).call();
    const totalETH = await this.state.web3.eth.getBalance(this.state.dBankAddress);
    const dBankBalance_ETH = (totalETH - dBankStakedBalance_ETH - dBankCollateralBalance_ETH).toString();
    this.setState({ 
      isDeposited, 
      isBorrowed,
      walletBalance_ETH,
      walletBalance_DBC,
      dBankStakedBalance_ETH,
      dBankCollateralBalance_ETH,
      dBankBalance_ETH,
      dBankBalance_DBC
    })

  }

  deposit = async (amount) => {
    
    this.setState({loading: true})
    if(this.state.dbank!=='undefined'){
      try{
        await this.state.dbank.methods.deposit().send({value: amount.toString(), from: this.state.account})
        this.update_balances();

      } catch (e) {
        console.log('Error, deposit: ', e)
      }
    }
    this.setState({loading: false})
  }

  withdraw = async (e) => {
    this.setState({loading: true})
    e.preventDefault()
    if(this.state.dbank!=='undefined'){
      try{
        await this.state.dbank.methods.withdraw().send({from: this.state.account})
        this.update_balances();
     } catch(e) {
        console.log('Error, withdraw: ', e)
      }
    }
    this.setState({loading: false})
  }

  borrow = async (amount) => {
    this.setState({loading: true})
    if(this.state.dbank!=='undefined'){
      try{
        await this.state.dbank.methods.borrow().send({value: amount.toString(), from: this.state.account})
        this.update_balances();
      } catch (e) {
        console.log('Error, borrow: ', e)
      }
    }
    this.setState({loading: false})
  }
  
  payOff = async (e) => {
    this.setState({loading: true})
    e.preventDefault()
    if(this.state.dbank!=='undefined'){
      try{
        const collateralEther = await this.state.dbank.methods.collateralEther(this.state.account).call();
        const tokenBorrowed = collateralEther/2
        await this.state.token.methods.approve(this.state.dBankAddress, tokenBorrowed.toString()).send({from: this.state.account})
        await this.state.dbank.methods.payOff().send({from: this.state.account})
        this.update_balances();
      } catch(e) {
        console.log('Error, pay off: ', e)
      }
    }
    this.setState({loading: false})
  }

  buyDBC = async (amount) => {
    this.setState({loading: true})
    if(this.state.dbank!=='undefined'){
      try{
        await this.state.dbank.methods.buyDBC().send({value: amount.toString(), from: this.state.account})
        this.update_balances();
      } catch (e) {
        console.log('Error, buy: ', e)
      }
    }
    this.setState({loading: false})
  }
  
  sellDBC = async (amount) => {
    this.setState({loading: true})

    if(this.state.dbank!=='undefined'){
      try {
        await this.state.token.methods.approve(this.state.dBankAddress, amount).send({ from: this.state.account })
        await this.state.dbank.methods.sellDBC(amount).send({ from: this.state.account })
        this.update_balances();
      } catch (e) {
        console.log('Error, sell: ', e)
      }
    }
    this.setState({loading: false})
  }

  constructor(props) {
    super(props)
    this.state = {
      web3: 'undefined',
      account: '',
      token: null,
      dbank: null,
      walletBalance_ETH: 0,
      walletBalance_DBC: 0,
      dBankStakedBalance_ETH: 0,
      dBankBalance_ETH: 0,
      dBankBalance_DBC: 0,
      dBankAddress: null,
      isDeposited: false,
      isBorrowed: false,
      loading: true
    }
  }

  render() {
    let content
    if(this.state.loading) {
      content =
        <Container className="mt-2 pt-2 d-flex flex-column">
          <Row>
            <Col md={{ span: 6, offset: 3}}>
              <Alert variant="info">
              <Spinner animation="border" role="status" variant="info">
              </Spinner>
              {'\u00A0'} Please wait...
              </Alert>
            </Col>
          </Row>
        </Container>
//      content = <p id="loader" className="text-center">Loading...</p>
    } else {
      content = <Main 
        deposit={this.deposit}
        withdraw={this.withdraw}
        borrow={this.borrow}
        payOff={this.payOff}
        buyDBC={this.buyDBC}
        sellDBC={this.sellDBC}
        walletBalance_ETH={this.state.walletBalance_ETH}
        walletBalance_DBC={this.state.walletBalance_DBC}
        dBankBalance_ETH={this.state.dBankBalance_ETH}
        dBankBalance_DBC={this.state.dBankBalance_DBC}
        dBankCollateralBalance_ETH={this.state.dBankCollateralBalance_ETH}
        dBankStakedBalance_ETH={this.state.dBankStakedBalance_ETH}
        dBankAddress={this.state.dBankAddress}
        account={this.state.account}
        isDeposited={this.state.isDeposited}
        isBorrowed={this.state.isBorrowed}

      />      
    }

    return (
      <span>
        <MyNav account = {this.state.account}/>
        { content }
      </span>
    );
  }
}

export default App;
