const IMAGE = /\.(webp|png|jpe?g|avif|gif)(\?.*)?$/i;

export async function load(url, context, nextLoad) {
  if (IMAGE.test(url)) {
    const name = decodeURIComponent(url.split('/').pop() ?? 'image').replace(/\?.*$/, '');
    return {
      format: 'module',
      shortCircuit: true,
      source: `export default { src: ${JSON.stringify('/_stub/' + name)}, width: 1376, height: 768, blurDataURL: 'data:image/gif;base64,R0lGODlhAQABAAAAACw=' };`,
    };
  }
  return nextLoad(url, context);
}
