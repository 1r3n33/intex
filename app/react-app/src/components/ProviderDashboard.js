import React from 'react';
import 'react-bulma-components/dist/react-bulma-components.min.css';
import Columns from 'react-bulma-components/lib/components/columns'
import { Field, Control, Input, Select } from 'react-bulma-components/lib/components/form';
import Button from 'react-bulma-components/lib/components/button';
import Table from 'react-bulma-components/lib/components/table';
import normalizeUrl from 'normalize-url';

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
    const address = this.props.user.address;

    const normalizedUrl = normalizeUrl(this.state.url, {stripProtocol: true, stripHash: true});

    const url = this.props.web3.utils.asciiToHex(normalizedUrl);
    const data = this.props.web3.utils.asciiToHex(normalizedUrl);

    try {
      // Before using Intex token to add Data Intelligence, we must increase allowance of the Exchange contract.
      await this.props.intex.increaseAllowance(this.props.exchange.address, this.props.web3.utils.toWei('1000'), { from: address });

      // Add fake data intelligence.
      await this.props.exchange.addDataIntelligence(url, 0, data, { from: address });

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
          <td>{this.props.web3.utils.hexToAscii(dataIntelligence.source)}</td>
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
          <Columns vCentered={true}>
            <Columns.Column size={7}>
              <Field>
              <Control>
                <Input placeholder="URL" value={this.state.url} onChange={this.onUrlInputValueChange}/>
              </Control>
            </Field>
            </Columns.Column>
            <Columns.Column size={4}>
              <Select name="IAB Brand Safety Categories" value={0} multiple={true}>
                <option value="1">Military conflict</option>
                <option value="2">Obscenity</option>
                <option value="3">Drugs</option>
                <option value="4">Tobacco</option>
                <option value="5">Adult</option>
                <option value="6">Arms</option>
                <option value="7">Crime</option>
                <option value="8">Death/injury</option>
                <option value="9">Online piracy</option>
                <option value="10">Hate speech</option>
                <option value="11">Terrorism</option>
                <option value="12">Spam/harmful sites</option>
                <option value="13">Fake news</option>
              </Select>
            </Columns.Column>
            <Columns.Column size={1}>
              <Button color='success' onClick={this.onAddUrlButtonClick}>Add</Button>
            </Columns.Column>
          </Columns>
          <Table>
            <thead>
              <tr>
                <th>Id</th>
                <th>Url</th>
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
