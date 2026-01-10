import React from 'react';
import { 
  MapPin, 
  Phone, 
  Mail, 
  Instagram, 
  Twitter, 
  Linkedin, 
  Archive, // Using Archive as a placeholder for the Nest jar icon
  Facebook
} from 'lucide-react';

const Footer = () => {
  return (
    <footer className="relative bg-[#08221B] text-gray-300 font-sans overflow-hidden">
      {/* Optional: Background 'blueprint' lines to match the aesthetic */}
      <div className="absolute inset-0 pointer-events-none opacity-10">
        <div className="absolute top-[30%] left-0 w-full h-px border-t border-dashed border-white transform -rotate-1"></div>
        <div className="absolute top-[60%] left-0 w-full h-px border-t border-dashed border-white transform rotate-1"></div>
      </div>

      <div className="max-w-7xl mx-auto px-6 pt-16 pb-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8">
          
          {/* Column 1: Brand Info */}
          <div className="lg:col-span-4 space-y-8">
            <div className="flex items-center gap-3">
              <div className="bg-white text-[#08221B] p-2 rounded-lg">
                <Archive size={24} strokeWidth={2.5} />
              </div>
              <h2 className="text-2xl font-bold text-white tracking-wide">NEST & NAIL</h2>
            </div>
            
            <p className="text-gray-400 leading-relaxed max-w-sm">
              Making home maintenance effortless. Professional services delivered to your doorstep.
            </p>

            <div className="space-y-4 pt-2">
              <div className="flex items-start gap-3 group">
                <MapPin className="w-5 h-5 text-red-500 mt-1 flex-shrink-0 group-hover:text-red-400 transition-colors" />
                <span className="text-sm">
                  123 Innovation Drive,<br />
                  San Francisco, CA 94103
                </span>
              </div>
              <div className="flex items-center gap-3 group">
                <Phone className="w-5 h-5 text-red-500 flex-shrink-0 group-hover:text-red-400 transition-colors" />
                <span className="text-sm">+1 (888) 555-0123</span>
              </div>
              <div className="flex items-center gap-3 group">
                <Mail className="w-5 h-5 text-red-500 flex-shrink-0 group-hover:text-red-400 transition-colors" />
                <a href="mailto:help@nestandnail.com" className="text-sm hover:text-white transition-colors">
                  help@nestandnail.com
                </a>
              </div>
            </div>
          </div>

          {/* Column 2: Services */}
          <div className="lg:col-span-3 lg:pl-4">
            <h3 className="text-xl font-bold text-white mb-6">Services</h3>
            <ul className="space-y-0">
              {['Home Cleaning', 'Plumbing & Water', 'Electrical Repairs', 'Painting & Decor', 'Smart Home Setup'].map((item, index) => (
                <li key={index} className="border-b border-white/10 last:border-0">
                  <a href="#" className="block py-3 text-sm hover:text-white hover:pl-2 transition-all duration-300">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Company */}
          <div className="lg:col-span-2">
            <h3 className="text-xl font-bold text-white mb-6">Company</h3>
            <ul className="space-y-4">
              {['Our Story', 'Careers', 'Partner Program', 'Reviews', 'Press Kit'].map((item, index) => (
                <li key={index}>
                  <a href="#" className="text-sm hover:text-white transition-colors">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Working Hours Card */}
          <div className="lg:col-span-3">
            <div className="bg-[#0F2922] border border-white/5 rounded-2xl p-6 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-20 h-20 bg-white/5 rounded-full blur-2xl -mr-10 -mt-10"></div>
              
              <h3 className="text-lg font-bold text-white mb-6">Working Hours</h3>
              
              <div className="space-y-3 text-sm mb-8">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Mon - Fri</span>
                  <span className="font-medium text-white">8:00 AM - 9:00 PM</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Saturday</span>
                  <span className="font-medium text-white">9:00 AM - 6:00 PM</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Sunday</span>
                  <span className="font-medium text-red-500">Emergency Only</span>
                </div>
              </div>

              <div className="pt-2">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">Follow Us</h4>
                <div className="flex gap-3">
                  {[
                    { Icon: Instagram, href: '#' },
                    { Icon: Twitter, href: '#' },
                    { Icon: Linkedin, href: '#' }
                  ].map(({ Icon, href }, i) => (
                    <a 
                      key={i} 
                      href={href}
                      className="w-10 h-10 bg-[#1A3830] hover:bg-[#23453b] rounded-lg flex items-center justify-center text-white transition-all duration-300 hover:-translate-y-1"
                    >
                      <Icon size={18} />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-500">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center font-bold font-serif border border-white/20">
              N
            </div>
            <p>&copy; 2024 Nest & Nail Inc. Licensed & Insured.</p>
          </div>
          
          <div className="flex gap-6">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <span className="text-gray-700">|</span>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <span className="text-gray-700">|</span>
            <a href="#" className="hover:text-white transition-colors">Sitemap</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;