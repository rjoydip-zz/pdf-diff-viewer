import Jimp from 'jimp';

async function imageDiff({
    original,
    compare,
    returnBase64 = false,
    returnBitmap = false,
  }: {
    original: any,
    compare:  any,
    returnBase64?: boolean,
    returnBitmap?: boolean,
  }): Promise<
    string | Buffer | { data: Buffer; height: number; width: number }
  > {
    const orgJimpIns = await Jimp.read(original);
    const comJimpIns = await Jimp.read(compare);
  
    const maxHeight = Math.max(
      orgJimpIns.bitmap.height,
      comJimpIns.bitmap.height
    );
  
    const maxWidth = Math.max(orgJimpIns.bitmap.width, comJimpIns.bitmap.width);
  
    const diff = Jimp.diff(
      orgJimpIns.resize(maxWidth, maxHeight),
      comJimpIns.resize(maxWidth, maxHeight)
    );
    if (returnBase64) {
      const b64 = await diff.image.getBase64Async(
        diff.image._originalMime === 'image/png' ? Jimp.MIME_PNG : Jimp.MIME_JPEG
      );
      return b64;
    } else {
      const bitmap = diff.image.bitmap;
      return returnBitmap ? bitmap : bitmap.data;
    }
  }

  export { imageDiff }