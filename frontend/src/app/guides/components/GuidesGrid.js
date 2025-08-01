import { motion } from 'framer-motion';
import GuideCard from './GuideCard';

const GuidesGrid = ({ guides, viewMode }) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <section className="py-12">
      <div className="container mx-auto px-6">
        <motion.div
          className={
            viewMode === 'grid' 
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" 
              : "space-y-6"
          }
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {guides.map((guide, index) => (
            <motion.div key={guide._id} variants={itemVariants}>
              <GuideCard guide={guide} viewMode={viewMode} index={index} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default GuidesGrid;