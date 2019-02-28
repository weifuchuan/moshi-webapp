require('@/common');
import './github-mobile.css';
import Mustache from 'mustache';
import $ from 'jquery';
import { fromNow, formatTime } from '@/common/kit/functions/moments';
import './index.less';

interface AnyAction {
  action: string;
  payload: any;
}

interface IIssue {
  id: number;
  courseId: number;
  accountId: number;
  title: string;
  openAt: number;
  closerId?: number;
  closeAt?: number;
  status: number;
  nickName: string;
  avatar: string;
  commentCount: number;
}

interface IIssueComment {
  id: number;
  issueId: number;
  accountId: number;
  createAt: number;
  content: string;
  status: number;
  nickName: string;
  avatar: string;
}

$(() => {
  const panelTpl = $('#panelTpl').html();
  $('#panelTpl').html('');
  const openModalTpl = $('#openModalTpl').html();
  const closeModalTpl = $('#closeModalTpl').html();
  Mustache.parse(panelTpl);
  Mustache.parse(openModalTpl);
  Mustache.parse(closeModalTpl);

  handler.handle = async ({ action, payload }: AnyAction) => {
    switch (action) {
      case 'load':
        let { issue, comments } = payload as {
          issue: IIssue;
          comments: IIssueComment[];
        };
        $('#panelTpl').html(
          Mustache.render(panelTpl, {
            issue: {
              ...issue,
              open: issue.closeAt
                ? issue.closeAt > issue.openAt ? false : true
                : true,
              openAt: fromNow(issue.openAt),
              closeAt: fromNow(issue.closeAt || Date.now()),
              first: comments[0]
            },
            comments: comments.slice(1).map((comment) => ({
              ...comment,
              createAt: fromNow(comment.createAt)
            }))
          })
        ); 
        break;

      default:
        break;
    }
  };
});

const overlayOpened: any = {};
