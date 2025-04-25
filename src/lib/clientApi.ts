import axios from 'axios'

// create an axios instance with a base URL
const clientApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})
// add an interceptor to handle errors

// Export the clientApi instance for use in other parts of the application
export default clientApi
