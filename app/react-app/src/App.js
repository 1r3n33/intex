import './App.css';
import React from 'react';
import ConnectToWallet from './components/ConnectToWallet';

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
