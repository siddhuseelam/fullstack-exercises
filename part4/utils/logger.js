const info = (...params) => {
  if (process.env.NODE_ENV !== 'test') {
    // Only log in non-test environments
    console.log(...params)
  }
}

const error = (...params) => {

  if(process.env.NODE_ENV !== 'test') {
    // Only log in non-test environments
    console.error(...params)
  }
}

module.exports = { info, error }