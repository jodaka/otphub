import { Tokens } from "../components/tokens/tokens.js";
import { EmptyScreen } from "../components/emptyScreen/emptyScreen.js";
import { getStoredTokens, saveTokens } from "./storage.js";
import { Dropzone } from "../components/dropzone/dropzone.js";
import { Menu } from "../components/menu/menu.js";

const wrapper = document.querySelector(".main");

new Menu();

getStoredTokens().then((tokens) => {
  new Dropzone(document.body, tokens, saveTokens);

  if (tokens.length === 0) {
    return EmptyScreen(wrapper);
  }

  Tokens(wrapper, tokens);
});
