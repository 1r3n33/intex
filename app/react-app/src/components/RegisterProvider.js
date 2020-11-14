import React from 'react';
import 'react-bulma-components/dist/react-bulma-components.min.css';
import Columns from 'react-bulma-components/lib/components/columns'
import { Field, Control, Input } from 'react-bulma-components/lib/components/form';
import Button from 'react-bulma-components/lib/components/button';

class RegisterProvider extends React.Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
        <p>
        Register as a provider.
        </p>
        <Columns gapless>
          <Columns.Column size={8}>
            <Field>
            <Control>
              <Input placeholder="Your Provider Name" />
            </Control>
          </Field>
          </Columns.Column>
          <Columns.Column>
            <Button>Register</Button>
          </Columns.Column>
        </Columns>
        </header>
      </div>
    );
  }
}

export default RegisterProvider;
