import { NextPage } from 'next'
import { connect } from 'unistore/react'
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi'

import actions from '../lib/redux/actions'
import { Uploader } from './Uploader'
import Document from './Document'
import Page from './Page'
import { Choose, If } from './extras'
import { useAsync } from '../hooks'
import { imageDiff } from '../lib/diff'

const DiffViewer = connect(
  ['original', 'compare'],
  actions
)(({ original, compare }: any) => {
  console.log(555)
  const { value } = useAsync<any>(async () => {
    const orgImg = original.image
    const comImg = compare.image
    let image = null
    console.log('XXX', (orgImg && comImg))
    if (orgImg && comImg) {
      image = await imageDiff({
        original: orgImg,
        compare: comImg,
        returnBase64: true,
      })
    }

    return {
      image,
    }
  })
  console.log('DiffViewer', value)
  return (
    <If condition={!!value}>
      <img
        src={value && value.image}
        alt={''}
        height={300}
        width={300}
        className="border-solid border-2 border-gray-600"
      />
    </If>
  )
})

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

const DocumentPage = connect(
  ['pageNumber'],
  actions
)(({ pageNumber }: any) => {
  return <Page pageNumber={pageNumber} exportImage={true} />
})

const CompareViewer = connect(
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
          onLoadSuccess={({ numPages, pdf }: any) => {
            setInfo({ id: 'compare', numPages, image: pdf.image })
          }}
        >
          <DocumentPage />
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

const OriginalViewer = connect(
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
          onLoadSuccess={({ numPages, pdf }: any) => {
            setInfo({ id: 'original', numPages, image: pdf.image })
          }}
        >
          <DocumentPage />
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

const Viewer: NextPage<{}> = () => {
  console.log(111)
  return (
    <div className="flex flex-col">
      <div className="flex flex-row justify-center m-2">
        <OriginalViewer />
        <CompareViewer />
      </div>
      <div className="flex flex-row justify-center m-2">
        <DiffViewer />
      </div>
      <div className="flex flex-row justify-center">
        <PageNavigate />
      </div>
    </div>
  )
}

export default Viewer
