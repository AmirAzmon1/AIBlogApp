import Link from "next/link";

export default function Home() {
  return <div>
    <h1>Welcome to My Next.js App</h1>
    <div>
      <Link href="/api/auth/login">login</Link>
    </div>
  </div>
  ;
}
