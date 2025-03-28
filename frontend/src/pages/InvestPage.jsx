import { motion } from 'framer-motion';
import PropertyForm from './Add';
import { useState } from 'react';

const InvestPage = () => {
  const [selectedOption, setSelectedOption] = useState(null);

  return (
    <div className="min-h-screen pt-32 px-4 bg-gray-50 flex items-center justify-center">
      <motion.div 
        initial={{ opacity: 0, y: -20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.5 }}
        className="max-w-2xl mx-auto rounded-lg shadow-xl bg-white p-6 text-center"
      >
        <motion.h2 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-2xl font-bold text-gray-900 mb-6"
        >
          Invest in Real Estate
        </motion.h2>
        <div className="flex justify-center gap-4 mb-6">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className={`px-6 py-3 rounded-md text-white text-lg transition-all duration-300 ${selectedOption === 'sell' ? 'bg-blue-600' : 'bg-gray-500'}`}
            onClick={() => setSelectedOption('sell')}
          >
            Sell
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className={`px-6 py-3 rounded-md text-white text-lg transition-all duration-300 ${selectedOption === 'rent' ? 'bg-blue-600' : 'bg-gray-500'}`}
            onClick={() => setSelectedOption('rent')}
          >
            Rent
          </motion.button>
        </div>
        {selectedOption && (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
  >
    <PropertyForm availability={selectedOption} />
  </motion.div>
)}
      </motion.div>
    </div>
  );
};

export default InvestPage;