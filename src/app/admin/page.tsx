'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Save,
  Upload,
  Eye,
  Settings,
  FileText,
  DollarSign,
  MessageSquare,
  Star,
  LogOut
} from 'lucide-react';

interface ContentData {
  hero: {
    title: string;
    tagline: string;
    subtitle: string;
    cta: string;
  };
  modules: {
    title: string;
    items: Array<{
      title: string;
      content: string;
    }>;
  };
  pricing: {
    title: string;
    period: string;
    plans: {
      light: {
        title: string;
        price: string;
        features: string[];
      };
      start: {
        title: string;
        price: string;
        features: string[];
      };
      pro: {
        title: string;
        price: string;
        features: string[];
      };
    };
  };
  testimonials: {
    title: string;
    items: Array<{
      name: string;
      role: string;
      content: string;
      rating: number;
    }>;
  };
  contact: {
    title: string;
    name: string;
    email: string;
    phone: string;
    company: string;
    plan: string;
    message: string;
  };
  footer: {
    copyright: string;
  };
}

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [content, setContent] = useState<ContentData | null>(null);
  const [language, setLanguage] = useState<'ru' | 'en'>('ru');
  const [saveStatus, setSaveStatus] = useState<{ type: 'success' | 'error' | null, message: string }>({ type: null, message: '' });
  const router = useRouter();

  // Simple authentication (in production, use proper auth)
  const handleAuth = () => {
    if (password === 'admin123') { // Change this to a secure password
      setIsAuthenticated(true);
      localStorage.setItem('admin_auth', 'true');
    } else {
      alert('Неверный пароль');
    }
  };

  useEffect(() => {
    const auth = localStorage.getItem('admin_auth');
    if (auth === 'true') {
      setIsAuthenticated(true);
      loadContent();
    }
  }, []);

  const loadContent = async () => {
    try {
      const response = await fetch(`/api/admin/content?lang=${language}`);
      if (response.ok) {
        const data = await response.json();
        setContent(data);
      }
    } catch (error) {
      console.error('Error loading content:', error);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadContent();
    }
  }, [language, isAuthenticated]);

  const handleSave = async () => {
    if (!content) return;

    setIsLoading(true);
    try {
      const response = await fetch('/api/admin/content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          language,
          content
        }),
      });

      if (response.ok) {
        setSaveStatus({ type: 'success', message: 'Изменения сохранены успешно!' });
        setTimeout(() => setSaveStatus({ type: null, message: '' }), 3000);
      } else {
        setSaveStatus({ type: 'error', message: 'Ошибка при сохранении' });
      }
    } catch (error) {
      setSaveStatus({ type: 'error', message: 'Ошибка при сохранении' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeploy = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/admin/deploy', {
        method: 'POST',
      });

      if (response.ok) {
        setSaveStatus({ type: 'success', message: 'Изменения опубликованы!' });
      } else {
        setSaveStatus({ type: 'error', message: 'Ошибка при публикации' });
      }
    } catch (error) {
      setSaveStatus({ type: 'error', message: 'Ошибка при публикации' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_auth');
    setIsAuthenticated(false);
    setPassword('');
  };

  const updateContent = (path: string, value: any) => {
    if (!content) return;

    const keys = path.split('.');
    const newContent = { ...content };

    let current: any = newContent;
    for (let i = 0; i < keys.length - 1; i++) {
      if (Array.isArray(current[keys[i]])) {
        current = current[keys[i]];
      } else {
        current = current[keys[i]] || {};
      }
    }
    current[keys[keys.length - 1]] = value;

    setContent(newContent);
  };

  const updateArrayItem = (path: string, index: number, field: string, value: any) => {
    if (!content) return;

    const keys = path.split('.');
    const newContent = { ...content };

    let current: any = newContent;
    for (let i = 0; i < keys.length; i++) {
      current = current[keys[i]];
    }

    if (current && current[index]) {
      current[index][field] = value;
      setContent(newContent);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center">Админ-панель VAIlite</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label htmlFor="password">Пароль</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Введите пароль"
                />
              </div>
              <Button onClick={handleAuth} className="w-full">
                Войти
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!content) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div>Загрузка...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-gray-900">Админ-панель</h1>
              <Badge variant="outline">{language === 'ru' ? 'Русский' : 'English'}</Badge>
            </div>
            <div className="flex items-center space-x-4">
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as 'ru' | 'en')}
                className="px-3 py-1 border rounded-md"
              >
                <option value="ru">Русский</option>
                <option value="en">English</option>
              </select>
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open('/', '_blank')}
              >
                <Eye className="w-4 h-4 mr-2" />
                Просмотр сайта
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
              >
                <LogOut className="w-4 h-4 mr-2" />
                Выход
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Status Alert */}
      {saveStatus.type && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Alert className={saveStatus.type === 'success' ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}>
            <AlertDescription className={saveStatus.type === 'success' ? 'text-green-800' : 'text-red-800'}>
              {saveStatus.message}
            </AlertDescription>
          </Alert>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="hero" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="hero">Hero</TabsTrigger>
            <TabsTrigger value="modules">Модули</TabsTrigger>
            <TabsTrigger value="pricing">Цены</TabsTrigger>
            <TabsTrigger value="testimonials">Отзывы</TabsTrigger>
            <TabsTrigger value="contact">Контакты</TabsTrigger>
            <TabsTrigger value="footer">Футер</TabsTrigger>
          </TabsList>

          {/* Hero Section */}
          <TabsContent value="hero">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Settings className="w-5 h-5 mr-2" />
                  Hero секция
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Заголовок</Label>
                  <Input
                    value={content.hero.title}
                    onChange={(e) => updateContent('hero.title', e.target.value)}
                  />
                </div>
                <div>
                  <Label>Подзаголовок</Label>
                  <Input
                    value={content.hero.tagline}
                    onChange={(e) => updateContent('hero.tagline', e.target.value)}
                  />
                </div>
                <div>
                  <Label>Описание</Label>
                  <Textarea
                    value={content.hero.subtitle}
                    onChange={(e) => updateContent('hero.subtitle', e.target.value)}
                  />
                </div>
                <div>
                  <Label>Текст кнопки</Label>
                  <Input
                    value={content.hero.cta}
                    onChange={(e) => updateContent('hero.cta', e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Modules Section */}
          <TabsContent value="modules">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="w-5 h-5 mr-2" />
                  Модули
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Заголовок секции</Label>
                  <Input
                    value={content.modules.title}
                    onChange={(e) => updateContent('modules.title', e.target.value)}
                  />
                </div>
                {content.modules.items.map((module, index) => (
                  <Card key={index} className="p-4">
                    <div className="space-y-3">
                      <div>
                        <Label>Название модуля {index + 1}</Label>
                        <Input
                          value={module.title}
                          onChange={(e) => updateArrayItem('modules.items', index, 'title', e.target.value)}
                        />
                      </div>
                      <div>
                        <Label>Описание модуля {index + 1}</Label>
                        <Textarea
                          value={module.content}
                          onChange={(e) => updateArrayItem('modules.items', index, 'content', e.target.value)}
                        />
                      </div>
                    </div>
                  </Card>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Pricing Section */}
          <TabsContent value="pricing">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <DollarSign className="w-5 h-5 mr-2" />
                  Цены
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Заголовок секции</Label>
                  <Input
                    value={content.pricing.title}
                    onChange={(e) => updateContent('pricing.title', e.target.value)}
                  />
                </div>
                <div>
                  <Label>Период оплаты</Label>
                  <Input
                    value={content.pricing.period}
                    onChange={(e) => updateContent('pricing.period', e.target.value)}
                  />
                </div>

                {Object.entries(content.pricing.plans).map(([key, plan]: [string, any]) => (
                  <Card key={key} className="p-4">
                    <h3 className="font-semibold mb-3">{plan.title}</h3>
                    <div className="space-y-3">
                      <div>
                        <Label>Цена</Label>
                        <Input
                          value={plan.price}
                          onChange={(e) => updateContent(`pricing.plans.${key}.price`, e.target.value)}
                        />
                      </div>
                      <div>
                        <Label>Особенности (каждая с новой строки)</Label>
                        <Textarea
                          value={plan.features.join('\n')}
                          onChange={(e) => updateContent(`pricing.plans.${key}.features`, e.target.value.split('\n'))}
                        />
                      </div>
                    </div>
                  </Card>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Testimonials Section */}
          <TabsContent value="testimonials">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Star className="w-5 h-5 mr-2" />
                  Отзывы
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Заголовок секции</Label>
                  <Input
                    value={content.testimonials.title}
                    onChange={(e) => updateContent('testimonials.title', e.target.value)}
                  />
                </div>
                {content.testimonials.items.map((testimonial, index) => (
                  <Card key={index} className="p-4">
                    <div className="space-y-3">
                      <div>
                        <Label>Имя</Label>
                        <Input
                          value={testimonial.name}
                          onChange={(e) => updateArrayItem('testimonials.items', index, 'name', e.target.value)}
                        />
                      </div>
                      <div>
                        <Label>Должность</Label>
                        <Input
                          value={testimonial.role}
                          onChange={(e) => updateArrayItem('testimonials.items', index, 'role', e.target.value)}
                        />
                      </div>
                      <div>
                        <Label>Отзыв</Label>
                        <Textarea
                          value={testimonial.content}
                          onChange={(e) => updateArrayItem('testimonials.items', index, 'content', e.target.value)}
                        />
                      </div>
                      <div>
                        <Label>Рейтинг (1-5)</Label>
                        <Input
                          type="number"
                          min="1"
                          max="5"
                          value={testimonial.rating}
                          onChange={(e) => updateArrayItem('testimonials.items', index, 'rating', parseInt(e.target.value))}
                        />
                      </div>
                    </div>
                  </Card>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Contact Section */}
          <TabsContent value="contact">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MessageSquare className="w-5 h-5 mr-2" />
                  Контакты
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Заголовок секции</Label>
                  <Input
                    value={content.contact.title}
                    onChange={(e) => updateContent('contact.title', e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Поле "Имя"</Label>
                    <Input
                      value={content.contact.name}
                      onChange={(e) => updateContent('contact.name', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>Поле "Email"</Label>
                    <Input
                      value={content.contact.email}
                      onChange={(e) => updateContent('contact.email', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>Поле "Телефон"</Label>
                    <Input
                      value={content.contact.phone}
                      onChange={(e) => updateContent('contact.phone', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>Поле "Компания"</Label>
                    <Input
                      value={content.contact.company}
                      onChange={(e) => updateContent('contact.company', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>Поле "План"</Label>
                    <Input
                      value={content.contact.plan}
                      onChange={(e) => updateContent('contact.plan', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>Поле "Сообщение"</Label>
                    <Input
                      value={content.contact.message}
                      onChange={(e) => updateContent('contact.message', e.target.value)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Footer Section */}
          <TabsContent value="footer">
            <Card>
              <CardHeader>
                <CardTitle>Футер</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Копирайт</Label>
                  <Input
                    value={content.footer.copyright}
                    onChange={(e) => updateContent('footer.copyright', e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-4 mt-8">
          <Button
            onClick={handleSave}
            disabled={isLoading}
            className="flex items-center"
          >
            <Save className="w-4 h-4 mr-2" />
            {isLoading ? 'Сохранение...' : 'Сохранить изменения'}
          </Button>
          <Button
            onClick={handleDeploy}
            disabled={isLoading}
            variant="outline"
            className="flex items-center"
          >
            <Upload className="w-4 h-4 mr-2" />
            {isLoading ? 'Публикация...' : 'Опубликовать'}
          </Button>
        </div>
      </div>
    </div>
  );
}
