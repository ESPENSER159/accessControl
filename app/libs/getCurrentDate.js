export const getCurrentDate = () => {
    // const d = new Date()
    var d = (new Date()).getTimezoneOffset() * 60000
    const setDate = (new Date(Date.now() - d)).toISOString().slice(0, -1)
    const date = setDate.split('T')[0]
    const time = setDate.split('T')[1].split('.')[0]
    return `${date} ${time}`
}