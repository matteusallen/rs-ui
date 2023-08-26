import moment from 'moment';

import { SingleDatePicker } from '../index';

describe('SingleDatePicker', () => {
  let component;
  let instance;
  const today = moment();
  const props = {
    cb: jest.fn(),
    value: today
  };

  it('should render', () => {
    component = shallow(<SingleDatePicker {...props} />);
    instance = component.instance();
    expect(component.exists()).toBeTruthy();
  });
  describe('onDateChange', () => {
    const newDate = moment('111111', 'DDMMYY');
    it('should call props.cb', () => {
      instance.onDateChange(newDate);
      expect(props.cb).toHaveBeenCalledWith(newDate);
    });
  });
  describe('onFocusChange', () => {
    it('changes state.focusedInput', () => {
      expect(instance.state.focused).toBeFalsy();
      instance.onFocusChange({ focused: true });
      expect(instance.state.focused).toBeTruthy();
    });
  });
});
