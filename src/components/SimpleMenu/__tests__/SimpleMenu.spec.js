import renderWithApollo from '../../../lib/testing-tools/renderWithApollo';
import { SimpleMenu } from '../index';

describe('SimpleMenu', () => {
  const setIsOpen = jest.fn();
  const handleParentClose = jest.fn();
  const isOpen = true;
  const options = [
    { label: 'Edit', onClick: () => (setIsOpen ? setIsOpen(!isOpen) : {}), dataTestId: 'simple-menu-edit' },
    { label: 'Delete', disabled: true, dataTestId: 'simple-menu-delete' }
  ];

  it('renders and fires CB', () => {
    const { container } = renderWithApollo(<SimpleMenu options={options} isParentOpen={true} handleParentClose={handleParentClose} />);
    expect(container).toBeTruthy();

    const simpleMenuButton = container.querySelector('button');
    simpleMenuButton.click();
    expect(handleParentClose).toHaveBeenCalled();
  });
});
