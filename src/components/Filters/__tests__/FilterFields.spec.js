import { FilterFieldsBase } from '../FilterFields';

// import 'react-dates/initialize'
jest.mock('react-dates/initialize');
describe('FilterFields', () => {
  const props = {
    filters: [
      {
        cb: jest.fn(),
        label: 'name',
        type: 'text',
        value: ''
      },
      {
        cb: jest.fn(),
        label: 'name',
        type: 'date',
        value: null
      },
      {
        cb: jest.fn(),
        label: 'name',
        type: 'date',
        value: null,
        plural: true
      },
      {
        cb: jest.fn(),
        label: 'name',
        type: 'select',
        value: null,
        options: [{ value: 'myValue', label: 'My Label' }]
      }
    ]
  };
  let component;
  it('should render', () => {
    component = shallow(<FilterFieldsBase {...props} />);
    expect(component.exists()).toBeTruthy();
  });
});
