import React from 'react'
import Dropzone from 'react-dropzone'

const Uploader = ({
  onUpload,
  className,
}: {
  onUpload?: Function
  className?: string
}) => {
  return (
    <Dropzone
      onDrop={(files: any) => {
        const reader = new FileReader()
        reader.onload = () => {
          const result = reader.result
          onUpload ? onUpload(result) : null
        }
        reader.readAsArrayBuffer(files[0])
      }}
    >
      {({ getRootProps, getInputProps }) => (
        <div className={className || ''} {...getRootProps()}>
          <input {...getInputProps()} />
          <p>
            Drag and drop your files anywhere or
            <br />
            Upload a file
          </p>
        </div>
      )}
    </Dropzone>
  )
}

export { Uploader }
