'use client';

import React, { useState } from 'react';
import axios from 'axios';

const Page: React.FC = () => {
  const [password, setPassword] = useState('');

  const handleClick = async () => {
    try {
      await axios.post('../insertData/api', { password });
      alert('APIが正常に実行されました');
    } catch (error) {
      console.error('Error fetching RSS data:', error);
      alert('パスワードが正しくないか、APIの実行中にエラーが発生しました');
    }
  };

  return (
    <main className='min-h-screen p-10'>
      <input
        type='password'
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder='パスワード'
        className='border border-gray-300 rounded px-4 py-2 mb-4 w-800'
      />
      <br />
      <button onClick={handleClick} className='text-2xl underline'>
        Insert Articles
      </button>
    </main>
  );
};

export default Page;
