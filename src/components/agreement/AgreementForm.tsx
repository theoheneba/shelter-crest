import { useState, useRef } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { emailService } from '../../services/emailService';
import Button from '../ui/Button';
import { FileText, Download, Send } from 'lucide-react';

interface AgreementFormProps {
  applicationData: any;
  onComplete: () => void;
}

const AgreementForm = ({ applicationData, onComplete }: AgreementFormProps) => {
  const { user } = useAuth();
  const [signature, setSignature] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [lastX, setLastX] = useState(0);
  const [lastY, setLastY] = useState(0);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    setIsDrawing(true);
    const rect = canvas.getBoundingClientRect();
    const x = ('touches' in e) ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = ('touches' in e) ? e.touches[0].clientY - rect.top : e.clientY - rect.top;
    setLastX(x);
    setLastY(y);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = ('touches' in e) ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = ('touches' in e) ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(x, y);
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.stroke();

    setLastX(x);
    setLastY(y);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    if (canvasRef.current) {
      setSignature(canvasRef.current.toDataURL());
    }
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        setSignature('');
      }
    }
  };

  const handleSubmit = async () => {
    if (!signature) {
      alert('Please sign the agreement before submitting.');
      return;
    }

    setIsSubmitting(true);
    try {
      // Generate PDF with signature
      const agreementPdf = await generateAgreementPdf(signature, applicationData);

      // Send emails
      await Promise.all([
        emailService.sendAgreementEmail(user?.email || '', agreementPdf),
        emailService.sendAdminNotification(agreementPdf, {
          firstName: user?.firstName,
          lastName: user?.lastName,
          email: user?.email,
          applicationId: applicationData.id
        })
      ]);

      onComplete();
    } catch (error) {
      console.error('Error submitting agreement:', error);
      alert('Failed to submit agreement. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Rental Assistance Agreement</h2>

      <div className="prose max-w-none mb-8">
        <h3>Terms and Conditions</h3>
        <p>This agreement is made between ShelterCrest ("the Company") and {user?.firstName} {user?.lastName} ("the Tenant").</p>

        <h4>1. Assistance Details</h4>
        <ul>
          <li>Monthly Rent Amount: GH₵ {applicationData.monthlyRent}</li>
          <li>Deposit Amount: GH₵ {applicationData.depositAmount}</li>
          <li>Lease Period: {new Date(applicationData.leaseStartDate).toLocaleDateString()} to {new Date(applicationData.leaseEndDate).toLocaleDateString()}</li>
        </ul>

        <h4>2. Payment Terms</h4>
        <p>The Tenant agrees to make monthly payments according to the established payment schedule. Payments are due on the 28th of each month.</p>

        <h4>3. Late Payment Policy</h4>
        <ul>
          <li>4th-10th: 10% penalty</li>
          <li>11th-18th: 15% penalty</li>
          <li>19th-25th: 25% penalty</li>
        </ul>

        <h4>4. Tenant Responsibilities</h4>
        <p>The Tenant agrees to:</p>
        <ul>
          <li>Maintain timely payments</li>
          <li>Notify the Company of any changes in employment or income</li>
          <li>Comply with all lease terms and conditions</li>
        </ul>
      </div>

      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-4">Digital Signature</h3>
        <div className="border-2 border-gray-300 rounded-lg p-4">
          <canvas
            ref={canvasRef}
            width={400}
            height={200}
            className="border border-gray-200 rounded w-full touch-none"
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseOut={stopDrawing}
            onTouchStart={startDrawing}
            onTouchMove={draw}
            onTouchEnd={stopDrawing}
          />
          <div className="mt-4 flex justify-between">
            <Button
              variant="outline"
              size="sm"
              onClick={clearSignature}
            >
              Clear Signature
            </Button>
            <div className="text-sm text-gray-500">
              Sign using mouse or touch
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <Button
          variant="outline"
          leftIcon={<Download size={18} />}
          onClick={() => {/* Handle preview/download */}}
        >
          Preview Agreement
        </Button>
        <Button
          onClick={handleSubmit}
          isLoading={isSubmitting}
          disabled={!signature || isSubmitting}
          leftIcon={<Send size={18} />}
        >
          Sign & Submit
        </Button>
      </div>
    </div>
  );
};

export default AgreementForm;