import Link from 'next/link';

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-between p-24">
      <h1 className="text-4xl font-bold mb-8">Mynews</h1>
      <nav className="mb-8">
        <ul className="flex space-x-4">
          <li>
            <Link href="/rss" className="text-blue-500 hover:underline">
              RSSフィード
            </Link>
          </li>
          <li>
            <Link href="/hatebu" className="text-blue-500 hover:underline">
              はてブ
            </Link>
          </li>
        </ul>
      </nav>
    </main>
  );
}