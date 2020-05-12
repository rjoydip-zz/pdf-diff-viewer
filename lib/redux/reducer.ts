import produce from 'immer'
import { ContextInterface, ViewerActionTypes, ViewerTypes } from './types'

function viewerReducer(state: ContextInterface, action: ViewerActionTypes) {
  switch (action.type) {
    case ViewerTypes.SET_FILE:
      return produce(state, (draft: any) => {
        const { id, file } = action.payload
        draft[id].file = file
      })
    case ViewerTypes.SET_PDF_AND_PAGES:
      return produce(state, (draft: any) => {
        const { id, pdf, numPages, pageNumber } = action.payload
        draft[id].pdf = pdf
        draft.pageNumber = pageNumber || 1
        draft[id].numPages = numPages
      })
    case ViewerTypes.SET_PAGE_NUMBER:
      return produce(state, (draft: any) => {
        draft.pageNumber = action.payload
      })
    default: {
      throw new Error(`Unhandled action type: ${action}`)
    }
  }
}

export { viewerReducer }
