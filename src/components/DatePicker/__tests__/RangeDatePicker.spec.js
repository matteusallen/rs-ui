import moment from 'moment';

import { RangeDatePicker } from '../index';

describe('RangeDatePicker', () => {
  let component;
  let instance;
  const today = moment();
  const tomorrow = moment().add(1, 'days');
  const props = {
    cb: jest.fn(),
    value: [today, tomorrow]
  };

  it('should render', () => {
    window.matchMedia = jest.fn().mockImplementation(query => {
      return {
        matches: true,
        media: query,
        onchange: null,
        addListener: jest.fn(), // deprecated
        removeListener: jest.fn(), // deprecated
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn()
      };
    });
    component = shallow(<RangeDatePicker {...props} />);
    instance = component.instance();
    expect(component.exists()).toBeTruthy();
  });
  // describe('onDatesChange', () => {
  //   // const newDates = {
  //   //   startDate: moment('111111', 'DDMMYY'),
  //   //   endDate: moment('111112', 'DDMMYY'),
  //   // }
  //   // it('should update state', async () => {
  //   //   expect(instance.state.startDate.format('YYYY-MM-DD')).toEqual(
  //   //     today.format('YYYY-MM-DD'),
  //   //   )
  //   //   instance.onDatesChange(newDates)
  //   //   expect(instance.state.startDate.format('YYYY-MM-DD')).toEqual(
  //   //     newDates.startDate.format('YYYY-MM-DD'),
  //   //   )
  //   // })
  //   // it('should call props.cb', () => {
  //   //   expect(props.cb).toHaveBeenCalledWith(newDates)
  //   // })
  // })
  describe('onFocusChange', () => {
    it('changes state.focusedInput', () => {
      expect(instance.state.focusedInput).toBeFalsy();
      instance.onFocusChange('startDate');
      expect(instance.state.focusedInput).toBeTruthy();
    });
  });
});
