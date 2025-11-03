interface RequestOptions extends RequestInit {
  params?: Record<string, any>
}

class Request {
  private baseURL: string

  constructor(baseURL: string = '') {
    this.baseURL = baseURL
  }

  private async request<T>(url: string, options: RequestOptions = {}): Promise<T> {
    const { params, ...init } = options

    // 处理查询参数
    let fullURL = `${this.baseURL}${url}`
    if (params) {
      const searchParams = new URLSearchParams(
        Object.entries(params).filter(([, value]) => value != null)
      )
      fullURL = `${fullURL}?${searchParams}`
    }

    // 默认配置
    const config: RequestInit = {
      ...init,
      headers: {
        'Content-Type': 'application/json',
        ...init.headers
      }
    }

    try {
      const response = await fetch(fullURL, config)

      if (!response.ok) {
        const error = await response.json().catch(() => ({}))
        throw new Error(error.message || '请求失败')
      }

      return response.json()
    } catch (error) {
      console.error('请求错误:', error)
      throw error
    }
  }

  get<T>(url: string, params?: Record<string, any>): Promise<T> {
    return this.request<T>(url, { method: 'GET', params })
  }

  post<T>(url: string, data?: any): Promise<T> {
    return this.request<T>(url, {
      method: 'POST',
      body: JSON.stringify(data)
    })
  }

  put<T>(url: string, data?: any): Promise<T> {
    return this.request<T>(url, {
      method: 'PUT',
      body: JSON.stringify(data)
    })
  }

  delete<T>(url: string): Promise<T> {
    return this.request<T>(url, { method: 'DELETE' })
  }
}

export const request = new Request('/api')
