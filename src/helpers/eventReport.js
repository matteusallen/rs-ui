//@flow
import moment from 'moment';
import Papa from 'papaparse';
import { getValueByPropPath } from '../utils/objectHelpers';
import type { StallProductType, RVProductType } from '../queries/Renter/EventForOrderCreate';
import { DATE_FORMAT } from './DATE_FORMAT';
import { createDateRange, datesInRange } from './momentRange';
import type { OrderItemType, OrderType } from '../mutations/OrderCheckout';
import type { EventReportEventType, EventReportReturnType } from '../queries/Admin/EventReport';

const parseDays = (eventStartDate: string, eventEndDate: string, format): string[] => {
  const [range] = createDateRange({
    eventStartDate: moment(eventStartDate)
      .subtract(1, 'days')
      .format(DATE_FORMAT),
    eventEndDate,
    pristine: true
  });

  return format ? range.map(d => moment(d, DATE_FORMAT).format(format)) : range;
};

const calculateNumberOfWeeklyItems = (item: StallProductType | RVProductType, event: EventReportEventType, productType: string) => {
  let totalItems = 0;
  const orderItems = [];
  event.orders.forEach(order => {
    orderItems.push(...order.orderItems);
  });

  orderItems.forEach(orderItem => {
    if (orderItem.reservation && item.id === orderItem.reservation[productType]?.id) {
      totalItems += orderItem.quantity;
    }
  });
  return totalItems;
};

const getDateTotals = (dates: string[], orderItems: Array<OrderItemType | {}>): string[] =>
  dates.map(date =>
    String(
      orderItems.reduce((state, curr) => {
        const reservation = getValueByPropPath(curr, 'reservation', curr);
        const endDate = moment(reservation.endDate)
          .subtract(1, 'days')
          .format(DATE_FORMAT);
        const inRange = datesInRange({
          start: reservation.startDate || '',
          end: endDate || '',
          selected: {
            start: date,
            end: date
          }
        });
        if (inRange) {
          return state + Number(curr.quantity || 0);
        }
        return state;
      }, 0)
    )
  );

const findOrderItems = (id?: string, orders: OrderType[], path: string): Array<OrderItemType | {}> =>
  orders.map(order => order.orderItems.find(orderItem => !!id && getValueByPropPath(orderItem, path) === id) || {});

const parseStallProducts = (event: EventReportEventType, dates: string[]): string[][] => {
  const items = [];
  for (const item of event.stallProducts) {
    const orderItems = findOrderItems(item.id, event.orders, 'reservation.stallProduct.id');
    const dateTotals = getDateTotals(dates, orderItems);
    const allItems = item.nightly ? dateTotals.reduce((state, curr) => state + Number(curr), 0) : calculateNumberOfWeeklyItems(item, event, 'stallProduct');
    const totals = [
      String(allItems),
      String(item.price),
      (Number(allItems) * item.price) % 1 === 0 ? String(Number(allItems) * item.price) : (Number(allItems) * item.price).toFixed(2)
    ];
    items.push([`${item.name} ${item.nightly ? '(Nightly)' : '(Flat Rate)'}`, ...dateTotals, ...totals]);
  }
  return items;
};

const parseRvProducts = (event: EventReportEventType, dates: string[]): string[][] => {
  const items = [];
  for (const item of event.rvProducts) {
    const orderItems = findOrderItems(item.id, event.orders, 'reservation.rvProduct.id');
    const dateTotals = getDateTotals(dates, orderItems);
    const allItems = item.nightly ? dateTotals.reduce((state, curr) => state + Number(curr), 0) : calculateNumberOfWeeklyItems(item, event, 'rvProduct');
    const totals = [
      String(allItems),
      String(item.price),
      (Number(allItems) * item.price) % 1 === 0 ? String(Number(allItems) * item.price) : (Number(allItems) * item.price).toFixed(2)
    ];
    items.push([`${item.rvLot.name} ${item.nightly ? '(Nightly)' : '(Flat Rate)'}`, ...dateTotals, ...totals]);
  }
  return items;
};

const parseAddOnProducts = (event: EventReportEventType, dates: string[]): string[][] => {
  const items = [];
  for (const item of event.addOnProducts) {
    const orderItems = findOrderItems(item.id, event.orders, 'addOnProduct.id');
    const dateTotals = dates.map(() => '-');
    const allItems = orderItems.reduce((state, curr) => state + Number(curr.quantity || 0), 0);
    const price = item.price;
    const priceTotal = (Number(allItems) * item.price) % 1 === 0 ? String(Number(allItems) * item.price) : (Number(allItems) * item.price).toFixed(2);
    const totals = [allItems, price, priceTotal].map(i => String(i));
    items.push([item.addOn.name, ...dateTotals, ...totals]);
  }
  return items.length > 0 ? [[], ...items] : items;
};

const getProductsSold = (event: EventReportEventType) => {
  const orderQuantity = {};
  const orderItems = [];
  event.orders.forEach(order => {
    orderItems.push(...order.orderItems);
  });

  orderItems.forEach(orderItem => {
    const quantity = orderItem.quantity;
    const productType = orderItem.reservation?.rvProduct ? 'rvProduct' : 'stallProduct';
    const id = orderItem.addOnProduct?.id || (orderItem.reservation && orderItem.reservation[productType]?.id);
    if (!id) return null;
    orderQuantity[id] = orderQuantity[id] + quantity || quantity;
  });

  const allProducts = [...event.addOnProducts, ...event.stallProducts, ...event.rvProducts];
  const productCount = [];

  allProducts.forEach(prod => {
    const name = prod.name || prod.addOn?.name;
    const quantity = orderQuantity[prod.id];
    if (quantity) {
      productCount.push([name, quantity]);
    }
  });

  return productCount;
};

const getReportArray = (event: EventReportEventType): string[][] => {
  const dates = parseDays(event.startDate, event.endDate, 'M/DD');
  const fullDates = parseDays(event.startDate, event.endDate);
  const totals = ['Total Quantity', 'Price', 'Total Price'];
  return [
    [event.name],
    ['Type', ...dates, ...totals],
    ...parseStallProducts(event, fullDates),
    ...parseRvProducts(event, fullDates),
    ...parseAddOnProducts(event, fullDates),
    [],
    ['Total Quantity Sold'],
    ...getProductsSold(event)
  ];
};

export const prepareEventReport = ({ event }: EventReportReturnType) => {
  const { name } = event;
  const csv = Papa.unparse(getReportArray(event));
  downloadEventReport(csv, name);
};

const downloadEventReport = (csv, name) => {
  const filename = 'event_report-' + name.replace(/[^A-Z0-9]+/gi, '_') + moment().format('_YYYY_MM_DD');
  const link = document.createElement('a');
  link.download = filename + '.csv';
  link.href = 'data:text/csv,' + encodeURIComponent(csv);
  if (document.body !== null) document.body.appendChild(link);
  link.click();
  if (document.body !== null) document.body.removeChild(link);
};
