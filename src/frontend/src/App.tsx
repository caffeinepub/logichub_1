import { useEffect, useRef, useState } from "react";

// ─── Types ───────────────────────────────────────────────────────────────────
type Screen = "loading" | "main" | "section" | "tasklist" | "test";
type Difficulty = "easy" | "medium" | "hard";
type TabType = "theory" | "examples" | "tasks";

// ─── Data ────────────────────────────────────────────────────────────────────
const TIPS = [
  "Совет: математика — это не скучно, это игра!",
  "Совет: каждая задача делает тебя умнее",
  "Совет: не торопись — лучшие решения приходят спокойно",
  "Совет: ошибки — это часть обучения!",
];

type Question = {
  text: string;
  difficulty: Difficulty;
  options: string[];
  correct: number;
  explanation: string;
};

type Section = {
  id: string;
  icon: string;
  title: string;
  subtitle: string;
  color: string;
  bgClass: string;
  borderClass: string;
  textClass: string;
  badgeBgClass: string;
  theory: { title: string; content: string }[];
  examples: { problem: string; solution: string }[];
  questions: Question[];
};

const MATH_SECTIONS: Section[] = [
  {
    id: "numbers",
    icon: "🔢",
    title: "Числа и действия",
    subtitle: "НОД, НОК, дроби",
    color: "blue",
    bgClass: "bg-blue-50 border-blue-200",
    borderClass: "border-blue-300",
    textClass: "text-blue-700",
    badgeBgClass: "bg-blue-100 text-blue-700",
    theory: [
      {
        title: "Натуральные числа",
        content:
          "Натуральные числа — это числа для счёта: 1, 2, 3, 4... Ноль не является натуральным числом. Они делятся на чётные (2, 4, 6...) и нечётные (1, 3, 5...). Наименьшее натуральное число — 1, наибольшего нет.",
      },
      {
        title: "Делимость. НОД и НОК",
        content:
          "НОД (наибольший общий делитель) — наибольшее число, на которое делятся оба числа без остатка. НОК (наименьшее общее кратное) — наименьшее число, которое делится на оба без остатка.\n\nПризнаки делимости:\n• на 2: последняя цифра чётная\n• на 3: сумма цифр делится на 3\n• на 5: последняя цифра 0 или 5\n• на 10: последняя цифра 0",
      },
      {
        title: "Обыкновенные дроби",
        content:
          "Дробь a/b означает: разделить a на b. Числитель (a) — сколько взяли частей. Знаменатель (b) — на сколько частей разделили целое.\n\nСокращение: делим числитель и знаменатель на их НОД.\nСложение/вычитание: нужен одинаковый знаменатель.\nУмножение: числитель на числитель, знаменатель на знаменатель.\nДеление: умножаем на перевёрнутую дробь.",
      },
      {
        title: "Десятичные дроби и смешанные числа",
        content:
          "Десятичная дробь: 0.5 = 1/2, 0.25 = 1/4. При умножении на 10 запятая сдвигается вправо.\n\nСмешанное число: 2¾ = 2 + 3/4 = 11/4. Чтобы перевести в неправильную дробь: целое × знаменатель + числитель.",
      },
    ],
    examples: [
      {
        problem: "Найди НОД(12, 18)",
        solution:
          "Делители 12: 1,2,3,4,6,12\nДелители 18: 1,2,3,6,9,18\nОбщие: 1,2,3,6\nНОД = 6",
      },
      {
        problem: "Сложи дроби: 1/4 + 2/3",
        solution:
          "Общий знаменатель = 12\n1/4 = 3/12\n2/3 = 8/12\n3/12 + 8/12 = 11/12",
      },
      {
        problem: "Умножь: 2/3 × 3/5",
        solution:
          "2×3 = 6 (числитель)\n3×5 = 15 (знаменатель)\n6/15 = 2/5 (сокращаем на 3)",
      },
    ],
    questions: [
      {
        text: "Чему равен НОД(8, 12)?",
        difficulty: "easy",
        options: ["2", "4", "6", "8"],
        correct: 1,
        explanation:
          "Делители 8: 1,2,4,8. Делители 12: 1,2,3,4,6,12. Наибольший общий — 4.",
      },
      {
        text: "Сколько будет 1/3 + 1/6?",
        difficulty: "easy",
        options: ["2/9", "1/2", "2/6", "3/9"],
        correct: 1,
        explanation: "1/3 = 2/6. Тогда 2/6 + 1/6 = 3/6 = 1/2.",
      },
      {
        text: "Какое число делится на 3?",
        difficulty: "easy",
        options: ["124", "251", "132", "407"],
        correct: 2,
        explanation: "132: 1+3+2=6, делится на 3. Проверяем сумму цифр.",
      },
      {
        text: "Переведи 2¾ в неправильную дробь",
        difficulty: "medium",
        options: ["6/4", "9/4", "11/4", "10/4"],
        correct: 2,
        explanation: "2×4 + 3 = 11. Знаменатель остаётся 4. Ответ: 11/4.",
      },
      {
        text: "НОК(4, 6) = ?",
        difficulty: "medium",
        options: ["6", "8", "12", "24"],
        correct: 2,
        explanation:
          "Кратные 4: 4,8,12,16... Кратные 6: 6,12,18... Наименьшее общее — 12.",
      },
    ],
  },
  {
    id: "negatives",
    icon: "➕",
    title: "Отрицательные числа",
    subtitle: "Модуль, координатная прямая",
    color: "red",
    bgClass: "bg-red-50 border-red-200",
    borderClass: "border-red-300",
    textClass: "text-red-700",
    badgeBgClass: "bg-red-100 text-red-700",
    theory: [
      {
        title: "Положительные и отрицательные числа",
        content:
          "Отрицательные числа — числа меньше нуля. Обозначаются знаком минус: −5, −3.7. Встречаются в реальной жизни: температура ниже нуля, долг, уровень ниже моря.",
      },
      {
        title: "Координатная прямая",
        content:
          "Числовая прямая: слева — отрицательные, в центре — ноль, справа — положительные. Чем правее точка — тем больше число. −3 < −1 < 0 < 2 < 5.",
      },
      {
        title: "Модуль числа",
        content:
          "Модуль |x| — расстояние от числа до нуля. Всегда ≥ 0.\n|5| = 5\n|−5| = 5\n|0| = 0\n\nМодуль убирает минус: |−7| = 7.",
      },
      {
        title: "Действия с отрицательными числами",
        content:
          "Сложение: (−3) + (−2) = −5 (складываем модули, ставим минус)\n(+5) + (−3) = +2 (вычитаем меньший из большего)\n\nВычитание: a − (−b) = a + b\n\nУмножение и деление:\n+ × + = +\n− × − = +\n+ × − = −\n− × + = −",
      },
    ],
    examples: [
      {
        problem: "Вычисли: −5 + 3",
        solution:
          "Разные знаки → вычитаем: 5−3=2\nБольший модуль у −5, ставим минус\nОтвет: −2",
      },
      {
        problem: "Вычисли: (−4) × (−3)",
        solution: "Минус на минус = плюс\n4 × 3 = 12\nОтвет: +12",
      },
      { problem: "|−8| + |3| = ?", solution: "|−8| = 8\n|3| = 3\n8 + 3 = 11" },
    ],
    questions: [
      {
        text: "Чему равно |−7|?",
        difficulty: "easy",
        options: ["−7", "0", "7", "49"],
        correct: 2,
        explanation:
          "Модуль — это расстояние до нуля, всегда положительное. |−7| = 7.",
      },
      {
        text: "Что больше: −3 или −7?",
        difficulty: "easy",
        options: ["−7", "−3", "Равны", "Нельзя сравнить"],
        correct: 1,
        explanation: "На числовой прямой −3 правее −7, значит −3 > −7.",
      },
      {
        text: "Вычисли: (−2) × (−5)",
        difficulty: "easy",
        options: ["−10", "10", "−7", "7"],
        correct: 1,
        explanation: "Минус на минус = плюс. 2×5=10. Ответ: +10.",
      },
      {
        text: "Вычисли: −8 + 3",
        difficulty: "medium",
        options: ["11", "−11", "−5", "5"],
        correct: 2,
        explanation:
          "Разные знаки: 8−3=5. Больший модуль у −8, ставим минус. Ответ: −5.",
      },
      {
        text: "Вычисли: 6 − (−4)",
        difficulty: "medium",
        options: ["2", "−2", "10", "−10"],
        correct: 2,
        explanation: "Минус минус = плюс. 6 − (−4) = 6 + 4 = 10.",
      },
    ],
  },
  {
    id: "proportions",
    icon: "📊",
    title: "Пропорции и проценты",
    subtitle: "Отношения, прямая пропорц.",
    color: "green",
    bgClass: "bg-green-50 border-green-200",
    borderClass: "border-green-300",
    textClass: "text-green-700",
    badgeBgClass: "bg-green-100 text-green-700",
    theory: [
      {
        title: "Отношение чисел",
        content:
          "Отношение a к b — это a/b или a÷b. Показывает, во сколько раз одна величина больше другой или какую часть одна составляет от другой.\n\nПример: отношение 6 к 3 равно 6/3 = 2 (первое в 2 раза больше второго).",
      },
      {
        title: "Пропорции",
        content:
          "Пропорция: a/b = c/d, или a:b = c:d.\nОсновное свойство: произведение крайних = произведению средних.\na × d = b × c\n\nПример: 2/3 = 4/6, проверка: 2×6 = 3×4 = 12 ✓",
      },
      {
        title: "Прямая и обратная пропорциональность",
        content:
          "Прямая пропорциональность: y = kx. При увеличении x в n раз, y тоже увеличивается в n раз.\n\nОбратная пропорциональность: y = k/x. При увеличении x в n раз, y уменьшается в n раз.\n\nПример прямой: скорость одинакова → расстояние ∝ времени.",
      },
      {
        title: "Проценты",
        content:
          "1% = 1/100 = 0.01\n\nНайти X% от числа N: N × X/100\nПример: 20% от 150 = 150 × 20/100 = 30\n\nНайти сколько % X составляет от N: (X/N) × 100%\nПример: 30 от 150 = (30/150) × 100% = 20%",
      },
    ],
    examples: [
      {
        problem: "Найди x: 3/x = 6/8",
        solution: "Основное свойство пропорции:\n3 × 8 = 6 × x\n24 = 6x\nx = 4",
      },
      {
        problem: "Сколько % составляет 45 от 180?",
        solution: "(45 / 180) × 100% = 0.25 × 100% = 25%",
      },
      {
        problem: "Найди 15% от 240",
        solution: "240 × 15/100 = 240 × 0.15 = 36",
      },
    ],
    questions: [
      {
        text: "15% от 200 = ?",
        difficulty: "easy",
        options: ["15", "20", "30", "25"],
        correct: 2,
        explanation: "200 × 15/100 = 200 × 0.15 = 30.",
      },
      {
        text: "Чему равно x: 2/3 = x/9?",
        difficulty: "easy",
        options: ["3", "6", "4", "9"],
        correct: 1,
        explanation: "2×9 = 3×x → 18 = 3x → x = 6.",
      },
      {
        text: "Сколько % это 12 от 48?",
        difficulty: "medium",
        options: ["4%", "12%", "25%", "48%"],
        correct: 2,
        explanation: "(12/48) × 100% = 0.25 × 100% = 25%.",
      },
      {
        text: "Цена выросла с 400 до 500 руб. На сколько %?",
        difficulty: "medium",
        options: ["10%", "20%", "25%", "100%"],
        correct: 2,
        explanation: "Рост = 100 руб. (100/400)×100% = 25%.",
      },
      {
        text: "Числа 4 и 16 в прямой пропорции. Если первое стало 8, второе стало?",
        difficulty: "hard",
        options: ["8", "16", "32", "64"],
        correct: 2,
        explanation:
          "Прямая пропорция: увеличилось в 2 раза → второе тоже в 2 раза. 16×2=32.",
      },
    ],
  },
  {
    id: "algebra",
    icon: "✏️",
    title: "Алгебра",
    subtitle: "Уравнения, выражения",
    color: "purple",
    bgClass: "bg-purple-50 border-purple-200",
    borderClass: "border-purple-300",
    textClass: "text-purple-700",
    badgeBgClass: "bg-purple-100 text-purple-700",
    theory: [
      {
        title: "Буквенные выражения",
        content:
          "Буква в алгебре — это переменная, которая может быть любым числом. 3a означает 3×a. 2a+b — это выражение с двумя переменными.\n\nЗначение выражения находят подстановкой: если a=2, то 3a = 3×2 = 6.",
      },
      {
        title: "Раскрытие скобок",
        content:
          "a(b+c) = ab + ac\n−(a+b) = −a − b\n−(a−b) = −a + b\n\nПример: 3(x+2) = 3x + 6\n−2(x−5) = −2x + 10",
      },
      {
        title: "Приведение подобных слагаемых",
        content:
          "Подобные слагаемые имеют одинаковую переменную в одинаковой степени: 3x и 5x — подобные.\n\nПриводим: складываем/вычитаем коэффициенты.\n3x + 5x = 8x\n7a − 3a + 2b = 4a + 2b\n\nЧисла без переменных тоже подобные: 5 + 3 = 8.",
      },
      {
        title: "Линейные уравнения",
        content:
          "Уравнение вида ax + b = c.\nРешение: изолируй x.\n\nПример: 2x + 3 = 7\n2x = 7 − 3 = 4\nx = 4/2 = 2\n\nПроверка: 2×2 + 3 = 7 ✓\n\nПравило: что делаем с одной стороной — делаем с другой.",
      },
    ],
    examples: [
      {
        problem: "Раскрой скобки: 4(2x − 3)",
        solution: "4 × 2x = 8x\n4 × (−3) = −12\nОтвет: 8x − 12",
      },
      {
        problem: "Приведи подобные: 5x + 3 − 2x + 7",
        solution: "Группируем: (5x − 2x) + (3 + 7)\n= 3x + 10",
      },
      {
        problem: "Решить уравнение: 3x − 5 = 10",
        solution: "3x = 10 + 5 = 15\nx = 15/3 = 5\nПроверка: 3×5−5 = 10 ✓",
      },
    ],
    questions: [
      {
        text: "Чему равно 5a при a=3?",
        difficulty: "easy",
        options: ["8", "53", "15", "2"],
        correct: 2,
        explanation: "5a = 5×3 = 15. Просто подставляем.",
      },
      {
        text: "Раскрой скобки: 2(x+4) = ?",
        difficulty: "easy",
        options: ["2x+4", "2x+8", "x+8", "2x+6"],
        correct: 1,
        explanation: "2×x=2x, 2×4=8. Итого: 2x+8.",
      },
      {
        text: "Реши уравнение: x + 5 = 12",
        difficulty: "easy",
        options: ["x=5", "x=7", "x=17", "x=60"],
        correct: 1,
        explanation: "x = 12−5 = 7.",
      },
      {
        text: "Приведи подобные: 4x + 2 − x + 5",
        difficulty: "medium",
        options: ["3x+7", "5x+7", "4x+7", "3x+3"],
        correct: 0,
        explanation: "(4x−x) + (2+5) = 3x + 7.",
      },
      {
        text: "Реши: 2x − 3 = 7",
        difficulty: "medium",
        options: ["x=2", "x=5", "x=7", "x=3"],
        correct: 1,
        explanation: "2x = 7+3 = 10, x = 10/2 = 5.",
      },
    ],
  },
  {
    id: "geometry",
    icon: "📐",
    title: "Геометрия",
    subtitle: "Углы, фигуры, окружность",
    color: "orange",
    bgClass: "bg-orange-50 border-orange-200",
    borderClass: "border-orange-300",
    textClass: "text-orange-700",
    badgeBgClass: "bg-orange-100 text-orange-700",
    theory: [
      {
        title: "Прямые и углы",
        content:
          "Угол — фигура из двух лучей из одной точки. Измеряется в градусах (°).\n\nВиды углов:\n• острый: < 90°\n• прямой: = 90°\n• тупой: > 90° и < 180°\n• развёрнутый: = 180°\n\nСумма углов треугольника = 180°.",
      },
      {
        title: "Параллельные прямые и симметрия",
        content:
          "Параллельные прямые — не пересекаются, расстояние между ними одинаково. Обозначение: a ∥ b.\n\nСимметрия: фигура симметрична, если при отражении относительно оси совпадает сама с собой. Примеры: квадрат (4 оси), круг (бесконечно много осей).",
      },
      {
        title: "Площадь круга и длина окружности",
        content:
          "Длина окружности: C = 2πr = πd\nПлощадь круга: S = πr²\nгде π ≈ 3.14, r — радиус, d — диаметр.\n\nПример: r=5 → C = 2×3.14×5 = 31.4, S = 3.14×25 = 78.5",
      },
      {
        title: "Простые фигуры и тела",
        content:
          "Площади:\n• Квадрат: S = a²\n• Прямоугольник: S = a×b\n• Треугольник: S = (a×h)/2\n• Трапеция: S = (a+b)/2 × h\n\nОбъём куба: V = a³\nОбъём прямоугольного параллелепипеда: V = a×b×c",
      },
    ],
    examples: [
      {
        problem: "Найди длину окружности с r=7 (π≈3.14)",
        solution: "C = 2πr = 2 × 3.14 × 7 = 43.96",
      },
      {
        problem: "Найди площадь треугольника с основанием 8 и высотой 5",
        solution: "S = (a×h)/2 = (8×5)/2 = 40/2 = 20",
      },
      {
        problem: "Угол треугольника: 60° и 80°. Найди третий угол.",
        solution: "Сумма углов = 180°\n180° − 60° − 80° = 40°",
      },
    ],
    questions: [
      {
        text: "Сумма углов треугольника равна?",
        difficulty: "easy",
        options: ["90°", "180°", "270°", "360°"],
        correct: 1,
        explanation:
          "Основное свойство треугольника: сумма всех трёх углов всегда равна 180°.",
      },
      {
        text: "Площадь квадрата со стороной 6 = ?",
        difficulty: "easy",
        options: ["12", "24", "36", "216"],
        correct: 2,
        explanation: "S = a² = 6² = 36.",
      },
      {
        text: "Длина окружности с r=10 (π≈3.14)?",
        difficulty: "medium",
        options: ["31.4", "62.8", "314", "3.14"],
        correct: 1,
        explanation: "C = 2πr = 2×3.14×10 = 62.8.",
      },
      {
        text: "Площадь круга r=3 (π≈3.14)?",
        difficulty: "medium",
        options: ["9.42", "18.84", "28.26", "6.28"],
        correct: 2,
        explanation: "S = πr² = 3.14 × 9 = 28.26.",
      },
      {
        text: "Один угол треугольника 90°, другой 45°. Третий?",
        difficulty: "easy",
        options: ["90°", "45°", "30°", "60°"],
        correct: 1,
        explanation: "180° − 90° − 45° = 45°.",
      },
    ],
  },
  {
    id: "extra",
    icon: "📈",
    title: "Дополнительно",
    subtitle: "Координаты, вероятность",
    color: "teal",
    bgClass: "bg-teal-50 border-teal-200",
    borderClass: "border-teal-300",
    textClass: "text-teal-700",
    badgeBgClass: "bg-teal-100 text-teal-700",
    theory: [
      {
        title: "Координатная плоскость",
        content:
          "Две перпендикулярные оси: горизонтальная (ось x) и вертикальная (ось y). Точка задаётся парой (x, y).\n\nПример: точка (3, −2) — 3 вправо, 2 вниз от начала координат (0,0).",
      },
      {
        title: "Вероятность",
        content:
          "Вероятность события = (число благоприятных исходов) / (всего возможных исходов).\n\nПример: вероятность выпадения 3 на кубике = 1/6 ≈ 0.17 ≈ 17%.\n\nВероятность от 0 (невозможно) до 1 (достоверно).",
      },
      {
        title: "Статистика. Среднее значение",
        content:
          "Среднее арифметическое: сумма всех чисел ÷ количество чисел.\n\nПример: оценки 4, 5, 3, 4, 5\nСумма = 21, количество = 5\nСреднее = 21/5 = 4.2\n\nМода — наиболее часто встречающееся значение (здесь: 4 и 5).",
      },
      {
        title: "Текстовые задачи",
        content:
          "Алгоритм решения:\n1. Прочитай условие дважды\n2. Запиши что известно и что найти\n3. Составь уравнение или план действий\n4. Реши и проверь ответ\n\nЧасто встречаются задачи на: движение (v×t=s), смеси, работу, прибыль.",
      },
    ],
    examples: [
      {
        problem: "Монету бросают 1 раз. Вероятность орла?",
        solution:
          "Всего исходов: 2 (орёл, решка)\nБлагоприятных: 1\nP = 1/2 = 0.5 = 50%",
      },
      {
        problem: "Среднее оценок: 5, 4, 3, 5, 3",
        solution: "Сумма: 5+4+3+5+3 = 20\nКоличество: 5\nСреднее: 20/5 = 4",
      },
      {
        problem: "Поезд едет 60 км/ч. За 3 часа проедет?",
        solution: "s = v × t = 60 × 3 = 180 км",
      },
    ],
    questions: [
      {
        text: "Среднее 2, 4, 6, 8 = ?",
        difficulty: "easy",
        options: ["4", "5", "6", "20"],
        correct: 1,
        explanation: "Сумма = 20, количество = 4. 20/4 = 5.",
      },
      {
        text: "Вероятность вытащить красный шар из 5 (3 красных)?",
        difficulty: "easy",
        options: ["1/5", "2/5", "3/5", "1/3"],
        correct: 2,
        explanation: "3 красных из 5 всего. P = 3/5.",
      },
      {
        text: "Точка (−2, 3) — это?",
        difficulty: "medium",
        options: [
          "2 вправо, 3 вверх",
          "2 влево, 3 вверх",
          "2 влево, 3 вниз",
          "2 вправо, 3 вниз",
        ],
        correct: 1,
        explanation: "x = −2 означает 2 влево, y = 3 означает 3 вверх.",
      },
      {
        text: "Скорость 50 км/ч, время 4 часа. Расстояние?",
        difficulty: "easy",
        options: ["54 км", "46 км", "200 км", "12.5 км"],
        correct: 2,
        explanation: "s = v×t = 50×4 = 200 км.",
      },
      {
        text: "Бросают кубик. Вероятность чётного числа?",
        difficulty: "medium",
        options: ["1/6", "1/3", "1/2", "2/3"],
        correct: 2,
        explanation: "Чётные: 2,4,6 — три из шести. P = 3/6 = 1/2.",
      },
    ],
  },
];

