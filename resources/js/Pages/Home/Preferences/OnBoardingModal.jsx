import { Dialog } from '@headlessui/react';
import { useForm } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

export default function OnboardingModal() {
  const [step, setStep] = useState(1);
  const [selectedPreferences, setSelectedPreferences] = useState([]);
  const [preferenceOptions, setPreferenceOptions] = useState([]);

  useEffect(() => {
    axios.get(route('user.onboarding.get.preferences')).then((response) => {
      setPreferenceOptions(response.data.preferences);
    });
  }, []);

  const { data, setData, post, processing, errors } = useForm({
    source: '',
    other_source: '',
    bed_preference: [],
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    post(route('user.onboarding.store'));
  };

  const handlePreferenceToggle = (pref) => {
    if (selectedPreferences.includes(pref)) {
      setSelectedPreferences(selectedPreferences.filter((p) => p !== pref));
    } else if (selectedPreferences.length < 5) {
      setSelectedPreferences([...selectedPreferences, pref]);
    }
  };

  useEffect(() => {
    setData('bed_preference', selectedPreferences);
  }, [selectedPreferences]);

  const steps = [1, 2];

  return (
    <Dialog
      open={true}
      onClose={() => {}}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 30 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className="bg-white p-6 rounded-2xl max-w-md w-full shadow-2xl space-y-6 relative"
      >
        {/* Progress Indicator */}
        <div className="flex justify-center space-x-2">
          {steps.map((s) => (
            <span
              key={s}
              className={`h-2.5 w-2.5 rounded-full transition-colors duration-300 ${
                s === step ? 'bg-blue-600' : 'bg-gray-300'
              }`}
            />
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -40 }}
                transition={{ duration: 0.3 }}
                className="space-y-3"
              >
                <h2 className="text-2xl font-semibold text-gray-800">
                  How did you hear about us?
                </h2>
                <select
                  value={data.source}
                  onChange={(e) => setData('source', e.target.value)}
                  className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  required
                >
                  <option value="">Select one</option>
                  <option value="Facebook">Facebook</option>
                  <option value="TikTok">TikTok</option>
                  <option value="Google Search">Google Search</option>
                  <option value="Friend">Friend</option>
                  <option value="Other">Other</option>
                </select>

                {data.source === 'Other' && (
                  <input
                    type="text"
                    placeholder="Please specify"
                    value={data.other_source}
                    onChange={(e) => setData('other_source', e.target.value)}
                    className="w-full border rounded-lg mt-2 p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    required
                  />
                )}
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -40 }}
                transition={{ duration: 0.3 }}
                className="space-y-3 max-h-[70vh] overflow-y-auto"
              >
                <h2 className="text-2xl font-semibold text-gray-800">
                  Choose your preferences
                </h2>
                <div className="flex flex-wrap gap-2 "> {/* Add Scrollbar */}
                  {preferenceOptions.map((pref) => {
                    const isSelected = selectedPreferences.includes(pref);
                    return (
                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        whileHover={{ scale: 1.05 }}
                        type="button"
                        key={pref}
                        onClick={() => handlePreferenceToggle(pref)}
                        className={`px-4 py-2 rounded-full border transition-all duration-200 ${
                          isSelected
                            ? 'bg-blue-600 text-white border-blue-600 shadow'
                            : 'bg-white text-gray-700 border-gray-300 hover:border-blue-400'
                        }`}
                      >
                        {pref}
                      </motion.button>
                    );
                  })}
                </div>
                <p className="text-sm text-gray-500">
                  You can select up to 5 preferences.
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center pt-2">
            {step > 1 ? (
              <button
                type="button"
                className="text-gray-500 hover:text-gray-700 transition-colors"
                onClick={() => setStep(step - 1)}
              >
                ← Back
              </button>
            ) : (
              <button
                type="button"
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                Skip
              </button>
            )}

            {step < steps.length ? (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="button"
                className="bg-blue-600 text-white px-6 py-2 rounded-lg shadow hover:bg-blue-700 transition"
                onClick={() => setStep(step + 1)}
              >
                Next →
              </motion.button>
            ) : (
              <motion.button
                whileHover={{ scale: processing ? 1 : 1.05 }}
                whileTap={{ scale: processing ? 1 : 0.95 }}
                type="submit"
                className={`px-6 py-2 rounded-lg shadow text-white transition ${
                  processing || selectedPreferences.length < 4
                    ? 'bg-blue-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700'
                }`}
                disabled={processing || selectedPreferences.length < 4}
              >
                {processing ? 'Submitting...' : 'Submit'}
              </motion.button>
            )}
          </div>
        </form>
      </motion.div>
    </Dialog>
  );
}
