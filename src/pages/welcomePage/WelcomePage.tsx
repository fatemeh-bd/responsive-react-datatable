import { useState } from "react";
import { Link } from "react-router-dom";

// Placeholder components for steps (replace with your actual components)
const Step1 = () => (
  <div className="p-6  rounded-lg shadow-md">
    <h2 className="text-2xl font-bold mb-4">Step 1: Installation</h2>
    <p>Install the package using npm or yarn.</p>
    <pre className="mt-4 p-4 rounded">
      npm install responsive-react-datatable
    </pre>
  </div>
);

const Step2 = () => (
  <div className="p-6 rounded-lg shadow-md">
    <h2 className="text-2xl font-bold mb-4">Step 2: Configuration</h2>
    <p>Import and configure the datatable in your component.</p>
    <pre className="mt-4 p-4 rounded">
      import {"DataTable"} from 'responsive-react-datatable'
      {/* Example config */}
    </pre>
  </div>
);

const Step3 = () => (
  <div className="p-6 rounded-lg shadow-md">
    <h2 className="text-2xl font-bold mb-4">Step 3: Usage</h2>
    <p>Render the datatable with your data.</p>
    {/* Add your actual component demo here */}
    <div className="mt-4">Demo Table Component</div>
  </div>
);

const steps = [Step1, Step2, Step3]; // Add more steps as needed

const WelcomePage = () => {
  const [showWelcome, setShowWelcome] = useState(true);
  const [currentStep, setCurrentStep] = useState(0);

  const handleGetStarted = () => {
    setShowWelcome(false);
    setCurrentStep(0);
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleFinish = () => {
    // Redirect or show completion, e.g., to /document
    window.location.href = "/document"; // Or use navigate from react-router
  };

  if (showWelcome) {
    return (
      <div className="w-full min-h-[90vh] flex flex-col items-center justify-center p-6">
        {/* Heading */}
        <h1
          className="text-3xl md:text-4xl font-extrabold mb-6 text-[#d24670] flex items-center text-center gap-2"
          role="heading"
          aria-label="Welcome to Responsive React Datatable"
        >
          Welcome to Responsive React Datatable
        </h1>

        {/* Description */}
        <p className="text-gray-700 dark:text-gray-300 text-center max-w-lg md:max-w-2xl text-base md:text-lg mb-8">
          A powerful, flexible, and fully customizable solution for managing
          data tables in your React applications. Designed for seamless
          integration, responsiveness, and smart data interaction.
        </p>

        {/* Call-to-Action Button */}
        <button
          onClick={handleGetStarted}
          className="inline-flex items-center transition-all px-6 py-3 bg-[#364169] text-white font-semibold rounded-lg shadow-md hover:scale-105 duration-300"
          aria-label="Get Started with Responsive React Datatable"
        >
          Get Started 🚀
        </button>
      </div>
    );
  }

  const CurrentStepComponent = steps[currentStep];
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === steps.length - 1;

  return (
    <div className="w-full min-h-[90vh] flex flex-col items-center justify-center p-6">
      {/* Step Content */}
      <div className="w-full max-w-4xl mb-8">
        <div className="flex justify-center mb-4">
          <div className="flex space-x-2">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`w-3 h-3 rounded-full ${
                  index <= currentStep ? "bg-[#364169]" : "bg-gray-300"
                }`}
              />
            ))}
          </div>
        </div>
        <CurrentStepComponent />
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between w-full max-w-4xl gap-4">
        <button
          onClick={handlePrevious}
          disabled={isFirstStep}
          className={`px-6 py-3 font-semibold rounded-lg shadow-md transition-all duration-300 ${
            isFirstStep
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-gray-500 text-white hover:bg-gray-600 hover:scale-105"
          }`}
        >
          Previous
        </button>
        <button
          onClick={isLastStep ? handleFinish : handleNext}
          className={`px-6 py-3 font-semibold rounded-lg shadow-md transition-all duration-300 ${
            isLastStep
              ? "bg-green-600 text-white hover:bg-green-700 hover:scale-105"
              : "bg-[#364169] text-white hover:bg-[#2d3a5f] hover:scale-105"
          }`}
        >
          {isLastStep ? "Finish" : "Next"}
        </button>
      </div>
    </div>
  );
};

export default WelcomePage;
