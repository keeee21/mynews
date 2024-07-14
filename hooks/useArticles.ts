import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function useArticles() {
  const { data, error } = useSWR('/article/api', fetcher, {
    refreshInterval: 60000, // 60秒ごとに再フェッチ
  });

  return {
    articles: data ? data.articles : [],
    isLoading: !error && !data,
    isError: error,
  };
}
