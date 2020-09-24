export function notDev() {
  const env = process.env.NODE_ENV || ''
  return env.includes('dev') || env.includes('local')
}
