import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { phone, email } = body;

    // Валидация: хотя бы одно поле должно быть заполнено
    if (!phone?.trim() && !email?.trim()) {
      return NextResponse.json(
        { error: 'Пожалуйста, заполните номер телефона или email' },
        { status: 400 }
      );
    }

    // Валидация email, если заполнено
    if (email?.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email.trim())) {
        return NextResponse.json(
          { error: 'Пожалуйста, введите корректный email' },
          { status: 400 }
        );
      }
    }

    // Логирование быстрой заявки на консультацию
    console.log('📞 Быстрая заявка на консультацию:', {
      phone: phone?.trim() || null,
      email: email?.trim() || null,
      source: 'hero_cta_button',
      timestamp: new Date().toISOString(),
      offer: 'discount_20_percent_today'
    });

    // Здесь можно добавить:
    // 1. Сохранение в базу данных (Prisma) в таблицу быстрых заявок
    // 2. Отправка уведомления в Telegram
    // 3. Создание задачи в CRM (с приоритетом "Горячий лид")
    // 4. Автоматический звонок или SMS клиенту
    // 5. Отправка email с презентацией компании

    // Имитация задержки обработки
    await new Promise(resolve => setTimeout(resolve, 800));

    return NextResponse.json(
      { 
        success: true, 
        message: 'Заявка принята! Менеджер свяжется с вами в ближайшее время.' 
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Ошибка обработки быстрой заявки:', error);
    return NextResponse.json(
      { error: 'Произошла ошибка при обработке заявки' },
      { status: 500 }
    );
  }
}
