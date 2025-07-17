import './globals.css';


export const metadata = {
  title: 'My ToDo App',
  description: 'A simple todo app built with Next.js',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body className="bg-gray-100 text-gray-900 font-sans min-h-screen flex flex-col">
        <header className="bg-blue-600 text-white py-4 shadow-md">
          <h1 className="text-2xl font-bold text-center">ToDo アプリ</h1>
        </header>
        <main className="flex-1 p-4 max-w-2xl mx-auto w-full">
          {children}
        </main>
        <footer className="bg-gray-200 text-center py-2 text-sm text-gray-600">
          <small>© 2025 My ToDo App</small>
        </footer>
      </body>
    </html>
  );
}