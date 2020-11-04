import React from 'react';
import TruffleContract from '@truffle/contract'
import ExchangeContract from '../contracts/Exchange.json'

class LoadBlockchainData extends React.Component {
  constructor(props) {
    super(props);
    
    this.exchange = TruffleContract(ExchangeContract);
    this.exchange.setProvider(window.web3.currentProvider)
    
    this.state = {
      providerName: ''
    };
  }

  componentDidMount() {
    this.exchange.deployed()
      .then(_ => {
        window.web3.eth.getAccounts()
          .then(accounts => {
            this.setState({providerName: accounts[0]});
          });
      })
      .catch(ex => console.log(ex));
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <p>
            Loading Blockchain data...  
          </p>
          {this.state.providerName}
        </header>
      </div>
    );
  }
}

export default LoadBlockchainData;
