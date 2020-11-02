import React from 'react';

import './App.css';
import Web3 from 'web3'

class ConnectToWallet extends React.Component {
  componentDidMount() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      window.ethereum.enable()
        .then(_ => {
          this.props.onConnectedToWallet(true);
        });
    }
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <p>
            Please connect to your wallet.
          </p>
        </header>
      </div>
    );
  }
};

class App extends React.Component {
  constructor(props) {
    super(props);
    this.onConnectedToWallet = this.onConnectedToWallet.bind(this);
    this.state = { connectedToWallet: false };
  }

  onConnectedToWallet(connected) {
    this.setState( { connectedToWallet: connected } );
  }

  render() {
    if (!this.state.connectedToWallet)
    {
      return <ConnectToWallet onConnectedToWallet={this.onConnectedToWallet}/>
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
