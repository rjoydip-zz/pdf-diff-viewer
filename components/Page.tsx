import { serializeError } from 'serialize-error'
import { ContextConsumer, ContextInterface } from './extras'
import { getPixelRatio } from '../utils'

interface PageProps {
  width?: number
  height?: number
  scale?: number
  rotate?: number
  unit?: string
  className?: string
  pixelRatio?: number
  pageNumber: number
  exportImage?: boolean
}

const PageInternal = ({
  numPages,
  className,
  height = 350,
  width = 350,
  pdf,
  unit,
  pixelRatio,
  scale,
  rotate,
  pageNumber,
  exportImage = false,
  onLoadError,
  onLoadSuccess,
}: PageProps & ContextInterface) => {
  const fn = async (canvasRef: any) => {
    const ctx = canvasRef.getContext('2d')
    canvasRef.style.width = `${Math.floor(width)}${unit || 'px'}`
    canvasRef.style.height = `${Math.floor(height)}${unit || 'px'}`
    try {
      const page = await pdf.getPage(pageNumber)
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
          numPages,
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
      className={className}
      style={{ width, height, display: 'block' }}
    />
  )
}

const Page = (props: PageProps) => (
  <ContextConsumer>
    {(context: any) => {
      return <PageInternal {...props} {...context} />
    }}
  </ContextConsumer>
)

export default Page
