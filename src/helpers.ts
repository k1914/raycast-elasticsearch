import { showToast, ToastStyle } from "@raycast/api";


// todo: defined type
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function mayI (v: any, { fn, speaking, silence } = v) {
  if(typeof fn !== 'function') return


  async function execute (resolve: (value: unknown) => void, reject: (value: unknown) => void) {
    try {
      const d = await fn();
      resolve(d);
    } catch {
      if (typeof silence === 'string') {
        await showToast(ToastStyle.Failure, silence)
      } else if (Array.isArray(silence) && silence.length > 1 && silence.every(item => typeof item === "string")) {
        await showToast(ToastStyle.Failure, silence[0], silence[1] );
      }
      reject('we could not');
    }
  }

  async function delyer (resolve: (value: unknown) => void) {
    setTimeout(() => resolve('we first'), 1000);
  }

  let anime = undefined;
  if (typeof speaking === 'string') {
    anime = await showToast(ToastStyle.Animated, speaking);
  } else if (Array.isArray(speaking) && speaking.length > 1 && speaking.every(item => typeof item === "string")) {
    anime = await showToast(ToastStyle.Animated, speaking[0], speaking[1] );
  }


  return Promise.all([new Promise(execute), new Promise(delyer)]).then(anime && anime.hide)
}