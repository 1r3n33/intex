import React from 'react';
import 'react-bulma-components/dist/react-bulma-components.min.css';
import { Field, Control, Label, Input } from 'react-bulma-components/lib/components/form';
import Button from 'react-bulma-components/lib/components/button';

class RegisterProvider extends React.Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
        <p>
        Register as a provider.
        </p>
        <Field>
          <Label>Name</Label>
          <Control>
            <Input placeholder="Text input" />
          </Control>
        </Field>
        <Button>Register</Button>
        </header>
      </div>
    );
  }
}

export default RegisterProvider;
