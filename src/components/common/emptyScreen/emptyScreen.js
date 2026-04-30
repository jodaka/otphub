export const EmptyScreen = (wrapper) => {
  const html = `
  <div class="emptyScreen">
    <svg
      class="emptyScreen__logo"
      xmlns="http://www.w3.org/2000/svg"
      xml:space="preserve"
      style="fill-rule: evenodd; clip-rule: evenodd; stroke-linejoin: round; stroke-miterlimit: 2"
      viewBox="0 0 48 15"
    >
      <path
        d="M148 49.6v9.2c0 1.2-1.1 2.2-2.4 2.2h-20.9c-1.3 0-2.4-1-2.4-2.2v-9.2c0-1.2 1.1-2.2 2.4-2.2h20.9c1.3 0 2.4 1 2.4 2.2Z"
        style="fill: #f90"
        transform="translate(-100 -47)"
      />
      <path
        d="M132.2 47.1c.5-.5 1-.8 1.7-.8 1.4 0 2 .8 2.1 2.4v4h-1.7v-4c0-.3 0-.6-.2-.7-.2-.2-.4-.3-.8-.3-.5 0-.9.2-1 .6v4.5h-1.8v-9h1.7V47Zm8.8 5c-.3.6-1 .8-1.7.8a2 2 0 0 1-1.5-.6c-.4-.4-.5-1-.6-1.7v-4.2h1.7v4.1c0 .7.3 1 1 1 .5 0 1-.2 1.1-.6v-4.5h1.7v6.4h-1.6V52Zm8.7-2.4c0 1-.2 1.8-.6 2.4-.5.5-1 .8-1.9.8a2 2 0 0 1-1.6-.8v.7H144v-9h1.7V47a2 2 0 0 1 1.5-.7c.8 0 1.4.3 1.9.9.4.6.6 1.4.6 2.4Zm-1.7-.1c0-.7 0-1.2-.3-1.4a1 1 0 0 0-.9-.5c-.5 0-.9.2-1.1.7v2.5c.2.4.6.6 1.1.6.6 0 1-.2 1.1-.8l.1-1.1Z"
        style="fill-rule: nonzero"
        transform="translate(-104.6 -41.3)"
      />
      <path
        d="M104.3 54.4c0 .9-.2 1.6-.5 2.2-.2.6-.6 1.1-1.2 1.4-.5.4-1 .5-1.8.5A3 3 0 0 1 99 58c-.5-.3-.9-.8-1.2-1.4a5 5 0 0 1-.4-2.1v-.6c0-.8.1-1.6.4-2.2.3-.6.7-1.1 1.2-1.4.6-.4 1.1-.5 1.8-.5s1.3.1 1.8.5c.5.3 1 .8 1.2 1.4.3.6.5 1.3.5 2.2v.5ZM103 54c0-1-.2-1.8-.6-2.4a2 2 0 0 0-1.7-.8 2 2 0 0 0-1.7.8 4 4 0 0 0-.6 2.3v.6c0 1 .2 1.8.6 2.3.4.6 1 .9 1.7.9a2 2 0 0 0 1.7-.8 4 4 0 0 0 .6-2.3V54Zm8.7-3.2h-2.8v7.6h-1v-7.6H105v-1h6.6v1ZM114 55v3.4h-1V50h3c1 0 1.8.2 2.3.7.5.5.8 1.1.8 1.9 0 .8-.3 1.4-.8 1.9-.5.4-1.3.7-2.2.7h-2Zm0-.9h2c.7 0 1.2-.1 1.5-.4.3-.3.5-.7.5-1.2s-.2-1-.5-1.2c-.3-.3-.8-.5-1.3-.5H114v3.3Z"
        style="fill: #fff; fill-rule: nonzero"
        transform="translate(-97.4 -47.1)"
      />
    </svg>

    <p class="emptyScreen__hint">Drop 2FA Auth backup here</p>
  </div>`;

  wrapper.innerHTML = html;
};
