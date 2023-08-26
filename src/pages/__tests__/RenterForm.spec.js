import { RenterFormBase } from '../RenterFormModal';

describe('RenterForm', () => {
  let component;
  // eslint-disable-next-line no-unused-vars
  let instance;
  const props = {
    className: 'className',
    open: false,
    onClose: jest.fn(),
    upsertUser: jest.fn(),
    heading: 'Hello World!',
    user: {},
    userRoles: { userRoles: [{ id: 1 }] }
  };
  it('should render without a user', () => {
    component = mount(<RenterFormBase {...props} />);
    component.instance();
    expect(component.exists()).toBeTruthy();
  });
  it('should render with a user', () => {
    props.user = {
      id: 99,
      firstName: 'Oliver',
      lastName: 'Queen',
      email: 'arrowrulez@queenconsolidated.com',
      role: '2'
    };
    component = mount(<RenterFormBase {...props} />);
    component.instance();
    expect(component.exists()).toBeTruthy();
  });
});
