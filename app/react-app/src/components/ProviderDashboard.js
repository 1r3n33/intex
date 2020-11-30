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
    this.onBrandSafetyCategoriesSelectionChange = this.onBrandSafetyCategoriesSelectionChange.bind(this);

    this.state = {
      url: '',
      brandSafetyCategories: [],
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

    } catch (ex) {
      console.log(ex);
    }
  }

  onUrlInputValueChange(e) {
    this.setState({ url: e.target.value });
  }

  onBrandSafetyCategoriesSelectionChange(e) {
    const categories = Array.from(e.target.selectedOptions, option => option.value);
    this.setState({ brandSafetyCategories: categories });
  }

  async onAddUrlButtonClick(e) {
    const address = this.props.user.address;

    const normalizedUrl = normalizeUrl(this.state.url, { stripProtocol: true, stripHash: true });

    const url = this.props.web3.utils.asciiToHex(normalizedUrl);

    // Build data array: length
    const length = this.state.brandSafetyCategories.length
    const buffer = new ArrayBuffer(4 * (1 + length));
    const data32 = new Int32Array(buffer);
    data32[0] = length;
    data32.set(this.state.brandSafetyCategories, 1);
    const data8 = new Uint8Array(buffer);

    try {
      const price = await this.props.exchange.addDataIntelligencePrice();

      // Before using Intex token to add Data Intelligence, we must increase allowance of the Exchange contract.
      await this.props.intex.increaseAllowance(this.props.exchange.address, price, { from: address });

      // Add data intelligence.
      await this.props.exchange.addDataIntelligence(url, 0, data8, { from: address });

      // Get data intelligences to refresh state.
      const dataIntelligences = await this.props.exchange.getDataIntelligences(address);

      this.setState({
        url: '',
        brandSafetyCategories: [],
        dataIntelligences: dataIntelligences
      });

    } catch (ex) {
      console.log(ex);
    }
  }

  renderTableData() {
    return this.state.dataIntelligences.map((dataIntelligence, index) => {
      const categories = [
        'Unknown',
        'Military conflict',
        'Obscenity',
        'Drugs',
        'Tobacco',
        'Adult',
        'Arms',
        'Crime',
        'Death/injury',
        'Online piracy',
        'Hate speech',
        'Terrorism',
        'Spam/harmful sites',
        'Fake news'
      ];

      const dataHex = dataIntelligence.data.substring(2); // remove 0x
      const data8 = Buffer.from(dataHex, 'hex');
      const data32 = new Int32Array(data8.buffer);
      const dataCategories = Array.from(data32).slice(1).map(x => categories[x]); // skip length
      const dataString = dataCategories.join(';');

      return (
        <tr key={index}>
          <td>{index}</td>
          <td>{this.props.web3.utils.hexToAscii(dataIntelligence.source)}</td>
          <td>{dataString}</td>
          <td>{dataIntelligence.timestamp}</td>
        </tr>
      );
    });
  }

  render() {
    return (
      <div className='App'>
        <header className='App-header'>
          <p>
            Welcome to Intex.
          </p>
          {this.props.user.address}
          <br />
          {this.props.web3.utils.hexToString(this.props.user.provider.name)}
          <Columns vCentered={true}>
            <Columns.Column size={7}>
              <Field>
                <Control>
                  <Input placeholder='URL' value={this.state.url} onChange={this.onUrlInputValueChange} />
                </Control>
              </Field>
            </Columns.Column>
            <Columns.Column size={4}>
              <Select multiple={true} value={this.state.brandSafetyCategories} onChange={this.onBrandSafetyCategoriesSelectionChange}>
                <option value='1'>Military conflict</option>
                <option value='2'>Obscenity</option>
                <option value='3'>Drugs</option>
                <option value='4'>Tobacco</option>
                <option value='5'>Adult</option>
                <option value='6'>Arms</option>
                <option value='7'>Crime</option>
                <option value='8'>Death/injury</option>
                <option value='9'>Online piracy</option>
                <option value='10'>Hate speech</option>
                <option value='11'>Terrorism</option>
                <option value='12'>Spam/harmful sites</option>
                <option value='13'>Fake news</option>
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
