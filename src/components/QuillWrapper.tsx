import React, { forwardRef } from 'react'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'

const QuillWrapper = forwardRef((props: any, ref: any) => {
  return <ReactQuill {...props} ref={ref} />
})

QuillWrapper.displayName = 'QuillWrapper'

export default QuillWrapper