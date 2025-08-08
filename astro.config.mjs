// import { defineConfig } from 'astro/config'
// import svelte from '@astrojs/svelte'
// import mdx from '@astrojs/mdx'
// import remarkGfm from 'remark-gfm'
// import remarkSmartypants from 'remark-smartypants'
// import rehypeExternalLinks from 'rehype-external-links'
// import remarkMath from 'remark-math';
// import rehypeKatex from 'rehype-katex';

// // https://astro.build/config
// export default defineConfig({
//   site: 'https://astro-blog-template.netlify.app',
//   integrations: [mdx(), svelte()],
//   markdown: {
//     remarkPlugins: [remarkMath],
//     rehypePlugins: [rehypeKatex],
//     shikiConfig: {
//       theme: 'nord',
//     },
//     remarkPlugins: [remarkGfm, remarkSmartypants],
//     rehypePlugins: [
//       [
//         rehypeExternalLinks,
//         {
//           target: '_blank',
//         },
//       ],
//     ],
//   },
// })

// astro.config.mjs
import { defineConfig } from 'astro/config';
import svelte from '@astrojs/svelte';
import mdx from '@astrojs/mdx';
import remarkGfm from 'remark-gfm';
import remarkSmartypants from 'remark-smartypants';
import rehypeExternalLinks from 'rehype-external-links';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

export default defineConfig({
  // site: 'https://leandreisk.github.io',
  base: '/',
  // output: 'static',
  integrations: [mdx(), svelte()],
  markdown: {
    // On regroupe **UNE** seule fois** remarkPlugins
    remarkPlugins: [
      remarkGfm,
      remarkSmartypants,
      remarkMath,           // <-- ajouté
    ],
    // … ta config Shiki reste
    shikiConfig: {
      theme: 'nord',
    },
    // Et **UNE** seule fois rehypePlugins
    rehypePlugins: [
      [
        rehypeExternalLinks,
        { target: '_blank' },
      ],
      rehypeKatex,           // <-- ajouté
    ],
  },
});
