'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { auth } from '@/lib/firebase';
import { Article } from '@/lib/types/article';
import { articlesService } from '@/services/articles.service';
import { integrationsService, IntegrationsList } from '@/services/integrations.service';
import LinkedInComposer from '@/components/admin/LinkedInComposer';
import ArticlesLoading from '@/app/admin/articles/loading';

export default function LinkedInArticlePostPage() {
  const { id } = useParams() as { id: string };
  const [article, setArticle] = useState<Article | null>(null);
  const [integrations, setIntegrations] = useState<IntegrationsList>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadStudio = async () => {
      try {
        setLoading(true);
        const token = await auth.currentUser?.getIdToken();
        if (!token) throw new Error('No authentication token');
        const [articleResponse, integrationResponse] = await Promise.all([
          articlesService.getById(id, token),
          integrationsService.list(token)
        ]);
        if (!articleResponse.success || !articleResponse.data) throw new Error('Article not found');
        setArticle(articleResponse.data);
        if (integrationResponse.success) setIntegrations(integrationResponse.data || {});
      } catch (loadError) {
        setError((loadError as Error).message);
      } finally {
        setLoading(false);
      }
    };

    loadStudio();
  }, [id]);

  if (loading) return <ArticlesLoading />;
  if (!article) {
    return (
      <div className="card card--padded">
        <h2>LinkedIn post studio unavailable</h2>
        <p>{error || 'The article could not be loaded.'}</p>
        <Link className="btn btn--secondary" href={`/admin/articles/${id}`}>Back to article</Link>
      </div>
    );
  }

  return (
    <div className="linkedin-post-page">
      <nav className="linkedin-post-page__breadcrumb" aria-label="Breadcrumb">
        <Link href={`/admin/articles/${id}`}>{article.title}</Link>
        <i className="ph ph-caret-right" />
        <span>Post</span>
        <i className="ph ph-caret-right" />
        <strong>LinkedIn</strong>
      </nav>
      <LinkedInComposer
        mode="page"
        backHref={`/admin/articles/${id}`}
        connected={Boolean(integrations.linkedin?.connected)}
        title={article.title}
        description={article.description}
        type="article"
        sourcePath={`/articles/${article.slug}`}
        initialImageUrl={article.backgroundImage}
      />
    </div>
  );
}
