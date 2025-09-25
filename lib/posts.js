import fs from 'fs'
import path from 'path'
import { compileMDX } from "next-mdx-remote/rsc"
import H1 from '@/components/h1';

const CONTENT_DIR = path.join(process.cwd(), 'content');

function isValidSlug(slug) {
  // Egyszerű slug validáció (csak betűk, számok, kötőjelek, aláhúzások)
  return /^[\w\-]+$/.test(slug.replace(/\.mdx$/, ''))
}

export async function loadPost(slug) {
  if (!isValidSlug(slug)) {
    throw new Error('Invalid slug');
  }

  const filename = slug.endsWith(".mdx") ? slug : `${slug}.mdx`;
  const filePath = path.join(CONTENT_DIR, filename)

  try {
    return await fs.promises.readFile(filePath, 'utf8')
  } catch (err) {
    throw new Error(`Post not found: ${slug}`)
  }
}

export async function getPost(slug) {
  const source = await loadPost(slug);

  return await compileMDX({
    source,
    components: {
      h1: (props) => <H1{...props} />,
    },
    options: {
      parseFrontmatter: true
    }
  })
}

export async function getPosts({
  newest = true, page = 1, limit = 10, tags
} = {}) {
  const dir = path.join(process.cwd(), 'content');
  const files = (await fs.promises.readdir(dir)).filter(f => f.endsWith('.mdx'));

  const posts = await Promise.all (
    files.map(async filename => {
      const { frontmatter } = await getPost(filename);

      return {
        frontmatter,
        slug: filename.replace(".mdx", "")
      }
    })
  );

  let filterdPosts = posts;

  if  (tags) {
    filterdPosts = filterdPosts.filter(
      post => 
        Array.isArray(post.frontmatter.tags) &&
        post.frontmatter.tags.some(tag => tags.includes(tag))
    )
  }

  if (newest) {
    filterdPosts.sort((a, b) => new Date(b.frontmatter.date) - new Date(a.frontmatter.date))
  } else {
    filterdPosts.sort((a, b) => new Date(a.frontmatter.date) - new Date(b.frontmatter.date))
  }

  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;



  return {
    posts: filterdPosts.slice(startIndex, endIndex),
    pageCount: Math.ceil(filterdPosts.length / limit)
  }
}