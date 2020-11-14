import React from 'react';
import 'react-bulma-components/dist/react-bulma-components.min.css';
import Columns from 'react-bulma-components/lib/components/columns'
import { Field, Control, Input } from 'react-bulma-components/lib/components/form';
import Button from 'react-bulma-components/lib/components/button';

class RegisterProvider extends React.Component {
  constructor(props) {
    super(props);

    this.onInputValueChange = this.onInputValueChange.bind(this);
    this.onRegisterButtonClick = this.onRegisterButtonClick.bind(this);

    this.state = { providerName: '' };
  }

  onInputValueChange(e) {
    this.setState({ providerName: e.target.value })
  }

  onRegisterButtonClick(e) {
    console.log(this.state.providerName)
  }

  render() {
    // TODO: Glue input and button together instead of using separate columns.
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
              <Input placeholder="Your Provider Name" value={this.state.providerName} onChange={this.onInputValueChange}/>
            </Control>
          </Field>
          </Columns.Column>
          <Columns.Column>
            <Button color='success' onClick={this.onRegisterButtonClick}>Register</Button>
          </Columns.Column>
        </Columns>
        </header>
      </div>
    );
  }
}

export default RegisterProvider;
