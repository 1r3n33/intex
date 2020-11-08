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
      .then(exchange => {
        this.props.web3.eth.getAccounts()
          .then(accounts => {
            const account = accounts[0];
            exchange.providerByAddress(account).then(provider => {
              const registeredProvider = (provider.addr === account) ? provider : null;
              this.props.onBlockchainDataLoaded( { address: account, provider: registeredProvider } );
            });
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
