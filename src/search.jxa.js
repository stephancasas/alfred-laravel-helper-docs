#!/usr/bin/env osascript -l JavaScript

function run(argv) {
  const App = Application.currentApplication();
  App.includeStandardAdditions = true;

  const CACHE_DIR = `${App.systemAttribute(
    'alfred_preferences',
  )}/workflows/${App.systemAttribute('alfred_workflow_uid')}`;

  App.doShellScript(
    `mkdir -p "${CACHE_DIR}/preview/collections"; mkdir -p "${CACHE_DIR}/preview/helpers"; mkdir -p "${CACHE_DIR}/icons"; mkdir -p "${CACHE_DIR}/indices";`,
  );

  /**
   * Safely read data from the disk.
   * @param pathOrCacheKey The path or cache key from which to read.
   * @returns any
   */
  const readData = (pathOrCacheKey) => {
    const App = Application.currentApplication();
    App.includeStandardAdditions = true;

    if (typeof CACHE_DIR !== 'undefined' && !pathOrCacheKey.match(/\//))
      pathOrCacheKey = `${CACHE_DIR}/${pathOrCacheKey}`;

    let data = App.doShellScript(
      `[ -f "${pathOrCacheKey}" ] && cat "${pathOrCacheKey}" || printf ''`,
    );
    try {
      data = JSON.parse(data);
    } catch (ex) {
      // no-op
    }
    return data;
  };

  const methods = readData(`${CACHE_DIR}/indices/collections.json`)
    .map((method) => ({ ...method, type: 'collections' }))
    .concat(
      readData(`${CACHE_DIR}/indices/helpers.json`).map((method) => ({
        ...method,
        type: 'helpers',
      })),
    );

  const chooseIcon = (id, method, type) => {
    if (method.match(/^Str::/)) return 'quote-right';
    if (id.match(/^fluent-str/)) return 'quotes';
    if (id.match(/^array-/)) return 'brackets-square';

    if (type === 'collections') return 'layer-group';
    if (type === 'helpers') return 'function';
  };

  const decorateMethod = (id, method, type) => {
    if (id.match(/^fluent-str/)) return `Str::of()->${method}()`;
    if (type === 'collections') return `collect()->${method}`;
    return method;
  };

  return JSON.stringify({
    items: methods.map(({ id, method, description, type }) => ({
      title: decorateMethod(id, method, type),
      subtitle: description,
      icon: {
        path: `${CACHE_DIR}/icons/${chooseIcon(id, method, type)}.png`,
      },
      quicklookurl: `${CACHE_DIR}/preview/${type}/${id}.png`,
      valid: false,
      match: `${id.replace(/-/g, ' ')} ${method.toLowerCase()} ${description}`,
    })),
  });
}
