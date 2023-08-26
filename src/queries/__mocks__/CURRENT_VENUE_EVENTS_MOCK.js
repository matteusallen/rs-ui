import { FILTERED_VENUE_EVENTS } from '../Admin/FilteredVenueEvents';

export default [
  {
    request: {
      query: FILTERED_VENUE_EVENTS
    },
    result: {
      data: {
        venue: {
          events: [
            {
              id: '1',
              name: 'green',
              pricePerNight: '46.00',
              pricePerEvent: '12.3',
              startDate: '2020-09-28',
              endDate: '2020-10-03',
              openDate: null,
              closeDate: null,
              dateRange: 'Sep 28-03, 2020',
              stallCount: 80,
              stallAvailability: {
                availability: [
                  {
                    date: '2020-09-28',
                    stallsAvailable: 80
                  },
                  {
                    date: '2020-09-29',
                    stallsAvailable: 80
                  },
                  {
                    date: '2020-09-30',
                    stallsAvailable: 80
                  },
                  {
                    date: '2020-10-01',
                    stallsAvailable: 80
                  },
                  {
                    date: '2020-10-02',
                    stallsAvailable: 80
                  }
                ]
              },
              addOns: [
                {
                  id: '1',
                  name: 'shavings',
                  unitName: 'bag',
                  description: 'Bags of shavings for bedding',
                  price: 8,
                  priceType: 'perUnit'
                }
              ],
              venue: {
                id: '1',
                city: 'Ceasarmouth',
                state: 'TN'
              },
              buildings: [
                {
                  id: '1',
                  name: 'Barn 10'
                },
                {
                  id: '2',
                  name: 'Barn 11'
                }
              ]
            }
          ]
        }
      },
      extensions: {}
    }
  }
];
