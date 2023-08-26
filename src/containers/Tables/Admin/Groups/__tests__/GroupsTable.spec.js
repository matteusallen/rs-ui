import React from 'react';
import { MockedProvider } from '@apollo/react-testing';
import TestRenderer from 'react-test-renderer';
import GroupsTable from '../index';
import CreateGroupModal from '../CreateAndEditGroupModal';
import mocks from './mocks';

function TestRenderComponent(mocks) {
  const component = TestRenderer.create(
    <MockedProvider mocks={mocks} addTypename={false}>
      <GroupsTable />
    </MockedProvider>
  );
  return component;
}

describe('GroupsTable', () => {
  it('component renders', () => {
    const component = shallow(
      <MockedProvider mocks={mocks}>
        <GroupsTable />
      </MockedProvider>
    );
    expect(component.exists()).toBeTruthy();
  });

  it.skip('shows loader while GQL fires off', () => {
    const component = TestRenderComponent(mocks);
    const table = component.toJSON();
    expect(table.children[0].props.className.includes('MuiCircularProgress-indeterminate'));
  });

  it.skip('renders a group in group table', async () => {
    const component = TestRenderComponent([mocks[0]]);
    await TestRenderer.act(async () => await new Promise(resolve => setTimeout(resolve, 0)));
    expect(component.toJSON()[3].children[0].children[0].children.includes('Mocked Group 1'));
  });
});

describe('CreateGroupsModal', () => {
  it('renders create group modal', async () => {
    const mockFn = jest.fn();
    const component = await mount(
      <MockedProvider mocks={mocks} addTypename={false}>
        <CreateGroupModal isOpen={true} onClose={mockFn} />
      </MockedProvider>
    );
    expect(component.text()).toContain('CREATE GROUP');
  });
});
