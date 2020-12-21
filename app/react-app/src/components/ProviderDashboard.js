import React from 'react';
import 'react-bulma-components/dist/react-bulma-components.min.css';
import Navbar from 'react-bulma-components/lib/components/navbar';
import Columns from 'react-bulma-components/lib/components/columns';
import { Field, Control, Input, Select } from 'react-bulma-components/lib/components/form';
import Button from 'react-bulma-components/lib/components/button';
import Table from 'react-bulma-components/lib/components/table';
import Modal from 'react-bulma-components/lib/components/modal';
import Section from 'react-bulma-components/lib/components/section';
import normalizeUrl from 'normalize-url';
import BrandSafetyCategories from './BrandSafety/Categories';

class ProviderDashboard extends React.Component {
  constructor(props) {
    super(props);

    this.onBuyIntexButtonClick = this.onBuyIntexButtonClick.bind(this);
    this.onUrlInputValueChange = this.onUrlInputValueChange.bind(this);
    this.onAddUrlButtonClick = this.onAddUrlButtonClick.bind(this);
    this.onBrandSafetyCategoriesSelectionChange = this.onBrandSafetyCategoriesSelectionChange.bind(this);
    this.onBuyModalOpen = this.onBuyModalOpen.bind(this);
    this.onBuyModalClose = this.onBuyModalClose.bind(this);

    this.state = {
      url: '',
      brandSafetyCategories: [],
      dataIntelligences: [],
      balance: undefined,
      showBuyModal: false
    };

    this.brandSafetyCategories = new BrandSafetyCategories();
  }

  async componentDidMount() {
    const address = this.props.user.address;

    try {
      const dataIntelligences = await this.props.exchange.getDataIntelligences(address);

      const balance = await this.props.intex.balanceOf(address);

      this.setState({
        dataIntelligences: dataIntelligences,
        balance: balance
      });

    } catch (ex) {
      console.log(ex);
    }
  }

  async onBuyIntexButtonClick() {
    try {
      // Buy INTX
      await this.props.intex.getTokens({ from: this.props.user.address, value: this.props.web3.utils.toWei('1') });

      // Get new balance
      const balance = await this.props.intex.balanceOf(this.props.user.address);

      this.setState({
        balance: balance,
        showBuyModal: false
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

    const bytes = this.brandSafetyCategories.toBytes(this.state.brandSafetyCategories);

    try {
      const price = await this.props.exchange.addDataIntelligencePrice();

      // Before using Intex token to add Data Intelligence, we must increase allowance of the Exchange contract.
      await this.props.intex.increaseAllowance(this.props.exchange.address, price, { from: address });

      // Add data intelligence.
      await this.props.exchange.addDataIntelligence(url, 0, bytes, { from: address });

      // Get data intelligences to refresh state.
      const dataIntelligences = await this.props.exchange.getDataIntelligences(address);

      // Get new balance
      const balance = await this.props.intex.balanceOf(address);

      this.setState({
        url: '',
        brandSafetyCategories: [],
        dataIntelligences: dataIntelligences,
        balance: balance
      });

    } catch (ex) {
      console.log(ex);
    }
  }

  onBuyModalOpen() {
    this.setState({
      showBuyModal: true
    });
  }

  onBuyModalClose() {
    this.setState({
      showBuyModal: false
    });
  }

  renderSelectOptions() {
    const keys = Object.keys(this.brandSafetyCategories.categories);
    return keys.map(k => {
      return (
        <option key={k} value={k}>{this.brandSafetyCategories.categories[k]}</option>
      );
    });
  }

  renderTableBody() {
    return this.state.dataIntelligences.map((dataIntelligence, index) => {

      const ids = this.brandSafetyCategories.fromHexadecimalString(dataIntelligence.data);
      const names = ids.map(id => this.brandSafetyCategories.categories[id]);

      return (
        <tr key={index}>
          <td>{index}</td>
          <td>{this.props.web3.utils.hexToAscii(dataIntelligence.source)}</td>
          <td>{names.join(';')}</td>
          <td>{dataIntelligence.timestamp}</td>
        </tr>
      );
    });
  }

  render() {
    return (
      <div className='App'>
        <Modal show={this.state.showBuyModal} onClose={this.onBuyModalClose}>
          <Modal.Content>
            <Section style={{ backgroundColor: 'white' }}>
              <div>
                Get 1,000,000 INTX
              </div>
              <Button color='success' onClick={this.onBuyIntexButtonClick}>Buy</Button>
            </Section>
          </Modal.Content>
        </Modal>
        <Navbar>
          <Navbar.Menu>
            <Navbar.Container>
              <Navbar.Item>
                <h1 className='title has-text-weight-normal'>Welcome to <span className='has-text-weight-bold'>Intex</span></h1>
              </Navbar.Item>
            </Navbar.Container>
            <Navbar.Container position='end'>
              <Navbar.Item>
                <div>
                  <h1 className='title is-4'>{this.props.web3.utils.hexToString(this.props.user.provider.name)}</h1>
                  <h2 className="subtitle is-6">{this.props.user.address}</h2>
                </div>
              </Navbar.Item>
              <Navbar.Item>
                <div>
                  <h1 className='title is-4' onClick={this.onBuyModalOpen}>{this.state.balance ? this.props.web3.utils.fromWei(this.state.balance) : '-'}</h1>
                  <h2 className="subtitle is-6" onClick={this.onBuyModalOpen}>INTX</h2>
                </div>
              </Navbar.Item>
            </Navbar.Container>
          </Navbar.Menu>
        </Navbar>
        <header className='App-header'>
          <br />
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
                {this.renderSelectOptions()}
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
              {this.renderTableBody()}
            </tbody>
          </Table>
        </header>
      </div>
    );
  }
}

export default ProviderDashboard;
