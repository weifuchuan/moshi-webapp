require('@/common');
import './github-mobile.css';
import Mustache from 'mustache';
import $ from 'jquery';
import { fromNow } from '@/common/kit/functions/moments';
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

interface Page<Model = any> {
  totalRow: number;
  pageNumber: number;
  firstPage: boolean;
  lastPage: boolean;
  totalPage: number;
  pageSize: number;
  list: Model[];
}

$(() => {
  const issuesTpl = $('#issuesTpl').html();
  const paginationTpl = $('#paginationTpl').html();

  Mustache.parse(issuesTpl);
  Mustache.parse(paginationTpl);

  handler.handle = async ({ action, payload }: AnyAction) => {
    switch (action) {
      case 'load':
        const page: Page<IIssue> = payload.page;
        const filter: 'open' | 'close' | 'your' = payload.filter;
        const html =
          Mustache.render(issuesTpl, {
            issues: page.list.map((i) => ({
              ...i,
              open:
                filter === 'open' ||
                (i.closeAt ? (i.closeAt > i.openAt ? false : true) : true),
              openAt: fromNow(i.openAt),
              closeAt: fromNow(i.closeAt || Date.now())
            }))
          }) + Mustache.render(paginationTpl, page);
        switch (filter) {
          case 'open':
            $('#tabs > :nth-child(1)').addClass('selected');
            $('#tabs > :nth-child(2)').removeClass('selected');
            $('#tabs > :nth-child(3)').removeClass('selected');
            break;
          case 'close':
            $('#tabs > :nth-child(1)').removeClass('selected');
            $('#tabs > :nth-child(2)').addClass('selected');
            $('#tabs > :nth-child(3)').removeClass('selected');
            break;
          case 'your':
            $('#tabs > :nth-child(1)').removeClass('selected');
            $('#tabs > :nth-child(2)').removeClass('selected');
            $('#tabs > :nth-child(3)').addClass('selected');
            break;
          default:
            break;
        }
        $('#list').html(html);
        break;

      default:
        break;
    }
  };
});
