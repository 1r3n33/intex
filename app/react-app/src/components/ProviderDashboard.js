import React from 'react';

class ProviderDashboard extends React.Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <p>
            Welcome to Intex.
          </p>
          {this.props.user.address}
          <br/>
          {this.props.web3.utils.hexToString(this.props.user.provider.name)}
        </header>
      </div>
    );
  }
}

export default ProviderDashboard;
