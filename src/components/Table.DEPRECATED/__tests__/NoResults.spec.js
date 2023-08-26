import { NoResultsBase } from '../NoResults';

describe('NoResults', () => {
  it('renders', () => {
    const component = shallow(<NoResultsBase />);
    expect(component.exists()).toBeTruthy();
  });
});
