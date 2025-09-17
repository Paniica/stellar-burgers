import { ChangeEvent, useState } from 'react';

/**
 * Простой переиспользуемый хук для управления значениями форм
 *
 * Этот хук упрощает работу с формами в React, предоставляя:
 * - Автоматическое обновление состояния при изменении полей
 * - Типизированные значения для TypeScript
 * - Удобный интерфейс для работы с input элементами
 *
 * @param baseForm - Начальные значения формы
 * @returns Массив с текущими значениями, обработчиком изменений и функцией установки значений
 */
export function useForm<T extends { [key: string]: string }>(baseForm: T) {
  // Состояние для хранения текущих значений формы
  const [values, setValues] = useState<T>(baseForm);

  /**
   * Обработчик изменений полей формы
   * Автоматически обновляет значение конкретного поля по его name
   */
  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  }

  // Возвращаем кортеж с функциями и значениями для удобного использования
  return [values, handleChange, setValues] as const;
}
