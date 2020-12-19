import { render, screen, waitFor } from '@testing-library/react';
import BrandSafetyCategories from 'components/BrandSafety/Categories';
import ProviderDashboard from '../components/ProviderDashboard';

// There is an issue in react-bulma-components Select when multiple selection is enabled.
// Despite we properly pass an array to value prop, it keeps checking for a string or number.
// BeforeAll silents the error generated by this issue.
//
// Possible fix:
// PropTypes.oneOfType([
//   PropTypes.string,
//   PropTypes.number,
//   PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string, PropTypes.number])),
// ])
//
// Fixed by https://github.com/couds/react-bulma-components/commit/085ae6ed46cce4a7c5766005926069e631d7a225
//
const originalError = console.error

beforeAll(() => {
  jest.spyOn(console, 'error').mockImplementation((...args) => {
    if (typeof args[0] === 'string' && args[0].includes('Failed prop type: Invalid prop `value` supplied to `Select`')) {
      return
    }
    return originalError.call(console, args)
  })
})

afterAll(() => {
  console.error.mockRestore()
})

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

test('renders welcome message', () => {
  const props = MockProps('ProviderAddress', 'ProviderName', 'ProviderBalance');
  render(<ProviderDashboard user={props.user} web3={props.web3} exchange={props.exchange} intex={props.intex}/>);

  const welcome = screen.getByText(/Welcome/i);
  expect(welcome).toBeInTheDocument();
});

test('renders all brand safety categories in Select options', () => {
  const props = MockProps('ProviderAddress', 'ProviderName', 'ProviderBalance');
  render(<ProviderDashboard user={props.user} web3={props.web3} exchange={props.exchange} intex={props.intex}/>);

  const brandSafetyCategories = new BrandSafetyCategories();

  const options = screen.getAllByRole('option');

  const keys = Object.keys(brandSafetyCategories.categories);
  expect(options.length).toEqual(keys.length)

  for (let i=0; i<keys.length; i++) {
    expect(options[i]).toHaveValue(keys[i]);
    expect(options[i]).toHaveTextContent(brandSafetyCategories.categories[keys[i]]);
  }
});

test('render user information in navbar', async () => {
  const props = MockProps('ProviderAddress', 'ProviderName', 'ProviderBalance');
  render(<ProviderDashboard user={props.user} web3={props.web3} exchange={props.exchange} intex={props.intex}/>);

  // Use waitFor to give render the time to resolve async calls and produce the expected output.
  await waitFor(() => {
    const navbarItems = screen.getAllByRole('heading');
    expect(navbarItems[1]).toHaveTextContent(props.user.provider.name);
    expect(navbarItems[2]).toHaveTextContent(props.user.address);
    expect(navbarItems[3]).toHaveTextContent('ProviderBalance');
  });
});
