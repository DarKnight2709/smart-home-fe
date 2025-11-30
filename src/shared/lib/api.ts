// store (dùng zustand) chứa token...
import useAuthStore from '@/features/auth/stores/authStore.ts'
import type { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios'
import axios from 'axios'
import qs from 'qs'
// cấu hình URL, route API, route Frontend
import envConfig from '../config/envConfig'
import type { RefreshTokenResponse } from '../validations/AuthSchema'
import API_ROUTES from './api-routes'
import ROUTES from './routes'

// interface mở rộng cho config axios
interface ExtendedAxiosRequestConfig extends InternalAxiosRequestConfig {
  // thêm _retry flag: dùng để đánh dấu request đã thử refresh token này hay chưa, tránh vòng lặp refresh vô hạn
  _retry?: boolean
}

// tạo axios instance
const api = axios.create({
  baseURL: envConfig.VITE_ENV === 'development' ? '/api' : envConfig.VITE_API_URL,
  // mặc định là json
  headers: {
    'Content-Type': 'application/json'
  },
  paramsSerializer: {
    serialize: (params) => {
      return qs.stringify(params, { arrayFormat: 'repeat', skipNulls: true })
    }
  }
})

// điều phối refresh token
// cờ báo đang có 1 request refresh token đang chạy
let isRefreshing = false
// lưu  Promise đang chạy cho phép các request khác await để lấy token mới thay vì gọi refresh lại
let refreshTokenPromise: Promise<string> | null = null

// gắn access token
api.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    // trước khi gửi request, lấy access token từ store và gắn vào header Authorization
    const accessToken = useAuthStore.getState().token?.accessToken

    if (accessToken && config.headers) {
      config.headers.Authorization = `Bearer ${accessToken}`
    }
    // nếu không có token, request vẫn đi mà không có header
    return config
  },
  (error: AxiosError) => {
    return Promise.reject(error)
  }
)

// xử lý lỗi, refresh token
api.interceptors.response.use(
  // trả về response nguyên vẹn nếu 2xx
  (response: AxiosResponse) => response,

  // khi có lỗi (catch)
  async (error: AxiosError) => {
    // là config của request gây lỗi (được cast sang ExtendedAxiosRequestConfig để dùng _retry flag)
    const originalRequest = error.config as ExtendedAxiosRequestConfig

    // A. Nếu lỗi xảy ra trong request refresh token
    // Nếu request hiện tại chính là request refresh token (tức bạn đang cố refresh nhưng server trả lỗi) -> logout user ngay, chuyển về trang login. Không tiếp tục retry
    if (originalRequest?.url?.includes(API_ROUTES.AUTH.REFRESH_TOKEN)) {
      isRefreshing = false
      refreshTokenPromise = null
      useAuthStore.getState().logout()
      window.location.href = ROUTES.LOGIN.url
      return Promise.reject(error)
    }

    // B. Xử lý 401 (không phải login endpoint và chưa retry)
    // Chỉ xử lý 401 một lần cho mỗi request (_retry) và không tác động đến request gọi login (login trả 401 thì không auto refresh).
    // Tức là chỉ xử lý 401 là hết hạn token, và chưa retry.
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest?.url?.includes(API_ROUTES.AUTH.LOGIN)
    ) {
      originalRequest._retry = true

      // B1. Nếu đang có tiến trình refresh token rồi thì chờ promise hiện tại
      // đợi để lấy token mới, gán header rồi retry request.
      // đây là các tránh gọi API refresh nhiều lần đồng thời
      if (isRefreshing && refreshTokenPromise) {
        try {
          const newToken = await refreshTokenPromise
          originalRequest.headers.Authorization = `Bearer ${newToken}`
          return api(originalRequest)
        } catch (refreshError) {
          return Promise.reject(refreshError)
        }
      }

      // B2. Nếu chưa có tiến trình refresh: khởi động quá trình refresh
      isRefreshing = true

      refreshTokenPromise = (async () => {
        try {
          // lấy refresh token từ store
          const refreshToken = useAuthStore.getState().token?.refreshToken

          // Nếu không có, thả lỗi để logout
          if (!refreshToken) {
            throw new Error('No refresh token available')
          }

          // gọi API refresh token
          const response = await api.post<RefreshTokenResponse>(API_ROUTES.AUTH.REFRESH_TOKEN, { refreshToken })

          // lấy access token từ response
          const newToken = response.data.accessToken
          // lưu token mới vào store
          await useAuthStore.getState().login(response.data)

          return newToken
        } catch (refreshError) {
          useAuthStore.getState().logout()
          window.location.href = ROUTES.LOGIN.url
          throw refreshError
        } finally {
          isRefreshing = false
          refreshTokenPromise = null
        }
      })()

      try {
        // lấy token mới từ promise
        const newToken = await refreshTokenPromise
        // gán token mới vào header
        originalRequest.headers.Authorization = `Bearer ${newToken}`
        // retry request
        return api(originalRequest)
      } catch (refreshError) {
        return Promise.reject(refreshError)
      }
    }

    // C. Nếu không rơi vào các trường hợp trên
    // trả về phần body lỗi từ server
    return Promise.reject(error.response?.data)
  }
)

export default api
