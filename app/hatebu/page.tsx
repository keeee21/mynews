"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";

type RSS = {
  id: number;
  title: string;
  link: string;
  bookmarkCount: number;
}

export default function Hatebu() {
  const [rssData, setRssData] = useState<RSS[]>([]);

  useEffect(() => {
    const fetchHatenaRSS = async () => {
      try {
        const response = await axios.get("../hatebu/api/");
        setRssData(response.data);
      } catch (error) {
        console.error("Error fetching RSS data:", error);
      }
    }
    fetchHatenaRSS();
  }, [])

  return (
    <main className="min-h-screen p-12">
      <Link href="/" className='text-2xl underline'>My News</Link>
      <div className="z-10 max-w-5xl w-full font-mono text-sm">
        <h1 className="text-xl font-bold bg-gray-600 text-white p-2">はてなブックマーク</h1>
        {rssData.length > 0 ? (
          <ul className="bg-white p-2">
            {rssData.map((item) => (
              <li key={item.id} className="my-2 underline underline-offset-2 decoration-gray-300 decoration-2">
                <a href={item.link} target="_blank" rel="noopener noreferrer">
                  ■ {item.title}
                </a>
                <span>（{item.bookmarkCount}）</span>
              </li>
            ))}
          </ul>
          ): (
            <p>Loading...</p>
          )}
      </div>
    </main>
  )
}