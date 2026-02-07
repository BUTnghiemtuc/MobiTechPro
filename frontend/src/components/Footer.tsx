import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-600 to-primary-400 flex items-center justify-center text-white font-bold text-lg">
                M
              </div>
              <span className="text-xl font-display font-bold tracking-tight text-white">
                MobiTechPro
              </span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              Your one-stop destination for premium tech gadgets, smartphones, and accessories. Experience the future today.
            </p>
            <div className="flex gap-4 pt-2">
              {/* Social Icons */}
              {['facebook', 'twitter', 'instagram', 'linkedin'].map((social) => (
                <a 
                  key={social} 
                  href="#" 
                  className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center hover:bg-primary-600 hover:text-white transition-all duration-300"
                >
                  <span className="sr-only">{social}</span>
                  <i className={`fab fa-${social}`}></i> {/* Placeholder for icons if using FontAwesome, or inline SVGs */}
                   {/* Inline SVG fallback since we don't have FA loaded maybe */}
                   <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                    </svg>
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="hover:text-primary-500 transition-colors">Home</Link></li>
              <li><Link to="/#product-section" className="hover:text-primary-500 transition-colors">Products</Link></li>
              <li><Link to="/about" className="hover:text-primary-500 transition-colors">About Us</Link></li>
              <li><Link to="/contact" className="hover:text-primary-500 transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="text-white font-bold mb-4">Support</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/contact" className="hover:text-primary-500 transition-colors">FAQ</Link></li>
              <li><Link to="/shipping-policy" className="hover:text-primary-500 transition-colors">Shipping Policy</Link></li>
              <li><Link to="/returns-refunds" className="hover:text-primary-500 transition-colors">Returns & Refunds</Link></li>
              <li><Link to="/privacy-policy" className="hover:text-primary-500 transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms-of-service" className="hover:text-primary-500 transition-colors">Terms of Service</Link></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-white font-bold mb-4">Stay Updated</h3>
            <p className="text-sm text-slate-400 mb-4">Subscribe to our newsletter for the latest tech news and exclusive deals.</p>
            <form className="flex flex-col gap-2" onSubmit={(e) => e.preventDefault()}>
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="bg-slate-800 text-white px-4 py-2.5 rounded-lg border border-slate-700 focus:outline-none focus:border-primary-500 transition-colors text-sm"
              />
              <button className="bg-primary-600 text-white px-4 py-2.5 rounded-lg font-medium hover:bg-primary-700 transition-colors text-sm">
                Subscribe
              </button>
            </form>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-8 mt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-500">
          <p>&copy; {new Date().getFullYear()} MobiTechPro. All rights reserved.</p>
          <div className="flex gap-4">
             {/* Payment Icons Placeholder */}
             <div className="flex items-center gap-2 grayscale opacity-70">
                <div className="h-6 w-10 bg-slate-800 rounded"></div>
                <div className="h-6 w-10 bg-slate-800 rounded"></div>
                <div className="h-6 w-10 bg-slate-800 rounded"></div>
             </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
