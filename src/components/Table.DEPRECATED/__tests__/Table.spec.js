import { CustomTableBase } from '../index';

describe('Table', () => {
  const props = {
    rows: [
      {
        disablePadding: false,
        id: 'name',
        label: 'name',
        numeric: false,
        editable: true
      }
    ],
    data: [
      {
        id: 1,
        name: 'Jim Halpert',
        someOtherKey: 'really tall'
      },
      {
        id: 2,
        name: 'Pam Beasley',
        someOtherKey: 'likes Jim'
      }
    ],
    selectedRows: {
      rows: [
        {
          id: 1,
          name: 'Jim Halpert',
          someOtherKey: 'really tall'
        }
      ],
      cb: jest.fn(),
      options: [{ value: 'Jim' }]
    },
    onClearFilters: jest.fn(),
    onCheckboxClick: jest.fn(),
    className: 'className',
    onEditClick: jest.fn(),
    order: 'asc',
    orderBy: 'name',
    filters: [
      {
        cb: jest.fn(),
        label: 'name',
        type: 'string',
        value: ''
      }
    ]
  };
  let component;
  let instance;
  it('renders', () => {
    component = mount(<CustomTableBase {...props} />);
    instance = component.instance();
    expect(component.exists()).toBeTruthy();
  });

  describe('getRowMap', () => {
    it('shades rows array to be an object for simpler iteration', () => {
      const test = instance.getRowMap();
      expect(test).toStrictEqual({ name: true });
    });
  });

  describe('mapDataToRows', () => {
    it('shaped data to match table expectation', () => {
      const test = instance.mapDataToRows();
      expect(test[0]).toStrictEqual(
        expect.objectContaining({
          name: expect.any(String),
          id: expect.any(Number)
        })
      );
      expect(test[0].someOtherKey).toBeFalsy();
    });
  });
});
