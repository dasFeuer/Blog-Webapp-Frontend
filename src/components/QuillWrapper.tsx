import React, { forwardRef } from 'react';
import ReactQuill from 'react-quill';

interface QuillWrapperProps {
  theme: string;
  value: string;
  onChange: (content: string) => void;
  modules: object;
  formats: string[];
  className?: string;
}

const QuillWrapper = forwardRef<ReactQuill, QuillWrapperProps>((props, ref) => {
  return <ReactQuill {...props} ref={ref as React.RefObject<ReactQuill>} />;
});

QuillWrapper.displayName = 'QuillWrapper';

export default QuillWrapper;
