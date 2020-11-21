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

    this.state = {
      url: '',
      dataIntelligences: []
    };
  }

  async componentDidMount() {
    const address = this.props.user.address;

    try {
      const dataIntelligences = await this.props.exchange.getDataIntelligences(address);

      this.setState({
        dataIntelligences: dataIntelligences
      });

    } catch(ex) {
      console.log(ex);
    }
  }

  onUrlInputValueChange(e) {
    this.setState({ url: e.target.value });
  }

  async onAddUrlButtonClick(e) {
    // Create fake data for now.
    const address = this.props.user.address;
    const hash = this.props.web3.utils.keccak256(this.state.url);
    const type = 0;
    const format = 1;
    const bytes = this.props.web3.utils.asciiToHex(this.state.url);

    try {
      // Before using Intex token to add Data Intelligence, we must increase allowance of the Exchange contract.
      await this.props.intex.increaseAllowance(this.props.exchange.address, this.props.web3.utils.toWei('1000'), { from: address });

      // Add fake data intelligence.
      await this.props.exchange.addDataIntelligence(hash, type, format, bytes, { from: address });

      // Get data intelligences to refresh state.
      const dataIntelligences = await this.props.exchange.getDataIntelligences(address);

      this.setState({
        url: '',
        dataIntelligences: dataIntelligences
      });

    } catch(ex) {
      console.log(ex);
    }
  }

  renderTableData() {
    return this.state.dataIntelligences.map((dataIntelligence, index) => {
      return (
        <tr key={index}>
          <td>{index}</td>
          <td>{dataIntelligence.data}</td>
          <td>{dataIntelligence.timestamp}</td>
        </tr>
      );
    });
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
                <th>Id</th>
                <th>Data</th>
                <th>Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {this.renderTableData()}
            </tbody>
          </Table>
        </header>
      </div>
    );
  }
}

export default ProviderDashboard;