// ─── Floating Symbols ────────────────────────────────────────────────────────
const SYMBOLS = ["+", "−", "×", "÷", "=", "x", "2", "3", "7", "?", "∑", "∞"];
const SYMBOL_COLORS = [
  "text-red-300",
  "text-green-300",
  "text-blue-300",
  "text-pink-300",
  "text-yellow-300",
  "text-purple-300",
];
const FLOAT_CLASSES = [
  "symbol-float-1",
  "symbol-float-2",
  "symbol-float-3",
  "symbol-float-4",
  "symbol-float-5",
];

const symbolData = Array.from({ length: 32 }, (_, i) => ({
  id: i,
  symbol: SYMBOLS[i % SYMBOLS.length],
  color: SYMBOL_COLORS[i % SYMBOL_COLORS.length],
  floatClass: FLOAT_CLASSES[i % FLOAT_CLASSES.length],
  top: `${5 + ((i * 37 + 11) % 90)}%`,
  left: `${3 + ((i * 53 + 7) % 94)}%`,
  size: `${1 + ((i * 17) % 14) / 10}rem`,
  opacity: 0.06 + ((i * 13) % 10) / 100,
  dur: `${15 + ((i * 7) % 16)}s`,
  delay: `-${(i * 3) % 12}s`,
}));

