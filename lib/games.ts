export type Game = {
  id: string
  title: string
  genre: string
  rating: number
  price: number
  cover: string
  releaseDate: string
  description: string
  platform: string
  popular?: boolean
}

export function formatPrice(price: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(price)
}