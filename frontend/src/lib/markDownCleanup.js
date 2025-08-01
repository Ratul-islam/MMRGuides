

  export const cleanContent = (content) => {
    return content
      .replace(/<span[^>]*id="docs-internal-guid[^>]*>/g, '')
      .replace(/<\/span>/g, '')
      .replace(/style="[^"]*"/g, '')
      .replace(/font-family:[^;]*;?/g, '')
      .replace(/font-size:[^;]*;?/g, '')
      .replace(/color:[^;]*;?/g, '')
      .replace(/background-color:[^;]*;?/g, '')
      .replace(/font-weight:[^;]*;?/g, '')
      .replace(/vertical-align:[^;]*;?/g, '')
      .replace(/white-space-collapse:[^;]*;?/g, '')
      .replace(/margin-[^:]*:[^;]*;?/g, '')
      .replace(/line-height:[^;]*;?/g, '')
      .replace(/font-variant[^:]*:[^;]*;?/g, '')
      .replace(/dir="[^"]*"/g, '')
      .replace(/style="[\s]*"/g, '')
      .replace(/<span>/g, '').replace(/<\/span>/g, '')
      .replace(/<h([1-6])[^>]*><blockquote>/g, '<blockquote><h$1>')
      .replace(/<\/blockquote><\/h[1-6]>/g, '</h$1></blockquote>')
      .replace(/\s+/g, ' ')
      .trim();
  };

  export const isHtmlContent = (content) => {
    return /<[^>]+>/.test(content);
  };