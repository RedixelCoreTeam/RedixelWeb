const WASM_BODY_STYLE_PROPERTIES = [
  'margin',
  'padding',
  'padding-top',
  'padding-bottom',
  'padding-left',
  'padding-right',
  'overflow',
  'display',
  'justify-content',
  'align-items',
  'height',
] as const;

export function resetWasmBodyStyles() {
  for (const property of WASM_BODY_STYLE_PROPERTIES) {
    document.body.style.removeProperty(property);
  }
}

export function guardBodyFromWasmStyles() {
  resetWasmBodyStyles();

  let isResetting = false;

  const observer = new MutationObserver(() => {
    if (isResetting) return;

    isResetting = true;
    resetWasmBodyStyles();
    isResetting = false;
  });

  observer.observe(document.body, { attributes: true, attributeFilter: ['style'] });

  return () => {
    observer.disconnect();
    resetWasmBodyStyles();
  };
}
