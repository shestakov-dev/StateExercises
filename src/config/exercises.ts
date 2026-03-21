import { CounterPage } from "../pages/CounterPage";
import { DashboardPage } from "../pages/DashboardPage";
import { EcommercePage } from "../pages/EcommercePage";
import { NotificationsPage } from "../pages/NotificationsPage";
import { ShoppingCartPage } from "../pages/ShoppingCartPage";
import { ThemePage } from "../pages/ThemePage";
import { TodoPage } from "../pages/TodoPage";

export type Difficulty = "Лесна" | "Средна" | "Сложна" | "Много сложна";
export type StateApproach =
	| "useReducer"
	| "contextApi"
	| "contextReducer"
	| "multiContext"
	| "zustand"
	| "combined";

export interface Exercise {
	id: number;
	title: string;
	pageComponent: React.ComponentType;
	difficulty: Difficulty;
	stateApproach: StateApproach;
	description: string;
	hint?: string;
	codeExample?: string;
}

export const difficultyClassModifier: Record<Difficulty, string> = {
	"Лесна": "easy",
	"Средна": "medium",
	"Сложна": "hard",
	"Много сложна": "very-hard",
};

export const stateApproachLabel: Record<StateApproach, string> = {
	useReducer: "useReducer",
	contextApi: "Context API",
	contextReducer: "Context + useReducer",
	multiContext: "Multiple Contexts",
	zustand: "Zustand",
	combined: "Context + useReducer + Zustand",
};

