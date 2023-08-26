import React from 'react';
import SignUp from 'Pages/SignUp/SignUp';
import SignUpForm from 'Pages/SignUp/SignUpForm/SignUpForm';
import SignUpHero from 'Pages/SignUp/SignUpHero/SignUpHero';
import { shallow } from 'enzyme';

describe('SignUp', () => {
  it('should render', () => {
    const wrapper = shallow(<SignUp />);
    expect(true).toBeTruthy();

    expect(wrapper.find('.sign-up-page')).toBeTruthy();
    expect(wrapper.contains(<SignUpHero />)).toBeTruthy();
    expect(wrapper.contains(<SignUpForm />)).toBeTruthy();
  });
});
