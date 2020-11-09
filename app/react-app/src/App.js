import './App.css';
import React from 'react';
import ConnectWallet from './components/ConnectWallet';
import LoadBlockchainData from './components/LoadBlockchainData';
import RegisterProvider from './components/RegisterProvider';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.onWalletConnected = this.onWalletConnected.bind(this);
    this.onBlockchainDataLoaded = this.onBlockchainDataLoaded.bind(this);
    this.onProviderRegistered = this.onProviderRegistered.bind(this);
    this.state = {
      web3: null,
      user: null,
      walletConnected: false,
      blockchainDataLoaded: false
    };
  }

  onWalletConnected(web3) {
    this.setState( { web3: web3, walletConnected: true } );
  }

  onBlockchainDataLoaded(user) {
    this.setState( { user: user, blockchainDataLoaded: true } );
  }

  onProviderRegistered(provider) {
    let user = this.state.user;
    user.provider = provider;
    this.setState( { user: user } );
  }

  render() {
    if (!this.state.walletConnected)
    {
      return <ConnectWallet onWalletConnected={this.onWalletConnected}/>;
    }
    else if (!this.state.blockchainDataLoaded)
    {
      return <LoadBlockchainData web3={this.state.web3} onBlockchainDataLoaded={this.onBlockchainDataLoaded}/>;
    }
    else if (!this.state.user.provider)
    {
      return <RegisterProvider web3={this.state.web3} onProviderRegistered={this.onProviderRegistered}/>;
    }
    else
    {
      return (
        <div className="App">
          <header className="App-header">
            <p>
            Welcome to Intex.
            </p>
            {this.state.user.address}
            <br/>
            {this.state.web3.utils.hexToString(this.state.user.provider.name)}
          </header>
        </div>
      );
    }
  }
}

export default App;
