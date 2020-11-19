import React from 'react';
import TruffleContract from '@truffle/contract'
import Intex from '../contracts/Intex.json'
import ExchangeContract from '../contracts/Exchange.json'

class LoadBlockchainData extends React.Component {
  constructor(props) {
    super(props);

    this.intex = TruffleContract(Intex);
    this.intex.setProvider(this.props.web3.currentProvider);

    this.exchange = TruffleContract(ExchangeContract);
    this.exchange.setProvider(this.props.web3.currentProvider);
  }

  async componentDidMount() {
    try {
      const intex = await this.intex.deployed();
      const exchange = await this.exchange.deployed();
      const accounts = await this.props.web3.eth.getAccounts();

      const account = accounts[0];

      const provider = await exchange.providerByAddress(account);

      const user = {
        address: account,
        provider: (provider.addr === account) ? provider : null,
      };

      this.props.onBlockchainDataLoaded( intex, exchange, user );
    }
    catch(ex) {
      console.log(ex);
    }
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
