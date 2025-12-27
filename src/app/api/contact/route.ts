import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Валидация данных
    if (!body.name || !body.email || !body.phone) {
      return NextResponse.json(
        { error: 'Пожалуйста, заполните все обязательные поля' },
        { status: 400 }
      );
    }

    // Валидация email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.email)) {
      return NextResponse.json(
        { error: 'Пожалуйста, введите корректный email' },
        { status: 400 }
      );
    }

    // Логирование заявки (в продакшене здесь будет сохранение в базу данных)
    console.log('Новая заявка:', {
      name: body.name,
      email: body.email,
      phone: body.phone,
      company: body.company,
      plan: body.plan,
      message: body.message,
      timestamp: new Date().toISOString()
    });

    // Здесь можно добавить:
    // 1. Сохранение в базу данных (Prisma)
    // 2. Отправка email уведомления
    // 3. Интеграция с CRM системой
    // 4. Отправка в Telegram

    // Имитация задержки обработки
    await new Promise(resolve => setTimeout(resolve, 500));

    return NextResponse.json(
      { 
        success: true, 
        message: 'Заявка успешно получена! Мы свяжемся с вами в ближайшее время.' 
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Ошибка обработки заявки:', error);
    return NextResponse.json(
      { error: 'Произошла ошибка при обработке заявки' },
      { status: 500 }
    );
  }
}
