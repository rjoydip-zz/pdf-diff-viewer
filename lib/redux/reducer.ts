import produce from 'immer'
import { ContextInterface, ViewerActionTypes, ViewerTypes } from './types'

function viewerReducer(state: ContextInterface, action: ViewerActionTypes) {
  switch (action.type) {
    case ViewerTypes.SET_PDF_AND_PAGES:
      return produce(state, (draft: any) => {
        const { id, pdf, numPages, pageNumber } = action.payload
        draft[id].pdf = pdf
        draft[id].numPages = numPages
        draft.pageNumber = pageNumber || 1
      })
    case ViewerTypes.INCREMENT_PAGE_NUMBER:
      return produce(state, (draft: any) => {
        draft.pageNumber =
          state.pageNumber >= 1 &&
          state.pageNumber <
            Math.max(state.original.numPages, state.compare.numPages)
            ? state.pageNumber + 1
            : state.pageNumber
      })
    case ViewerTypes.DECREMENT_PAGE_NUMBER:
      return produce(state, (draft: any) => {
        draft.pageNumber =
          state.pageNumber > 1 ? state.pageNumber - 1 : state.pageNumber
      })
    case ViewerTypes.SET_IMAGE:
      return produce(state, (draft: any) => {
        const { id, image } = action.payload
        draft[id].image = image
      })
    default: {
      throw new Error(`Unhandled action type: ${action}`)
    }
  }
}

export { viewerReducer }
