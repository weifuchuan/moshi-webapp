require('@/common/index');
import '@/common/geektime.css';
import 'github-markdown-css/github-markdown.css';
import './index.less';
import $ from 'jquery';
import Mustache from 'mustache';
import { formatDate } from '@/common/kit/functions/moments';
import { secondToMS } from '@/common/kit/functions/secondToStr';
import { intercepteAllAnchorClick, intercepteAllImageClick, enhancerVideo } from '@/common';

interface AnyAction {
  action: string;
  payload: any;
}

interface IArticle {
  id: number;
  courseId: number;
  title: string;
  content: string;
  publishAt?: number;
  createAt: number;
  status: number;
  audioId: number;
  contentType: string;
  summary: string;
  coverImage?: string;
  visitAt?: number;
  trialReading?: boolean;
  readed?: boolean;
  nickName?: string;
  avatar?: string;
  courseName?: string;
  liked?: boolean;
  likeCount?: number;
  comments: IArticleComment[];
  audio?: {
    recorder: string;
    resource: string;
  };
}

interface IArticleComment {
  id: number;
  articleId: number;
  accountId: number;
  content: string;
  createAt: number;
  status: number;
  replyTo?: number;
  nickName: string;
  avatar: string;
  likeCount: number;
}

const commentListTpl = $('#commentListTpl').html();
Mustache.parse(commentListTpl);

let article: IArticle;

const onMsg = ({ action, payload }: AnyAction) => {
  switch (action) {
    case 'load':
      article = payload.article;
      const { prev, next } = payload;
      $('#title').text(article.title);
      $('#publishAt > :nth-child(1)').text(formatDate(article.publishAt!));
      $('#publishAt > :nth-child(2)').text(article.nickName!);
      if (article.coverImage) {
        $('#coverImage').attr('src', article.coverImage);
        $('#coverImage').removeClass('hide');
      } else {
        $('#coverImage').addClass('hide');
      }
      if (article.audio) {
        $('#audioPlayer > :nth-child(1) > :nth-child(1)').text(
          '朗读者：' + article.audio.recorder
        );
        const audio = document.getElementById('audio') as HTMLAudioElement;
        audio.onloadedmetadata = () => {
          $('#audioPlayer > :nth-child(1) > :nth-child(2)').text(
            '时长：' + secondToMS(audio.duration)
          );
        };
        audio.src = article.audio.resource;
      } else {
        $('#audioPlayer').addClass('hide');
      }
      $('#content').html(article.content);
      intercepteAllAnchorClick('#content');
      intercepteAllImageClick('#content');
      enhancerVideo();
      $('#jump').html(`
        ${prev
          ? `
            <a href="#" onclick="send({action:'jump',payload:'prev'})" >
              <span>上一篇  ${prev}</span>
            </a>
          `
          : ''}
        ${next
          ? `
            <a href="#" onclick="send({action:'jump',payload:'next'})" >
              <span>下一篇  ${next}</span>
            </a>
          `
          : ''}
      `);

      renderComments(article.comments);      
      break;
    case "addComment":
      article.comments.unshift(payload); 
      renderComments(article.comments);
      break;
    default:
      break;
  }
};

function renderComments(comments: IArticleComment[]) {
  const replies = comments.filter((c) => !!c.replyTo);
  comments = comments.filter((c) => !c.replyTo);
  const comments2 = comments.map((c) => {
    let reply;
    const i = replies.findIndex((r) => r.replyTo === c.id);
    if (i !== -1) {
      reply = replies[i];
    }
    return {
      ...c,
      createAt: formatDate(c.createAt),
      reply
    };
  });
  $('#commentList').html(
    Mustache.render(commentListTpl, {
      comments: comments2
    })
  );
  intercepteAllAnchorClick('#commentList');
}

handler.handle = async function() {
  try {
    // @ts-ignore
    onMsg(...arguments);
  } catch (error) {
    alert(error.toString());
  }
};

let play = false;

$('#audioPlayer').click(() => {
  if (play) {
    play = false;
    $('#audioPlayer > :nth-child(2)').html(`
      <i aria-label="图标: pause-circle" class="anticon anticon-pause-circle"><svg viewBox="64 64 896 896" class="" data-icon="pause-circle" width="48px" height="48px" fill="currentColor" aria-hidden="true"><path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm0 820c-205.4 0-372-166.6-372-372s166.6-372 372-372 372 166.6 372 372-166.6 372-372 372zm-88-532h-48c-4.4 0-8 3.6-8 8v304c0 4.4 3.6 8 8 8h48c4.4 0 8-3.6 8-8V360c0-4.4-3.6-8-8-8zm224 0h-48c-4.4 0-8 3.6-8 8v304c0 4.4 3.6 8 8 8h48c4.4 0 8-3.6 8-8V360c0-4.4-3.6-8-8-8z"></path></svg></i>
    `);
  } else {
    play = true;
    $('#audioPlayer > :nth-child(2)').html(`
      <i aria-label="play" class="anticon anticon-play-circle"><svg viewBox="64 64 896 896" class="" data-icon="play-circle" width="48px" height="48px" fill="currentColor" aria-hidden="true"><path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm0 820c-205.4 0-372-166.6-372-372s166.6-372 372-372 372 166.6 372 372-166.6 372-372 372z"></path><path d="M719.4 499.1l-296.1-215A15.9 15.9 0 0 0 398 297v430c0 13.1 14.8 20.5 25.3 12.9l296.1-215a15.9 15.9 0 0 0 0-25.8zm-257.6 134V390.9L628.5 512 461.8 633.1z"></path></svg></i>
    `);
  }
});
