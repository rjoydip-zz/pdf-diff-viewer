const actions = (_: any) => ({
  incrementPageNumber(state: any) {
    const maxPageNumber = Math.max(
      state.original.numPages,
      state.compare.numPages
    )
    return {
      ...state,
      pageNumber:
        state.pageNumber >= 1 && state.pageNumber < maxPageNumber
          ? state.pageNumber + 1
          : state.pageNumber,
    }
  },
  decrementPageNumber(state: any) {
    return {
      ...state,
      pageNumber:
        state.pageNumber > 1 ? state.pageNumber - 1 : state.pageNumber,
    }
  },
  setPageNumber(state: any, payLoad: any) {
    return {
      ...state,
      pageNumber: payLoad || 1,
    }
  },
  setNumberOfPages(state: any, payLoad: any) {
    const { id, numPages } = payLoad
    return {
      ...state,
      [id]: {
        ...state[id],
        numPages,
      },
    }
  },
  setFile(state: any, payLoad: any) {
    const { id, file } = payLoad
    return {
      ...state,
      [id]: {
        ...state[id],
        file,
      },
    }
  },
  setImage(state: any, payLoad: any) {
    const { id, img } = payLoad
    return {
      ...state,
      [id]: {
        ...state[id],
        img,
      },
    }
  },
})

export default actions
