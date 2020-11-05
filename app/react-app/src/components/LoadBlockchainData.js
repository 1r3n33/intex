import React from 'react';
import TruffleContract from '@truffle/contract'
import ExchangeContract from '../contracts/Exchange.json'

class LoadBlockchainData extends React.Component {
  constructor(props) {
    super(props);

    this.exchange = TruffleContract(ExchangeContract);
    this.exchange.setProvider(this.props.web3.currentProvider);
  }

  componentDidMount() {
    this.exchange.deployed()
      .then(_ => {
        this.props.web3.eth.getAccounts()
          .then(accounts => {
            this.props.onBlockchainDataLoaded(accounts[0]);
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
        </header>
      </div>
    );
  }
}

export default LoadBlockchainData;
