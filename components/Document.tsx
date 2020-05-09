import { useAsync } from 'react-use'
import pdfjs, { PDFDataRangeTransport } from 'pdfjs-dist'
import {
  isDataURI,
  dataURItoUint8Array,
  displayCORSWarning,
  isBrowser,
  isBlob,
  isFile,
  loadFromFile,
} from '../utils'
import Context from './extras/Context'
import Choose from './extras/Choose'

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`

const findDocumentSource = async (file: any) => {
  if (!file) {
    return null
  }

  // File is a string
  if (typeof file === 'string') {
    if (isDataURI(file)) {
      const fileUint8Array = dataURItoUint8Array(file)
      return { data: fileUint8Array }
    }

    displayCORSWarning()
    return { url: file }
  }

  // File is PDFDataRangeTransport
  if (file instanceof PDFDataRangeTransport) {
    return { range: file }
  }

  // File is an ArrayBuffer
  if (new ArrayBuffer(file)) {
    return { data: file }
  }

  /**
   * The cases below are browser-only.
   * If you're running on a non-browser environment, these cases will be of no use.
   */
  if (isBrowser) {
    // File is a Blob
    if (isBlob(file) || isFile(file)) {
      return { data: await loadFromFile(file) }
    }
  }
  // At this point, file must be an object
  if (typeof file !== 'object') {
    throw new Error(
      'Invalid parameter in file, need either Uint8Array, string or a parameter object'
    )
  }

  if (!file.url && !file.data && !file.range) {
    throw new Error(
      'Invalid parameter object: need either .data, .range or .url'
    )
  }

  // File .url is a string
  if (typeof file.url === 'string') {
    if (isDataURI(file.url)) {
      const { url, ...otherParams } = file
      const fileUint8Array = dataURItoUint8Array(url)
      return { data: fileUint8Array, ...otherParams }
    }

    displayCORSWarning()
  }

  return file
}

const loadDocument = async ({ url }: any) => {
  const loadPDF = await pdfjs.getDocument(url).promise
  return {
    pdf: loadPDF,
    numPages: loadPDF.numPages
  }
}

const Document = ({
  file,
  children,
}: {
  file: FileReader | ArrayBuffer | Buffer | string
  className?: string
  children?: React.ReactNode
}) => {
  const state = useAsync(async () => {
    const { data } = await findDocumentSource(file)
    return await loadDocument({
      url: data,
    })
  }, [])
  return (
    <Choose>
      <Choose.When condition={state.loading}>
        <h1>Loading 😎</h1>
      </Choose.When>
      <Choose.Otherwise>
        <Context.Provider
          value={{...state}}
        >
          {children}
        </Context.Provider>
      </Choose.Otherwise>
    </Choose>
  )
}

export default Document
