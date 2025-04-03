import React, { useState } from 'react';
import { Dialog } from '@headlessui/react';
import { motion } from 'framer-motion';

const TermsAndConditionsModal = ({ isOpen, onClose, onAgree }) => {
    return (
        <Dialog open={isOpen} onClose={onClose} className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="fixed inset-0 bg-black bg-opacity-50" aria-hidden="true"></div>
            
            <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 z-50 relative"
            >
                <Dialog.Title className="text-lg font-semibold mb-4">Terms and Conditions</Dialog.Title>
                <p className="text-sm text-gray-700 mb-4">
                    By using this service, you agree to comply with our terms and conditions. Please read them carefully.
                </p>
                <div className="flex justify-end space-x-4">
                    <button 
                        onClick={onClose} 
                        className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400"
                    >
                        Decline
                    </button>
                    <button 
                        onClick={onAgree} 
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                    >
                        Agree
                    </button>
                </div>
            </motion.div>
        </Dialog>
    );
};

export default TermsAndConditionsModal;
