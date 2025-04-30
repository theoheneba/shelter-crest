import { Shield } from 'lucide-react';

const TermsAndConditions = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-primary-100 text-primary-800 mb-4">
          <Shield size={32} />
        </div>
        <h1 className="text-3xl font-bold text-gray-900">Terms and Conditions</h1>
        <p className="mt-4 text-gray-600">Last updated: April 26, 2025</p>
      </div>

      <div className="prose max-w-none">
        <h2>1. Introduction</h2>
        <p>
          Welcome to ShelterCrest. These terms and conditions outline the rules and regulations for the use of our services.
          By accessing this website and using our services, we assume you accept these terms and conditions in full.
        </p>

        <h2>2. Service Description</h2>
        <p>
          ShelterCrest provides a platform for rental assistance and financial support for housing needs. Our services include:
        </p>
        <ul>
          <li>Rent payment assistance</li>
          <li>Document verification</li>
          <li>Payment processing</li>
          <li>Financial assessment</li>
        </ul>

        <h2>3. Eligibility</h2>
        <p>
          To be eligible for our services, users must:
        </p>
        <ul>
          <li>Be at least 18 years of age</li>
          <li>Have valid identification</li>
          <li>Meet income requirements</li>
          <li>Provide accurate and truthful information</li>
        </ul>

        <h2>4. User Obligations</h2>
        <p>
          Users of our service agree to:
        </p>
        <ul>
          <li>Provide accurate and complete information</li>
          <li>Maintain the security of their account</li>
          <li>Comply with payment schedules</li>
          <li>Update personal information as needed</li>
        </ul>

        <h2>5. Payment Terms</h2>
        <p>
          Our payment terms include:
        </p>
        <ul>
          <li>Regular payment schedule on the 28th of each month</li>
          <li>Late payment penalties as outlined in the agreement</li>
          <li>Processing fees where applicable</li>
          <li>Refund policies for security deposits</li>
        </ul>

        <h2>6. Privacy and Data Protection</h2>
        <p>
          We are committed to protecting your privacy. Our privacy policy outlines:
        </p>
        <ul>
          <li>How we collect and use your information</li>
          <li>Data security measures</li>
          <li>Third-party data sharing policies</li>
          <li>Your rights regarding your personal data</li>
        </ul>

        <h2>7. Termination</h2>
        <p>
          We reserve the right to terminate service:
        </p>
        <ul>
          <li>For violation of these terms</li>
          <li>For providing false information</li>
          <li>For payment default</li>
          <li>At our discretion with notice</li>
        </ul>

        <h2>8. Limitation of Liability</h2>
        <p>
          ShelterCrest shall not be liable for:
        </p>
        <ul>
          <li>Indirect or consequential losses</li>
          <li>Third-party actions</li>
          <li>Force majeure events</li>
          <li>User negligence</li>
        </ul>

        <h2>9. Changes to Terms</h2>
        <p>
          We reserve the right to modify these terms at any time. Users will be notified of significant changes.
          Continued use of our services constitutes acceptance of modified terms.
        </p>

        <h2>10. Contact Information</h2>
        <p>
          For questions about these terms, contact us at:
        </p>
        <ul>
          <li>Email: legal@sheltercrest.org</li>
          <li>Phone: +233 55 123 4567</li>
          <li>Address: 123 Business Avenue, Accra, Ghana</li>
        </ul>
      </div>
    </div>
  );
};

export default TermsAndConditions;