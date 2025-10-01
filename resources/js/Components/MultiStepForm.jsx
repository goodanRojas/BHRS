import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

export default function MultiStepForm({
  steps,              // [{ label: "Step Name", content: (formData, setFormData) => JSX, validate: (formData) => bool }]
  onSubmit,           // callback when final step submits
  initialData = {},   // starting form data
}) {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState(initialData);

  const currentStep = steps[step];

  const nextStep = () => {
    if (currentStep.validate && !currentStep.validate(formData)) return;
    if (step < steps.length - 1) setStep(step + 1);
  };

  const prevStep = () => step > 0 && setStep(step - 1);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (step === steps.length - 1) {
      onSubmit(formData);
    } else {
      nextStep();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-lg">
      {/* Step Indicator */}
      <div className="flex justify-between mb-6">
        {steps.map((s, idx) => (
          <div key={idx} className="flex-1 flex flex-col items-center">
            <div
              className={`w-10 h-10 flex items-center justify-center rounded-full border-2 transition 
                ${idx <= step ? "bg-indigo-600 text-white border-indigo-600" : "bg-gray-100 border-gray-300 text-gray-500"}`}
            >
              {idx + 1}
            </div>
            <span className="text-xs mt-2 text-center">{s.label}</span>
          </div>
        ))}
      </div>

      {/* Step Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -40 }}
          transition={{ duration: 0.3 }}
          className="space-y-4"
        >
          {currentStep.content(formData, setFormData)}
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div className="flex justify-between mt-6">
        {step > 0 && (
          <button
            type="button"
            onClick={prevStep}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
          >
            Previous
          </button>
        )}
        <button
          type={step === steps.length - 1 ? "submit" : "button"}
          onClick={step === steps.length - 1 ? undefined : nextStep}
          className={`px-4 py-2 rounded-md text-white transition ${
            step === steps.length - 1
              ? "bg-green-600 hover:bg-green-700"
              : "bg-indigo-600 hover:bg-indigo-700"
          }`}
        >
          {step === steps.length - 1 ? "Submit" : "Next"}
        </button>
      </div>
    </form>
  );
}
