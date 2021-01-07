import "./App.css";
import React from "react";
import ConnectWallet from "./components/ConnectWallet";
import LoadBlockchainData from "./components/LoadBlockchainData";
import RegisterProvider from "./components/RegisterProvider";
import ProviderDashboard from "./components/ProviderDashboard";
import Wallet from "components/Intex/Wallet";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.onWalletConnected = this.onWalletConnected.bind(this);
    this.onBlockchainDataLoaded = this.onBlockchainDataLoaded.bind(this);
    this.onProviderRegistered = this.onProviderRegistered.bind(this);
    this.state = {
      web3: null,
      intex: null,
      exchange: null,
      user: null,
      walletConnected: false,
      blockchainDataLoaded: false,
    };

    this.wallet = undefined;
  }

  onWalletConnected(web3) {
    this.setState({ web3: web3, walletConnected: true });
  }

  onBlockchainDataLoaded(intex, exchange, user) {
    this.wallet = new Wallet(intex, user.address);
    this.setState({
      intex: intex,
      exchange: exchange,
      user: user,
      blockchainDataLoaded: true,
    });
  }

  onProviderRegistered(provider) {
    let user = this.state.user;
    user.provider = provider;
    this.setState({ user: user });
  }

  render() {
    if (!this.state.walletConnected) {
      return <ConnectWallet onWalletConnected={this.onWalletConnected} />;
    } else if (!this.state.blockchainDataLoaded) {
      return (
        <LoadBlockchainData
          web3={this.state.web3}
          onBlockchainDataLoaded={this.onBlockchainDataLoaded}
        />
      );
    } else if (!this.state.user.provider) {
      return (
        <RegisterProvider
          web3={this.state.web3}
          exchange={this.state.exchange}
          user={this.state.user}
          onProviderRegistered={this.onProviderRegistered}
        />
      );
    } else {
      return (
        <ProviderDashboard
          web3={this.state.web3}
          intex={this.state.intex}
          exchange={this.state.exchange}
          user={this.state.user}
          wallet={this.wallet}
        />
      );
    }
  }
}

export default App;
