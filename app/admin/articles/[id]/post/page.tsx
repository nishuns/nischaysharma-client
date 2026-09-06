import { redirect } from 'next/navigation';

interface ArticlePostPageProps {
  params: Promise<{ id: string }>;
}

export default async function ArticlePostPage({ params }: ArticlePostPageProps) {
  const { id } = await params;
  redirect(`/admin/articles/${id}/post/linkedin`);
}
