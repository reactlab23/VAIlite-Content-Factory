'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Phone, Mail, CheckCircle, Gift } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface ConsultationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ConsultationModal({ isOpen, onClose }: ConsultationModalProps) {
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Валидация: хотя бы одно поле должно быть заполнено
    if (!phone.trim() && !email.trim()) {
      alert('Пожалуйста, введите номер телефона или email');
      return;
    }

    // Валидация email, если заполнено
    if (email.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        alert('Пожалуйста, введите корректный email');
        return;
      }
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/quick-consultation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phone: phone.trim(),
          email: email.trim(),
        }),
      });

      if (response.ok) {
        setIsSuccess(true);
        // Закрыть модальное окно через 3 секунды
        setTimeout(() => {
          setIsSuccess(false);
          setPhone('');
          setEmail('');
          onClose();
        }, 4000);
      } else {
        alert('Произошла ошибка. Пожалуйста, попробуйте снова.');
      }
    } catch (error) {
      alert('Произошла ошибка. Пожалуйста, попробуйте снова.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSuccessClose = () => {
    setIsSuccess(false);
    setPhone('');
    setEmail('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        className="bg-[#0A0A0A] border-[rgba(212,175,55,0.3)] text-[#F8F8F8] max-w-md"
        showCloseButton={!isSuccess}
      >
        {!isSuccess ? (
          <>
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-[#D4AF37] text-center">
                Получить Персональную Консультацию
              </DialogTitle>
              <DialogDescription className="text-[#E8D5A3] text-base text-center">
                Оставьте контакт для связи
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-6 mt-6">
              {/* Баннер со скидкой */}
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-r from-[rgba(212,175,55,0.15)] to-[rgba(170,140,44,0.15)] border border-[#D4AF37] rounded-lg p-4 flex items-start gap-3"
              >
                <Gift className="w-6 h-6 text-[#D4AF37] flex-shrink-0 mt-0.5" />
                <div className="text-sm">
                  <p className="font-semibold text-[#D4AF37] mb-1">
                    Специальное предложение!
                  </p>
                  <p className="text-[#F8F8F8] opacity-90">
                    Если вы позвоните сегодня — получите скидку <span className="text-[#D4AF37] font-bold text-lg">20%</span>
                  </p>
                </div>
              </motion.div>

              {/* Поле телефона */}
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-[#E8D5A3] font-semibold flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  Номер телефона
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+7 (___) ___-__-__"
                  className="bg-[rgba(255,255,255,0.05)] border-[rgba(212,175,55,0.2)] text-[#F8F8F8] placeholder:text-[#F8F8F8]/40 focus:border-[#D4AF37]"
                />
              </div>

              {/* Разделитель */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-[rgba(212,175,55,0.2)]"></span>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-[#0A0A0A] px-2 text-[#F8F8F8] opacity-60">
                    ИЛИ
                  </span>
                </div>
              </div>

              {/* Поле email */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-[#E8D5A3] font-semibold flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Email адрес
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="bg-[rgba(255,255,255,0.05)] border-[rgba(212,175,55,0.2)] text-[#F8F8F8] placeholder:text-[#F8F8F8]/40 focus:border-[#D4AF37]"
                />
              </div>

              {/* Кнопка отправки */}
              <Button
                type="submit"
                disabled={isSubmitting || (!phone.trim() && !email.trim())}
                className="w-full py-4 bg-gradient-to-r from-[#D4AF37] to-[#AA8C2C] hover:from-[#D4AF37] hover:to-[#AA8C2C] text-black font-bold text-base uppercase tracking-wider shadow-[0_10px_30px_rgba(212,175,55,0.4)] hover:shadow-[0_15px_40px_rgba(212,175,55,0.4)] transition-all duration-300"
              >
                {isSubmitting ? 'Отправка...' : 'Отправить заявку'}
              </Button>

              {/* Подсказка */}
              <p className="text-xs text-center text-[#F8F8F8] opacity-60">
                * Заполните хотя бы одно поле для обратной связи
              </p>
            </form>
          </>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-8"
          >
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="w-20 h-20 mx-auto mb-6 bg-[rgba(212,175,55,0.15)] rounded-full flex items-center justify-center"
            >
              <CheckCircle className="w-12 h-12 text-[#D4AF37]" />
            </motion.div>

            <h3 className="text-2xl font-bold text-[#D4AF37] mb-4">
              Спасибо!
            </h3>

            <p className="text-[#F8F8F8] text-base leading-relaxed mb-4">
              Скоро вам перезвонит персональный менеджер, который подготовит вашу персональную стратегию и расскажет о преимуществах сотрудничества с VAIlite Content Factory.
            </p>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="bg-gradient-to-r from-[rgba(212,175,55,0.15)] to-[rgba(170,140,44,0.15)] border border-[#D4AF37] rounded-lg p-4 flex items-center gap-3"
            >
              <Gift className="w-6 h-6 text-[#D4AF37] flex-shrink-0" />
              <div className="text-sm text-left">
                <p className="font-semibold text-[#D4AF37]">
                  Не забудьте спросить про скидку 20%!
                </p>
                <p className="text-[#F8F8F8] opacity-80 text-xs mt-1">
                  Призвонит сегодня и получите спецпредложение
                </p>
              </div>
            </motion.div>

            <Button
              onClick={handleSuccessClose}
              variant="outline"
              className="mt-6 border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black"
            >
              Закрыть
            </Button>
          </motion.div>
        )}
      </DialogContent>
    </Dialog>
  );
}
