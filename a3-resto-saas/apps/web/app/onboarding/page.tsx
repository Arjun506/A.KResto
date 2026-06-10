'use client';

import { useState } from 'react';

const steps = [
  'Restaurant Info',
  'Business Details',
  'Subscription Plan',
  'Complete Setup',
];

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] =
    useState(1);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">

      <div className="bg-white rounded-3xl shadow w-full max-w-4xl p-10">

        <div className="mb-10">

          <h1 className="text-4xl font-bold">
            Restaurant Onboarding
          </h1>

          <p className="text-gray-500 mt-2">
            Setup your restaurant SaaS account
          </p>

        </div>

        <div className="flex items-center justify-between mb-12">

          {steps.map((step, index) => (
            <div
              key={step}
              className="flex-1 flex items-center"
            >

              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold
                ${
                  currentStep >= index + 1
                    ? 'bg-black text-white'
                    : 'bg-gray-200 text-gray-500'
                }`}
              >
                {index + 1}
              </div>

              <div className="ml-3">

                <p className="font-medium">
                  {step}
                </p>

              </div>

            </div>
          ))}

        </div>

        <div className="space-y-6">

          <div>

            <label className="block mb-2 font-medium">
              Restaurant Name
            </label>

            <input
              type="text"
              placeholder="Enter restaurant name"
              className="w-full border rounded-2xl px-5 py-4"
            />

          </div>

          <div>

            <label className="block mb-2 font-medium">
              Restaurant Address
            </label>

            <input
              type="text"
              placeholder="Enter restaurant address"
              className="w-full border rounded-2xl px-5 py-4"
            />

          </div>

          <div>

            <label className="block mb-2 font-medium">
              Contact Number
            </label>

            <input
              type="text"
              placeholder="Enter contact number"
              className="w-full border rounded-2xl px-5 py-4"
            />

          </div>

        </div>

        <div className="flex justify-between mt-10">

          <button className="border px-6 py-3 rounded-2xl">
            Back
          </button>

          <button
            onClick={() =>
              setCurrentStep((prev) =>
                prev < 4 ? prev + 1 : prev
              )
            }
            className="bg-black text-white px-6 py-3 rounded-2xl"
          >
            Continue
          </button>

        </div>

      </div>

    </div>
  );
}