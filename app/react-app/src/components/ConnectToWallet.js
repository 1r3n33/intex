import React from 'react';
import Web3 from 'web3';

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

export default ConnectToWallet;
