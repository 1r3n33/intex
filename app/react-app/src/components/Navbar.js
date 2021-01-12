import React from "react";
import "react-bulma-components/dist/react-bulma-components.min.css";
import { default as BulmaNavbar } from "react-bulma-components/lib/components/navbar";
import Modal from "react-bulma-components/lib/components/modal";
import Section from "react-bulma-components/lib/components/section";
import Button from "react-bulma-components/lib/components/button";
import {
  Field,
  Control,
  Input,
} from "react-bulma-components/lib/components/form";
import Columns from "react-bulma-components/lib/components/columns/columns";

class Navbar extends React.Component {
  constructor(props) {
    super(props);

    this.onBuyModalOpen = this.onBuyModalOpen.bind(this);
    this.onBuyModalClose = this.onBuyModalClose.bind(this);
    this.onBuyIntexButtonClick = this.onBuyIntexButtonClick.bind(this);

    this.state = {
      showBuyModal: false,
    };
  }

  onBuyModalOpen() {
    this.setState({
      showBuyModal: true,
    });
  }

  onBuyModalClose() {
    this.setState({
      showBuyModal: false,
    });
  }

  async onBuyIntexButtonClick() {
    try {
      // Buy INTX
      await this.props.wallet.buy(1);

      // Get new balance
      const balance = await this.props.wallet.getBalance();

      this.setState({
        showBuyModal: false,
      });
      this.props.onBalanceChange(balance);
    } catch (ex) {
      console.log(ex);
    }
  }

  renderUser() {
    return (
      <BulmaNavbar.Item>
        <div>
          <h1 className="title is-4">
            {this.props.user.provider
              ? this.props.web3.utils.hexToString(this.props.user.provider.name)
              : "-"}
          </h1>
          <h2 className="subtitle is-6">{this.props.user.address}</h2>
        </div>
      </BulmaNavbar.Item>
    );
  }

  renderBalance() {
    return (
      <BulmaNavbar.Item>
        <div>
          <h1 className="title is-4" onClick={this.onBuyModalOpen}>
            {this.props.balance
              ? this.props.web3.utils.fromWei(this.props.balance)
              : "-"}
          </h1>
          <h2 className="subtitle is-6" onClick={this.onBuyModalOpen}>
            INTX
          </h2>
        </div>
      </BulmaNavbar.Item>
    );
  }

  render() {
    return (
      <div>
        <Modal show={this.state.showBuyModal} onClose={this.onBuyModalClose}>
          <Modal.Content>
            <Section style={{ backgroundColor: "white" }}>
              <div>
                <Columns vCentered={true}>
                  <Columns.Column size={1}>Pay</Columns.Column>
                  <Columns.Column size={2}>
                    <Field kind="addons">
                      <Control>
                        <Input placeholder="1" value="1" readOnly={true} />
                        <p className="help is-warning">
                          {this.state.errorMessage}
                        </p>
                      </Control>
                    </Field>
                  </Columns.Column>
                  <Columns.Column size={7}>
                    ETH to buy 1,000,000 INTX
                  </Columns.Column>
                  <Columns.Column size={1}>
                    <Button
                      color="success"
                      onClick={this.onBuyIntexButtonClick}
                    >
                      Buy
                    </Button>
                  </Columns.Column>
                </Columns>
              </div>
            </Section>
          </Modal.Content>
        </Modal>
        <BulmaNavbar>
          <BulmaNavbar.Menu>
            <BulmaNavbar.Container>
              <BulmaNavbar.Item>
                <h1 className="title has-text-weight-normal">
                  Welcome to <span className="has-text-weight-bold">Intex</span>
                </h1>
              </BulmaNavbar.Item>
            </BulmaNavbar.Container>
            <BulmaNavbar.Container position="end">
              {this.renderUser()}
              {this.renderBalance()}
            </BulmaNavbar.Container>
          </BulmaNavbar.Menu>
        </BulmaNavbar>
      </div>
    );
  }
}

export default Navbar;
