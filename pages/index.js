// pages/index.js
import { getSession } from '@auth0/nextjs-auth0';

// דף הבית לאורחים לפני התחברות
export default function HomePage() {
  return (
    <div className="grid gap-8 md:grid-cols-2 items-center">
      <div className="space-y-4">
        <h1 className="text-3xl md:text-5xl font-bold tracking-tight">Create Characters. Write Stories. Share Magic.</h1>
        <p className="text-gray-600">Log in to start crafting your characters and generating stories in minutes.</p>
        <div className="flex gap-3">
          <a href="/api/auth/login" className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">Login</a>
          <a href="#how-it-works" className="inline-flex items-center rounded-md border px-4 py-2 hover:bg-gray-50">How it works</a>
        </div>
      </div>
      <div className="rounded-xl border bg-white p-6 shadow-sm">
        <div className="h-40 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg" />
        <p className="mt-4 text-sm text-gray-500">A simple, beautiful way to build your stories.</p>
      </div>
    </div>
  );
}

// זה החלק החשוב: פונקציה שרצה על השרת לפני טעינת העמוד
export async function getServerSideProps(ctx) {
  // 1. קבל את הסשן של המשתמש מהבקשה
  const session = await getSession(ctx.req, ctx.res);

  // 2. בדוק אם המשתמש מחובר
  if (session?.user) {
    // 3. אם כן, בצע הפניה לדאשבורד
    return {
      redirect: {
        destination: '/dashboard',
        permanent: false, // לא הפניה קבועה, כי המצב יכול להשתנות
      },
    };
  }

  // 4. אם לא, פשוט תטען את העמוד כרגיל (עם props ריקים)
  return {
    props: {},
  };
}