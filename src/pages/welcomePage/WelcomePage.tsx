import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

// Placeholder components for steps (replace with your actual components)
const Step1 = () => (
  <div className="p-4 rounded-lg shadow-md">
    <h2 className="text-2xl font-bold mb-4">Step 1: Installation</h2>
    <p>Install the package using npm or yarn.</p>
    <pre className="mt-4 md:p-4 p-3 text-wrap rounded bg-[#364153]">
      npm install responsive-react-datatable
    </pre>
  </div>
);

const Step2 = () => (
  <div className="p-6 rounded-lg shadow-md">
    <h2 className="text-2xl font-bold mb-4">Step 2: Configuration</h2>
    <p>Import and configure the datatable in your component.</p>

    <pre className="mt-4 p-4 text-wrap rounded bg-[#364153] text-white">
      {`import { DataTable } from 'responsive-react-datatable'`}
    </pre>
    <p className="mt-4">
      This is the <strong>minimal setup</strong> with the fewest props. For more
      configuration options, please check the{" "}
      <Link className="text-[#d24670]" to="/document">
        documentation
      </Link>{" "}
      section.
    </p>
    <pre className="mt-4 text-wrap p-4 overflow-x-auto rounded bg-[#364153] text-white whitespace-pre-wrap">
      {`<Table
  mode="static"
  tableName="test"
  staticRows={mock?.data}
  totalItems={mock?.recordsFiltered}
  columns={columns}
  notify={(text) => alert(text)}
/>`}
    </pre>
  </div>
);

const Step3 = () => (
  <div className="p-6 rounded-lg shadow-md">
    <h2 className="text-2xl font-semibold text-center">🎉 Congratulations!</h2>
    <p className="mt-4">
      Your datatable is now set up successfully. You can customize its
      configuration to match your project needs, such as adjusting columns,
      enabling search and filters, setting up pagination, or adding actions like
      edit and delete. This way, the table stays flexible and user-friendly for
      your workflow.
    </p>

    <div className="mt-4 flex flex-col">
      <a href="#" className="text-[#d24670]">
        &gt; Basic Setup
      </a>
      <a href="#" className="text-[#d24670]">
        &gt; Advanced Setup
      </a>
    </div>
  </div>
);

const steps = [Step1, Step2, Step3];

const WelcomePage = () => {
  const [showWelcome, setShowWelcome] = useState(true);
  const [currentStep, setCurrentStep] = useState(0);
  const navigate = useNavigate();
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
    navigate("/document");
  };

  if (showWelcome) {
    return (
      <div className="w-full min-h-[90vh] flex flex-col items-center justify-center p-2">
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
          <div className="flex relative gap-6 before:content-[''] before:w-full before:h-[2px] before:bg-[#364169] before:z-[-1] before:absolute before:-top-[-50%]">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`w-8 h-8 z-10 rounded-full flex items-center justify-center ${
                  index <= currentStep
                    ? "bg-[#364169]"
                    : "border-2 border-[#364169] bg-black"
                }`}
              >
                <span>{index}</span>
              </div>
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
              ? "opacity-0"
              : "bg-[#364153] text-white hover:bg-gray-600 hover:scale-105"
          }`}
        >
          Previous
        </button>
        <button
          onClick={isLastStep ? handleFinish : handleNext}
          className={`px-6 py-3 font-semibold rounded-lg shadow-md transition-all duration-300 ${
            isLastStep
              ? "bg-green-600 text-white hover:scale-105"
              : "bg-[#d24670] text-white hover:scale-105"
          }`}
        >
          {isLastStep ? "Finish" : "Next"}
        </button>
      </div>
    </div>
  );
};

export default WelcomePage;
