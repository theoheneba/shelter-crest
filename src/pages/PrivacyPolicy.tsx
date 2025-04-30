import { Lock } from 'lucide-react';

const PrivacyPolicy = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-primary-100 text-primary-800 mb-4">
          <Lock size={32} />
        </div>
        <h1 className="text-3xl font-bold text-gray-900">Privacy Policy</h1>
        <p className="mt-4 text-gray-600">Last updated: April 26, 2025</p>
      </div>

      <div className="prose max-w-none">
        <h2>1. Introduction</h2>
        <p>
          At ShelterCrest, we take your privacy seriously. This Privacy Policy explains how we collect,
          use, disclose, and safeguard your information when you use our services.
        </p>

        <h2>2. Information We Collect</h2>
        <h3>2.1 Personal Information</h3>
        <p>We collect information that you provide directly to us, including:</p>
        <ul>
          <li>Name and contact information</li>
          <li>Financial information</li>
          <li>Employment details</li>
          <li>Government-issued identification</li>
          <li>Banking information</li>
        </ul>

        <h3>2.2 Automatically Collected Information</h3>
        <p>When you use our services, we automatically collect:</p>
        <ul>
          <li>Device information</li>
          <li>Log data</li>
          <li>Usage information</li>
          <li>Location data</li>
        </ul>

        <h2>3. How We Use Your Information</h2>
        <p>We use the collected information for:</p>
        <ul>
          <li>Processing your applications</li>
          <li>Facilitating payments</li>
          <li>Verifying your identity</li>
          <li>Communicating with you</li>
          <li>Improving our services</li>
          <li>Legal compliance</li>
        </ul>

        <h2>4. Information Sharing</h2>
        <p>We may share your information with:</p>
        <ul>
          <li>Service providers</li>
          <li>Financial institutions</li>
          <li>Legal authorities when required</li>
          <li>Business partners with your consent</li>
        </ul>

        <h2>5. Data Security</h2>
        <p>
          We implement appropriate technical and organizational measures to protect your personal information, including:
        </p>
        <ul>
          <li>Encryption of sensitive data</li>
          <li>Regular security assessments</li>
          <li>Access controls</li>
          <li>Employee training</li>
        </ul>

        <h2>6. Your Rights</h2>
        <p>You have the right to:</p>
        <ul>
          <li>Access your personal information</li>
          <li>Correct inaccurate data</li>
          <li>Request deletion of your data</li>
          <li>Restrict processing</li>
          <li>Data portability</li>
          <li>Object to processing</li>
        </ul>

        <h2>7. Data Retention</h2>
        <p>
          We retain your personal information for as long as necessary to:
        </p>
        <ul>
          <li>Provide our services</li>
          <li>Comply with legal obligations</li>
          <li>Resolve disputes</li>
          <li>Enforce agreements</li>
        </ul>

        <h2>8. Children's Privacy</h2>
        <p>
          Our services are not intended for individuals under 18 years of age. We do not knowingly
          collect personal information from children.
        </p>

        <h2>9. Changes to This Policy</h2>
        <p>
          We may update this Privacy Policy from time to time. We will notify you of any changes by
          posting the new Privacy Policy on this page and updating the "Last updated" date.
        </p>

        <h2>10. Contact Us</h2>
        <p>
          If you have any questions about this Privacy Policy, please contact us at:
        </p>
        <ul>
          <li>Email: privacy@sheltercrest.org</li>
          <li>Phone: +233 55 123 4567</li>
          <li>Address: 123 Business Avenue, Accra, Ghana</li>
        </ul>
      </div>
    </div>
  );
};

export default PrivacyPolicy;