export const exercises: Exercise[] = [
	{
		id: 1,
		title: "Брояч с useReducer",
		pageComponent: CounterPage,
		difficulty: "Лесна",
		stateApproach: "useReducer",
		description:
			"Създайте брояч, който използва useReducer вместо useState. Reducer-ът трябва да поддържа 4 действия: INCREMENT, DECREMENT, RESET и INCREMENT_BY (с payload). Покажете текущата стойност и история на действията.",
		hint:
			'В reducer-а добавете history към state: return { count: state.count + 1, history: [...state.history, "+1 -> " + (state.count + 1)] }.',
		codeExample: `function counterReducer(state, action) {
  switch (action.type) {
    case 'INCREMENT':
      return { ...state, count: state.count + 1 };
    case 'DECREMENT':
      return { ...state, count: state.count - 1 };
    case 'RESET':
      return { ...state, count: 0 };
    case 'INCREMENT_BY':
      return { ...state, count: state.count + action.payload };
    default:
      return state;
  }
}

function Counter() {
  const [state, dispatch] = useReducer(counterReducer, { count: 0 });
  // dispatch({ type: 'INCREMENT' })
  // dispatch({ type: 'INCREMENT_BY', payload: 10 })
}`,
	},
	{
		id: 2,
		title: "Theme Toggle с Context API",
		pageComponent: ThemePage,
		difficulty: "Лесна",
		stateApproach: "contextApi",
		description:
			"Създайте пълна система за тема (светла/тъмна) с Context API. Следвайте шаблона: 1) createContext, 2) ThemeProvider с state, 3) useTheme custom hook, 4) три компонента, които четат темата: Header, QuizCard и Footer.",
		hint:
			'Използвайте условен клас: className={theme === "dark" ? "dark-class" : "light-class"}. Всеки custom hook трябва да хвърля грешка ако е извън своя Provider.',
		codeExample: `const ThemeContext = createContext();

function ThemeProvider({ children }) {
  const [theme, setTheme] = useState("light");
  const toggleTheme = () =>
    setTheme(t => t === "light" ? "dark" : "light");
  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme трябва да е в ThemeProvider!");
  return ctx;
}`,
	},
	{
		id: 3,
		title: "Система за известия",
		pageComponent: NotificationsPage,
		difficulty: "Средна",
		stateApproach: "contextReducer",
		description:
			"Създайте система за известия. NotificationProvider използва useReducer вътрешно. Компонентите могат да добавят, премахват и изчистват известия чрез useNotifications() hook. Всяко известие има тип (success/error/warning) и текст.",
		hint:
			"Бонус: добавете автоматично изчезване след 5 секунди. В addNotification използвайте setTimeout(() => removeNotification(id), 5000). Генерирайте id преди dispatch и го подайте.",
		codeExample: `function notificationReducer(state, action) {
  switch (action.type) {
    case 'ADD':
      return [...state, {
        id: Date.now(), type: action.notifType,
        message: action.message,
      }];
    case 'REMOVE':
      return state.filter(n => n.id !== action.id);
    case 'CLEAR_ALL':
      return [];
  }
}

function NotificationProvider({ children }) {
  const [notifications, dispatch] = useReducer(
    notificationReducer, []
  );
  const addNotification = (type, message) =>
    dispatch({ type: 'ADD', notifType: type, message });
  // removeNotification, clearAll...
}`,
	},
	{
		id: 4,
		title: "Количка за пазаруване",
		pageComponent: ShoppingCartPage,
		difficulty: "Средна",
		stateApproach: "useReducer",
		description:
			"Създайте количка за пазаруване. useReducer управлява масив от продукти с количество. Компонентите показват каталог, количката и обобщение (общо артикули, обща цена). Actions: ADD_ITEM, REMOVE_ITEM, UPDATE_QUANTITY, CLEAR_CART.",
		hint:
			"При ADD_ITEM: ако продуктът вече е в количката — увеличи quantity. Computed values (totalItems, totalPrice) се изчисляват с .reduce() директно от cart.items.",
		codeExample: `function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existing = state.items.find(
        i => i.product.id === action.product.id
      );
      if (existing) {
        return { items: state.items.map(i =>
          i.product.id === action.product.id
            ? { ...i, quantity: i.quantity + 1 } : i
        )};
      }
      return {
        items: [...state.items,
          { product: action.product, quantity: 1 }],
      };
    }
    case 'REMOVE_ITEM':
      return { items: state.items.filter(
        i => i.product.id !== action.id
      )};
    case 'CLEAR_CART':
      return { items: [] };
  }
}`,
	},
	{
		id: 5,
		title: "Multi-Context Dashboard",
		pageComponent: DashboardPage,
		difficulty: "Сложна",
		stateApproach: "multiContext",
		description:
			"Създайте dashboard с 3 отделни Context-а: ThemeContext (светла/тъмна тема), AuthContext (login/logout), LanguageContext (BG/EN превод). Header (theme toggle + lang switch + user info), Sidebar (навигация с превод), MainContent (защитено съдържание).",
		hint:
			"Редът на Provider-ите няма значение за функционалността. Конвенцията: най-общият (Theme) е най-отвън. Всеки custom hook трябва да хвърля грешка ако е извън своя Provider.",
		codeExample: `function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <LangProvider>
          <Header />
          <div style={{ display: "flex" }}>
            <Sidebar />
            <MainContent />
          </div>
        </LangProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
// translations:
const t = {
  bg: { dashboard: "Табло", quizzes: "Тестове",
        settings: "Настройки", welcome: "Добре дошли" },
  en: { dashboard: "Dashboard", quizzes: "Quizzes",
        settings: "Settings", welcome: "Welcome" },
};`,
	},
	{
		id: 6,
		title: "Todo App със Zustand",
		pageComponent: TodoPage,
		difficulty: "Сложна",
		stateApproach: "zustand",
		description:
			"Създайте Todo приложение с Zustand store. Store-ът съдържа: todos[], filter (all/active/completed), searchQuery. Actions: addTodo, toggleTodo, deleteTodo, setFilter, setSearch. Computed: getFilteredTodos, getStats.",
		hint:
			"Винаги използвайте selector функция: useTodoStore(s => s.todos), НЕ useTodoStore().todos. Без selector — ВСЯКА промяна в store-а ще пре-рендерира компонента.",
		codeExample: `const useTodoStore = create((set, get) => ({
  todos: [...],
  filter: 'all',
  searchQuery: '',

  addTodo: (text) => set((s) => ({
    todos: [...s.todos, { id: Date.now(), text, done: false }],
  })),
  toggleTodo: (id) => set((s) => ({
    todos: s.todos.map(t =>
      t.id === id ? { ...t, done: !t.done } : t
    ),
  })),
  setFilter: (filter) => set({ filter }),
  setSearch: (q) => set({ searchQuery: q }),

  getFilteredTodos: () => {
    const { todos, filter, searchQuery } = get();
    // filter by status + search
  },
  getStats: () => { /* total, done, remaining */ },
}));`,
	},
	{
		id: 7,
		title: "Мини e-commerce",
		pageComponent: EcommercePage,
		difficulty: "Много сложна",
		stateApproach: "combined",
		description:
			"Комбинирайте ВСИЧКИ подходи: ThemeContext (Context API) за тема, AuthContext (Context API) за потребител, useReducer за количката, Zustand store за каталога (products + favorites + search + category filter).",
		hint:
			"Theme и Auth се променят рядко с Context. Количката има сложна логика с useReducer. Каталогът е глобален state с computed values в Zustand (selectors, no Provider, оптимизирани ре-рендери).",
		codeExample: `function App() {
  const [cart, cartDispatch] =
    useReducer(cartReducer, { items: [] });
  return (
    <ThemeProvider>
      <AuthProvider>
        <NavBar cartCount={cart.items.length} />
        <div style={{ display: "flex" }}>
          <div style={{ flex: 3 }}>
            <SearchBar />      {/* useProductStore */}
            <CategoryFilter /> {/* useProductStore */}
            <ProductGrid
              onAddToCart={(p) =>
                cartDispatch({ type: 'ADD_TO_CART', product: p })
              }
            />
          </div>
          <div style={{ flex: 1 }}>
            <Cart items={cart.items} dispatch={cartDispatch} />
            <FavoritesPanel /> {/* useProductStore */}
          </div>
        </div>
      </AuthProvider>
    </ThemeProvider>
  );
}`,
	},
];

export function getExerciseById(id: number): Exercise | undefined {
	return exercises.find(exercise => exercise.id === id);
}
