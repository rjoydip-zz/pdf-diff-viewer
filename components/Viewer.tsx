import { NextPage } from 'next'
import { connect } from 'unistore/react'
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi'

import actions from '../lib/redux/actions'
import { Uploader } from './Uploader'
import Document from './Document'
import Page from './Page'
import { Choose } from './extras'

const PageNavigate = connect(
  ['original', 'compare', 'pageNumber'],
  actions
)(
  ({
    original,
    compare,
    pageNumber,
    incrementPageNumber,
    decrementPageNumber,
  }: any) => {
    return (
      <>
        <button aria-label="Previous" onClick={decrementPageNumber}>
          <FiChevronLeft />
        </button>
        <p>
          Page {pageNumber} of {Math.max(original.numPages, compare.numPages)}
        </p>
        <button aria-label="Next" onClick={incrementPageNumber}>
          <FiChevronRight />
        </button>
      </>
    )
  }
)

const DocPage = connect<{}, {}, {}, {}>(
  ['pageNumber'],
  actions
)(({ pageNumber }: any) => {
  console.log(444)
  return <Page pageNumber={pageNumber} />
})

const OriginalUploader = connect(
  ['original'],
  actions
)(({ original, setFile, setInfo }: any) => {
  console.log(222)
  return (
    <Choose>
      <Choose.When condition={!!original.file}>
        <Document
          file={original.file}
          className="outline-none shadow-lg max-h-xs max-w-xs"
          onLoadSuccess={({ numPages }) => {
            setInfo({
              id: 'original',
              numPages: numPages,
              pageNumber: 1,
            })
          }}
        >
          <DocPage />
        </Document>
      </Choose.When>
      <Choose.Otherwise>
        <Uploader
          onUpload={(file: FileReader) => setFile({ id: 'original', file })}
          className="p-6 text-center text-sm border-solid outline-none shadow-lg"
        />
      </Choose.Otherwise>
    </Choose>
  )
})

const CompareUploader = connect(
  ['compare'],
  actions
)(({ compare, setFile, setInfo }: any) => {
  console.log(333)
  return (
    <Choose>
      <Choose.When condition={!!compare.file}>
        <Document
          file={compare.file}
          className="outline-none shadow-lg max-h-xs max-w-xs"
          onLoadSuccess={({ numPages }) => {
            setInfo({
              id: 'compare',
              numPages: numPages,
              pageNumber: 1,
            })
          }}
        >
          <DocPage />
        </Document>
      </Choose.When>
      <Choose.Otherwise>
        <Uploader
          onUpload={(file: FileReader) => setFile({ id: 'compare', file })}
          className="p-6 text-center text-sm border-solid outline-none shadow-lg"
        />
      </Choose.Otherwise>
    </Choose>
  )
})

const Viewer: NextPage<{}> = connect(
  [],
  actions
)(({}: any) => {
  console.log(111)
  return (
    <div className="flex flex-col">
      <div className="flex flex-row justify-center m-2">
        <OriginalUploader />
        <CompareUploader />
      </div>
      <div className="flex flex-row justify-center">
        <PageNavigate />
      </div>
    </div>
  )
})

export default Viewer
