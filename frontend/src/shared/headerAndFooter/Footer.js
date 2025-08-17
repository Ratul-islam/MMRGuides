import Link from "next/link";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-950 text-gray-300">
      <div className="container mx-auto px-6 py-10 flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2">
          <span className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center text-white font-bold text-lg">{'</>'}</span>
          <span className="text-lg font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">Guides Hub</span>
        </Link>
        {/* Navigation */}
        <div className="flex gap-6 text-sm">
          <Link href="/" className="hover:text-white transition">Home</Link>
          <Link href="/guides" className="hover:text-white transition">Guides</Link>
          <Link href="/about" className="hover:text-white transition">About</Link>
        </div>
        {/* Copyright */}
        <div className="text-xs text-gray-500">&copy; {currentYear} Guides Hub</div>
      </div>
    </footer>
  );
};

export default Footer;