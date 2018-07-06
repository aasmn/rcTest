const storage = window.localStorage
const S = {
  getItem (key) {
    if (storage.getItem(key) === null) {
      return null
    }
    try {
      const rawData = storage.getItem(key).trim()
      const processData = JSON.parse(rawData)
      return (typeof processData === 'object') ? processData : rawData
    } catch (e) {
      return storage.getItem(key).trim()
    }
  },
  setItem (key, value) {
    value = typeof value === 'string' ? value.trim() : JSON.stringify(value)
    storage.setItem(key, value)
  },
  removeItem (key) {
    storage.removeItem(key)
  }
}
export default S
