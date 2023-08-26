import React from 'react';
import { configure, mount, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { MockedProvider } from '@apollo/react-testing';
// import 'react-dates/initialize'

configure({ adapter: new Adapter() });

jest.mock('universal-cookie', () => ({
  get: jest.fn(),
  remove: jest.fn(),
  set: jest.fn()
}));

jest.mock('./src/lib/auth', () => ({
  getToken: jest.fn(),
  setToken: jest.fn(),
  clearToken: jest.fn()
}));
// jest.mock('react-dates/initialize')
// jest.mock('react-dates/lib/css/_datepicker.css')
global.mount = mount;
global.shallow = shallow;
global.MockedProvider = MockedProvider;
global.React = React;
