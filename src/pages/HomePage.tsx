import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  CheckCircle, ArrowRight, Home, DollarSign, FileCheck, Lock, Shield, Users, Star, ChevronLeft, ChevronRight, 
  CreditCard, FileText, Briefcase, Touchpad as Couch, Tv, Smartphone, Building, Calendar, Clock
} from 'lucide-react';
import Button from '../components/ui/Button';

// Testimonials data
const testimonials = [
  {
    id: 1,
    name: "Sarah Johnson",
    role: "Tenant",
    image: "https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg",
    content: "ShelterCrest made it incredibly easy to manage my rent payments. Their support team is amazing!"
  },
  {
    id: 2,
    name: "Michael Chen",
    role: "Property Owner",
    image: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg",
    content: "The platform has streamlined our rental process. Highly recommended for property owners."
  },
  {
    id: 3,
    name: "Emily Brown",
    role: "Tenant",
    image: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg",
    content: "Thanks to ShelterCrest, I was able to find affordable housing that fits my budget."
  }
];

const HomePage = () => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [autoplay, setAutoplay] = useState(true);

  useEffect(() => {
    if (!autoplay) return;

    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => 
        prev === testimonials.length - 1 ? 0 : prev + 1
      );
    }, 5000);

    return () => clearInterval(interval);
  }, [autoplay]);

  const nextTestimonial = () => {
    setAutoplay(false);
    setCurrentTestimonial((prev) => 
      prev === testimonials.length - 1 ? 0 : prev + 1
    );
  };

  const prevTestimonial = () => {
    setAutoplay(false);
    setCurrentTestimonial((prev) => 
      prev === 0 ? testimonials.length - 1 : prev - 1
    );
  };

  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700 text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg')] bg-cover bg-center opacity-10"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-primary-900/90 via-primary-800/80 to-primary-700/70"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-5xl sm:text-6xl font-bold leading-tight mb-6">
                Secure Your Dream Home Today
              </h1>
              <p className="text-xl text-primary-100 mb-8 leading-relaxed">
                ShelterCrest helps you achieve housing stability through innovative financial solutions
                and flexible payment options. Get started with our rent assistance and Buy Now Pay Later program.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/eligibility">
                  <Button 
                    size="lg" 
                    variant="secondary"
                    rightIcon={<ArrowRight size={20} />}
                    className="bg-white text-primary-900 hover:bg-primary-50"
                  >
                    Check Eligibility
                  </Button>
                </Link>
                <Link to="/register">
                  <Button 
                    size="lg" 
                    variant="outline" 
                    className="border-2 border-white text-white hover:bg-white/10"
                  >
                    Create Account
                  </Button>
                </Link>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="hidden lg:block"
            >
              <div className="relative">
                <div className="absolute -inset-4 bg-white/5 rounded-2xl backdrop-blur-sm"></div>
                <div className="relative bg-white/10 rounded-xl p-6 backdrop-blur-md">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white/10 p-4 rounded-lg backdrop-blur">
                      <Building className="h-8 w-8 text-primary-200 mb-2" />
                      <h3 className="font-semibold">Rent Assistance</h3>
                      <p className="text-sm text-primary-200">Flexible payment plans</p>
                    </div>
                    <div className="bg-white/10 p-4 rounded-lg backdrop-blur">
                      <Calendar className="h-8 w-8 text-primary-200 mb-2" />
                      <h3 className="font-semibold">Quick Approval</h3>
                      <p className="text-sm text-primary-200">24-48 hour process</p>
                    </div>
                    <div className="bg-white/10 p-4 rounded-lg backdrop-blur">
                      <Shield className="h-8 w-8 text-primary-200 mb-2" />
                      <h3 className="font-semibold">Secure Platform</h3>
                      <p className="text-sm text-primary-200">Protected payments</p>
                    </div>
                    <div className="bg-white/10 p-4 rounded-lg backdrop-blur">
                      <Users className="h-8 w-8 text-primary-200 mb-2" />
                      <h3 className="font-semibold">5000+ Users</h3>
                      <p className="text-sm text-primary-200">Trust our service</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center"
          >
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-1.5 h-3 bg-white/50 rounded-full mt-2"
            />
          </motion.div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-4xl font-bold text-gray-900 mb-4"
            >
              How It Works
            </motion.h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our simple process helps you get the support you need in just a few steps.
            </p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-8">
            {[
              {
                icon: FileText,
                title: "1. Apply Online",
                description: "Complete our simple online application form with your details and requirements.",
                delay: 0
              },
              {
                icon: FileCheck,
                title: "2. Quick Verification",
                description: "We verify your employment and income details within 24-48 hours.",
                delay: 0.2
              },
              {
                icon: CheckCircle,
                title: "3. Get Approved",
                description: "Receive your approval and choose your payment schedule.",
                delay: 0.4
              },
              {
                icon: Home,
                title: "4. Move In",
                description: "We handle the payments while you focus on settling into your new home.",
                delay: 0.6
              }
            ].map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: step.delay }}
                className="relative text-center"
              >
                <div className="inline-flex items-center justify-center h-20 w-20 rounded-full bg-primary-100 text-primary-800 mb-6">
                  <step.icon size={40} />
                </div>
                <h3 className="text-xl font-semibold mb-4">{step.title}</h3>
                <p className="text-gray-600 leading-relaxed">
                  {step.description}
                </p>
                {index < 3 && (
                  <div className="hidden md:block absolute top-24 left-full w-full h-0.5 bg-primary-100 -translate-y-1/2">
                    <div className="absolute right-0 -top-1.5 h-4 w-4 bg-primary-100 rounded-full" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Buy Now Pay Later Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-4xl font-bold text-gray-900 mb-4"
            >
              Buy Now Pay Later
            </motion.h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Get the home essentials you need today and pay over time with our flexible payment plans.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Couch,
                title: "Furniture",
                description: "Furnish your home with quality furniture and spread the cost over time.",
                items: ["Beds & Mattresses", "Sofas & Chairs", "Dining Sets"],
                delay: 0
              },
              {
                icon: Tv,
                title: "Appliances",
                description: "Get essential home appliances with flexible payment options.",
                items: ["Refrigerators", "Washing Machines", "Air Conditioners"],
                delay: 0.2
              },
              {
                icon: Smartphone,
                title: "Electronics",
                description: "Stay connected with the latest electronics and manageable payments.",
                items: ["Smart TVs", "Laptops", "Mobile Devices"],
                delay: 0.4
              }
            ].map((category, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: category.delay }}
                className="bg-white rounded-2xl shadow-lg p-8 transform hover:-translate-y-1 transition-transform duration-300"
              >
                <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-primary-100 text-primary-800 mb-6">
                  <category.icon size={32} />
                </div>
                <h3 className="text-xl font-semibold mb-4">{category.title}</h3>
                <p className="text-gray-600 mb-6">{category.description}</p>
                <ul className="space-y-3">
                  {category.items.map((item, itemIndex) => (
                    <li key={itemIndex} className="flex items-center text-gray-700">
                      <CheckCircle size={16} className="text-green-500 mr-2" />
                      {item}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Verification Process Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-4xl font-bold text-gray-900 mb-4"
            >
              Our Verification Process
            </motion.h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We ensure a secure and thorough verification process to protect all parties involved.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Briefcase,
                title: "Employment Verification",
                description: "We verify your employment status and income directly with your employer through secure channels.",
                items: ["Employment contract", "Salary slips", "Work ID"],
                delay: 0
              },
              {
                icon: CreditCard,
                title: "Financial Assessment",
                description: "We review your financial history and current status to ensure affordable payment plans.",
                items: ["Bank statements", "Credit history", "Income assessment"],
                delay: 0.2
              },
              {
                icon: Shield,
                title: "Identity Verification",
                description: "We use secure methods to verify your identity and protect against fraud.",
                items: ["Government ID", "Proof of address", "Biometric verification"],
                delay: 0.4
              }
            ].map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: step.delay }}
                className="bg-gray-50 rounded-2xl p-8"
              >
                <div className="flex items-start mb-6">
                  <div className="p-3 bg-primary-100 rounded-lg">
                    <step.icon className="h-8 w-8 text-primary-800" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-xl font-semibold">{step.title}</h3>
                    <p className="text-gray-600 mt-2">{step.description}</p>
                  </div>
                </div>
                <ul className="space-y-3">
                  {step.items.map((item, itemIndex) => (
                    <li key={itemIndex} className="flex items-center text-gray-700">
                      <CheckCircle size={16} className="text-green-500 mr-2" />
                      {item}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-4xl font-bold text-gray-900 mb-4"
            >
              What Our Users Say
            </motion.h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Hear from people who have benefited from our services.
            </p>
          </div>

          <div className="relative max-w-4xl mx-auto">
            <div className="overflow-hidden">
              <motion.div
                key={currentTestimonial}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="flex flex-col items-center"
              >
                <div className="w-24 h-24 rounded-full overflow-hidden mb-6 ring-4 ring-primary-100">
                  <img
                    src={testimonials[currentTestimonial].image}
                    alt={testimonials[currentTestimonial].name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <blockquote className="text-2xl text-gray-900 text-center max-w-2xl mb-6 font-light italic">
                  "{testimonials[currentTestimonial].content}"
                </blockquote>
                <div className="text-center">
                  <p className="text-lg font-semibold text-gray-900">{testimonials[currentTestimonial].name}</p>
                  <p className="text-primary-600">{testimonials[currentTestimonial].role}</p>
                </div>
              </motion.div>
            </div>

            <button
              onClick={prevTestimonial}
              className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-3 shadow-lg hover:bg-gray-50 transition-colors"
            >
              <ChevronLeft size={24} />
            </button>
            <button
              onClick={nextTestimonial}
              className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-3 shadow-lg hover:bg-gray-50 transition-colors"
            >
              <ChevronRight size={24} />
            </button>
          </div>

          <div className="flex justify-center mt-8 space-x-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setAutoplay(false);
                  setCurrentTestimonial(index);
                }}
                className={`w-3 h-3 rounded-full transition-colors ${
                  index === currentTestimonial ? 'bg-primary-600' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-primary-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { value: "5000+", label: "Happy Tenants" },
              { value: "GH₵ 10M+", label: "Rent Assistance" },
              { value: "98%", label: "Success Rate" },
              { value: "24/7", label: "Support" }
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-5xl font-bold mb-2">{stat.value}</div>
                <div className="text-primary-200 text-lg">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-primary-800 via-primary-900 to-primary-950 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg')] bg-cover bg-center opacity-10"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-primary-800/90 via-primary-900/90 to-primary-950/90"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-4xl font-bold mb-6">Ready to Get Started?</h2>
            <p className="text-xl mb-8 max-w-3xl mx-auto text-primary-100">
              Take the first step toward housing stability by checking your eligibility today.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link to="/eligibility">
                <Button 
                  size="lg" 
                  variant="secondary"
                  className="bg-white text-primary-900 hover:bg-primary-50"
                >
                  Check Eligibility
                </Button>
              </Link>
              <Link to="/login">
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-2 border-white text-white hover:bg-white/10"
                >
                  Sign In
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;