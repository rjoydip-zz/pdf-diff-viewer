export enum ViewerTypes {
  SET_IMAGE = 'SET_IMAGE',
  SET_PDF_AND_PAGES = 'SET_PDF_AND_PAGES',
  INCREMENT_PAGE_NUMBER = 'INCREMENT_PAGE_NUMBER',
  DECREMENT_PAGE_NUMBER = 'DECREMENT_PAGE_NUMBER',
}

interface NestedInterface {
  pdf: any
  image: any
  numPages: number
}

export interface ContextInterface {
  pageNumber: number
  original: NestedInterface
  compare: NestedInterface
}

export type ViewerActionTypes =
  | {
      type: typeof ViewerTypes.SET_IMAGE
      payload: any
    }
  | {
      type: typeof ViewerTypes.INCREMENT_PAGE_NUMBER
      payload: any
    }
  | {
      type: typeof ViewerTypes.DECREMENT_PAGE_NUMBER
      payload: any
    }
  | {
      type: typeof ViewerTypes.SET_PDF_AND_PAGES
      payload: any
    }
