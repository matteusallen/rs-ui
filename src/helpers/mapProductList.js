// @flow
export type StallProductType = {|
  description: string,
  endDate: string,
  eventId: number | string,
  id: number | string,
  name: string,
  nightly: boolean,
  price: number | string,
  startDate: string
|};

export type StallProductListReturnType = {|
  ...StallProductType,
  disabled?: boolean,
  header: string,
  id: number | string,
  key: string,
  label?: string,
  price: number | string,
  priceLabel?: string,
  selected?: boolean,
  subheader: string
|};

export type RvProductType = {|
  description: string,
  id: number | string,
  name: string,
  price: number,
  nightly: boolean,
  rvLot: {
    description: string,
    name: string,
    power: string,
    sewer: boolean,
    water: boolean
  }
|};

export type RvProductListReturnType = {|
  ...RvProductType,
  disabled?: boolean,
  header: string,
  nightly: boolean,
  id: number | string,
  key: string,
  power: string,
  price: number,
  sewer: boolean,
  subheader: string,
  water: boolean
|};

export const mapStallProductList = (stallProducts: StallProductType[] = []): StallProductListReturnType[] =>
  stallProducts.map(props => {
    const { name, id, nightly, price, description } = props;
    return {
      ...props,
      header: name,
      id,
      key: `product-${id}`,
      nightly,
      price,
      subheader: description,
      description
    };
  });

export const mapRvProductList = (products: RvProductType[]): RvProductListReturnType[] =>
  products.map(props => {
    const { id, price, rvLot, description: rvProductDescription, name: rvProductName } = props;
    const { description, name, power, sewer, water } = rvLot;

    return {
      ...props,
      description: '',
      header: rvProductName || name,
      id,
      key: `product-${id}`,
      power,
      price,
      sewer,
      subheader: rvProductDescription || description,
      water
    };
  });
