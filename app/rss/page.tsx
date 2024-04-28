"use client";

import axios from 'axios';
import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';

interface RSSItem {
  id: number;
  title: string;
  link: string;
  company: string;
  pubDate: string;
}

const PAGE_SIZE = 10;

const Page: React.FC = () => {
  const [displayedItems, setDisplayedItems] = useState<RSSItem[]>([]);
  const [nextChunkIndex, setNextChunkIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const fetchNextChunk = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await axios.get<RSSItem[]>(
        `../rss/api?start=${nextChunkIndex * PAGE_SIZE}&end=${
          (nextChunkIndex + 1) * PAGE_SIZE
        }`
      );
      setDisplayedItems((prevItems) => [...prevItems, ...response.data]);
      setNextChunkIndex((prevIndex) => prevIndex + 1);
    } catch (error) {
      console.error('Error fetching RSS data:', error);
    } finally {
      setIsLoading(false);
    }
  }, [nextChunkIndex]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight;
      const scrollTop = document.documentElement.scrollTop;
      const clientHeight = document.documentElement.clientHeight;
      if (scrollTop + clientHeight >= scrollHeight * 0.9 && !isLoading) {
        fetchNextChunk();
      }
    };
  
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [fetchNextChunk, isLoading]);
  

  useEffect(() => {
    fetchNextChunk();
  }, []);

  return (
    <main className="min-h-screen p-10">
      <Link href="/" className='text-2xl underline'>My News</Link>
      <div className="z-10 max-w-5xl w-full font-mono text-sm">
        <h1 className="text-xl font-bold bg-gray-600 text-white p-2">企業のRSSフィード</h1>
        <ul className="bg-white p-2 my-2">
          {displayedItems.map((item, index) => (
            <li key={item.id + "-" + index} className='my-2 underline underline-offset-2 decoration-gray-300 decoration-2'>
              <a
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
              >
                {/* ◯日前　と出力したい */}
                ■ {item.title}(<span className='text-gray-500'>{item.company}</span>)
              </a>
            </li>
          ))}
        </ul>
        {isLoading && <p>読み込み中...</p>}
      </div>
    </main>
  );
};

export default Page;