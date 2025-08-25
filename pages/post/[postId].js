import { useRouter } from 'next/router';

const PostLandingPage = () => {
  const router = useRouter();
  const { postId } = router.query;

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', textAlign: 'center', padding: '20px' }}>
      <h1>Welcome to Post {postId}</h1>
      <p>This is a dynamic landing page for post ID: {postId}.</p>
      <button
        onClick={() => router.push('/')}
        style={{
          padding: '10px 20px',
          backgroundColor: '#0070f3',
          color: '#fff',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
        }}
      >
        Go Back to Home
      </button>
    </div>
  );
};

export default PostLandingPage;