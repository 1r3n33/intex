import { render, screen, waitFor } from "@testing-library/react";
import Navbar from "../components/Navbar";

function MockProps(address, name, balance) {
  const provider = { name: "name" };
  const user = { address: "address", provider: provider };

  const web3 = {
    utils: {
      hexToString: function (s) {
        return s;
      },
      fromWei: function (_) {
        return balance;
      },
    },
  };

  const exchange = {
    getDataIntelligences: async function (_) {
      return [];
    },
  };

  const intex = {
    balanceOf: async function (_) {
      return balance;
    },
  };

  return { user, web3, exchange, intex };
}

test("renders welcome message", () => {
  const props = MockProps("ProviderAddress", "ProviderName", "ProviderBalance");
  render(<Navbar user={props.user} web3={props.web3} intex={props.intex} />);

  const welcome = screen.getByText(/Welcome/i);
  expect(welcome).toBeInTheDocument();
});

test("render user information in navbar", async () => {
  const props = MockProps("ProviderAddress", "ProviderName", "ProviderBalance");
  render(
    <Navbar
      user={props.user}
      web3={props.web3}
      intex={props.intex}
      balance={"ProviderBalance"}
    />
  );

  // Use waitFor to give render the time to resolve async calls and produce the expected output.
  await waitFor(() => {
    const navbarItems = screen.getAllByRole("heading");
    expect(navbarItems[1]).toHaveTextContent(props.user.provider.name);
    expect(navbarItems[2]).toHaveTextContent(props.user.address);
    expect(navbarItems[3]).toHaveTextContent("ProviderBalance");
  });
});
