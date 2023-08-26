import { FiltersBase } from '../index';

describe('Filters', () => {
  let component;
  let instance;
  const filter = {
    cb: jest.fn(),
    label: 'first name',
    type: 'string',
    value: ''
  };
  const props = {
    className: 'className',
    filters: [filter],
    onClearFilters: jest.fn(),
    onSubmit: jest.fn()
  };

  it('Should Render', async () => {
    component = await mount(<FiltersBase {...props} />);
    instance = await component.instance();
    expect(component.exists()).toBeTruthy();
  });
  it('should expand and collapse', () => {
    expect(instance.state.expanded).toBeFalsy();
    instance.togglePanel();
    expect(instance.state.expanded).toBeTruthy();
  });
  it('should call onSubmit', () => {
    const toggleSpy = jest.spyOn(instance, 'togglePanel');
    instance.applyFilters();
    expect(instance.props.onSubmit).toHaveBeenCalled();
    expect(toggleSpy).toHaveBeenCalled();
  });
});
