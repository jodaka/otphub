import { Dropzone } from '../components/dropzone/dropzone.js';
import { EmptyScreen } from '../components/emptyScreen/emptyScreen.js';
import { Menu } from '../components/menu/menu.js';
import { Tokens } from '../components/tokens/tokens.js';
import { getStoredTokens, saveTokens } from './storage.js';

const wrapper = document.querySelector('.main');

const osType = window.__TAURI_PLUGIN_OS__.type();
const isMobile = osType === 'android' || osType === 'ios';
if (isMobile) {
  document.documentElement.classList.add('mobile');
} else {
  new Menu();
}

getStoredTokens().then((tokens) => {
  if (!isMobile) {
    new Dropzone(document.body, tokens, saveTokens);
  }

  if (tokens.length === 0) {
    return EmptyScreen(wrapper);
  }

  Tokens(wrapper, tokens);
});
