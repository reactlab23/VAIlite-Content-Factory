'use client';

import { useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { 
  Radar, 
  FileEdit, 
  Bot, 
  ShieldCheck, 
  Rocket, 
  Star, 
  Phone, 
  Mail, 
  Send
} from 'lucide-react';
import { 
  Button } from '@/components/ui/button';
import { 
  Card, 
  CardContent 
} from '@/components/ui/card';
import { 
  Input } from '@/components/ui/input';
import { 
  Textarea } from '@/components/ui/textarea';
import { 
  Label } from '@/components/ui/label';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { ConsultationModal } from '@/components/ConsultationModal';

// Import translations
import enTranslations from '@/locales/en/common.json';
import ruTranslations from '@/locales/ru/common.json';

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0 }
};

const staggerChildren = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

type Translations = typeof enTranslations;

export default function VAIliteLandingPage() {
  const [language, setLanguage] = useState<'en' | 'ru'>('ru');
  const [activeModule, setActiveModule] = useState<number | null>(null);
  const [selectedPlan, setSelectedPlan] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    plan: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [isConsultationModalOpen, setIsConsultationModalOpen] = useState(false);

  const heroRef = useRef(null);
  const modulesRef = useRef(null);
  const pricingRef = useRef(null);
  const testimonialsRef = useRef(null);
  const contactRef = useRef(null);

  const heroInView = useInView(heroRef, { once: true, amount: 0.3 });
  const modulesInView = useInView(modulesRef, { once: true, amount: 0.1 });
  const pricingInView = useInView(pricingRef, { once: true, amount: 0.1 });
  const testimonialsInView = useInView(testimonialsRef, { once: true, amount: 0.1 });
  const contactInView = useInView(contactRef, { once: true, amount: 0.1 });

  // Get translations based on current language
  const t: Translations = language === 'ru' ? ruTranslations : enTranslations;

  const moduleIcons = [
    <Radar key="radar" className="w-16 h-16" />,
    <FileEdit key="fileedit" className="w-16 h-16" />,
    <Bot key="bot" className="w-16 h-16" />,
    <ShieldCheck key="shield" className="w-16 h-16" />,
    <Rocket key="rocket" className="w-16 h-16" />
  ];

  const testimonials = t.testimonials.items.map((item, index) => ({
    id: index + 1,
    name: item.name,
    role: item.role,
    avatar: [
      'https://sfile.chatglm.cn/images-ppt/362ac986a5b8.jpg',
      'https://sfile.chatglm.cn/images-ppt/07d468ab4941.jpg',
      'https://sfile.chatglm.cn/images-ppt/a8025c485fb8.jpg'
    ][index],
    content: item.content,
    rating: item.rating
  }));

  const pricingPlans = [
    {
      title: t.pricing.plans.light.title,
      price: t.pricing.plans.light.price,
      period: t.pricing.period,
      features: t.pricing.plans.light.features,
      featured: false
    },
    {
      title: t.pricing.plans.start.title,
      price: t.pricing.plans.start.price,
      period: t.pricing.period,
      features: t.pricing.plans.start.features,
      featured: true
    },
    {
      title: t.pricing.plans.pro.title,
      price: t.pricing.plans.pro.price,
      period: t.pricing.period,
      features: t.pricing.plans.pro.features,
      featured: false
    }
  ];

  // Animation variant for checkmark appearance
  const checkmarkVariants = {
    hidden: { 
      opacity: 0, 
      scale: 0, 
      rotate: -180 
    },
    visible: { 
      opacity: 1, 
      scale: 1, 
      rotate: 0,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 15
      }
    }
  };

  // Animation variant for text typewriter effect
  const textVariants = {
    hidden: { 
      width: 0,
      opacity: 0
    },
    visible: (i: number) => ({
      width: '100%',
      opacity: 1,
      transition: {
        duration: 0.8,
        delay: i * 0.15,
        ease: "easeOut"
      }
    })
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleModuleClick = (moduleId: number) => {
    setActiveModule(activeModule === moduleId ? null : moduleId);
  };

  const handlePlanSelect = (plan: string) => {
    setSelectedPlan(plan);
    setFormData(prev => ({ ...prev, plan }));
    scrollToSection('contact');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage(null);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSubmitMessage({
          type: 'success',
          text: t.contact.success
        });
        setFormData({
          name: '',
          email: '',
          phone: '',
          company: '',
          plan: '',
          message: ''
        });
        setSelectedPlan('');
      } else {
        setSubmitMessage({
          type: 'error',
          text: t.contact.error
        });
      }
    } catch (error) {
      setSubmitMessage({
        type: 'error',
        text: t.contact.error
      });
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setSubmitMessage(null), 5000);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#F8F8F8] overflow-x-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute w-[200%] h-[200%] top-[-50%] left-[-50%] bg-gradient-to-br from-[rgba(212,175,55,0.05)] via-transparent to-[rgba(15,25,41,0.8)] animate-spin-slow" />
        {[...Array(9)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-[rgba(212,175,55,0.3)] animate-float-up"
            style={{
              left: `${(i + 1) * 10}%`,
              animationDelay: `${i * 2}s`,
              animationDuration: `${20 + (i % 2) * 5}s`
            }}
          />
        ))}
      </div>

      {/* Fixed Language Switcher */}
      <div className="fixed top-4 right-4 z-50">
        <LanguageSwitcher 
          currentLanguage={language}
          onLanguageChange={(lang) => setLanguage(lang as 'en' | 'ru')}
        />
      </div>

      {/* Hero Section */}
      <header 
        ref={heroRef}
        className="relative z-10 bg-gradient-to-b from-[rgba(10,10,10,0.95)] to-[rgba(10,10,10,0.8)] py-[100px] overflow-hidden"
      >
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center opacity-10"
          style={{ backgroundImage: 'url(https://sfile.chatglm.cn/images-ppt/438662169c70.jpg)' }}
        />
        <div className="container mx-auto px-5 relative z-10">
          <motion.div
            initial="hidden"
            animate={heroInView ? "visible" : "hidden"}
            variants={fadeInUp}
            transition={{ duration: 0.8 }}
            className="text-center max-w-5xl mx-auto"
          >
            <motion.h1
              animate={{ 
                textShadow: [
                  '0 0 10px rgba(212,175,55,0.4), 0 0 20px rgba(212,175,55,0.4)',
                  '0 0 20px rgba(212,175,55,0.4), 0 0 30px rgba(212,175,55,0.4), 0 0 40px rgba(212,175,55,0.4)',
                  '0 0 10px rgba(212,175,55,0.4), 0 0 20px rgba(212,175,55,0.4)'
                ]
              }}
              transition={{ duration: 3, repeat: Infinity }}
              className="text-5xl md:text-6xl lg:text-[56px] font-black text-[#D4AF37] uppercase tracking-[4px] mb-5"
            >
              {t.hero.title}
            </motion.h1>
            <p className="text-2xl md:text-3xl text-[#E8D5A3] italic mb-8">
              {t.hero.tagline}
            </p>
            <p className="text-lg md:text-xl text-[#F8F8F8] mb-10 max-w-3xl mx-auto leading-relaxed">
              {t.hero.subtitle}
            </p>
            <Button
              onClick={() => setIsConsultationModalOpen(true)}
              size="lg"
              className="px-10 py-6 bg-gradient-to-r from-[#D4AF37] to-[#AA8C2C] hover:from-[#D4AF37] hover:to-[#AA8C2C] text-black font-bold text-base uppercase tracking-[2px] rounded-md shadow-[0_10px_30px_rgba(212,175,55,0.4)] hover:shadow-[0_15px_40px_rgba(212,175,55,0.4)] hover:-translate-y-1 transition-all duration-300"
            >
              {t.hero.cta}
            </Button>
          </motion.div>
        </div>
      </header>

      {/* Modules Section */}
      <section 
        id="modules"
        ref={modulesRef}
        className="relative z-10 bg-gradient-to-b from-[rgba(10,10,10,0.9)] to-[rgba(15,25,41,0.9)] py-[100px] overflow-hidden"
      >
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center opacity-5"
          style={{ backgroundImage: 'url(https://sfile.chatglm.cn/images-ppt/7683b264ab35.jpg)' }}
        />
        <div className="container mx-auto px-5 relative z-10 max-w-6xl">
          <motion.h2
            initial="hidden"
            animate={modulesInView ? "visible" : "hidden"}
            variants={fadeInUp}
            className="text-5xl md:text-[42px] text-[#D4AF37] text-center font-bold mb-[60px] relative after:content-[''] after:block after:w-[120px] after:h-[3px] after:bg-gradient-to-r after:from-transparent after:via-[#D4AF37] after:to-transparent after:mx-auto after:mt-5"
          >
            {t.modules.title}
          </motion.h2>
          <motion.div
            initial="hidden"
            animate={modulesInView ? "visible" : "hidden"}
            variants={staggerChildren}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {t.modules.items.map((module, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
              >
                <Card
                  onClick={() => handleModuleClick(index)}
                  className={`relative bg-[rgba(15,25,41,0.8)] border-[1px] border-[rgba(212,175,55,0.2)] rounded-xl p-9 cursor-pointer transition-all duration-500 backdrop-blur-md hover:-translate-y-4 hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)] hover:border-[#D4AF37] overflow-hidden group ${activeModule === index ? 'border-[#D4AF37] shadow-[0_20px_40px_rgba(212,175,55,0.2)]' : ''}`}
                >
                  <div className={`absolute left-0 top-0 w-1.5 bg-gradient-to-b from-[#D4AF37] to-[#AA8C2C] transition-all duration-500 ${activeModule === index ? 'h-full' : 'h-0'}`} />
                  <div className="text-[#D4AF37] mb-6 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3">
                    {moduleIcons[index]}
                  </div>
                  <h3 className="text-2xl font-bold text-[#E8D5A3] mb-5">
                    {module.title}
                  </h3>
                  <div 
                    className={`overflow-hidden transition-all duration-600 ${
                      activeModule === index ? 'max-h-[500px] opacity-100 mt-4' : 'max-h-0 opacity-0'
                    }`}
                  >
                    <p className="text-base leading-relaxed text-[#F8F8F8]">
                      {module.content}
                    </p>
                  </div>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Pricing Section */}
      <section 
        id="pricing"
        ref={pricingRef}
        className="relative z-10 bg-gradient-to-b from-[rgba(15,25,41,0.9)] to-[rgba(10,10,10,0.95)] py-[100px] overflow-hidden"
      >
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center opacity-5"
          style={{ backgroundImage: 'url(https://sfile.chatglm.cn/images-ppt/f68ca351608f.jpg)' }}
        />
        <div className="container mx-auto px-5 relative z-10 max-w-6xl">
          <motion.h2
            initial="hidden"
            animate={pricingInView ? "visible" : "hidden"}
            variants={fadeInUp}
            className="text-5xl md:text-[42px] text-[#D4AF37] text-center font-bold mb-[60px] relative after:content-[''] after:block after:w-[120px] after:h-[3px] after:bg-gradient-to-r after:from-transparent after:via-[#D4AF37] after:to-transparent after:mx-auto after:mt-5"
          >
            {t.pricing.title}
          </motion.h2>
          <motion.div
            initial="hidden"
            animate={pricingInView ? "visible" : "hidden"}
            variants={staggerChildren}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center mb-[60px]"
          >
            {pricingPlans.map((plan, index) => (
              <motion.div
                key={plan.title}
                variants={fadeInUp}
                className="relative"
              >
                <Card
                  className={`relative bg-[rgba(10,10,10,0.9)] border-[1px] border-[rgba(212,175,55,0.2)] rounded-xl p-[50px_35px] text-center transition-all duration-500 backdrop-blur-md hover:-translate-y-4 hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)] hover:border-[#D4AF37] ${plan.featured ? 'border-2 border-[#D4AF37] scale-105 shadow-[0_15px_35px_rgba(212,175,55,0.15)] z-10' : ''}`}
                >
                  {plan.featured && (
                    <div className="absolute top-[-20px] left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#D4AF37] to-[#AA8C2C] text-black px-6 py-2 rounded-full font-bold text-sm uppercase shadow-[0_5px_15px_rgba(212,175,55,0.4)]">
                      {t.pricing.featured}
                    </div>
                  )}
                  <h3 className="text-3xl font-bold text-[#E8D5A3] mb-6">
                    {plan.title}
                  </h3>
                  <div className="text-5xl font-black text-[#D4AF37] mb-2.5">
                    {plan.price}
                  </div>
                  <p className="text-lg text-[#F8F8F8] font-medium mb-9">
                    {plan.period}
                  </p>
                  <ul className="text-left list-none mb-10 space-y-4.5">
                    {plan.features.map((feature, i) => (
                      <li 
                        key={i} 
                        className="text-base pl-9 relative text-[#F8F8F8] flex items-start"
                      >
                        <motion.span
                          initial="hidden"
                          animate={pricingInView ? "visible" : "hidden"}
                          variants={checkmarkVariants}
                          transition={{ delay: index * 0.2 + i * 0.15 }}
                          className="absolute left-0 top-0 text-[#D4AF37] font-bold text-lg flex-shrink-0"
                        >
                          ✓
                        </motion.span>
                        <motion.span
                          initial="hidden"
                          animate={pricingInView ? "visible" : "hidden"}
                          variants={textVariants}
                          custom={i}
                          transition={{ delay: index * 0.2 + i * 0.15 + 0.1 }}
                          className="overflow-hidden whitespace-nowrap"
                        >
                          <span className="inline-block">{feature}</span>
                        </motion.span>
                      </li>
                    ))}
                  </ul>
                  <Button
                    onClick={() => handlePlanSelect(plan.title)}
                    variant="outline"
                    className="w-full py-4 border-2 border-[#D4AF37] text-[#D4AF37] font-bold text-base uppercase tracking-[1px] rounded-md hover:bg-[#D4AF37] hover:text-black transition-all duration-400"
                  >
                    {t.pricing.select}
                  </Button>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section 
        id="testimonials"
        ref={testimonialsRef}
        className="relative z-10 bg-gradient-to-b from-[rgba(10,10,10,0.95)] to-[rgba(15,25,41,0.9)] py-[100px] overflow-hidden"
      >
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center opacity-5"
          style={{ backgroundImage: 'url(https://sfile.chatglm.cn/images-ppt/cc73c7cd0a2d.jpg)' }}
        />
        <div className="container mx-auto px-5 relative z-10 max-w-6xl">
          <motion.h2
            initial="hidden"
            animate={testimonialsInView ? "visible" : "hidden"}
            variants={fadeInUp}
            className="text-5xl md:text-[42px] text-[#D4AF37] text-center font-bold mb-[60px] relative after:content-[''] after:block after:w-[120px] after:h-[3px] after:bg-gradient-to-r after:from-transparent after:via-[#D4AF37] after:to-transparent after:mx-auto after:mt-5"
          >
            {t.testimonials.title}
          </motion.h2>
          <motion.div
            initial="hidden"
            animate={testimonialsInView ? "visible" : "hidden"}
            variants={staggerChildren}
            className="grid grid-cols-1 md:grid-cols-3 gap-10"
          >
            {testimonials.map((testimonial) => (
              <motion.div
                key={testimonial.id}
                variants={fadeInUp}
              >
                <Card className="relative bg-[rgba(15,25,41,0.8)] border-[1px] border-[rgba(212,175,55,0.2)] rounded-xl p-10 transition-all duration-500 backdrop-blur-md hover:-translate-y-3 hover:shadow-[0_20px_40px_rgba(0,0,0,0.3)] hover:border-[#D4AF37] flex flex-col">
                  <div className="flex items-center mb-6">
                    <img
                      src={testimonial.avatar}
                      alt={testimonial.name}
                      className="w-20 h-20 rounded-full border-3 border-[#D4AF37] mr-5 object-cover shadow-[0_5px_15px_rgba(0,0,0,0.3)]"
                    />
                    <div>
                      <h3 className="text-xl font-bold text-[#E8D5A3] mb-1.5">
                        {testimonial.name}
                      </h3>
                      <p className="text-sm text-[#F8F8F8] opacity-80 font-medium">
                        {testimonial.role}
                      </p>
                    </div>
                  </div>
                  <div className="relative italic text-base leading-relaxed text-[#F8F8F8] flex-grow">
                    <span className="absolute -top-5 -left-3 text-[60px] text-[rgba(212,175,55,0.3)] leading-none">"</span>
                    {testimonial.content}
                  </div>
                  <div className="text-[#D4AF37] text-xl mt-5 flex gap-1">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-6 h-6 fill-current" />
                    ))}
                  </div>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section 
        id="contact"
        ref={contactRef}
        className="relative z-10 bg-gradient-to-b from-[rgba(15,25,41,0.9)] to-[rgba(10,10,10,0.95)] py-[100px] text-center overflow-hidden"
      >
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center opacity-5"
          style={{ backgroundImage: 'url(https://sfile.chatglm.cn/images-ppt/438662169c70.jpg)' }}
        />
        <div className="container mx-auto px-5 relative z-10 max-w-4xl">
          <motion.h2
            initial="hidden"
            animate={contactInView ? "visible" : "hidden"}
            variants={fadeInUp}
            className="text-5xl md:text-[42px] text-[#D4AF37] text-center font-bold mb-[60px] relative after:content-[''] after:block after:w-[120px] after:h-[3px] after:bg-gradient-to-r after:from-transparent after:via-[#D4AF37] after:to-transparent after:mx-auto after:mt-5"
          >
            {t.contact.title}
          </motion.h2>
          <motion.div
            initial="hidden"
            animate={contactInView ? "visible" : "hidden"}
            variants={fadeInUp}
          >
            <Card className="relative bg-[rgba(10,10,10,0.9)] border-[1px] border-[rgba(212,175,55,0.2)] rounded-xl p-12 backdrop-blur-md max-w-2xl mx-auto">
              <form onSubmit={handleFormSubmit} className="space-y-6">
                <div className="text-left">
                  <Label htmlFor="name" className="block mb-2.5 font-semibold text-[#E8D5A3] text-base">
                    {t.contact.name}
                  </Label>
                  <Input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder={t.contact.namePlaceholder}
                    required
                    className="bg-[rgba(255,255,255,0.05)] border-[1px] border-[rgba(212,175,55,0.2)] rounded-md px-5 py-4 text-[#F8F8F8] text-base focus:border-[#D4AF37] focus:shadow-[0_0_15px_rgba(212,175,55,0.2)] focus:bg-[rgba(255,255,255,0.08)] transition-all duration-400"
                  />
                </div>

                <div className="text-left">
                  <Label htmlFor="email" className="block mb-2.5 font-semibold text-[#E8D5A3] text-base">
                    {t.contact.email}
                  </Label>
                  <Input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder={t.contact.emailPlaceholder}
                    required
                    className="bg-[rgba(255,255,255,0.05)] border-[1px] border-[rgba(212,175,55,0.2)] rounded-md px-5 py-4 text-[#F8F8F8] text-base focus:border-[#D4AF37] focus:shadow-[0_0_15px_rgba(212,175,55,0.2)] focus:bg-[rgba(255,255,255,0.08)] transition-all duration-400"
                  />
                </div>

                <div className="text-left">
                  <Label htmlFor="phone" className="block mb-2.5 font-semibold text-[#E8D5A3] text-base">
                    {t.contact.phone}
                  </Label>
                  <Input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder={t.contact.phonePlaceholder}
                    required
                    className="bg-[rgba(255,255,255,0.05)] border-[1px] border-[rgba(212,175,55,0.2)] rounded-md px-5 py-4 text-[#F8F8F8] text-base focus:border-[#D4AF37] focus:shadow-[0_0_15px_rgba(212,175,55,0.2)] focus:bg-[rgba(255,255,255,0.08)] transition-all duration-400"
                  />
                </div>

                <div className="text-left">
                  <Label htmlFor="company" className="block mb-2.5 font-semibold text-[#E8D5A3] text-base">
                    {t.contact.company}
                  </Label>
                  <Input
                    type="text"
                    id="company"
                    name="company"
                    value={formData.company}
                    onChange={handleInputChange}
                    placeholder={t.contact.companyPlaceholder}
                    className="bg-[rgba(255,255,255,0.05)] border-[1px] border-[rgba(212,175,55,0.2)] rounded-md px-5 py-4 text-[#F8F8F8] text-base focus:border-[#D4AF37] focus:shadow-[0_0_15px_rgba(212,175,55,0.2)] focus:bg-[rgba(255,255,255,0.08)] transition-all duration-400"
                  />
                </div>

                <div className="text-left">
                  <Label htmlFor="plan" className="block mb-2.5 font-semibold text-[#E8D5A3] text-base">
                    {t.contact.plan}
                  </Label>
                  <Input
                    type="text"
                    id="plan"
                    name="plan"
                    value={formData.plan}
                    onChange={handleInputChange}
                    placeholder={t.contact.planPlaceholder}
                    className="bg-[rgba(255,255,255,0.05)] border-[1px] border-[rgba(212,175,55,0.2)] rounded-md px-5 py-4 text-[#F8F8F8] text-base focus:border-[#D4AF37] focus:shadow-[0_0_15px_rgba(212,175,55,0.2)] focus:bg-[rgba(255,255,255,0.08)] transition-all duration-400"
                  />
                </div>

                <div className="text-left">
                  <Label htmlFor="message" className="block mb-2.5 font-semibold text-[#E8D5A3] text-base">
                    {t.contact.message}
                  </Label>
                  <Textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    placeholder={t.contact.messagePlaceholder}
                    rows={5}
                    className="bg-[rgba(255,255,255,0.05)] border-[1px] border-[rgba(212,175,55,0.2)] rounded-md px-5 py-4 text-[#F8F8F8] text-base focus:border-[#D4AF37] focus:shadow-[0_0_15px_rgba(212,175,55,0.2)] focus:bg-[rgba(255,255,255,0.08)] transition-all duration-400 resize-none"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 bg-gradient-to-r from-[#D4AF37] to-[#AA8C2C] hover:from-[#D4AF37] hover:to-[#AA8C2C] text-black font-bold text-base uppercase tracking-[2px] rounded-md shadow-[0_10px_20px_rgba(212,175,55,0.4)] hover:shadow-[0_15px_35px_rgba(212,175,55,0.4)] hover:-translate-y-1 transition-all duration-400"
                >
                  {isSubmitting ? (
                    <span>{t.contact.sending}</span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <Send className="w-5 h-5" />
                      {t.contact.submit}
                    </span>
                  )}
                </Button>

                {submitMessage && (
                  <div
                    className={`font-semibold mt-5 ${
                      submitMessage.type === 'success' ? 'text-[#00ff88]' : 'text-[#ff4444]'
                    }`}
                  >
                    {submitMessage.text}
                  </div>
                )}
              </form>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 bg-[#0A0A0A] py-12 text-center overflow-hidden">
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center opacity-5"
          style={{ backgroundImage: 'url(https://sfile.chatglm.cn/images-ppt/cc73c7cd0a2d.jpg)' }}
        />
        <div className="container mx-auto px-5 relative z-10">
          <div className="text-4xl font-black text-[#D4AF37] uppercase tracking-[3px] mb-6" style={{ textShadow: '0 0 15px rgba(212,175,55,0.4)' }}>
            VAIlite Content Factory
          </div>
          <div className="flex justify-center gap-6 mb-9">
            <a
              href="https://t.me/VadimCrypton"
              target="_blank"
              rel="noopener noreferrer"
              className="w-14 h-14 rounded-full bg-[rgba(212,175,55,0.1)] border-2 border-[#D4AF37] flex items-center justify-center text-[#D4AF37] transition-all duration-400 hover:bg-[#D4AF37] hover:text-black hover:-translate-y-1 hover:shadow-[0_10px_20px_rgba(212,175,55,0.3)]"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m22 2-7 20-4-9-9-4Z"/>
                <path d="M22 2 11 13"/>
              </svg>
            </a>
            <a
              href="tel:+79530991529"
              className="w-14 h-14 rounded-full bg-[rgba(212,175,55,0.1)] border-2 border-[#D4AF37] flex items-center justify-center text-[#D4AF37] transition-all duration-400 hover:bg-[#D4AF37] hover:text-black hover:-translate-y-1 hover:shadow-[0_10px_20px_rgba(212,175,55,0.3)]"
            >
              <Phone className="w-7 h-7" />
            </a>
            <a
              href="mailto:info@vailite.com"
              className="w-14 h-14 rounded-full bg-[rgba(212,175,55,0.1)] border-2 border-[#D4AF37] flex items-center justify-center text-[#D4AF37] transition-all duration-400 hover:bg-[#D4AF37] hover:text-black hover:-translate-y-1 hover:shadow-[0_10px_20px_rgba(212,175,55,0.3)]"
            >
              <Mail className="w-7 h-7" />
            </a>
          </div>
          <p className="text-[#F8F8F8] text-opacity-70 font-medium text-base">
            {t.footer.copyright}
          </p>
        </div>
      </footer>

      {/* Consultation Modal */}
      <ConsultationModal
        isOpen={isConsultationModalOpen}
        onClose={() => setIsConsultationModalOpen(false)}
      />

      <style jsx global>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @keyframes float-up {
          0% { 
            transform: translateY(100vh) scale(0); 
            opacity: 0; 
          }
          10% { 
            opacity: 1; 
          }
          90% { 
            opacity: 1; 
          }
          100% { 
            transform: translateY(-100vh) scale(1); 
            opacity: 0; 
          }
        }

        .animate-spin-slow {
          animation: spin-slow 30s linear infinite;
        }

        .animate-float-up {
          animation: float-up 20s ease-in-out infinite;
        }

        * {
          scroll-behavior: smooth;
        }
      `}</style>
    </div>
  );
}
