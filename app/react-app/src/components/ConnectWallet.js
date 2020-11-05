import React from 'react';
import Web3 from 'web3';

class ConnectWallet extends React.Component {
  componentDidMount() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      window.ethereum.enable()
        .then(_ => {
          this.props.onWalletConnected(window.web3);
        });
    }
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <p>
            Please connect your wallet.
          </p>
        </header>
      </div>
    );
  }
}

export default ConnectWallet;
