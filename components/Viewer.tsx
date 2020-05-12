import { NextPage } from 'next'
import {
  ViewerProvider,
  useViewerState,
  useViewerDispatch,
} from './ViewerContext'
import { Choose } from './extras'
import Document from './Document'
import Page from './Page'
import { Uploader } from './Uploader'
import { ViewerTypes } from '../lib/redux/types'

const ViewerInternal = ({ id }: { id: string }) => {
  const state = useViewerState()
  const dispatch = useViewerDispatch()
  console.log('[VIEWER_STATE]', state)
  return (
    <Choose>
      <Choose.When condition={!!state[id].file}>
        <Document
          id={id}
          file={state[id].file}
          className="outline-none shadow-lg max-h-xs max-w-xs"
        >
          <Page />
        </Document>
      </Choose.When>
      <Choose.Otherwise>
        <Uploader
          onUpload={(file: FileReader) =>
            dispatch({ type: ViewerTypes.SET_FILE, payload: { id, file } })
          }
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
          <ViewerInternal id="original" />
        </div>
        <div className="flex flex-row justify-center"></div>
        <div className="flex flex-row justify-center m-2"></div>
      </div>
    </ViewerProvider>
  )
}

export default Viewer
