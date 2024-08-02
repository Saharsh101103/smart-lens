import Head from 'next/head';
import FeatureCard from '../components/FeatureCard';

type Post = {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
};

const Home: React.FC = () => {
  // Example state for the latest post
  // const [latestPost, setLatestPost] = useState<Post | null>(null);

  // useEffect(() => {
  //   async function fetchLatestPost() {
  //     const response = await fetch('/api/trpc/post.getLatest');
  //     const data = await response.json();
  //     setLatestPost(data);
  //   }
  //   fetchLatestPost();
  // }, []);

  return (
    <>
      <Head>
        <title>Smart Lens - Home</title>
        <meta name="description" content="Revolutionize Your Visual Experience with Smart Lens" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="bg-gray-100 min-h-screen">
        {/* Hero Section */}
        <section className="flex flex-col items-center justify-center py-20 bg-blue-500 text-white text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold">Revolutionize Your Visual Experience</h1>
          <p className="mt-4 text-lg md:text-xl lg:text-2xl">
            Instantly identify objects and get useful information with our advanced image recognition technology.
          </p>
          <a href="#features" className="mt-8 px-6 py-3 bg-yellow-500 text-black font-semibold rounded-lg hover:bg-yellow-400 text-base md:text-lg lg:text-xl">
            Get Started
          </a>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl md:text-4xl font-semibold text-center mb-8">Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <FeatureCard
                title="Instant Object Recognition"
                description="Get instant information about objects you see in the real world."
              />
              <FeatureCard
                title="Seamless Integration"
                description="Easily integrate with other applications and services."
              />
              <FeatureCard
                title="Real-time Information"
                description="Receive up-to-date and accurate information instantly."
              />
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-20 bg-gray-200">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl md:text-4xl font-semibold text-center mb-8">How It Works</h2>
            <ol className="list-decimal pl-6 space-y-4 text-base md:text-lg">
              <li>Upload an image of the object.</li>
              <li>Receive detailed information and suggestions.</li>
              <li>Explore and learn more about the object.</li>
            </ol>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-20">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl md:text-4xl font-semibold text-center mb-8">What Our Users Say</h2>
            <div className="flex flex-col items-center">
              <blockquote className="bg-white p-6 rounded-lg shadow-lg">
                <p className="text-lg md:text-xl">“Smart Lens has completely transformed how I interact with the world around me!”</p>
                <footer className="mt-4">— Jane Doe</footer>
              </blockquote>
              {/* Add more testimonials here */}
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-gray-800 text-white py-6">
          <div className="container mx-auto px-6 text-center">
            <p>&copy; {new Date().getFullYear()} Smart Lens. All rights reserved.</p>
            <a href="mailto:contact@smartlens.com" className="mt-2 block text-base md:text-lg">Contact Us</a>
            <div className="mt-2">
              <a href="#" className="text-gray-400 hover:text-white mx-2">Facebook</a>
              <a href="#" className="text-gray-400 hover:text-white mx-2">Twitter</a>
              <a href="#" className="text-gray-400 hover:text-white mx-2">Instagram</a>
            </div>
          </div>
        </footer>
      </main>
    </>
  );
};

export default Home;
