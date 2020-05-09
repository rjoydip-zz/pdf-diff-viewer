import { NextPage } from 'next'
import { connect } from 'unistore/react'
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi'

import If from './extras/If'
import { Uploader } from './Uploader'
import actions from '../lib/redux/actions'
import Document from './Document'
import Page from './Page'

/* const DiffView = connect<
  {
    id: string
  },
  {},
  {},
  {}
>(
  ['pageNumber', 'difference'],
  actions
)(({ id = '', difference }: any) => {
  const { img } = difference
  return (
    <div id={id}>
      <If condition={img}>
        <img
          src={img}
          alt={''}
          height={300}
          width={300}
          className="border-solid border-2 border-gray-600"
        />
      </If>
    </div>
  )
}) */

const UploaderAndViewer = connect<
  {
    id: string
  },
  {},
  {},
  {}
>(
  ['original', 'compare', 'pageNumber'],
  actions
)(
  ({
    id = '',
    original,
    compare,
    setFile,
  }: any) => {
    const file =
      id === 'original' ? original.file : id === 'compare' ? compare.file : null
    return (
      <div id={id} className="flex flex-row">
        <If condition={!file}>
          <Uploader
            onUpload={(file: FileReader) => setFile({ id, file })}
            className="p-6 text-center text-sm border-solid outline-none shadow-lg"
          />
        </If>
        <If condition={file}>
          <Document
            file={file}
            className="outline-none shadow-lg max-h-xs max-w-xs"
          >
            <Page />
          </Document>
        </If>
      </div>
    )
  }
)

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

const Viewer: NextPage<{}> = connect(
  [],
  actions
)(({}: any) => {
  return (
    <div className="flex flex-col">
      <div className="flex flex-row justify-center m-2">
        <UploaderAndViewer id="original" />
        <UploaderAndViewer id="compare" />
      </div>
      <div className="flex flex-row justify-center">
        <PageNavigate />
      </div>
      {/* <div className="flex flex-row justify-center m-2">
        <DiffView id="difference" />
      </div> */}
    </div>
  )
})

export default Viewer
