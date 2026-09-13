document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // ==========================================================================
  // 1. THEME MANAGEMENT (Dark / Light Mode)
  // ==========================================================================
  const themeToggleBtn = document.getElementById('theme-toggle');
  const htmlRoot = document.documentElement;

  // Check saved theme or fallback to user system preference
  const savedTheme = localStorage.getItem('payal_portfolio_theme');
  if (savedTheme) {
    htmlRoot.setAttribute('data-theme', savedTheme);
  } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
    htmlRoot.setAttribute('data-theme', 'light');
  } else {
    htmlRoot.setAttribute('data-theme', 'dark');
  }

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = htmlRoot.getAttribute('data-theme');
      const newTheme = currentTheme === 'light' ? 'dark' : 'light';
      htmlRoot.setAttribute('data-theme', newTheme);
      localStorage.setItem('payal_portfolio_theme', newTheme);
      showToast(`Switched to ${newTheme.toUpperCase()} mode`, 'info');
    });
  }

  // ==========================================================================
  // 2. NAVBAR SCROLL EFFECT & ACTIVE LINK SPY
  // ==========================================================================
  const navbar = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');
  const backToTopBtn = document.getElementById('back-to-top');

  if (navbar || backToTopBtn || navLinks.length) {
    window.addEventListener('scroll', () => {
      const scrollPos = window.scrollY;

      // Sticky Navbar blur shadow
      if (navbar) {
        if (scrollPos > 40) {
          navbar.classList.add('scrolled');
        } else {
          navbar.classList.remove('scrolled');
        }
      }

      // Back to top visibility
      if (backToTopBtn) {
        if (scrollPos > 350) {
          backToTopBtn.classList.add('show');
        } else {
          backToTopBtn.classList.remove('show');
        }
      }

      // Active link highlighting based on section position
      sections.forEach(section => {
        const sectionTop = section.offsetTop - 120;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');

        if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
          navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${sectionId}`) {
              link.classList.add('active');
            }
          });
        }
      });
    });
  }

  // Back to top click handler
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ==========================================================================
  // 3. MOBILE DRAWER NAVIGATION
  // ==========================================================================
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const closeDrawerBtn = document.getElementById('close-drawer-btn');
  const mobileDrawer = document.getElementById('mobile-drawer');
  const mobileOverlay = document.getElementById('mobile-menu-overlay');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

  function openDrawer() {
    if (!mobileDrawer || !mobileOverlay || !mobileMenuBtn) return;
    mobileDrawer.classList.add('active');
    mobileOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
    mobileMenuBtn.setAttribute('aria-expanded', 'true');
  }

  function closeDrawer() {
    if (!mobileDrawer || !mobileOverlay || !mobileMenuBtn) return;
    mobileDrawer.classList.remove('active');
    mobileOverlay.classList.remove('active');
    document.body.style.overflow = '';
    mobileMenuBtn.setAttribute('aria-expanded', 'false');
  }

  if (mobileMenuBtn) mobileMenuBtn.addEventListener('click', openDrawer);
  if (closeDrawerBtn) closeDrawerBtn.addEventListener('click', closeDrawer);
  if (mobileOverlay) mobileOverlay.addEventListener('click', closeDrawer);

  mobileNavLinks.forEach(link => {
    link.addEventListener('click', closeDrawer);
  });

  // ==========================================================================
  // 4. HERO TYPEWRITER ANIMATION
  // ==========================================================================
  const typewriterElement = document.getElementById('typewriter');
  const phrases = [
    'Frontend Web Developer',
    'BCA & MCA Scholar',
    'JavaScript ES6+ Builder',
    'Responsive UI Specialist',
    'Creative Problem Solver'
  ];
  let phraseIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingSpeed = 100;

  if (typewriterElement) {
    function typeStep() {
      const currentPhrase = phrases[phraseIndex];

      if (isDeleting) {
        typewriterElement.textContent = currentPhrase.substring(0, charIndex - 1);
        charIndex--;
        typingSpeed = 50;
      } else {
        typewriterElement.textContent = currentPhrase.substring(0, charIndex + 1);
        charIndex++;
        typingSpeed = 100;
      }

      if (!isDeleting && charIndex === currentPhrase.length) {
        typingSpeed = 1800; // Pause at end of word
        isDeleting = true;
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        typingSpeed = 400; // Pause before typing next word
      }

      setTimeout(typeStep, typingSpeed);
    }
    typeStep();
  }

  // ==========================================================================
  // 5. PROJECT FILTERING SYSTEM
  // ==========================================================================
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  if (filterBtns.length) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filterValue = btn.getAttribute('data-filter');

        projectCards.forEach(card => {
          const category = card.getAttribute('data-category');
          if (filterValue === 'all' || category === filterValue) {
            card.style.display = 'flex';
            card.style.animation = 'fadeIn 0.4s ease forwards';
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  }

  // ==========================================================================
  // 6. MODAL MANAGER (Universal open / close handling)
  // ==========================================================================
  const allModals = document.querySelectorAll('.modal-overlay');

  function openModal(modalId) {
    const targetModal = document.getElementById(modalId);
    if (targetModal) {
      targetModal.classList.add('active');
      targetModal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeModal(modalId) {
    const targetModal = document.getElementById(modalId);
    if (targetModal) {
      targetModal.classList.remove('active');
      targetModal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }
  }

  // Close modals on clicking backdrop or close buttons
  allModals.forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal || e.target.closest('[data-close]')) {
        const closeTarget = e.target.closest('[data-close]');
        const modalId = closeTarget ? closeTarget.getAttribute('data-close') : modal.id;
        closeModal(modalId);
      }
    });
  });

  // Close modals on ESC key
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      allModals.forEach(modal => {
        if (modal.classList.contains('active')) {
          closeModal(modal.id);
        }
      });
      if (mobileDrawer.classList.contains('active')) {
        closeDrawer();
      }
    }
  });

  // Wire up Resume triggers
  const resumeTriggers = [
    document.getElementById('open-resume-btn'),
    document.getElementById('drawer-resume-btn'),
    document.getElementById('hero-resume-btn'),
    ...document.querySelectorAll('.open-resume-trigger')
  ];
  resumeTriggers.forEach(btn => {
    if (btn) {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        openModal('resume-modal');
      });
    }
  });

  // Print Resume action
  const printBtns = [
    document.getElementById('print-resume-btn'),
    document.getElementById('modal-doc-print-btn')
  ];
  printBtns.forEach(btn => {
    if (btn) {
      btn.addEventListener('click', () => {
        window.print();
      });
    }
  });

  // Wire up Live Demo Launcher Buttons
  const demoLaunchBtns = document.querySelectorAll('.launch-demo-btn');
  demoLaunchBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const demoType = btn.getAttribute('data-demo');
      if (demoType === 'todo') {
        openModal('todo-modal');
      } else if (demoType === 'quote') {
        openModal('quote-modal');
      } else if (demoType === 'recipe') {
        openModal('recipe-modal');
      }
    });
  });

  // ==========================================================================
  // 7. INTERACTIVE TO-DO LIST APPLICATION (Modal 1)
  // ==========================================================================
  const todoInput = document.getElementById('demo-todo-input');
  const todoAddBtn = document.getElementById('demo-todo-add-btn');
  const todoList = document.getElementById('demo-todo-list');
  const todoFilterBtns = document.querySelectorAll('.todo-filter-btn');
  const todoClearCompletedBtn = document.getElementById('demo-todo-clear-completed');

  const countAll = document.getElementById('count-all');
  const countActive = document.getElementById('count-active');
  const countCompleted = document.getElementById('count-completed');

  let currentTodoFilter = 'all';

  if (todoList && countAll && countActive && countCompleted) {
    // Initial seed tasks or load from localStorage
    let todos = [];
    const storedTodos = localStorage.getItem('payal_demo_todos');
    if (storedTodos) {
      try {
        todos = JSON.parse(storedTodos);
      } catch (err) {
        todos = [];
      }
    }

    if (todos.length === 0) {
      todos = [
        { id: '1', text: 'Build responsive portfolio website with modern UI', completed: true },
        { id: '2', text: 'Complete frontend internship deliverables for ShriJi Agro', completed: true },
        { id: '3', text: 'Prepare for Master of Computer Applications (MCA)', completed: false },
        { id: '4', text: 'Explore Artificial Intelligence & Machine Learning foundations', completed: false }
      ];
      saveTodos();
    }

    function saveTodos() {
      localStorage.setItem('payal_demo_todos', JSON.stringify(todos));
    }

    function renderTodos() {
      todoList.innerHTML = '';

      const filtered = todos.filter(t => {
        if (currentTodoFilter === 'active') return !t.completed;
        if (currentTodoFilter === 'completed') return t.completed;
        return true;
      });

      if (filtered.length === 0) {
        todoList.innerHTML = `<li class="empty-todo-state"><i class="fa-solid fa-clipboard-check"></i> No tasks found in this view.</li>`;
      } else {
        filtered.forEach(todo => {
          const li = document.createElement('li');
          li.className = `todo-item ${todo.completed ? 'completed' : ''}`;
          li.innerHTML = `
            <div class="todo-item-left">
              <input type="checkbox" class="todo-checkbox" ${todo.completed ? 'checked' : ''} data-id="${todo.id}" />
              <span class="todo-text">${escapeHtml(todo.text)}</span>
            </div>
            <button class="todo-delete-btn" data-id="${todo.id}" title="Delete task">
              <i class="fa-solid fa-trash-can"></i>
            </button>
          `;
          todoList.appendChild(li);
        });
      }

      // Update counters
      const activeCount = todos.filter(t => !t.completed).length;
      const completedCount = todos.filter(t => t.completed).length;
      countAll.textContent = todos.length;
      countActive.textContent = activeCount;
      countCompleted.textContent = completedCount;
    }

    function addTodo() {
      const text = todoInput.value.trim();
      if (!text) {
        showToast('Please type a task before adding!', 'error');
        return;
      }

      const newTodo = {
        id: Date.now().toString(),
        text,
        completed: false
      };

      todos.unshift(newTodo);
      saveTodos();
      renderTodos();
      todoInput.value = '';
      showToast('Task added to your list!', 'success');
    }

    todoAddBtn.addEventListener('click', addTodo);
    todoInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        addTodo();
      }
    });

    todoList.addEventListener('click', (e) => {
      const checkbox = e.target.closest('.todo-checkbox');
      if (checkbox) {
        const id = checkbox.getAttribute('data-id');
        const item = todos.find(t => t.id === id);
        if (item) {
          item.completed = checkbox.checked;
          saveTodos();
          renderTodos();
          showToast(item.completed ? 'Task marked complete!' : 'Task marked active', 'info');
        }
        return;
      }

      const deleteBtn = e.target.closest('.todo-delete-btn');
      if (deleteBtn) {
        const id = deleteBtn.getAttribute('data-id');
        todos = todos.filter(t => t.id !== id);
        saveTodos();
        renderTodos();
        showToast('Task deleted', 'info');
      }
    });

    todoFilterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        todoFilterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentTodoFilter = btn.getAttribute('data-todo-filter');
        renderTodos();
      });
    });

    todoClearCompletedBtn.addEventListener('click', () => {
      const initialLen = todos.length;
      todos = todos.filter(t => !t.completed);
      if (todos.length < initialLen) {
        saveTodos();
        renderTodos();
        showToast('Cleared all completed tasks', 'info');
      } else {
        showToast('No completed tasks to clear', 'info');
      }
    });

    renderTodos();
  }

  // ==========================================================================
  // 8. RANDOM QUOTE GENERATOR (Modal 2)
  // ==========================================================================
  const quotesData = [
    { text: "Simplicity is the soul of efficiency.", author: "Austin Freeman", category: "Software Design" },
    { text: "Make it work, make it right, make it fast.", author: "Kent Beck", category: "Engineering" },
    { text: "First, solve the problem. Then, write the code.", author: "John Johnson", category: "Problem Solving" },
    { text: "Code is like humor. When you have to explain it, it’s bad.", author: "Cory House", category: "Clean Code" },
    { text: "Experience is the name everyone gives to their mistakes.", author: "Oscar Wilde", category: "Learning" },
    { text: "In order to be irreplaceable, one must always be different.", author: "Coco Chanel", category: "Inspiration" },
    { text: "Knowledge is power, but enthusiasm pulls the switch.", author: "Ivern Ball", category: "Motivation" },
    { text: "Any fool can write code that a computer can understand. Good programmers write code that humans can understand.", author: "Martin Fowler", category: "Craftsmanship" },
    { text: "The only way to do great work is to love what you do.", author: "Steve Jobs", category: "Passion" },
    { text: "Talk is cheap. Show me the code.", author: "Linus Torvalds", category: "Action" },
    { text: "Perfection is achieved not when there is nothing more to add, but when there is nothing left to take away.", author: "Antoine de Saint-Exupéry", category: "Design" }
  ];

  const quoteTextElem = document.getElementById('quote-text');
  const quoteAuthorElem = document.getElementById('quote-author');
  const quoteCategoryElem = document.getElementById('quote-category');
  const newQuoteBtn = document.getElementById('new-quote-btn');
  const copyQuoteBtn = document.getElementById('copy-quote-btn');

  if (quoteTextElem && quoteAuthorElem && quoteCategoryElem && newQuoteBtn && copyQuoteBtn) {
    function getRandomQuote() {
      const randomIndex = Math.floor(Math.random() * quotesData.length);
      const selected = quotesData[randomIndex];

      // Smooth fade effect
      quoteTextElem.style.opacity = '0';
      quoteAuthorElem.style.opacity = '0';

      setTimeout(() => {
        quoteTextElem.textContent = `"${selected.text}"`;
        quoteAuthorElem.innerHTML = `&mdash; ${selected.author}`;
        quoteCategoryElem.textContent = selected.category;

        quoteTextElem.style.opacity = '1';
        quoteAuthorElem.style.opacity = '1';
      }, 200);
    }

    newQuoteBtn.addEventListener('click', getRandomQuote);

    copyQuoteBtn.addEventListener('click', () => {
      const fullText = `${quoteTextElem.textContent} ${quoteAuthorElem.textContent}`;
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(fullText).then(() => {
          showToast('Quote copied to clipboard!', 'success');
        }).catch(() => {
          fallbackCopy(fullText);
        });
      } else {
        fallbackCopy(fullText);
      }
    });
  }

  function fallbackCopy(text) {
    const tempInput = document.createElement('textarea');
    tempInput.value = text;
    document.body.appendChild(tempInput);
    tempInput.select();
    document.execCommand('copy');
    document.body.removeChild(tempInput);
    showToast('Quote copied to clipboard!', 'success');
  }

  // ==========================================================================
  // 9. RECIPE FINDER APP DEMO (Modal 3)
  // ==========================================================================
  const recipesDatabase = [
    {
      id: 1,
      title: "Classic Margherita Pizza",
      category: "italian",
      desc: "Crispy crust topped with rich tomato reduction, fresh buffalo mozzarella, and aromatic basil leaves.",
      time: "25 mins",
      difficulty: "Easy",
      ingredients: ["Flour", "Tomato Sauce", "Mozzarella", "Fresh Basil", "Olive Oil"]
    },
    {
      id: 2,
      title: "Creamy Paneer Butter Masala",
      category: "indian",
      desc: "Tender paneer cubes simmered in a spiced, buttery tomato & cashew gravy with aromatic kasuri methi.",
      time: "35 mins",
      difficulty: "Medium",
      ingredients: ["Paneer", "Tomatoes", "Butter", "Cashews", "Cream", "Spices"]
    },
    {
      id: 3,
      title: "Mediterranean Quinoa Salad",
      category: "healthy",
      desc: "Nutrient-rich fluffy quinoa tossed with crisp cucumber, cherry tomatoes, kalamata olives, and lemon dressing.",
      time: "15 mins",
      difficulty: "Easy",
      ingredients: ["Quinoa", "Cucumber", "Cherry Tomatoes", "Feta Cheese", "Lemon Dressing"]
    },
    {
      id: 4,
      title: "Molten Chocolate Lava Cake",
      category: "dessert",
      desc: "Decadent warm chocolate cake with a rich, velvety molten chocolate center. Served warm with vanilla gelato.",
      time: "20 mins",
      difficulty: "Medium",
      ingredients: ["Dark Chocolate", "Butter", "Eggs", "Flour", "Vanilla"]
    },
    {
      id: 5,
      title: "Creamy Garlic Parmesan Pasta",
      category: "italian",
      desc: "Fettuccine pasta enrobed in a rich garlic, butter, and freshly grated aged Parmesan cheese cream sauce.",
      time: "20 mins",
      difficulty: "Easy",
      ingredients: ["Fettuccine", "Garlic", "Heavy Cream", "Parmesan", "Parsley"]
    },
    {
      id: 6,
      title: "Spiced Dal Tadka with Jeera Rice",
      category: "indian",
      desc: "Yellow lentils tempered with ghee, cumin seeds, garlic, dried red chilies, and garnished with fresh coriander.",
      time: "30 mins",
      difficulty: "Easy",
      ingredients: ["Toor Dal", "Ghee", "Cumin Seeds", "Garlic", "Turmeric", "Basmati Rice"]
    },
    {
      id: 7,
      title: "Avocado & Chickpea Power Bowl",
      category: "healthy",
      desc: "Roasted chickpeas, ripe Hass avocado, baby spinach, roasted sweet potatoes, and tahini drizzle.",
      time: "20 mins",
      difficulty: "Easy",
      ingredients: ["Chickpeas", "Avocado", "Spinach", "Sweet Potato", "Tahini"]
    },
    {
      id: 8,
      title: "Berry Tiramisu Parfait",
      category: "dessert",
      desc: "Layers of espresso-soaked ladyfingers, velvety mascarpone cream, and fresh raspberry coulis.",
      time: "15 mins",
      difficulty: "Easy",
      ingredients: ["Ladyfingers", "Mascarpone", "Espresso", "Berries", "Cocoa"]
    }
  ];

  const recipeSearchInput = document.getElementById('recipe-search-input');
  const recipePills = document.querySelectorAll('.recipe-pill');
  const recipeResultsGrid = document.getElementById('recipe-results-grid');

  let activeRecipeTag = 'all';

  if (recipeSearchInput && recipeResultsGrid) {
    function renderRecipes() {
      const query = (recipeSearchInput.value || '').toLowerCase().trim();

      const filtered = recipesDatabase.filter(recipe => {
        const matchesTag = (activeRecipeTag === 'all') || (recipe.category === activeRecipeTag);
        const matchesSearch = !query ||
          recipe.title.toLowerCase().includes(query) ||
          recipe.desc.toLowerCase().includes(query) ||
          recipe.ingredients.some(ing => ing.toLowerCase().includes(query));

        return matchesTag && matchesSearch;
      });

      recipeResultsGrid.innerHTML = '';

      if (filtered.length === 0) {
        recipeResultsGrid.innerHTML = `
          <div style="grid-column: 1 / -1; text-align: center; padding: 2rem; color: var(--text-muted);">
            <i class="fa-solid fa-utensils" style="font-size: 2rem; margin-bottom: 0.5rem; opacity: 0.5;"></i>
            <p>No recipes found matching "${escapeHtml(query)}". Try another search term!</p>
          </div>
        `;
        return;
      }

      filtered.forEach(recipe => {
        const card = document.createElement('div');
        card.className = 'recipe-item-card';
        card.innerHTML = `
          <div class="recipe-card-header">
            <span class="recipe-tag">${recipe.category.toUpperCase()}</span>
            <span style="font-size: 0.75rem; color: var(--text-muted);"><i class="fa-regular fa-clock"></i> ${recipe.time}</span>
          </div>
          <h4 class="recipe-card-title">${escapeHtml(recipe.title)}</h4>
          <p class="recipe-card-desc">${escapeHtml(recipe.desc)}</p>
          <div class="recipe-meta">
            <span><i class="fa-solid fa-gauge-simple-high"></i> ${recipe.difficulty}</span>
            <span style="color: var(--primary); cursor: pointer;" class="recipe-view-btn" data-id="${recipe.id}">
              <i class="fa-solid fa-eye"></i> View Ingredients
            </span>
          </div>
        `;
        recipeResultsGrid.appendChild(card);
      });
    }

    recipeSearchInput.addEventListener('input', renderRecipes);

    recipePills.forEach(pill => {
      pill.addEventListener('click', () => {
        recipePills.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        activeRecipeTag = pill.getAttribute('data-recipe-tag');
        renderRecipes();
      });
    });

    recipeResultsGrid.addEventListener('click', (e) => {
      const viewBtn = e.target.closest('.recipe-view-btn');
      if (viewBtn) {
        const recipeId = parseInt(viewBtn.getAttribute('data-id'), 10);
        const recipe = recipesDatabase.find(r => r.id === recipeId);
        if (recipe) {
          showToast(`${recipe.title} ingredients: ${recipe.ingredients.join(', ')}`, 'info');
        }
      }
    });

    renderRecipes();
  }

  // ==========================================================================
  // 10. PROJECT DETAILS MODAL POPULATOR
  // ==========================================================================
  const projectDetailsMap = {
    agro: {
      title: "ShriJi Agro Products Company Website",
      sub: "Corporate Web Project &bull; Frontend Internship",
      body: `
        <div style="line-height: 1.7; color: var(--text-muted);">
          <p style="margin-bottom: 1rem;"><strong style="color: var(--text-main);">Project Overview:</strong> An end-to-end responsive commercial website built for ShriJi Agro Products Pvt. Ltd. to showcase their complete portfolio of agricultural supplies, machinery, fertilizers, and corporate service offerings.</p>
          <h4 style="color: var(--text-main); margin-bottom: 0.5rem;"><i class="fa-solid fa-check-double" style="color: var(--accent-emerald);"></i> Key Highlights:</h4>
          <ul style="padding-left: 1.25rem; margin-bottom: 1rem; list-style: disc;">
            <li>100% Mobile-first layouts using CSS Flexbox and Grid, tested across iOS and Android browsers.</li>
            <li>Interactive product catalogs with instant filtering and customer inquiry modal forms.</li>
            <li>Cross-browser performance optimization, asset compression, and clean modular code.</li>
            <li>Collaborated using Git and agile sprint reviews with team members and senior mentor.</li>
          </ul>
          <p><strong style="color: var(--text-main);">Tech Stack:</strong> HTML5, CSS3, CSS Flexbox, JavaScript ES6+, Responsive Design.</p>
        </div>
      `
    },
    recipe: {
      title: "Recipe Finder Web Application",
      sub: "API Integration & DOM Manipulation",
      body: `
        <div style="line-height: 1.7; color: var(--text-muted);">
          <p style="margin-bottom: 1rem;"><strong style="color: var(--text-main);">Project Overview:</strong> A dynamic culinary search application that allows food enthusiasts to discover delicious dishes by query, dietary tag, or available pantry ingredients.</p>
          <h4 style="color: var(--text-main); margin-bottom: 0.5rem;"><i class="fa-solid fa-code" style="color: var(--primary);"></i> Architecture &amp; Functionality:</h4>
          <ul style="padding-left: 1.25rem; margin-bottom: 1rem; list-style: disc;">
            <li>Asynchronous REST API consumption and dynamic DOM rendering.</li>
            <li>Instant client-side debounced search and category pill filtering.</li>
            <li>Ingredient checklist view and responsive card grid layout.</li>
            <li>Interactive live demo directly accessible via this portfolio's project section.</li>
          </ul>
          <p><strong style="color: var(--text-main);">Tech Stack:</strong> JavaScript (ES6+), Fetch API, CSS Grid, DOM Manipulation, Custom Modals.</p>
        </div>
      `
    },
    todo: {
      title: "Smart Task Manager with LocalStorage",
      sub: "Web Storage API & State Management",
      body: `
        <div style="line-height: 1.7; color: var(--text-muted);">
          <p style="margin-bottom: 1rem;"><strong style="color: var(--text-main);">Project Overview:</strong> A productivity web tool engineered to help users manage daily workflows, featuring complete task lifecycle controls and persistent browser storage.</p>
          <h4 style="color: var(--text-main); margin-bottom: 0.5rem;"><i class="fa-solid fa-database" style="color: var(--secondary);"></i> Key Technical Features:</h4>
          <ul style="padding-left: 1.25rem; margin-bottom: 1rem; list-style: disc;">
            <li>CRUD Operations: Add, read, update completion status, and remove tasks.</li>
            <li>Data Persistence: Stores serialized task records via browser <code>localStorage</code>.</li>
            <li>Dynamic Filtering: Real-time filtering by All, Active, and Completed tasks.</li>
            <li>Live Counters: Dynamic status indicators that update automatically on mutation.</li>
          </ul>
          <p><strong style="color: var(--text-main);">Tech Stack:</strong> HTML5, CSS3, JavaScript ES6+, Web Storage API.</p>
        </div>
      `
    },
    quote: {
      title: "Inspirational Random Quote Generator",
      sub: "Clipboard API & Micro-interactions",
      body: `
        <div style="line-height: 1.7; color: var(--text-muted);">
          <p style="margin-bottom: 1rem;"><strong style="color: var(--text-main);">Project Overview:</strong> An interactive quote machine delivering inspiring programming philosophy and personal motivation quotes with single-click clipboard copying.</p>
          <h4 style="color: var(--text-main); margin-bottom: 0.5rem;"><i class="fa-solid fa-wand-magic-sparkles" style="color: var(--accent-amber);"></i> Key Capabilities:</h4>
          <ul style="padding-left: 1.25rem; margin-bottom: 1rem; list-style: disc;">
            <li>Randomization algorithm with duplicate-prevention state handling.</li>
            <li>Native Async Clipboard API integration with cross-browser fallback support.</li>
            <li>Smooth CSS transition animations during quote swaps.</li>
            <li>Fully playable right inside the live demo modal in this portfolio!</li>
          </ul>
          <p><strong style="color: var(--text-main);">Tech Stack:</strong> JavaScript, Async Clipboard API, CSS Keyframes.</p>
        </div>
      `
    }
  };

  const viewDetailsBtns = document.querySelectorAll('.view-details-btn');
  const detailsModalTitle = document.getElementById('details-modal-title');
  const detailsModalSub = document.getElementById('details-modal-sub');
  const detailsModalBody = document.getElementById('details-modal-body');

  viewDetailsBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const projectKey = btn.getAttribute('data-project');
      const details = projectDetailsMap[projectKey];
      if (details) {
        detailsModalTitle.textContent = details.title;
        detailsModalSub.innerHTML = details.sub;
        detailsModalBody.innerHTML = details.body;
        openModal('details-modal');
      }
    });
  });

  // Copy Project Summary button
  const copyProjectSummaryBtns = document.querySelectorAll('.copy-project-summary');
  copyProjectSummaryBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const projectKey = btn.getAttribute('data-project');
      if (projectKey === 'agro') {
        const text = "ShriJi Agro Products Corporate Website: Full responsive website delivered end-to-end during frontend internship by Payal Garg. Built with HTML5, CSS3, Flexbox, and JavaScript.";
        navigator.clipboard.writeText(text).then(() => {
          showToast('Project summary copied to clipboard!', 'success');
        });
      }
    });
  });

  // ==========================================================================
  // 11. CONTACT FORM VALIDATION & INTERACTIVE SUBMISSION
  // ==========================================================================
  const contactForm = document.getElementById('portfolio-contact-form');
  const submitBtn = document.getElementById('submit-btn');
  const btnText = submitBtn ? submitBtn.querySelector('.btn-text') : null;
  const btnLoading = submitBtn ? submitBtn.querySelector('.btn-loading') : null;

  const nameInput = document.getElementById('contact-name');
  const emailInput = document.getElementById('contact-email');
  const messageInput = document.getElementById('contact-message');

  function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }

  if (contactForm && submitBtn && nameInput && emailInput && messageInput) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      let isValid = true;

      // Reset error states
      [nameInput, emailInput, messageInput].forEach(inp => {
        inp.closest('.form-group').classList.remove('has-error');
      });

      // Validate Name
      if (!nameInput.value.trim()) {
        nameInput.closest('.form-group').classList.add('has-error');
        isValid = false;
      }

      // Validate Email
      if (!emailInput.value.trim() || !validateEmail(emailInput.value.trim())) {
        emailInput.closest('.form-group').classList.add('has-error');
        isValid = false;
      }

      // Validate Message
      if (!messageInput.value.trim()) {
        messageInput.closest('.form-group').classList.add('has-error');
        isValid = false;
      }

      if (!isValid) {
        showToast('Please fix the highlighted fields.', 'error');
        return;
      }

      // Simulation of sending with loading spinner
      btnText.classList.add('d-none');
      btnLoading.classList.remove('d-none');
      submitBtn.disabled = true;

      setTimeout(() => {
        btnText.classList.remove('d-none');
        btnLoading.classList.add('d-none');
        submitBtn.disabled = false;

        const userName = nameInput.value.trim();
        showToast(`Thank you, ${userName}! Your message has been sent successfully.`, 'success');
        contactForm.reset();
      }, 1200);
    });
  }

  // ==========================================================================
  // 12. TOAST NOTIFICATION SYSTEM
  // ==========================================================================
  function showToast(message, type = 'info', duration = 3500) {
    const toastContainer = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;

    let iconClass = 'fa-info-circle';
    if (type === 'success') iconClass = 'fa-circle-check';
    if (type === 'error') iconClass = 'fa-circle-exclamation';

    toast.innerHTML = `
      <i class="fa-solid ${iconClass}"></i>
      <span>${escapeHtml(message)}</span>
    `;

    toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.style.animation = 'slideToast 0.3s cubic-bezier(0.16, 1, 0.3, 1) reverse forwards';
      setTimeout(() => {
        if (toastContainer.contains(toast)) {
          toastContainer.removeChild(toast);
        }
      }, 300);
    }, duration);
  }

  // ==========================================================================
  // 13. UTILITY FUNCTIONS & COPYRIGHT YEAR
  // ==========================================================================
  function escapeHtml(str) {
    if (!str) return '';
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // Set current year in footer
  const currentYearSpan = document.getElementById('current-year');
  if (currentYearSpan) {
    currentYearSpan.textContent = new Date().getFullYear();
  }

});
