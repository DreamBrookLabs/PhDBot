import { Button } from "@/components/ui/button";
import Link from "next/link";

const HomePage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <img src="/PhDBot_transparent.png" alt="PhDBot" className="w-8 h-8" />
              <h1 className="text-2xl font-bold text-gray-900">PhDBot</h1>
            </div>
            <nav className="flex space-x-4">
              <Link href="/sign-in">
                <Button variant="outline">Login</Button>
              </Link>
              <Link href="/sign-up">
                <Button>Get Started</Button>
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center">
          <h2 className="text-5xl font-bold text-gray-900 mb-6">
            Personalized PhD-Level 
            <span className="text-blue-600"> AI-Agents</span>
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Experience the future of AI assistance with specialized agents designed to provide 
            PhD-level expertise across multiple domains. Get intelligent, research-grade responses 
            tailored to your specific needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/sign-up">
              <Button size="lg" className="text-lg px-8 py-3">
                Start Free Trial
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button variant="outline" size="lg" className="text-lg px-8 py-3">
                View Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h3 className="text-3xl font-bold mb-4">
              Ready to Experience PhD-Level AI?
            </h3>
            <p className="text-xl mb-8 opacity-90">
              Join thousands of researchers, students, and professionals who trust PhDBot 
              for their most complex questions and tasks.
            </p>
            <Link href="/sign-up">
              <Button size="lg" variant="secondary" className="text-lg px-8 py-3">
                Get Started Today
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <img src="/PhDBot_transparent.png" alt="PhDBot" className="w-6 h-6" />
                <h4 className="text-lg font-semibold">PhDBot</h4>
              </div>
              <p className="text-gray-400">
                Personalized PhD-Level AI-Agents for intelligent assistance.
              </p>
            </div>
            <div>
              <h5 className="text-lg font-semibold mb-4">Quick Links</h5>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/dashboard" className="hover:text-white transition-colors">Dashboard</Link></li>
                <li><Link href="/sign-up" className="hover:text-white transition-colors">Sign Up</Link></li>
                <li><Link href="/sign-in" className="hover:text-white transition-colors">Login</Link></li>
              </ul>
            </div>
            <div>
              <h5 className="text-lg font-semibold mb-4">Contact</h5>
              <p className="text-gray-400">
                Get in touch for support or inquiries about our AI-powered solutions.
              </p>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 PhDBot. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;