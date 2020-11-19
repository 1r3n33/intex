import React from 'react';
import 'react-bulma-components/dist/react-bulma-components.min.css';
import Table from 'react-bulma-components/lib/components/table';
import { Field, Control, Input } from 'react-bulma-components/lib/components/form';
import Button from 'react-bulma-components/lib/components/button';

class ProviderDashboard extends React.Component {
  constructor(props) {
    super(props);

    this.onUrlInputValueChange = this.onUrlInputValueChange.bind(this);
    this.onAddUrlButtonClick = this.onAddUrlButtonClick.bind(this);

    this.state = { url: '' };
  }

  onUrlInputValueChange(e) {
    this.setState({ url: e.target.value });
  }

  onAddUrlButtonClick(e) {
  }

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
          <Field kind='addons'>
            <Control>
              <Input placeholder="URL" value={this.state.url} onChange={this.onUrlInputValueChange}/>
            </Control>
            <Control>
              <Button color='success' onClick={this.onAddUrlButtonClick}>Add</Button>
            </Control>
          </Field>
          <Table>
            <thead>
              <tr>
                <th>URL</th>
                <th>Brand Safety Classification</th>
                <th>Date</th>
              </tr>
            </thead>
          </Table>
        </header>
      </div>
    );
  }
}

export default ProviderDashboard;
