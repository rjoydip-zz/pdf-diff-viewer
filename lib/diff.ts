import Jimp from 'jimp'

type Props = {
  data: Buffer
  height: number
  width: number
} | Buffer | string

async function imageDiff<T extends Props>({
  original,
  compare,
  returnBase64 = false,
  returnBitmap = false,
}: {
  original: any
  compare: any
  returnBase64?: boolean
  returnBitmap?: boolean
}): Promise<T | Props> {
  const orgJimpIns = await Jimp.read(original)
  const comJimpIns = await Jimp.read(compare)

  const maxHeight = Math.max(orgJimpIns.bitmap.height, comJimpIns.bitmap.height)

  const maxWidth = Math.max(orgJimpIns.bitmap.width, comJimpIns.bitmap.width)

  const diff = Jimp.diff(
    orgJimpIns.resize(maxWidth, maxHeight),
    comJimpIns.resize(maxWidth, maxHeight)
  )
  let returnData: Props
  if (returnBase64) {
    returnData = await diff.image.getBase64Async(
      diff.image._originalMime === 'image/png' ? Jimp.MIME_PNG : Jimp.MIME_JPEG
    )
  } else {
    const bitmap = diff.image.bitmap
    returnData = returnBitmap ? bitmap : bitmap.data
  }

  return returnData
}

export { imageDiff }