function FloatingSymbols() {
  return (
    <div
      className="fixed inset-0 pointer-events-none overflow-hidden z-0"
      aria-hidden
    >
      {symbolData.map((s) => (
        <span
          key={s.id}
          className={`absolute select-none font-bold ${s.color} ${s.floatClass}`}
          style={{
            top: s.top,
            left: s.left,
            fontSize: s.size,
            opacity: s.opacity,
            // @ts-ignore
            "--dur": s.dur,
            animationDelay: s.delay,
          }}
        >
          {s.symbol}
        </span>
      ))}
    </div>
  );
}

// ─── Shared UI ────────────────────────────────────────────────────────────────
function BluePill({ children }: { children: React.ReactNode }) {
  return (
    <div className="animate-slide-down bg-primary text-primary-foreground text-center font-bold text-xl py-3 px-8 rounded-full shadow-lg mb-5">
      {children}
    </div>
  );
}

function BackButton({
  onClick,
  "data-ocid": ocid,
}: { onClick: () => void; "data-ocid"?: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      data-ocid={ocid}
      className="btn-press mt-3 w-full border-2 border-primary text-primary font-semibold text-base py-3 px-6 rounded-2xl hover:bg-primary/10 transition-all"
    >
      ← Назад
    </button>
  );
}

function DifficultyBadge({ difficulty }: { difficulty: Difficulty }) {
  const map: Record<Difficulty, { label: string; cls: string }> = {
    easy: { label: "Легко", cls: "badge-easy" },
    medium: { label: "Средне", cls: "badge-medium" },
    hard: { label: "Сложно", cls: "badge-hard" },
  };
  const d = map[difficulty];
  return <span className={`difficulty-badge ${d.cls}`}>{d.label}</span>;
}

