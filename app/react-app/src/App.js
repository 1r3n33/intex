import './App.css';
import Web3 from 'web3'

function App() {
  if (window.ethereum) {
    window.web3 = new Web3(window.ethereum);
    window.ethereum.enable();
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

export default App;
