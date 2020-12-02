import { render, screen } from '@testing-library/react';
import App from '../App';

test('renders connect message', () => {
  render(<App />);
  const message = screen.getByText(/Please connect your wallet./i);
  expect(message).toBeInTheDocument();
});
