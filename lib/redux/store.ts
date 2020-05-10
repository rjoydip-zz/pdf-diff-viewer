import createStore from 'unistore'

// 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=='

const ref = {
  file: null,
  img: null,
  numPages: 0,
}

const initialState = {
  pageNumber: 0,
  compare: ref,
  original: ref,
  difference: ref,
}

export default () => createStore(initialState)
