import createStore from 'unistore'

const ref = {
  file: null,
  image: null,
  numPages: 0,
}

const initialState = {
  pageNumber: 1,
  compare: ref,
  original: ref,
}

export default () => createStore(initialState)
