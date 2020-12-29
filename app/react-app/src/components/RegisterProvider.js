import React from "react";
import "react-bulma-components/dist/react-bulma-components.min.css";
import {
  Field,
  Control,
  Input,
} from "react-bulma-components/lib/components/form";
import Button from "react-bulma-components/lib/components/button";

class RegisterProvider extends React.Component {
  constructor(props) {
    super(props);

    this.isProviderNameValid = this.isProviderNameValid.bind(this);
    this.onInputValueChange = this.onInputValueChange.bind(this);
    this.onRegisterButtonClick = this.onRegisterButtonClick.bind(this);

    this.state = {
      registerButtonEnabled: false,
      providerName: "",
    };

    this.providerNameRegex = RegExp("^[a-zA-Z0-9]*$");
  }

  isProviderNameValid(name) {
    return name.length > 0 && this.providerNameRegex.test(name);
  }

  onInputValueChange(e) {
    const name = e.target.value;
    const validName = this.isProviderNameValid(name);

    this.setState({
      providerName: name,
      registerButtonEnabled: validName,
    });
  }

  onRegisterButtonClick(e) {
    const validName = this.isProviderNameValid(this.state.providerName);
    if (!validName) {
      this.setState({
        providerName: "",
        registerButtonEnabled: false,
      });
      return;
    }

    const address = this.props.user.address;
    const name = this.props.web3.utils.asciiToHex(this.state.providerName);

    this.props.exchange
      .registerAsProvider(name, { from: address })
      .then((_) => {
        // TODO: Should we create an in-memory provider instead of calling contract?
        this.props.exchange.providerByAddress(address).then((provider) => {
          const registeredProvider =
            provider.addr === address ? provider : null;
          this.props.onProviderRegistered(registeredProvider);
        });
      });
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <p>Register as a provider.</p>
          <Field kind="addons">
            <Control>
              <Input
                placeholder="Your Provider Name"
                value={this.state.providerName}
                onChange={this.onInputValueChange}
              />
            </Control>
            <Control>
              <Button
                disabled={!this.state.registerButtonEnabled}
                color="success"
                onClick={this.onRegisterButtonClick}
              >
                Register
              </Button>
            </Control>
          </Field>
        </header>
      </div>
    );
  }
}

export default RegisterProvider;
