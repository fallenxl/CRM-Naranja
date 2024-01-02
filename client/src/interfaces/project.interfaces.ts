export interface IProject {
  _id: string;
  name: string;
  description: string;
  address: string;
  models?: IProjectModels[] | [];
}

export interface IProjectModels {
  model: string;
  price: string;
  priceWithDiscount: string;
  area: number;
}
