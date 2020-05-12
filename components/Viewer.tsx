import { NextPage } from 'next'
import { connect } from 'unistore/react'
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi'

import actions from '../lib/redux/actions'
import { Uploader } from './Uploader'
import Document from './Document'
import Page from './Page'
import { Choose, If } from './extras'
import { imageDiff } from '../lib/diff'
import { useEffect, useState } from 'react'

const DiffViewer = connect(
  ['original', 'compare', 'pageNumber'],
  actions
)(({ original, compare, pageNumber }: any) => {
  const [image, setImage] = useState('')
  const orgImg = original.image
  const comImg = compare.image

  useEffect(() => {
    ;(async () => {
      if (!!(orgImg && comImg)) {
        setImage(
          await imageDiff<any>({
            original: orgImg,
            compare: comImg,
            returnBase64: true,
          })
        )
      }

      if (!!orgImg && !comImg) {
        setImage(orgImg)
      }

      if (!orgImg && !!comImg) {
        setImage(comImg)
      }
    })()
  }, [original, compare, pageNumber])

  return (
    <If condition={image !== ''}>
      <img
        src={image}
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

const CompareViewer = connect(
  ['compare', 'pageNumber'],
  actions
)(({ compare, pageNumber, setFile, setInfo }: any) => {
  const id = 'compare'
  const ref = compare
  return (
    <Choose>
      <Choose.When condition={!!ref.file}>
        <Document
          file={ref.file}
          className="outline-none shadow-lg max-h-xs max-w-xs"
          onLoadSuccess={({ numPages, pdf }: any) => {
            setInfo({ id, numPages, image: pdf.image })
          }}
        >
          <Page pageNumber={pageNumber} exportImage={true} />
        </Document>
      </Choose.When>
      <Choose.Otherwise>
        <Uploader
          onUpload={(file: FileReader) => setFile({ id, file })}
          className="p-6 text-center text-sm border-solid outline-none shadow-lg"
        />
      </Choose.Otherwise>
    </Choose>
  )
})

const OriginalViewer = connect(
  ['original', 'pageNumber'],
  actions
)(({ original, pageNumber, setFile, setInfo }: any) => {
  const id = 'original'
  const ref = original
  return (
    <Choose>
      <Choose.When condition={!!ref.file}>
        <Document
          file={ref.file}
          className="outline-none shadow-lg max-h-xs max-w-xs"
          onLoadSuccess={({ numPages, pdf }: any) => {
            setInfo({ id, numPages, image: pdf.image })
          }}
        >
          <Page pageNumber={pageNumber} exportImage={true} />
        </Document>
      </Choose.When>
      <Choose.Otherwise>
        <Uploader
          onUpload={(file: FileReader) => setFile({ id, file })}
          className="p-6 text-center text-sm border-solid outline-none shadow-lg"
        />
      </Choose.Otherwise>
    </Choose>
  )
})

const Viewer: NextPage<{}> = () => {
  return (
    <div className="flex flex-col">
      <div className="flex flex-row justify-center m-2">
        <OriginalViewer />
        <CompareViewer />
      </div>
      <div className="flex flex-row justify-center">
        <PageNavigate />
      </div>
      <div className="flex flex-row justify-center m-2">
        <DiffViewer />
      </div>
    </div>
  )
}

export default Viewer
