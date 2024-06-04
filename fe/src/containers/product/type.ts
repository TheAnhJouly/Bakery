export enum ProductType {
  men = '1',
  women = '2',
  kids = '3',
}

export type ProductData = {
  id: number
  name: string
  slug?: string
  price: number
  description?: string
  coverImage: string
  salePrice: number
  sizes?: any
  text?: string
}
