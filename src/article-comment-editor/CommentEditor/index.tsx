import 'draft-js/dist/Draft.css';
import 'github-markdown-css/github-markdown.css';
import React, { Component } from 'react';
import ReactMde from 'react-mde';
import 'react-mde/lib/styles/css/react-mde-all.css';
import './index.less';
import { fromEvent } from 'rxjs';
import markdownToHtml from '@/common/kit/functions/markdownToHtml';
require('./all.min.js');

interface CommentEditorProps {
  okText?: string;
  defaultContent?: string;
  onComment: (content: string) => void;
  onOpenMasteringMarkdown?: () => void;
}

export class CommentEditor extends Component<CommentEditorProps> {
  state = { content: '', tab: 'write' };

  constructor(props: CommentEditorProps) {
    super(props);

    this.state = {
      content: props.defaultContent ? props.defaultContent : '',
      tab: 'write' as 'write' | 'preview'
    };
  }

  readonly setContent = (content: string) => {
    this.setState({ content });
    setTimeout(() => {
      this.setState({ content });
      this.container!.scrollIntoView();
    }, 300);
  };

  readonly getContent = () => {
    return this.state.content;
  };

  container: HTMLDivElement | null = null;
  input: HTMLInputElement | null = null;

  render() {
    return (
      <div className={'CommentEditor'} ref={(e) => (this.container = e)}>
        <ReactMde
          onChange={(v) => this.setState({ content: v })}
          value={this.state.content}
          selectedTab={this.state.tab as any}
          onTabChange={(tab) => this.setState({ tab })}
          generateMarkdownPreview={(md) =>
            markdownToHtml(md).then((html) => (this.preview(), html))}
        />
        <div className="BottomBar">
          <a
            href="#"
            target="_blank"
            onClick={() => {
              this.props.onOpenMasteringMarkdown &&
                this.props.onOpenMasteringMarkdown();
            }}
          >
            <svg
              viewBox="0 0 16 16"
              version="1.1"
              width="16"
              height="16"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M14.85 3H1.15C.52 3 0 3.52 0 4.15v7.69C0 12.48.52 13 1.15 13h13.69c.64 0 1.15-.52 1.15-1.15v-7.7C16 3.52 15.48 3 14.85 3zM9 11H7V8L5.5 9.92 4 8v3H2V5h2l1.5 2L7 5h2v6zm2.99.5L9.5 8H11V5h2v3h1.5l-2.51 3.5z"
              />
            </svg>
            <span>Markdown参考</span>
          </a>
          <button
            type="primary"
            onClick={() => {
              this.props.onComment(this.state.content);
            }}
          >
            {this.props.okText ? this.props.okText : '评论'}
          </button>
        </div>
      </div>
    );
  }

  preview = () => {
    const els = document.getElementsByClassName('mde-preview');
    if (open)
      for (let i = 0; i < els.length; i++) {
        if (els.item(i)!.className.indexOf('markdown-body') === -1) {
          els.item(i)!.className += ' markdown-body';
        }
      }
  };

  upload = async () => {
    if (this.input) {
      const subp = fromEvent(this.input, 'change').subscribe(() => {
        const files = this.input!.files;
        if (files) {
          if (files.length > 0) {
          }
        }
        subp.unsubscribe();
      });
      this.input.click();
    }
  };
}
