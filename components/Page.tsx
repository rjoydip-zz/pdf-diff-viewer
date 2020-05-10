import { ContextConsumer, ContextInterface } from './extras'
import { getPixelRatio, loop } from '../utils'

interface PageProps {
  width?: number
  height?: number
  scale?: number
  rotate?: number
  unit?: string
  className?: string
  pixelRatio?: number
  pageNumber?: number
  renderInteractiveForms?: boolean
  inputRef?: (args: any) => void
  onLoadError?: (args: any) => void
  onLoadSuccess?: (args: any) => void
}

const PageInternal = ({
  numPages,
  className,
  height = 350,
  width = 350,
  pdf,
  unit,
  pixelRatio,
  renderInteractiveForms = false,
  scale,
  rotate,
  pageNumber = 1,
  onLoadError = loop,
  onLoadSuccess = loop,
}: PageProps & ContextInterface) => {
  const cb = async (ref: any) => {
    try {
      const canvas = ref
      const page = await pdf.getPage(pageNumber)
      const renderViewport = page.getViewport({
        scale: (scale || 1.5) * (pixelRatio || getPixelRatio()),
        rotate: rotate || 180,
      })

      canvas.width = renderViewport.width
      canvas.height = renderViewport.height

      canvas.style.width = `${Math.floor(width)}${unit || 'px'}`
      canvas.style.height = `${Math.floor(height)}${unit || 'px'}`

      await page.render({
        canvasContext: canvas.getContext('2d'),
        viewport: renderViewport,
        renderInteractiveForms,
      }).promise

      onLoadSuccess({
        pdf: {
          numPages,
          pageNumber,
        },
        ref: {
          canvas,
        },
      })
    } catch (error) {
      onLoadError(error)
    }
  }

  return (
    <canvas
      ref={cb}
      className={className}
      style={{ width, height, display: 'block' }}
    />
  )
}

const Page = (props: PageProps) => {
  return (
    <ContextConsumer>
      {(context: any) => <PageInternal {...props} {...context} />}
    </ContextConsumer>
  )
}

export default Page
