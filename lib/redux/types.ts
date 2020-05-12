export enum ViewerTypes {
  SET_FILE = 'SET_FILE',
  SET_PAGE_NUMBER = 'SET_PAGE_NUMBER',
  SET_PDF_AND_PAGES = 'SET_PDF_AND_PAGES',
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
      type: typeof ViewerTypes.SET_FILE
      payload: any
    }
  | {
      type: typeof ViewerTypes.SET_PAGE_NUMBER
      payload: any
    }
  | {
      type: typeof ViewerTypes.SET_PDF_AND_PAGES
      payload: any
    }
