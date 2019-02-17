require('@/common/index');
import '@/common/geektime.css';
import 'github-markdown-css/github-markdown.css';
import './index.less';
import $ from 'jquery';  
import { intercepteAllAnchorClick } from '@/common';

const root = document.getElementById('root')!;

handler.handle =async (payload: {
  content: string;
  type: 'github' | 'geektime';
}) => {
  root.innerHTML = payload.content;
  if (payload.type === 'github') {
    root.className = 'markdown-body';
  } else {
    root.className = 'markdown-body';
  } 
  setTimeout(() => {     
    intercepteAllAnchorClick()
  }, 300);

};
