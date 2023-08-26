import moment from 'moment';

import { FilterChipsBase } from '../FilterChips';

describe('FilterChips', () => {
  const filter = {
    cb: jest.fn(),
    label: 'first name',
    type: 'string',
    value: ''
  };
  const props = {
    className: 'className',
    filters: [filter],
    onSubmit: jest.fn()
  };
  let instance;
  let component;

  it('Should render', () => {
    component = shallow(<FilterChipsBase {...props} />);
    instance = component.instance();
    expect(component.exists()).toBeTruthy();
  });
  describe('getFilterValue', () => {
    it('should return a formatted date if passed a moment object', () => {
      const michaelsLastDay = 'April 28, 2011';
      const newFilter = { value: moment(new Date(michaelsLastDay)) };
      expect(instance.getFilterValue(newFilter)).toEqual('04/28/2011');
    });
    it('should return a dash separated value if passed an array', () => {
      const newFilter = { value: ['Bears', 'Beets', 'Battlestar Gallactica'] };
      expect(instance.getFilterValue(newFilter)).toEqual('Bears — Beets — Battlestar Gallactica');
    });
    it('should return the value if passed a string', () => {
      const newFilter = { value: 'ridi do do do' };
      expect(instance.getFilterValue(newFilter)).toEqual('ridi do do do');
    });
  });
});
