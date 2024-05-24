import { useState, useEffect } from 'react';
import type { Article } from '@prisma/client';
import { getArticles } from 'app/api';

export function useArticles() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedArticles = await getArticles();
        setArticles(fetchedArticles);
      } catch (error) {
        console.error('Error fetching articles:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return { articles, isLoading };
}
