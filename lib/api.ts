import axios from 'axios'

const API_URL = 'http://localhost:3001'

export interface Game {
    id: number
    title: string
    description: string
    genre: string
    platform: string
    price: number
    rating: number
    cover: string
    releaseDate: string
    popular: boolean
    inStock: boolean
    createdAt: string
}

export async function fetchGames(): Promise<Game[]> {
    const response = await axios.get(`${API_URL}/games`)
    // Преобразуем snake_case из БД в camelCase для фронтенда
    return response.data.map((g: any) => ({
        id: g.id,
        title: g.title,
        description: g.description,
        genre: g.genre,
        platform: g.platform,
        price: Number(g.price),
        rating: Number(g.rating),
        cover: g.cover,
        releaseDate: g.release_date,
        popular: g.popular,
        inStock: g.in_stock,
        createdAt: g.created_at,
    }))
}

export async function fetchGame(id: number): Promise<Game> {
    const response = await axios.get(`${API_URL}/games/${id}`)
    const g = response.data
    return {
        id: g.id,
        title: g.title,
        description: g.description,
        genre: g.genre,
        platform: g.platform,
        price: Number(g.price),
        rating: Number(g.rating),
        cover: g.cover,
        releaseDate: g.release_date,
        popular: g.popular,
        inStock: g.in_stock,
        createdAt: g.created_at,
    }
}

export function formatPrice(price: number) {
    return new Intl.NumberFormat('ru-RU', {
        style: 'currency',
        currency: 'RUB',
        maximumFractionDigits: 0,
    }).format(price)
}

export function formatDate(date: string) {
    return new Date(date).toLocaleDateString('ru-RU', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    })
}

//Заказы
export interface OrderItem {
    game_id: number
    quantity: number
}

export interface Order {
    id: number
    customer_name: string
    customer_email: string
    total: number
    status: string
    created_at: string
    items?: any[]
}

export async function createOrder(data: {
    customer_name: string
    customer_email: string
    items: OrderItem[]
}): Promise<Order> {
    const response = await axios.post(`${API_URL}/orders`, data)
    return response.data
}

export async function fetchOrders(): Promise<Order[]> {
    const response = await axios.get(`${API_URL}/orders`)
    return response.data
}

export async function fetchOrder(id: number): Promise<Order> {
    const response = await axios.get(`${API_URL}/orders/${id}`)
    return response.data
}

export async function updateOrderStatus(id: number, status: string): Promise<Order> {
    const response = await axios.put(`${API_URL}/orders/${id}`, { status })
    return response.data
}

export const ORDER_STATUSES = [
    { value: 'new', label: 'Новый', color: 'text-blue-400' },
    { value: 'processing', label: 'В обработке', color: 'text-yellow-400' },
    { value: 'completed', label: 'Завершён', color: 'text-green-400' },
    { value: 'cancelled', label: 'Отменён', color: 'text-red-400' },
]

//Добавление и удаление игр
export async function deleteGame(id: number): Promise<void> {
    await axios.delete(`${API_URL}/games/${id}`)
}

export async function createGame(data: any): Promise<Game> {
    const response = await axios.post(`${API_URL}/games`, data)
    return response.data
}

export async function updateGame(id: number, data: any): Promise<Game> {
    const response = await axios.put(`${API_URL}/games/${id}`, data)
    return response.data
}

axios.interceptors.request.use((config) => {
    const token = localStorage.getItem('token')
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})