// ─── Loading Screen ───────────────────────────────────────────────────────────
function LoadingScreen() {
  const [tipIndex, setTipIndex] = useState(0);

  useEffect(() => {
    const iv = setInterval(
      () => setTipIndex((i) => (i + 1) % TIPS.length),
      1800,
    );
    return () => clearInterval(iv);
  }, []);

  return (
    <div className="flex flex-col items-center justify-between h-full py-10 animate-fade-in">
      <div className="flex-1 flex flex-col items-center justify-center gap-8">
        <div className="animate-slide-down text-center">
          <div className="bg-primary text-primary-foreground px-10 py-5 rounded-b-[3rem] rounded-t-xl shadow-xl">
            <div className="text-4xl font-black tracking-tight">LogicHub</div>
            <div className="text-sm font-medium opacity-90 mt-1">
              Математика для 5-6 классов
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1 text-2xl font-bold text-primary mt-4">
          <span>загрузка</span>
          <span className="flex gap-[3px] ml-1">
            <span className="loading-dot inline-block w-2 h-2 bg-primary rounded-full" />
            <span className="loading-dot inline-block w-2 h-2 bg-primary rounded-full" />
            <span className="loading-dot inline-block w-2 h-2 bg-primary rounded-full" />
          </span>
        </div>
      </div>
      <div className="bg-primary text-primary-foreground rounded-2xl px-5 py-4 text-sm text-center shadow-md max-w-xs animate-fade-in">
        <span key={tipIndex} className="animate-fade-in block">
          {TIPS[tipIndex]}
        </span>
      </div>
    </div>
  );
}

