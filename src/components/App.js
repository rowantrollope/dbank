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
        let isDeposited = await this.state.dbank.methods.isDeposited(this.state.account).call(); 
        let dBankBalance_ETH = await this.state.dbank.methods.etherBalanceOf(this.state.account).call();
        let walletBalance_ETH = await this.state.web3.eth.getBalance(this.state.account);
        let walletBalance_DBC= await this.state.token.methods.balanceOf(this.state.account).call();
        this.setState({  
          isDeposited, 
          dBankBalance_ETH,
          walletBalance_ETH, 
          walletBalance_DBC })
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
    const walletBalance_ETH = await this.state.web3.eth.getBalance(this.state.account);
    const walletBalance_DBC = await this.state.token.methods.balanceOf(this.state.account).call();
    const dBankBalance_ETH = await this.state.dbank.methods.etherBalanceOf(this.state.account).call();

    this.setState({ isDeposited, 
                    walletBalance_ETH,
                    walletBalance_DBC,
                    dBankBalance_ETH })

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

  //balanceOf = async (account) => {
  //  await this.state.web3.eth.getBalance(account);
  //}

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

  /*updateBalances = async () => {
    const balance = await this.state.web3.eth.getBalance(this.state.account);
    this.setState({walletBalance_ETH: balance});
    balance = await this.state.token.balanceOf(this.state.account);
    this.setState({walletBalance_DBC: balance}); 

  }*/

  borrow = async (amount) => {
    this.setState({loading: true})
    if(this.state.dbank!=='undefined'){
      try{
        await this.state.dbank.methods.borrow().send({value: amount.toString(), from: this.state.account})
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
        const collateralEther = await this.state.dbank.methods.collateralEther(this.state.account).call({from: this.state.account})
        const tokenBorrowed = collateralEther/2
        await this.state.token.methods.approve(this.state.dBankAddress, tokenBorrowed.toString()).send({from: this.state.account})
        await this.state.dbank.methods.payOff().send({from: this.state.account})
      } catch(e) {
        console.log('Error, pay off: ', e)
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
      dBankBalance_ETH: 0,
      dBankAddress: null,
      isDeposited: false,
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
        walletBalance_ETH={this.state.walletBalance_ETH}
        walletBalance_DBC={this.state.walletBalance_DBC}
        dBankBalance_ETH={this.state.dBankBalance_ETH}
        account={this.state.account}
        isDeposited={this.state.isDeposited}

      />      
    }

    return (
      <div className='text-monospace'>
        <MyNav account = {this.state.account}/>
        { content }
      </div>
    );
  }
}

export default App;
