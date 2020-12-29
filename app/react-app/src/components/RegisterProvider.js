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
    this.getErrorMessageFromRpcException = this.getErrorMessageFromRpcException.bind(
      this
    );
    this.onInputValueChange = this.onInputValueChange.bind(this);
    this.onRegisterButtonClick = this.onRegisterButtonClick.bind(this);

    this.state = {
      registerButtonEnabled: false,
      providerName: "",
      errorMessage: "",
    };

    this.providerNameRegex = RegExp("^[a-zA-Z0-9]*$");
  }

  isProviderNameValid(name) {
    return name.length > 0 && this.providerNameRegex.test(name);
  }

  getErrorMessageFromRpcException(ex) {
    try {
      const first = ex.message.indexOf("{");
      const last = ex.message.lastIndexOf("}");
      const json = ex.message.substring(first, last + 1);
      const rpc = JSON.parse(json);
      const full = rpc.value.data.message;
      return full.substring(
        "VM Exception while processing transaction: revert ".length
      );
    } catch (_) {
      return "Unknown error";
    }
  }

  onInputValueChange(e) {
    const name = e.target.value;
    const validName = this.isProviderNameValid(name);

    this.setState({
      providerName: name,
      registerButtonEnabled: validName,
    });
  }

  async onRegisterButtonClick(e) {
    const validName = this.isProviderNameValid(this.state.providerName);
    if (!validName) {
      this.setState({
        providerName: "",
        registerButtonEnabled: false,
      });
      return;
    }

    try {
      const address = this.props.user.address;
      const name = this.props.web3.utils.asciiToHex(this.state.providerName);

      await this.props.exchange.registerAsProvider(name, { from: address });

      const provider = await this.props.exchange.providerByAddress(address);

      const registeredProvider = provider.addr === address ? provider : null;
      this.props.onProviderRegistered(registeredProvider);
    } catch (ex) {
      this.setState({
        errorMessage: this.getErrorMessageFromRpcException(ex),
      });
    }
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
              <p class="help is-warning">{this.state.errorMessage}</p>
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
