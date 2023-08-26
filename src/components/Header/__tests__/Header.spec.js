import Header from '../index';
import renderWithApollo from '../../../lib/testing-tools/renderWithApollo';

describe('Header Component', () => {
  it('renders', () => {
    const { container } = renderWithApollo(<Header />);
    expect(container.querySelector('header')).toBeTruthy();
  });
});
