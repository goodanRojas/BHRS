import { Dialog } from '@headlessui/react';
import { useForm } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import axios from 'axios';

export default function OnboardingModal() {
  const [step, setStep] = useState(1);
  const [selectedPreferences, setSelectedPreferences] = useState([]);

  const preferenceOptions = [
    'Air Conditioning',
    'Near CR',
    'Lower Bunk',
    'Privacy Curtain',
    'Fast WiFi',
  ];

  const { data, setData, post, processing, errors } = useForm({
    source: '',
    other_source: '',
    bed_preference: [],
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    post('/onboarding');
    console.log(errors);
  };

 

  const handlePreferenceToggle = (pref) => {
    if (selectedPreferences.includes(pref)) {
      setSelectedPreferences(selectedPreferences.filter((p) => p !== pref));
    } else if (selectedPreferences.length < 5) {
      setSelectedPreferences([...selectedPreferences, pref]);
    }
  };

  // Sync selectedPreferences to form data
  useEffect(() => {
    setData('bed_preference', selectedPreferences);
  }, [selectedPreferences]);

  const steps = [1, 2];

  return (
    <Dialog
      open={true}
      onClose={() => {}}
      className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center"
    >
      <div className="bg-white p-6 rounded-xl max-w-md w-full shadow-xl space-y-6">
        {/* Progress Indicator */}
        <div className="flex justify-center space-x-2">
          {steps.map((s) => (
            <span
              key={s}
              className={`h-2 w-2 rounded-full ${s === step ? 'bg-blue-600' : 'bg-gray-300'}`}
            />
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Step 1: How did you hear about us */}
          {step === 1 && (
            <div>
              <h2 className="text-xl font-semibold mb-2">How did you hear about us?</h2>
              <select
                value={data.source}
                onChange={(e) => setData('source', e.target.value)}
                className="w-full border rounded p-2"
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
                  className="w-full border rounded mt-2 p-2"
                  required
                />
              )}
            </div>
          )}

          {/* Step 2: Bed Preferences */}
          {step === 2 && (
            <div>
              <h2 className="text-xl font-semibold mb-2">Choose your bed preferences</h2>
              <div className="flex flex-wrap gap-2">
                {preferenceOptions.map((pref) => {
                  const isSelected = selectedPreferences.includes(pref);
                  return (
                    <button
                      type="button"
                      key={pref}
                      onClick={() => handlePreferenceToggle(pref)}
                      className={`px-3 py-1 rounded-full border ${
                        isSelected
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'bg-white text-gray-700 border-gray-300'
                      }`}
                    >
                      {pref}
                    </button>
                  );
                })}
              </div>
              <p className="text-sm text-gray-500 mt-1">
                You can select up to 5 preferences.
              </p>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between pt-2">
            {step > 1 ? (
              <button
                type="button"
                className="text-gray-500 hover:underline"
                onClick={() => setStep(step - 1)}
              >
                Back
              </button>
            ) : (
              <button
                type="button"
                className="text-gray-500 hover:underline"
              >
                Skip
              </button>
            )}

            {step < steps.length ? (
              <button
                type="button"
                className="bg-blue-600 text-white px-4 py-2 rounded"
                onClick={() => setStep(step + 1)}
              >
                Next
              </button>
            ) : (
              <button
                type="submit"
                className={`bg-blue-600 text-white px-4 py-2 rounded ${processing || selectedPreferences.length < 5 ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={processing || selectedPreferences.length < 4}
              >
                Submit
              </button>
            )}
          </div>
        </form>
      </div>
    </Dialog>
  );
}
