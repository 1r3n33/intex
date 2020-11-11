import React from 'react';
import 'react-bulma-components/dist/react-bulma-components.min.css';
import { Button } from 'react-bulma-components';

class RegisterProvider extends React.Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
        <p>
        Register as a provider.
        </p>
        <Button>Register</Button>
        </header>
      </div>
    );
  }
}

export default RegisterProvider;
