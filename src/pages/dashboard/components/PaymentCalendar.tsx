import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Button from '../../../components/ui/Button';
import { addMonths, subMonths, format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, isToday } from 'date-fns';

// Mock payment data for the calendar
const mockPayments = [
  { date: '2025-07-15', amount: 1200, status: 'upcoming' },
  { date: '2025-06-15', amount: 1200, status: 'completed' },
  { date: '2025-05-15', amount: 1200, status: 'completed' },
  { date: '2025-04-15', amount: 1200, status: 'completed' },
];

const PaymentCalendar = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  
  const prevMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };
  
  const nextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };
  
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd });
  
  // Get payment for a specific day
  const getPaymentForDay = (day: Date) => {
    return mockPayments.find(payment => 
      isSameDay(new Date(payment.date), day)
    );
  };
  
  const renderHeader = () => {
    return (
      <div className="flex items-center justify-between mb-4">
        <Button variant="outline" size="sm" onClick={prevMonth}>
          <ChevronLeft size={16} />
        </Button>
        <h2 className="text-lg font-semibold">
          {format(currentMonth, 'MMMM yyyy')}
        </h2>
        <Button variant="outline" size="sm" onClick={nextMonth}>
          <ChevronRight size={16} />
        </Button>
      </div>
    );
  };
  
  const renderDays = () => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    
    return (
      <div className="grid grid-cols-7 gap-1 mb-2">
        {days.map(day => (
          <div key={day} className="text-center text-xs font-medium text-gray-500 py-2">
            {day}
          </div>
        ))}
      </div>
    );
  };
  
  const renderCells = () => {
    const dateFormat = 'd';
    const rows = [];
    
    let days = [];
    let day = monthStart;
    let formattedDate = '';
    
    // Create blank cells for days before the start of the month
    const startDay = monthStart.getDay();
    if (startDay !== 0) {
      for (let i = 0; i < startDay; i++) {
        days.push(
          <div key={`empty-${i}`} className="h-16 border border-gray-100 bg-gray-50 opacity-50"></div>
        );
      }
    }
    
    // Fill in the days of the current month
    while (day <= monthEnd) {
      formattedDate = format(day, dateFormat);
      const cloneDay = day;
      const payment = getPaymentForDay(day);
      
      days.push(
        <div
          key={day.toString()}
          className={`relative h-16 border border-gray-200 p-1 transition-all duration-200 ${
            isToday(day) ? 'bg-primary-50 border-primary-500' : ''
          } ${payment ? 'hover:bg-gray-100 cursor-pointer' : ''}`}
        >
          <div className={`text-right text-sm ${
            isToday(day) ? 'font-bold text-primary-800' : ''
          }`}>
            {formattedDate}
          </div>
          
          {payment && (
            <div className={`mt-1 p-1 text-xs rounded-md ${
              payment.status === 'upcoming' 
                ? 'bg-blue-100 text-blue-800' 
                : 'bg-green-100 text-green-800'
            }`}>
              ${payment.amount}
            </div>
          )}
        </div>
      );
      
      day = new Date(day.getTime() + 24 * 60 * 60 * 1000); // Add a day
    }
    
    rows.push(
      <div key="days" className="grid grid-cols-7 gap-1">
        {days}
      </div>
    );
    
    return rows;
  };
  
  return (
    <div className="payment-calendar">
      {renderHeader()}
      {renderDays()}
      {renderCells()}
      
      <div className="mt-4 flex items-center justify-center space-x-4 text-sm">
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-green-500 mr-1"></div>
          <span>Completed</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-blue-500 mr-1"></div>
          <span>Upcoming</span>
        </div>
      </div>
    </div>
  );
};

export default PaymentCalendar;