import pdfjs from 'pdfjs-dist'
import { NextPage } from 'next'
import { serializeError } from 'serialize-error'
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi'

import {
  ViewerProvider,
  useViewerState,
  useViewerDispatch,
} from './ViewerContext'
import { Choose } from './extras'
import { Uploader } from './Uploader'
import { ViewerTypes } from '../lib/redux/types'
import { findDocumentSource, getPixelRatio } from '../utils'
import { imageDiff } from '../lib/diff'
import { useState, useEffect } from 'react'

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`

const DiffViewer = (props: any) => {
  const state = useViewerState()
  const { height = 350, width = 350 } = props
  const [image, setImage] = useState(
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII='
  )
  const { original, compare } = state
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
  }, [original, compare])

  return (
    <img
      src={image}
      alt={''}
      height={height}
      width={width}
      className="border-solid border-2 border-gray-600"
    />
  )
}

const Document = (props: any) => {
  const {
    id,
    scale,
    rotate,
    width = 350,
    pixelRatio,
    unit,
    height = 350,
    exportImage = false,
    onLoadSuccess,
    onLoadError,
  } = props
  const state = useViewerState()
  const fn = async (canvasRef: any) => {
    const ctx = canvasRef.getContext('2d')
    canvasRef.style.width = `${Math.floor(width)}${unit || 'px'}`
    canvasRef.style.height = `${Math.floor(height)}${unit || 'px'}`
    try {
      const page = await state[id].pdf.getPage(state.pageNumber)
      const renderViewport = page.getViewport({
        scale: (scale || 1.5) * (pixelRatio || getPixelRatio()),
        rotate: rotate || 180,
      })

      canvasRef.width = renderViewport.width
      canvasRef.height = renderViewport.height

      await page.render({
        canvasContext: ctx,
        viewport: renderViewport,
      }).promise

      onLoadSuccess &&
        onLoadSuccess({
          pdf: {
            page,
            image: exportImage ? canvasRef.toDataURL() : null,
          },
          numPages: state[id].numPages,
          canvas: canvasRef,
        })
    } catch (error) {
      const serialized = serializeError(error)
      if (serialized.message === 'Invalid page request') {
        ctx.clearRect(0, 0, canvasRef.width, canvasRef.height)
      }
      onLoadSuccess &&
        onLoadSuccess({
          pdf: {
            page: null,
            image: null,
          },
          numPages: 0,
          canvas: canvasRef,
        })
      onLoadError && onLoadError(error)
    }
  }
  return (
    <canvas
      ref={(ref: any) => ref && fn(ref)}
      className="outline-none shadow-lg max-h-xs max-w-xs"
      style={{ width, height, display: 'block' }}
    />
  )
}

const Pagination = () => {
  const state = useViewerState()
  const dispatch = useViewerDispatch()
  return (
    <>
      <button
        aria-label="Previous"
        onClick={() => dispatch({ type: ViewerTypes.DECREMENT_PAGE_NUMBER })}
      >
        <FiChevronLeft />
      </button>
      <p>
        Page {state.pageNumber} of{' '}
        {Math.max(state.original.numPages, state.compare.numPages)}
      </p>
      <button
        aria-label="Next"
        onClick={() => dispatch({ type: ViewerTypes.INCREMENT_PAGE_NUMBER })}
      >
        <FiChevronRight />
      </button>
    </>
  )
}

const ViewerInternal = ({ id }: { id: string }) => {
  const state = useViewerState()
  const dispatch = useViewerDispatch()
  console.log('[VIEWER_STATE]', state)

  const onUpload = async (file: FileReader) => {
    const { data } = await findDocumentSource(file)
    const pdf = await pdfjs.getDocument(data).promise
    const numPages = pdf.numPages
    dispatch({
      type: ViewerTypes.SET_PDF_AND_PAGES,
      payload: { id, pdf, numPages },
    })
  }

  const onLoadSuccess = async ({ pdf }: any) => {
    dispatch({
      type: ViewerTypes.SET_IMAGE,
      payload: { id, image: pdf.image },
    })
  }

  return (
    <Choose>
      <Choose.When condition={!!state[id].pdf}>
        <Document id={id} exportImage={true} onLoadSuccess={onLoadSuccess} />
      </Choose.When>
      <Choose.Otherwise>
        <Uploader
          onUpload={onUpload}
          className="p-6 text-center text-sm border-solid outline-none shadow-lg"
        />
      </Choose.Otherwise>
    </Choose>
  )
}

const Viewer: NextPage<{}> = () => {
  return (
    <ViewerProvider>
      <div className="flex flex-col">
        <div className="flex flex-row justify-center m-2">
          {/* Original & Compare Upload + Viewer */}
          <ViewerInternal id="original" />
          <ViewerInternal id="compare" />
        </div>
        <div className="flex flex-row justify-center">
          {/* Pagination */}
          <Pagination />
        </div>
        <div className="flex flex-row justify-center m-2">
          <DiffViewer />
        </div>
      </div>
    </ViewerProvider>
  )
}

export default Viewer
