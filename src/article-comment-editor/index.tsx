require('@/common/index');
import React, { useRef, useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { CommentEditor } from './CommentEditor';
import 'github-markdown-css/github-markdown.css';
import mastering from './mastering';

interface AnyAction {
  action: string;
  payload: any;
}

function Editor() {
  const editorRef = useRef<CommentEditor>(null);
  useEffect(() => {
    handler.handle = async ({ action, payload }: AnyAction) => {
      switch (action) {
        case 'setContent': 
          editorRef.current!.setState({ content: payload });
          break;
        case 'getContent':
          return editorRef.current!.state.content;
        default:
          break;
      }
    };
    send({ action: 'editorReady' });
  }, []);
  const [ show, setShow ] = useState(false);
  return (
    <div>
      <CommentEditor
        ref={editorRef}
        onComment={(content) => {
          send({ action: 'submit', payload: content });
        }}
        okText={'提交'}
        onOpenMasteringMarkdown={() => {
          setShow(!show);
        }}
      />
      {show ? (
        <div
          className="markdown-body"
          style={{ paddingTop: '1em' }}
          dangerouslySetInnerHTML={{ __html: mastering }}
        />
      ) : null}
    </div>
  );
}

ReactDOM.render(<Editor />, document.getElementById('root')!);
