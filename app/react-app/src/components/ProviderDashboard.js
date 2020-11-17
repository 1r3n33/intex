import React from 'react';
import 'react-bulma-components/dist/react-bulma-components.min.css';
import Table from 'react-bulma-components/lib/components/table';
import { Field, Control, Input } from 'react-bulma-components/lib/components/form';
import Button from 'react-bulma-components/lib/components/button';

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
          <Table>
            <thead>
              <tr>
                <th>URL</th>
                <th>Brand Safety Classification</th>
                <th>Date</th>
              </tr>
            </thead>
          </Table>
          <Field kind='addons'>
            <Control>
              <Input placeholder="URL"/>
            </Control>
            <Control>
              <Button color='success'>Add</Button>
            </Control>
          </Field>
        </header>
      </div>
    );
  }
}

export default ProviderDashboard;
