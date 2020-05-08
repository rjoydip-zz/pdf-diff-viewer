import createStore from 'unistore'

// const pngB64 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII='

const _p = {
  file: null,
  img: null,
  numPages: 0,
}

const initialState = {
  pageNumber: 0,
  compare: _p,
  original: _p,
  difference: {
    img: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=='
  },
}

export default () => createStore(initialState)
