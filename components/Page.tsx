import { createRef, useLayoutEffect } from 'react'

import Context from './extras/Context'
import Choose from './extras/Choose'
import { getPixelRatio } from '../utils'
import useAsyncFn from '../hooks/useAsyncFn'

const Canvas = ({ ref, height, width, pixelRatio, className }: any) => {
  const canvasRef = createRef<HTMLCanvasElement>()
  const dw = Math.floor(pixelRatio * width)
  const dh = Math.floor(pixelRatio * height)
  useLayoutEffect(() => {
    ref ? ref(canvasRef.current) : null
  })
  return (
    <canvas
      ref={canvasRef}
      width={dw}
      height={dh}
      style={{ width, height, display: 'block' }}
      className={className}
    />
  )
}

const PageInternal = ({
  value,
  width = 350,
  height = 350,
  scale = 1.5,
  rotate = 180,
  unit = 'px',
  currentPage = 1,
  className = '',
  pixelRatio = getPixelRatio(),
  renderInteractiveForms = false,
}: any) => {
  const { pdf } = value
  const [/* asyncState */, asyncStateMethods] = useAsyncFn<any>(async (ref: any) => {
    const canvas = ref.base
    const page = await pdf.getPage(currentPage)
    const renderViewport = page.getViewport({
      scale: scale * pixelRatio,
      rotate: rotate,
    })

    canvas.width = renderViewport.width
    canvas.height = renderViewport.height

    canvas.style.width = `${Math.floor(width)}${unit}`
    canvas.style.height = `${Math.floor(height)}${unit}`

    const renderContext = {
      canvasContext: canvas.getContext('2d'),
      viewport: renderViewport,
      renderInteractiveForms,
    }
    await page.render(renderContext).promise
    return {
      renderContext,
      numPages: page.pageNumber,
    }
  }, [])
  /* console.log(asyncState) */
  return (
    <Choose>
      <Choose.Otherwise>
        <Canvas
          ref={asyncStateMethods}
          width={width}
          height={height}
          pixelRatio={pixelRatio}
          className={className}
        />
      </Choose.Otherwise>
    </Choose>
  )
}

const Page = (props: any) => {
  return (
    <Context.Consumer>
      {(context) => <PageInternal {...props} {...context} />}
    </Context.Consumer>
  )
}

export default Page
