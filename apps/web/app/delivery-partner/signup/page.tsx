'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { registerDeliveryPartner, type CreateDeliveryPartnerPayload } from '@/services/online-ordering.service';
import {
  AnimatedButton,
  GlassContainer,
  Alert,
} from '@/components/common/animated-components';
import { Truck, Mail, Phone, MapPin, FileText } from 'lucide-react';

export default function DeliveryPartnerSignUpPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [formData, setFormData] = useState<CreateDeliveryPartnerPayload>({
    name: '',
    email: '',
    phone: '',
    password: '',
    aadharNumber: '',
    panNumber: '',
    vehicleType: 'bike',
    vehicleNumber: '',
    bankAccountNumber: '',
    ifscCode: '',
    latitude: 0,
    longitude: 0,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (currentStep === 1) {
      if (!formData.name || !formData.email || !formData.phone || !formData.password) {
        setError('Please fill in all personal details');
        return;
      }
      if (formData.password.length < 6) {
        setError('Password must be at least 6 characters');
        return;
      }
      setCurrentStep(2);
      return;
    }

    if (currentStep === 2) {
      if (!formData.aadharNumber || !formData.panNumber) {
        setError('Please enter Aadhar and PAN numbers');
        return;
      }
      setCurrentStep(3);
      return;
    }

    if (currentStep === 3) {
      if (!formData.vehicleType || !formData.vehicleNumber) {
        setError('Please select vehicle type and enter vehicle number');
        return;
      }
      setCurrentStep(4);
      return;
    }

    if (currentStep === 4) {
      if (!formData.bankAccountNumber || !formData.ifscCode) {
        setError('Please enter bank account details');
        return;
      }

      // Register delivery partner
      try {
        setLoading(true);
        const result = await registerDeliveryPartner(formData);
        setSuccess('Registration successful! Please verify your documents.');

        // Redirect to verification page
        setTimeout(() => {
          router.push(`/delivery-partner/verify/${result.id}`);
        }, 2000);
      } catch (err: any) {
        setError(err.message || 'Registration failed. Please try again.');
      } finally {
        setLoading(false);
      }
    }
  };

  const steps = [
    { number: 1, title: 'Personal Info', icon: '👤' },
    { number: 2, title: 'Documents', icon: '📄' },
    { number: 3, title: 'Vehicle', icon: '🚗' },
    { number: 4, title: 'Bank Details', icon: '🏦' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 dark:from-gray-900 dark:via-purple-900 dark:to-gray-900 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Truck className="w-8 h-8 text-purple-600" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Become a Delivery Partner
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            Earn money by delivering food. Quick registration process.
          </p>
        </div>

        {/* Progress Steps */}
        <GlassContainer className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <React.Fragment key={step.number}>
                <div
                  className={`
                    flex flex-col items-center
                    ${currentStep >= step.number ? 'opacity-100' : 'opacity-50'}
                  `}
                >
                  <div
                    className={`
                      w-12 h-12 rounded-full flex items-center justify-center
                      transition-all duration-300
                      ${currentStep >= step.number
                        ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
                        : 'bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300'
                      }
                    `}
                  >
                    {step.icon}
                  </div>
                  <p className="text-xs mt-2 font-semibold text-gray-700 dark:text-gray-300 text-center">
                    {step.title}
                  </p>
                </div>

                {index < steps.length - 1 && (
                  <div
                    className={`
                      flex-1 h-1 mx-2 transition-all duration-300
                      ${currentStep > step.number
                        ? 'bg-gradient-to-r from-purple-600 to-blue-600'
                        : 'bg-gray-300 dark:bg-gray-600'
                      }
                    `}
                  />
                )}
              </React.Fragment>
            ))}
          </div>
        </GlassContainer>

        {/* Form */}
        <GlassContainer>
          {error && (
            <Alert
              type="error"
              title="Error"
              message={error}
              onClose={() => setError(null)}
            />
          )}

          {success && (
            <Alert
              type="success"
              title="Success"
              message={success}
              onClose={() => setSuccess(null)}
            />
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Step 1: Personal Information */}
            {currentStep === 1 && (
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                  Personal Information
                </h2>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter your full name"
                    className="w-full bg-white/10 dark:bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                    <Mail className="w-4 h-4 inline mr-2" />
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="your@email.com"
                    className="w-full bg-white/10 dark:bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                    <Phone className="w-4 h-4 inline mr-2" />
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="+91 98765 43210"
                    className="w-full bg-white/10 dark:bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                    Password
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Enter password (min 6 characters)"
                    className="w-full bg-white/10 dark:bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>
            )}

            {/* Step 2: Documents */}
            {currentStep === 2 && (
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                  Government Documents
                </h2>

                <Alert
                  type="info"
                  title="Document Verification"
                  message="We'll verify your documents after registration. Upload clear photos in the next step."
                />

                <div>
                  <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                    <FileText className="w-4 h-4 inline mr-2" />
                    Aadhar Number
                  </label>
                  <input
                    type="text"
                    name="aadharNumber"
                    value={formData.aadharNumber}
                    onChange={handleInputChange}
                    placeholder="12-digit Aadhar number"
                    className="w-full bg-white/10 dark:bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                    PAN Number
                  </label>
                  <input
                    type="text"
                    name="panNumber"
                    value={formData.panNumber}
                    onChange={handleInputChange}
                    placeholder="10-digit PAN number"
                    className="w-full bg-white/10 dark:bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>
            )}

            {/* Step 3: Vehicle Information */}
            {currentStep === 3 && (
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                  Vehicle Information
                </h2>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                    Vehicle Type
                  </label>
                  <select
                    name="vehicleType"
                    value={formData.vehicleType}
                    onChange={handleInputChange}
                    className="w-full bg-white/10 dark:bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-gray-900 dark:text-white focus:outline-none focus:border-purple-500"
                  >
                    <option value="bike">Bike</option>
                    <option value="car">Car</option>
                    <option value="bicycle">Bicycle</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                    Vehicle Number
                  </label>
                  <input
                    type="text"
                    name="vehicleNumber"
                    value={formData.vehicleNumber}
                    onChange={handleInputChange}
                    placeholder="e.g., DL01AB1234"
                    className="w-full bg-white/10 dark:bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>
            )}

            {/* Step 4: Bank Details */}
            {currentStep === 4 && (
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                  Bank Account Details
                </h2>

                <Alert
                  type="info"
                  title="Secure Payment"
                  message="Your earnings will be transferred to this account every week."
                />

                <div>
                  <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                    Bank Account Number
                  </label>
                  <input
                    type="text"
                    name="bankAccountNumber"
                    value={formData.bankAccountNumber}
                    onChange={handleInputChange}
                    placeholder="Enter account number"
                    className="w-full bg-white/10 dark:bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                    IFSC Code
                  </label>
                  <input
                    type="text"
                    name="ifscCode"
                    value={formData.ifscCode}
                    onChange={handleInputChange}
                    placeholder="e.g., SBIN0001234"
                    className="w-full bg-white/10 dark:bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>
            )}

            {/* Buttons */}
            <div className="flex gap-4 pt-6">
              {currentStep > 1 && (
                <AnimatedButton
                  variant="secondary"
                  onClick={() => setCurrentStep(currentStep - 1)}
                  className="flex-1"
                >
                  Previous
                </AnimatedButton>
              )}

              <AnimatedButton
                variant="primary"
                type="submit"
                loading={loading}
                className="flex-1"
              >
                {currentStep === 4 ? 'Complete Registration' : 'Next'}
              </AnimatedButton>
            </div>
          </form>
        </GlassContainer>

        {/* Terms */}
        <p className="text-center text-gray-600 dark:text-gray-400 text-sm mt-6">
          By signing up, you agree to our{' '}
          <a href="#" className="text-purple-600 dark:text-purple-400 font-semibold hover:underline">
            Terms of Service
          </a>{' '}
          and{' '}
          <a href="#" className="text-purple-600 dark:text-purple-400 font-semibold hover:underline">
            Privacy Policy
          </a>
        </p>
      </div>
    </div>
  );
}

