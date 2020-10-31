import React from 'react';

import './App.css';
import Web3 from 'web3'

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { connected: false };
  }

  render() {
    if (!this.state.connected)
    {
      if (window.ethereum) {
        window.web3 = new Web3(window.ethereum);
        window.ethereum.enable()
          .then(_ => {
            this.setState({ connected: true });
          });
      }

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
