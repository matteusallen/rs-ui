import OutlinedSelect from '../OutlinedSelect';

describe('OutlinedSelect', () => {
  const props = {
    cb: jest.fn(),
    className: 'className',
    label: 'select',
    options: [{ label: 'My Label', value: 'myValue' }],
    selectedOption: ''
  };
  it('should render', () => {
    const component = mount(<OutlinedSelect {...props} />);
    expect(component.exists()).toBeTruthy();
  });
});
