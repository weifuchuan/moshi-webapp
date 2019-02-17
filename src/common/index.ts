import $ from 'jquery';
import repeat from './kit/functions/repeat';

(window as any).ready = false;
(window as any).pending = [];

(window as any).handler = {
  async handle(...args: any[]): Promise<any> {}
};

var id2resolve = {};

window.document.addEventListener('message', async function(e: any) {
  var msg = e.data;
  if (msg.trim() === 'ready') {
    (window as any).ready = true;
    pending.forEach((f) => f());
    pending = [];
    return;
  }
  // alert(msg);
  msg = JSON.parse(msg);
  if (msg.type === 0) {
    try {
      var payload = msg.payload;
      var result = await handler.handle(payload);
      ReactNativeWebView.postMessage(JSON.stringify({ id: msg.id, result: result, type: 0 }));
    } catch (e) {}
  } else {
    if (id2resolve[msg.id]) {
      id2resolve[msg.id](msg.result);
      delete id2resolve[msg.id];
    }
  }
});

(window as any).send = function send(payload: any): Promise<any> {
  if (!ready) {
    return new Promise((resolve) => {
      pending.push(async () => {
        resolve(await send(payload));
      });
    });
  }

  return new Promise(function(resolve) {
    var id = new Date().toString() + Math.random();
    id2resolve[id] = resolve;
    ReactNativeWebView.postMessage(JSON.stringify({ id: id, payload: payload, type: 1 }));
  });
};

$(() => {
  repeat(() => {
    if ((window as any).ready) {
      return true;
    }
    ReactNativeWebView.postMessage('ready');
    return false;
  }, 100);

  const body = document.getElementsByTagName('body').item(0)!;

  const observer = new ResizeObserver((entries) => {
    ReactNativeWebView.postMessage(
      JSON.stringify({
        type: 'heightChange',
        height: body.scrollHeight
      })
    );
  });

  observer.observe(body);
});

export function intercepteAllAnchorClick(baseSelector: string = '') {
  $<HTMLAnchorElement>(`${baseSelector} a`).each(function(i, el) {
    el.onclick = (e) => {
      e.preventDefault();
      e.stopPropagation();
      send({ action: 'click', uri: el.href });
    };
  });
}

export function intercepteAllImageClick(baseSelector: string = '') {
  $<HTMLImageElement>(`${baseSelector} img`).each(function(i, el) {
    el.onclick = (e) => {
      e.preventDefault();
      e.stopPropagation();
      send({ action: 'openImage', src: el.src });
    };
  });
}

export function enhancerVideo() {
  /*  
  webkit-playsinline
  playsinline="true"

  x-webkit-airplay="allow" 
  x5-video-player-type="h5"  
  x5-video-player-fullscreen="true"
  x5-video-orientation="portraint"
  */
  $('video')
    .attr('webkit-playsinline', 'true')
    .attr('playsinline', 'true')
    .attr('x-webkit-airplay', 'allow')
    .attr('x5-video-player-type', 'h5')
    .attr('x5-video-player-fullscreen', 'true')
    .attr('x5-video-orientation', 'portraint'); 
}
