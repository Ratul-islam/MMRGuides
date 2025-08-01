import { motion } from 'framer-motion';

const HeroSection = ({ totalGuides }) => {
  return (
    <section className="relative py-3 lg:py-5 bg-white border-b border-gray-100">
      <div className="container mx-auto px-6">
        <motion.div 
          className="text-center max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Status Badge */}
          <motion.div
            className="inline-flex items-center px-3 py-1.5 bg-gray-100 rounded-full text-gray-700 text-sm font-medium mb-6"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
          >
            <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
            {totalGuides}+ Development Guides
          </motion.div>
          
          {/* Main Heading */}
          <motion.h1 
            className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-2 leading-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            Learn. Build. Grow.
          </motion.h1>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;