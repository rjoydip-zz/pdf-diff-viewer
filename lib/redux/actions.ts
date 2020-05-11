import produce from 'immer'

const actions = () => ({
  incrementPageNumber(state: any) {
    return produce(state, (draft: any) => {
      draft.pageNumber =
        state.pageNumber >= 1 &&
        state.pageNumber <
          Math.max(state.original.numPages, state.compare.numPages)
          ? state.pageNumber + 1
          : state.pageNumber
    })
  },
  decrementPageNumber(state: any) {
    return produce(state, (draft: any) => {
      draft.pageNumber =
        state.pageNumber > 1 ? state.pageNumber - 1 : state.pageNumber
    })
  },
  setInfo(state: any, payLoad: any) {
    const { id, numPages, image } = payLoad
    return produce(state, (draft: any) => {
      draft[id].image = image
      draft[id].numPages = numPages
    })
  },
  setFile(state: any, payLoad: any) {
    const { id, file } = payLoad
    return produce(state, (draft: any) => {
      draft[id].file = file
    })
  },
  setImage(state: any, payLoad: any) {
    const { id, img } = payLoad
    return produce(state, (draft: any) => {
      draft[id].img = img
    })
  },
})

export default actions
