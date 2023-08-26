import TableHead from '../TableHead';

describe('TableHead', () => {
  const props = {
    onRequestSort: jest.fn(),
    order: 'asc',
    orderBy: 'world',
    rows: [
      {
        disablePadding: false,
        id: 'hello',
        label: 'HELLO',
        numeric: false,
        sortable: false
      },
      {
        disablePadding: false,
        id: 'world',
        label: 'WORLD',
        numeric: false,
        sortable: true
      }
    ]
  };
  let component;
  it('should render', () => {
    component = shallow(<TableHead {...props} />);
    expect(component.exists()).toBeTruthy();
  });
  it('should have sortable and non-sortable fields', () => {
    expect(component.find('.MuiTableCell-alignLeft-15')).toBeTruthy();
    expect(component.find('.MuiTableSortLabel-root-27')).toBeTruthy();
  });
});
