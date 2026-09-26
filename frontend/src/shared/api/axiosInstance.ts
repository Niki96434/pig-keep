import axios from 'axios'

const DEFAULT_TIMEOUT_MS = 5000

export const axiosInstance = axios.create({
  baseURL: 'http://localhost:3000',
  timeout: DEFAULT_TIMEOUT_MS,
  headers: {
    'Content-Type': 'application/json',
  },
})
