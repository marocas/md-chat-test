import clientApi from '@/lib/clientApi'
import { useState } from 'react'

type RequestMethod = 'get' | 'post' | 'put' | 'delete' | 'patch'

interface UseClientApiOptions<T = unknown> {
  method: RequestMethod
  url: string
  data?: any
  params?: Record<string, any>
  headers?: Record<string, string>
}

export function useClientApi<T = unknown>() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<null | string>(null)
  const [status, setStatus] = useState<null | number>(null)
  const [responseData, setResponseData] = useState<T | null>(null)

  const request = async ({
    method,
    url,
    data,
    params,
    headers,
  }: UseClientApiOptions<T>) => {
    setLoading(true)
    setError(null)

    try {
      const res = await clientApi.request<T>({
        method,
        url,
        data,
        params,
        headers,
      })

      setResponseData(res.data)
      setStatus(res.status)

      return { data: res.data, status: res.status, error: null, loading: false }
    } catch (err: any) {
      const message =
        err.response?.data?.message || err.message || 'Unknown error'
      setError(message)
      setStatus(err.response?.status ?? null)

      return {
        data: null,
        status: err.response?.status,
        error: message,
        loading: false,
      }
    } finally {
      setLoading(false)
    }
  }

  return { request, loading, error, status, data: responseData }
}
