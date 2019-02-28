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
  const titleInputRef = useRef<HTMLInputElement>(null);
  const editorRef = useRef<CommentEditor>(null);
  useEffect(() => {
    handler.handle = async ({ action, payload }: AnyAction) => {
      switch (action) {
        case 'setTitleContent':
          const { title, content } = payload;
          content.trim() && editorRef.current!.setState({ content });
          title.trim() && (titleInputRef.current!.value = title);
          break;
        case 'getTitleContent':
          return {
            title: titleInputRef.current!.value,
            content: editorRef.current!.state.content
          };
        default:
          break;
      }
    };
    send({ action: 'editorReady' });
  }, []);
  const [ show, setShow ] = useState(false);
  return (
    <div>
      <label>Title: </label>
      <br />
      <input
        ref={titleInputRef}
        style={{ width: '100%', margin: '0 0 8px 0', padding: '4px 6px' }}
      />
      <br />
      <label>Comment: </label>
      <br />
      <CommentEditor
        ref={editorRef}
        onComment={(content) => {
          send({
            action: 'submit',
            payload: { content, title: titleInputRef.current!.value }
          });
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
