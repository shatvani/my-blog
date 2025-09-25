import { notFound } from 'next/navigation'
import { getPost as getPostNotCached, getPosts } from '@/lib/posts';
import { cache } from "react";
import Link from 'next/link';

const getPost = cache(
  async (slug) => await getPostNotCached(slug)
);

export async function generateStaticParams() {
  const {posts} = await getPosts({ limit: 1000 });
  return posts.map(post => ({ slug: post.slug }));
}

export async function generateMetadata({ params }) {
  try {
    const resolvedParams = await params
    const { frontmatter } = await getPost(resolvedParams.slug);
    return frontmatter;
  } catch (e) { }
}

export default async function BlogPage({ params }) {
  let post;

  try {
    const resolvedParams = await params;
    post = await getPost(resolvedParams.slug);
  } catch (e) {
    notFound()
  }
  
  return (
    <article className="prose dark:prose-invert">
      <div className="flex space-x-2 mb-8">
        {post.frontmatter.tags.map(tag => (
          <Link href={`/blog?tags=${tag}`} key={tag} 
          className="bg-gray-200 dark:bg-gray-700 text-sm px-2 py-1 rounded-full">
            #{tag}
          </Link>
        ))}
      </div>
      { post.content }
    </article>
  )
}