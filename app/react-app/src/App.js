import './App.css';
import React from 'react';
import ConnectToWallet from './components/ConnectToWallet';
import LoadBlockchainData from './components/LoadBlockchainData';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.onConnectedToWallet = this.onConnectedToWallet.bind(this);
    this.onBlockchainDataLoaded = this.onBlockchainDataLoaded.bind(this);
    this.state = {
      connectedToWallet: false,
      blockchainDataLoaded: false
    };
  }

  onConnectedToWallet(connected) {
    this.setState( { connectedToWallet: connected } );
  }

  onBlockchainDataLoaded(loaded) {
    this.setState( { blockchainDataLoaded: loaded } );
  }

  render() {
    if (!this.state.connectedToWallet)
    {
      return <ConnectToWallet onConnectedToWallet={this.onConnectedToWallet}/>;
    }
    else if (!this.state.blockchainDataLoaded)
    {
      return <LoadBlockchainData onBlockchainDataLoaded={this.onBlockchainDataLoaded}/>;
    }
    else
    {
      return (
        <div className="App">
          <header className="App-header">
            <p>
              Welcome to Intex.
            </p>
          </header>
        </div>
      );
    }
  }
}

export default App;