// ─── Main Screen ──────────────────────────────────────────────────────────────
function MainScreen({ onSection }: { onSection: (idx: number) => void }) {
  return (
    <div className="flex flex-col h-full animate-fade-in-scale">
      <div
        className="bg-primary text-primary-foreground w-full py-7 px-6 text-center shadow-xl mb-6"
        style={{ clipPath: "polygon(0 0, 100% 0, 100% 80%, 50% 100%, 0 80%)" }}
      >
        <div className="text-4xl font-black tracking-tight">LogicHub</div>
        <div className="text-sm font-medium opacity-90 mt-1">
          Математика для 5-6 классов
        </div>
      </div>
      <div
        className="px-4 grid grid-cols-2 gap-3 flex-1 content-start overflow-y-auto pb-4"
        data-ocid="main.list"
      >
        {MATH_SECTIONS.map((sec, i) => (
          <button
            key={sec.id}
            type="button"
            onClick={() => onSection(i)}
            data-ocid={`main.item.${i + 1}`}
            className={`btn-press rounded-2xl border-2 p-4 flex flex-col items-start gap-2 text-left shadow-sm hover:shadow-md transition-all ${sec.bgClass}`}
          >
            <span className="text-3xl">{sec.icon}</span>
            <span
              className={`font-bold text-sm leading-tight ${sec.textClass}`}
            >
              {sec.title}
            </span>
            <span className="text-xs text-gray-500 leading-tight">
              {sec.subtitle}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Task List Screen ─────────────────────────────────────────────────────────
function TaskListScreen({
  sectionIdx,
  onTask,
  onBack,
  onTheory,
}: {
  sectionIdx: number;
  onTask: (qIdx: number) => void;
  onBack: () => void;
  onTheory: () => void;
}) {
  const sec = MATH_SECTIONS[sectionIdx];
  const inlineSymbols = Array.from({ length: 18 }, (_, i) => ({
    id: i,
    symbol: ["+", "−", "×", "÷", "=", "x", "?", "∑"][i % 8],
    floatClass: FLOAT_CLASSES[i % FLOAT_CLASSES.length],
    top: `${5 + ((i * 43 + 7) % 88)}%`,
    left: `${3 + ((i * 61 + 13) % 92)}%`,
    size: `${1.2 + ((i * 19) % 14) / 10}rem`,
    opacity: 0.08 + ((i * 11) % 8) / 100,
    dur: `${14 + ((i * 9) % 14)}s`,
    delay: `-${(i * 4) % 12}s`,
  }));

  return (
    <div className="relative flex flex-col h-full animate-slide-in-right bg-white overflow-hidden">
      {/* Inline floating symbols */}
      <div
        className="absolute inset-0 pointer-events-none overflow-hidden z-0"
        aria-hidden
      >
        {inlineSymbols.map((s) => (
          <span
            key={s.id}
            className={`absolute select-none font-bold ${s.floatClass}`}
            style={{
              top: s.top,
              left: s.left,
              fontSize: s.size,
              opacity: s.opacity,
              color: "#3AABDC",
              // @ts-ignore
              "--dur": s.dur,
              animationDelay: s.delay,
            }}
          >
            {s.symbol}
          </span>
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col flex-1 px-5 pt-7 pb-4">
        {/* Grade badge */}
        <div className="flex flex-col items-center mb-6">
          <div
            className="text-white font-bold text-base py-2 px-8 rounded-full shadow-md mb-2"
            style={{ background: "#3AABDC" }}
          >
            Для 5-6 классов
          </div>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-2xl">{sec.icon}</span>
            <span className="font-black text-gray-800 text-lg">
              {sec.title}
            </span>
          </div>
        </div>

        {/* Task number grid */}
        <div
          className="grid grid-cols-4 gap-3 flex-1 content-start"
          data-ocid="tasklist.list"
        >
          {sec.questions.map((q, i) => (
            <button
              key={q.text}
              type="button"
              onClick={() => onTask(i)}
              data-ocid={`tasklist.item.${i + 1}`}
              className="btn-press aspect-square rounded-2xl flex items-center justify-center shadow-md hover:shadow-lg hover:scale-105 transition-all"
              style={{ background: "#3AABDC" }}
            >
              <span className="text-white font-black text-2xl">{i + 1}</span>
            </button>
          ))}
        </div>

        {/* Theory link */}
        <button
          type="button"
          onClick={onTheory}
          data-ocid="tasklist.theory.button"
          className="btn-press mt-5 w-full font-semibold text-sm py-2.5 rounded-2xl border-2 transition-all"
          style={{ color: "#3AABDC", borderColor: "#3AABDC" }}
        >
          📚 Теория и примеры
        </button>

        {/* Back button */}
        <button
          type="button"
          onClick={onBack}
          data-ocid="tasklist.back_button"
          className="btn-press mt-3 w-full text-white font-bold text-base py-3 px-6 rounded-full shadow-md transition-all"
          style={{ background: "#3AABDC" }}
        >
          Вернуться назад
        </button>
      </div>
    </div>
  );
}

// ─── Section Screen ───────────────────────────────────────────────────────────
function SectionScreen({
  sectionIdx,
  onStartTest,
  onBack,
}: {
  sectionIdx: number;
  onStartTest: (qIdx: number) => void;
  onBack: () => void;
}) {
  const sec = MATH_SECTIONS[sectionIdx];
  const [activeTab, setActiveTab] = useState<TabType>("theory");
  const [openTheory, setOpenTheory] = useState<number | null>(null);

  const tabs: { id: TabType; label: string }[] = [
    { id: "theory", label: "Теория" },
    { id: "examples", label: "Примеры" },
    { id: "tasks", label: "Задания" },
  ];

  return (
    <div className="flex flex-col h-full animate-slide-in-right">
      {/* Header */}
      <div className={`${sec.bgClass} border-b-2 px-4 pt-4 pb-3`}>
        <div className="flex items-center gap-3 mb-3">
          <span className="text-3xl">{sec.icon}</span>
          <div>
            <div
              className={`font-black text-lg leading-tight ${sec.textClass}`}
            >
              {sec.title}
            </div>
            <div className="text-xs text-gray-500">{sec.subtitle}</div>
          </div>
        </div>
        {/* Tabs */}
        <div className="flex gap-2" data-ocid="section.tab">
          {tabs.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setActiveTab(t.id)}
              data-ocid={`section.${t.id}.tab`}
              className={`flex-1 py-2 rounded-xl text-sm font-semibold transition-all btn-press ${
                activeTab === t.id
                  ? "bg-primary text-primary-foreground shadow"
                  : `bg-white/60 ${sec.textClass} hover:bg-white/80`
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-3">
        {/* ТЕОРИЯ */}
        {activeTab === "theory" && (
          <div className="flex flex-col gap-3" data-ocid="section.theory.list">
            {sec.theory.map((item, i) => (
              <div
                key={item.title}
                className={`rounded-2xl border-2 overflow-hidden shadow-sm ${sec.borderClass}`}
                data-ocid={`section.theory.item.${i + 1}`}
              >
                <button
                  type="button"
                  onClick={() => setOpenTheory(openTheory === i ? null : i)}
                  className={`btn-press w-full flex items-center justify-between px-4 py-3 text-left font-bold text-sm transition-colors ${
                    openTheory === i
                      ? "bg-primary text-primary-foreground"
                      : `${sec.bgClass} ${sec.textClass}`
                  }`}
                >
                  <span>{item.title}</span>
                  <span
                    className="text-xl font-black transition-transform duration-300"
                    style={{
                      transform:
                        openTheory === i ? "rotate(45deg)" : "rotate(0deg)",
                    }}
                  >
                    +
                  </span>
                </button>
                <div
                  className={`topic-content${openTheory === i ? " open" : ""}`}
                >
                  <div className="px-4 py-4 text-sm leading-relaxed text-foreground/80 bg-white whitespace-pre-line">
                    {item.content}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ПРИМЕРЫ */}
        {activeTab === "examples" && (
          <div
            className="flex flex-col gap-4"
            data-ocid="section.examples.list"
          >
            {sec.examples.map((ex, i) => (
              <div
                key={ex.problem}
                className="rounded-2xl border-2 border-gray-200 overflow-hidden shadow-sm bg-white"
                data-ocid={`section.examples.item.${i + 1}`}
              >
                <div className={`${sec.bgClass} px-4 py-3 border-b`}>
                  <div className={`font-bold text-sm ${sec.textClass}`}>
                    Задача {i + 1}
                  </div>
                  <div className="font-semibold text-sm text-gray-800 mt-1">
                    {ex.problem}
                  </div>
                </div>
                <div className="px-4 py-3">
                  <div className="text-xs font-bold text-gray-400 uppercase mb-1">
                    Решение:
                  </div>
                  <div className="text-sm font-mono whitespace-pre-line text-gray-700 bg-gray-50 rounded-xl p-3">
                    {ex.solution}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ЗАДАНИЯ */}
        {activeTab === "tasks" && (
          <div className="flex flex-col gap-3" data-ocid="section.tasks.list">
            {sec.questions.map((q, i) => (
              <div
                key={q.text}
                className="rounded-2xl border-2 border-gray-200 bg-white shadow-sm p-4 flex flex-col gap-3"
                data-ocid={`section.tasks.item.${i + 1}`}
              >
                <div className="flex items-start justify-between gap-2">
                  <span className="text-sm font-semibold text-gray-800 flex-1">
                    {q.text}
                  </span>
                  <DifficultyBadge difficulty={q.difficulty} />
                </div>
                <button
                  type="button"
                  onClick={() => onStartTest(i)}
                  data-ocid={`section.tasks.start_button.${i + 1}`}
                  className={`btn-press self-end text-sm font-bold py-2 px-4 rounded-xl text-primary-foreground transition-all ${
                    sec.color === "blue"
                      ? "bg-blue-500 hover:bg-blue-600"
                      : sec.color === "red"
                        ? "bg-red-500 hover:bg-red-600"
                        : sec.color === "green"
                          ? "bg-green-600 hover:bg-green-700"
                          : sec.color === "purple"
                            ? "bg-purple-500 hover:bg-purple-600"
                            : sec.color === "orange"
                              ? "bg-orange-500 hover:bg-orange-600"
                              : "bg-teal-500 hover:bg-teal-600"
                  }`}
                >
                  Начать →
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="px-4 pb-3">
        <BackButton onClick={onBack} data-ocid="section.back_button" />
      </div>
    </div>
  );
}

// ─── Test Screen ──────────────────────────────────────────────────────────────
function TestScreen({
  sectionIdx,
  questionIdx,
  onNext,
  onDone,
  onBack,
}: {
  sectionIdx: number;
  questionIdx: number;
  onNext: (wasCorrect: boolean) => void;
  onDone: (wasCorrect: boolean) => void;
  onBack: () => void;
}) {
  const sec = MATH_SECTIONS[sectionIdx];
  const q = sec.questions[questionIdx];
  const total = sec.questions.length;
  const isLast = questionIdx === total - 1;

  const [selected, setSelected] = useState<number | null>(null);
  const answered = selected !== null;
  const isCorrect = selected === q.correct;

  const optionLabels = ["A", "B", "C", "D"];

  const handleSelect = (idx: number) => {
    if (answered) return;
    setSelected(idx);
  };

  const handleNext = () => {
    const correct = selected === q.correct;
    if (isLast) onDone(correct);
    else onNext(correct);
  };

  const getOptionStyle = (idx: number) => {
    if (!answered)
      return "bg-white border-gray-200 text-gray-800 hover:border-primary hover:bg-primary/5";
    if (idx === q.correct) return "bg-green-50 border-green-400 text-green-800";
    if (idx === selected) return "bg-red-50 border-red-400 text-red-800";
    return "bg-white border-gray-200 text-gray-400";
  };

  return (
    <div className="flex flex-col h-full animate-slide-in-right">
      {/* Header */}
      <div className={`${sec.bgClass} border-b-2 px-4 pt-4 pb-3`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">{sec.icon}</span>
            <span className={`font-bold text-sm ${sec.textClass}`}>
              {sec.title}
            </span>
          </div>
          <span className="text-xs font-bold text-gray-500 bg-white/70 px-3 py-1 rounded-full">
            {questionIdx + 1} / {total}
          </span>
        </div>
        {/* Progress bar */}
        <div className="mt-2 bg-white/60 rounded-full h-2 overflow-hidden">
          <div
            className="h-full bg-primary rounded-full transition-all duration-500"
            style={{ width: `${((questionIdx + 1) / total) * 100}%` }}
          />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-4">
        {/* Question */}
        <div className="bg-white rounded-2xl border-2 border-gray-200 shadow-sm p-4">
          <div className="text-xs font-bold text-gray-400 uppercase mb-2">
            Вопрос {questionIdx + 1}
          </div>
          <p className="font-semibold text-gray-900 text-base leading-relaxed">
            {q.text}
          </p>
          <div className="mt-2">
            <DifficultyBadge difficulty={q.difficulty} />
          </div>
        </div>

        {/* Options */}
        <div className="flex flex-col gap-2" data-ocid="test.options.list">
          {q.options.map((opt, i) => (
            <button
              key={opt}
              type="button"
              onClick={() => handleSelect(i)}
              disabled={answered}
              data-ocid={`test.option.${i + 1}`}
              className={`btn-press w-full border-2 rounded-2xl p-3 text-left flex items-center gap-3 transition-all ${getOptionStyle(
                i,
              )} ${answered ? "cursor-default" : "cursor-pointer"}`}
            >
              <span
                className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shrink-0 ${
                  answered && i === q.correct
                    ? "bg-green-500 text-white"
                    : answered && i === selected && !isCorrect
                      ? "bg-red-500 text-white"
                      : "bg-gray-100 text-gray-600"
                }`}
              >
                {optionLabels[i]}
              </span>
              <span className="text-sm font-medium">{opt}</span>
              {answered && i === q.correct && (
                <span className="ml-auto text-green-600 font-bold">✓</span>
              )}
              {answered && i === selected && !isCorrect && i !== q.correct && (
                <span className="ml-auto text-red-500 font-bold">✗</span>
              )}
            </button>
          ))}
        </div>

        {/* Result feedback */}
        {answered && (
          <div
            className={`rounded-2xl border-2 p-4 animate-fade-in ${
              isCorrect
                ? "bg-green-50 border-green-300"
                : "bg-red-50 border-red-300"
            }`}
            data-ocid={isCorrect ? "test.success_state" : "test.error_state"}
          >
            <div
              className={`font-bold text-base mb-2 ${isCorrect ? "text-green-700" : "text-red-700"}`}
            >
              {isCorrect ? "✓ Правильно!" : "✗ Неверно"}
            </div>
            <p className="text-sm leading-relaxed text-gray-700">
              {q.explanation}
            </p>
          </div>
        )}

        {/* Proceed button */}
        {answered && (
          <button
            type="button"
            onClick={handleNext}
            data-ocid={isLast ? "test.done_button" : "test.next_button"}
            className="btn-press w-full bg-primary text-primary-foreground font-bold text-base py-3 rounded-2xl shadow-md hover:brightness-105 transition-all animate-fade-in"
          >
            {isLast ? "Завершить тест" : "Следующий вопрос →"}
          </button>
        )}
      </div>

      <div className="px-4 pb-3">
        <BackButton onClick={onBack} data-ocid="test.back_button" />
      </div>
    </div>
  );
}

// ─── Score Screen ─────────────────────────────────────────────────────────────
function ScoreScreen({
  score,
  total,
  sectionIdx,
  onRetry,
  onBack,
}: {
  score: number;
  total: number;
  sectionIdx: number;
  onRetry: () => void;
  onBack: () => void;
}) {
  const sec = MATH_SECTIONS[sectionIdx];
  const pct = Math.round((score / total) * 100);
  const emoji = pct >= 80 ? "🏆" : pct >= 60 ? "👍" : pct >= 40 ? "🤔" : "📚";
  const msg =
    pct >= 80
      ? "Отлично!"
      : pct >= 60
        ? "Хорошо!"
        : pct >= 40
          ? "Неплохо, но можно лучше"
          : "Нужно повторить тему";

  return (
    <div className="flex flex-col h-full px-4 pt-8 animate-fade-in-scale">
      <BluePill>Результат теста</BluePill>
      <div className="flex-1 flex flex-col items-center justify-center gap-6">
        <div
          className={`${sec.bgClass} border-2 rounded-3xl p-8 w-full text-center shadow-md`}
        >
          <div className="text-6xl mb-4">{emoji}</div>
          <div className={`text-4xl font-black ${sec.textClass} mb-2`}>
            {score}/{total}
          </div>
          <div className="text-sm text-gray-600 mb-1">
            {pct}% правильных ответов
          </div>
          <div className={`font-bold text-lg ${sec.textClass}`}>{msg}</div>
        </div>

        {/* Progress bar */}
        <div className="w-full">
          <div className="bg-gray-200 rounded-full h-4 overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all duration-1000"
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>

        <button
          type="button"
          onClick={onRetry}
          data-ocid="score.retry_button"
          className="btn-press w-full bg-primary text-primary-foreground font-bold text-lg py-4 rounded-2xl shadow-md hover:brightness-105 transition-all"
        >
          🔄 Пройти ещё раз
        </button>
      </div>
      <BackButton onClick={onBack} data-ocid="score.back_button" />
    </div>
  );
}

// ─── App ──────────────────────────────────────────────────────────────────────
export default function App() {
  const [screen, setScreen] = useState<Screen>("loading");
  const [selectedSection, setSelectedSection] = useState(0);
  const [questionIdx, setQuestionIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const transitionRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const navigate = (to: Screen) => {
    if (transitionRef.current) clearTimeout(transitionRef.current);
    setScreen(to);
  };

  useEffect(() => {
    const t = setTimeout(() => setScreen("main"), 2500);
    return () => clearTimeout(t);
  }, []);

  const handleStartTest = (sectionIdx: number, qIdx: number) => {
    setSelectedSection(sectionIdx);
    setQuestionIdx(qIdx);
    setScore(0);
    setShowScore(false);
    navigate("test");
  };

  const handleNextQuestion = (wasCorrect: boolean) => {
    if (wasCorrect) setScore((s) => s + 1);
    setQuestionIdx((i) => i + 1);
  };

  const handleDone = (wasCorrect: boolean) => {
    if (wasCorrect) setScore((s) => s + 1);
    setShowScore(true);
  };

  const renderScreen = () => {
    if (screen === "loading") return <LoadingScreen />;
    if (screen === "main")
      return (
        <MainScreen
          onSection={(i) => {
            setSelectedSection(i);
            navigate("tasklist");
          }}
        />
      );
    if (screen === "tasklist") {
      return (
        <TaskListScreen
          sectionIdx={selectedSection}
          onTask={(qIdx) => handleStartTest(selectedSection, qIdx)}
          onBack={() => navigate("main")}
          onTheory={() => navigate("section")}
        />
      );
    }
    if (screen === "section") {
      return (
        <SectionScreen
          sectionIdx={selectedSection}
          onStartTest={(qIdx) => handleStartTest(selectedSection, qIdx)}
          onBack={() => navigate("main")}
        />
      );
    }
    if (screen === "test") {
      if (showScore) {
        return (
          <ScoreScreen
            score={score}
            total={MATH_SECTIONS[selectedSection].questions.length}
            sectionIdx={selectedSection}
            onRetry={() => {
              setScore(0);
              setQuestionIdx(0);
              setShowScore(false);
            }}
            onBack={() => {
              setShowScore(false);
              navigate("section");
            }}
          />
        );
      }
      return (
        <TestScreen
          key={questionIdx}
          sectionIdx={selectedSection}
          questionIdx={questionIdx}
          onNext={handleNextQuestion}
          onDone={handleDone}
          onBack={() => navigate("section")}
        />
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen app-bg flex items-center justify-center">
      <FloatingSymbols />
      <div
        className="relative z-10 bg-white/90 w-full max-w-[430px] min-h-screen flex flex-col shadow-2xl overflow-hidden"
        style={{ backdropFilter: "blur(2px)" }}
      >
        <main className="flex-1 flex flex-col pb-6 overflow-hidden">
          {renderScreen()}
        </main>
        <footer className="text-center text-xs text-muted-foreground pb-3 px-4">
          © {new Date().getFullYear()}. Built with ❤️ using{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-primary"
          >
            caffeine.ai
          </a>
        </footer>
      </div>
    </div>
  );
}
