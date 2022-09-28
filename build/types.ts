export interface ViteEnv {
  VITE_GLOB_APP_TITLE: string
  VITE_GLOB_APP_SHORT_NAME: string
  VITE_USE_IMAGEMIN: boolean
  VITE_BUILD_COMPRESS: 'gzip' | 'brotli' | 'none'
  VITE_BUILD_COMPRESS_DELETE_ORIGIN_FILE: boolean
}
