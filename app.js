// Main Application Logic
const App = {
    currentUser: null,
    users: [],
    transactions: [],
    goals: [],
    investments: [],
    
    init() {
        this.loadData();
        this.initEventListeners();
        this.updateNavigation(false);
        
        // Initialize investments module
        if (typeof Investments !== 'undefined') {
            Investments.init();
        }
    },
    
    loadData() {
        // Load from localStorage
        this.users = JSON.parse(localStorage.getItem('cbi_users')) || [];
        this.transactions = JSON.parse(localStorage.getItem('cbi_transactions')) || [];
        this.goals = JSON.parse(localStorage.getItem('cbi_goals')) || [];
        this.investments = JSON.parse(localStorage.getItem('cbi_investments')) || [];
        
        // Initialize with sample data if empty
        if (this.users.length === 0) {
            this.initSampleData();
        }
    },
    
    initSampleData() {
        this.users = [
            {
                id: 1,
                name: "Rahul Sharma",
                username: "rahul123",
                password: "password123",
                email: "parent@example.com",
                age: 10,
                accountNumber: "CB-100000001",
                balance: 1250,
                totalEarned: 1500,
                joinDate: "2024-01-15",
                avatarColor: "#FFC107"
            }
        ];
        
        this.transactions = [
            { id: 1, userId: 1, type: 'deposit', amount: 500, description: 'Pocket Money', date: '2024-03-01', time: '10:30' },
            { id: 2, userId: 1, type: 'deposit', amount: 300, description: 'Birthday Gift', date: '2024-03-05', time: '14:20' },
            { id: 3, userId: 1, type: 'withdraw', amount: 150, description: 'Toy Purchase', date: '2024-03-10', time: '16:45' },
            { id: 4, userId: 1, type: 'deposit', amount: 200, description: 'Chores', date: '2024-03-12', time: '09:15' },
            { id: 5, userId: 1, type: 'deposit', amount: 400, description: 'Weekly Allowance', date: '2024-03-15', time: '11:00' }
        ];
        
        this.goals = [
            { id: 1, userId: 1, name: 'New Bicycle', target: 2000, saved: 1250, icon: 'bicycle', createdAt: '2024-02-01' },
            { id: 2, userId: 1, name: 'Video Game', target: 800, saved: 400, icon: 'game', createdAt: '2024-02-15' }
        ];
        
        this.investments = [];
        
        this.saveData();
    },
    
    saveData() {
        localStorage.setItem('cbi_users', JSON.stringify(this.users));
        localStorage.setItem('cbi_transactions', JSON.stringify(this.transactions));
        localStorage.setItem('cbi_goals', JSON.stringify(this.goals));
        localStorage.setItem('cbi_investments', JSON.stringify(this.investments));
    },
    
    initEventListeners() {
        // Get Started button
        document.getElementById('get-started-btn')?.addEventListener('click', () => this.showPage('login'));
        
        // Form switches
        document.getElementById('switch-to-register')?.addEventListener('click', (e) => {
            e.preventDefault();
            this.showPage('register');
        });
        
        document.getElementById('switch-to-login')?.addEventListener('click', (e) => {
            e.preventDefault();
            this.showPage('login');
        });
        
        // Forms
        document.getElementById('login-form')?.addEventListener('submit', (e) => this.handleLogin(e));
        document.getElementById('register-form')?.addEventListener('submit', (e) => this.handleRegister(e));
        document.getElementById('logout-btn')?.addEventListener('click', () => this.handleLogout());
        
        // Modals
        document.querySelectorAll('.close-modal').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const modalId = e.target.getAttribute('data-modal');
                this.closeModal(modalId);
            });
        });
        
        // Quick actions
        document.querySelectorAll('.action-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const action = e.currentTarget.getAttribute('data-action');
                this.openModal(action + '-modal');
            });
        });
        
        // Navigation buttons
        document.addEventListener('click', (e) => {
            if (e.target.closest('.nav-section-btn')) {
                const section = e.target.closest('.nav-section-btn').getAttribute('data-section');
                this.showSection(section);
            }
        });
        
        // Transaction confirmations
        document.getElementById('confirm-deposit')?.addEventListener('click', () => this.handleDeposit());
        document.getElementById('confirm-withdraw')?.addEventListener('click', () => this.handleWithdraw());
        document.getElementById('confirm-transfer')?.addEventListener('click', () => this.handleTransfer());
        document.getElementById('confirm-goal')?.addEventListener('click', () => this.handleAddGoal());
        
        // Close modal on outside click
        window.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                e.target.classList.remove('show');
            }
        });
    },
    
    showPage(page) {
        document.querySelectorAll('.page-container').forEach(p => p.classList.remove('active'));
        
        if (page === 'home') {
            document.getElementById('homepage')?.classList.add('active');
            this.updateNavigation(false);
        } else if (page === 'login') {
            document.getElementById('login-container')?.classList.add('active');
            this.updateNavigation(false);
        } else if (page === 'register') {
            document.getElementById('register-container')?.classList.add('active');
            this.updateNavigation(false);
        } else if (page === 'dashboard') {
            document.getElementById('dashboard')?.classList.add('active');
            this.updateNavigation(true);
            this.updateDashboard();
        }
    },
    
    updateNavigation(isLoggedIn) {
        const mainNav = document.getElementById('main-nav');
        if (!mainNav) return;
        
        mainNav.innerHTML = '';
        
        if (isLoggedIn) {
            const items = [
                { text: 'Dashboard', section: 'dashboard-home-section' },
                { text: 'Invest', section: 'investments-section' },
                { text: 'Goals', section: 'goals-section' },
                { text: 'Games', section: 'games-section' }
            ];
            
            items.forEach(item => {
                const li = document.createElement('li');
                const a = document.createElement('a');
                a.textContent = item.text;
                a.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.showSection(item.section);
                    document.querySelectorAll('#main-nav a').forEach(link => link.classList.remove('active'));
                    a.classList.add('active');
                });
                li.appendChild(a);
                mainNav.appendChild(li);
            });
            
            mainNav.querySelector('a')?.classList.add('active');
        } else {
            const items = [
                { text: 'Home', action: () => this.showPage('home') },
                { text: 'Login', action: () => this.showPage('login') },
                { text: 'Register', action: () => this.showPage('register') }
            ];
            
            items.forEach(item => {
                const li = document.createElement('li');
                const a = document.createElement('a');
                a.textContent = item.text;
                a.addEventListener('click', (e) => {
                    e.preventDefault();
                    item.action();
                });
                li.appendChild(a);
                mainNav.appendChild(li);
            });
        }
    },
    
    showSection(sectionId) {
        document.querySelectorAll('.dashboard-section').forEach(s => s.classList.remove('active-section'));
        document.getElementById(sectionId)?.classList.add('active-section');
        
        // Update investments when showing investment section
        if (sectionId === 'investments-section') {
            this.updateInvestments();
        }
    },
    
    openModal(modalId) {
        document.getElementById(modalId)?.classList.add('show');
    },
    
    closeModal(modalId) {
        document.getElementById(modalId)?.classList.remove('show');
    },
    
    handleLogin(e) {
        e.preventDefault();
        const username = document.getElementById('login-username').value;
        const password = document.getElementById('login-password').value;
        
        const user = this.users.find(u => u.username === username && u.password === password);
        
        if (user) {
            this.currentUser = user;
            this.showPage('dashboard');
            this.showNotification('Login successful! Welcome back, ' + user.name + '!', 'success');
        } else {
            this.showNotification('Invalid login ID or password. Please try again.', 'error');
        }
    },
    
    handleRegister(e) {
        e.preventDefault();
        const name = document.getElementById('register-name').value;
        const username = document.getElementById('register-username').value;
        const password = document.getElementById('register-password').value;
        const email = document.getElementById('register-email').value;
        const age = document.getElementById('register-age').value;
        
        if (this.users.some(u => u.username === username)) {
            this.showNotification('This login ID is already taken. Please choose another.', 'error');
            return;
        }
        
        const newUser = {
            id: this.users.length + 1,
            name: name,
            username: username,
            password: password,
            email: email,
            age: parseInt(age),
            accountNumber: 'CB-' + (100000000 + this.users.length + 1),
            balance: 100,
            totalEarned: 100,
            joinDate: new Date().toISOString().split('T')[0],
            avatarColor: this.getRandomColor()
        };
        
        this.users.push(newUser);
        
        const welcomeTransaction = {
            id: this.transactions.length + 1,
            userId: newUser.id,
            type: 'deposit',
            amount: 100,
            description: 'Welcome Bonus!',
            date: new Date().toISOString().split('T')[0],
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        this.transactions.push(welcomeTransaction);
        
        this.saveData();
        this.currentUser = newUser;
        this.showPage('dashboard');
        this.showNotification('Account created successfully! You received a welcome bonus of 100 CB Coins!', 'success');
        
        document.getElementById('register-form').reset();
    },
    
    handleLogout() {
        this.currentUser = null;
        this.showPage('home');
        this.showNotification('You have been logged out successfully.', 'info');
    },
    
    handleDeposit() {
        const amount = parseInt(document.getElementById('deposit-amount').value);
        const source = document.getElementById('deposit-source').value;
        
        if (!amount || amount <= 0) {
            this.showNotification('Please enter a valid amount.', 'error');
            return;
        }
        
        this.currentUser.balance += amount;
        this.currentUser.totalEarned += amount;
        
        const newTransaction = {
            id: this.transactions.length + 1,
            userId: this.currentUser.id,
            type: 'deposit',
            amount: amount,
            description: 'Deposit from ' + this.getSourceText(source),
            date: new Date().toISOString().split('T')[0],
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        this.transactions.push(newTransaction);
        
        this.updateUserData();
        this.updateDashboard();
        this.closeModal('deposit-modal');
        document.getElementById('deposit-amount').value = '';
        
        this.showNotification('Successfully deposited ' + amount + ' CB Coins!', 'success');
    },
    
    handleWithdraw() {
        const amount = parseInt(document.getElementById('withdraw-amount').value);
        const reason = document.getElementById('withdraw-reason').value;
        
        if (!amount || amount <= 0) {
            this.showNotification('Please enter a valid amount.', 'error');
            return;
        }
        
        if (amount > this.currentUser.balance) {
            this.showNotification('Insufficient balance for this withdrawal.', 'error');
            return;
        }
        
        this.currentUser.balance -= amount;
        
        const newTransaction = {
            id: this.transactions.length + 1,
            userId: this.currentUser.id,
            type: 'withdraw',
            amount: amount,
            description: 'Withdrawal for ' + this.getReasonText(reason),
            date: new Date().toISOString().split('T')[0],
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        this.transactions.push(newTransaction);
        
        this.updateUserData();
        this.updateDashboard();
        this.closeModal('withdraw-modal');
        document.getElementById('withdraw-amount').value = '';
        
        this.showNotification('Successfully withdrew ' + amount + ' CB Coins!', 'success');
    },
    
    handleTransfer() {
        const toAccount = document.getElementById('transfer-to').value;
        const amount = parseInt(document.getElementById('transfer-amount').value);
        const note = document.getElementById('transfer-note').value;
        
        if (!toAccount) {
            this.showNotification('Please enter an account ID to transfer to.', 'error');
            return;
        }
        
        if (!amount || amount <= 0) {
            this.showNotification('Please enter a valid amount.', 'error');
            return;
        }
        
        if (amount > this.currentUser.balance) {
            this.showNotification('Insufficient balance for this transfer.', 'error');
            return;
        }
        
        const recipient = this.users.find(u => u.accountNumber === toAccount);
        
        if (!recipient) {
            this.showNotification('Account not found. Please check the account ID.', 'error');
            return;
        }
        
        if (recipient.id === this.currentUser.id) {
            this.showNotification('You cannot transfer to your own account.', 'error');
            return;
        }
        
        this.currentUser.balance -= amount;
        recipient.balance += amount;
        
        const senderTransaction = {
            id: this.transactions.length + 1,
            userId: this.currentUser.id,
            type: 'withdraw',
            amount: amount,
            description: 'Transfer to ' + recipient.name + (note ? ': ' + note : ''),
            date: new Date().toISOString().split('T')[0],
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        
        const recipientTransaction = {
            id: this.transactions.length + 2,
            userId: recipient.id,
            type: 'deposit',
            amount: amount,
            description: 'Transfer from ' + this.currentUser.name + (note ? ': ' + note : ''),
            date: new Date().toISOString().split('T')[0],
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        
        this.transactions.push(senderTransaction, recipientTransaction);
        
        const recipientIndex = this.users.findIndex(u => u.id === recipient.id);
        this.users[recipientIndex] = recipient;
        
        this.updateUserData();
        this.updateDashboard();
        this.closeModal('transfer-modal');
        document.getElementById('transfer-to').value = '';
        document.getElementById('transfer-amount').value = '';
        document.getElementById('transfer-note').value = '';
        
        this.showNotification('Successfully transferred ' + amount + ' CB Coins to ' + recipient.name + '!', 'success');
    },
    
    handleAddGoal() {
        const name = document.getElementById('goal-name').value;
        const target = parseInt(document.getElementById('goal-target').value);
        const icon = document.getElementById('goal-icon').value;
        
        if (!name) {
            this.showNotification('Please enter a goal name.', 'error');
            return;
        }
        
        if (!target || target <= 0) {
            this.showNotification('Please enter a valid target amount.', 'error');
            return;
        }
        
        const newGoal = {
            id: this.goals.length + 1,
            userId: this.currentUser.id,
            name: name,
            target: target,
            saved: 0,
            icon: icon,
            createdAt: new Date().toISOString().split('T')[0]
        };
        
        this.goals.push(newGoal);
        this.saveData();
        
        this.updateDashboard();
        this.closeModal('add-goal-modal');
        document.getElementById('goal-name').value = '';
        document.getElementById('goal-target').value = '';
        
        this.showNotification('New savings goal created: ' + name + '!', 'success');
    },
    
    updateUserData() {
        const userIndex = this.users.findIndex(u => u.id === this.currentUser.id);
        this.users[userIndex] = this.currentUser;
        this.saveData();
    },
    
    updateDashboard() {
        if (!this.currentUser) return;
        
        // Update user info
        document.getElementById('welcome-name').textContent = this.currentUser.name;
        document.getElementById('account-number').textContent = this.currentUser.accountNumber;
        document.getElementById('current-balance').textContent = this.currentUser.balance.toLocaleString();
        
        // Update stats
        const investmentValue = typeof Investments !== 'undefined' ? Investments.calculateTotalInvestmentValue() : 0;
        const userGoals = this.goals.filter(g => g.userId === this.currentUser.id);
        
        document.getElementById('stat-savings').textContent = '₹' + this.currentUser.balance.toLocaleString();
        document.getElementById('stat-investments').textContent = '₹' + Math.round(investmentValue).toLocaleString();
        document.getElementById('stat-goals').textContent = userGoals.length;
        document.getElementById('stat-earned').textContent = '₹' + this.currentUser.totalEarned.toLocaleString();
        
        // Update avatars
        const updateAvatar = (id) => {
            const avatar = document.getElementById(id);
            if (avatar) {
                avatar.textContent = this.currentUser.name.charAt(0).toUpperCase();
                avatar.style.backgroundColor = this.currentUser.avatarColor;
            }
        };
        updateAvatar('user-avatar');
        updateAvatar('profile-avatar');
        
        // Update profile
        document.getElementById('profile-name').textContent = this.currentUser.name;
        document.getElementById('profile-account').textContent = this.currentUser.accountNumber;
        document.getElementById('profile-email').value = this.currentUser.email;
        document.getElementById('profile-join-date').value = new Date(this.currentUser.joinDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
        document.getElementById('profile-total-earned').value = this.currentUser.totalEarned.toLocaleString();
        
        this.updateDashboardSummary();
        this.updateRecentActivity();
        this.updateTransactions();
        this.updateGoals();
        this.updateGames();
        this.updateAchievements();
        this.updateInvestments();
    },
    
    updateDashboardSummary() {
        const summary = document.getElementById('dashboard-summary');
        if (!summary) return;
        
        const investmentValue = typeof Investments !== 'undefined' ? Investments.calculateTotalInvestmentValue() : 0;
        const totalWealth = this.currentUser.balance + investmentValue;
        
        summary.innerHTML = `
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 15px; margin-bottom: 15px;">
                <h3>Total Wealth</h3>
                <div style="font-size: 2rem; font-weight: bold;">₹${Math.round(totalWealth).toLocaleString()}</div>
                <p style="font-size: 0.9rem; opacity: 0.9;">Balance: ₹${this.currentUser.balance} | Investments: ₹${Math.round(investmentValue)}</p>
            </div>
            <p>💡 <strong>Tip:</strong> Try investing in Fixed Deposits for guaranteed returns!</p>
        `;
    },
    
    updateRecentActivity() {
        const activity = document.getElementById('recent-activity');
        if (!activity) return;
        
        const recentTransactions = this.transactions
            .filter(t => t.userId === this.currentUser.id)
            .sort((a, b) => new Date(b.date + ' ' + b.time) - new Date(a.date + ' ' + a.time))
            .slice(0, 5);
        
        if (recentTransactions.length === 0) {
            activity.innerHTML = '<p style="text-align: center; color: #666; padding: 20px;">No recent activity</p>';
            return;
        }
        
        activity.innerHTML = recentTransactions.map(t => `
            <div class="transaction">
                <div>
                    <div><strong>${t.description}</strong></div>
                    <div style="font-size: 0.9rem; color: #666;">${t.date} at ${t.time}</div>
                </div>
                <div class="${t.type === 'deposit' ? 'transaction-income' : 'transaction-expense'}">
                    ${t.type === 'deposit' ? '+' : '-'}₹${t.amount}
                </div>
            </div>
        `).join('');
    },
    
    updateTransactions() {
        const list = document.getElementById('transaction-list');
        if (!list) return;
        
        const userTransactions = this.transactions
            .filter(t => t.userId === this.currentUser.id)
            .sort((a, b) => new Date(b.date + ' ' + b.time) - new Date(a.date + ' ' + a.time))
            .slice(0, 20);
        
        if (userTransactions.length === 0) {
            list.innerHTML = '<p style="text-align: center; color: #666; padding: 20px;">No transactions yet. Make your first deposit!</p>';
            return;
        }
        
        list.innerHTML = userTransactions.map(t => `
            <div class="transaction">
                <div>
                    <div><strong>${t.description}</strong></div>
                    <div style="font-size: 0.9rem; color: #666;">${t.date} at ${t.time}</div>
                </div>
                <div class="${t.type === 'deposit' || t.type === 'investment' ? 'transaction-income' : 'transaction-expense'}">
                    ${t.type === 'deposit' ? '+' : '-'}₹${t.amount}
                </div>
            </div>
        `).join('');
    },
    
    updateGoals() {
        const list = document.getElementById('goals-list');
        if (!list) return;
        
        const userGoals = this.goals.filter(g => g.userId === this.currentUser.id);
        
        if (userGoals.length === 0) {
            list.innerHTML = '<p style="text-align: center; color: #666; grid-column: 1/-1;">No savings goals yet. Create your first goal!</p>';
            return;
        }
        
        const icons = { bicycle: '🚲', game: '🎮', book: '📚', toy: '🧸', phone: '📱', laptop: '💻', other: '🎯' };
        
        list.innerHTML = userGoals.map(goal => {
            const progress = Math.min((goal.saved / goal.target) * 100, 100);
            const icon = icons[goal.icon] || '🎯';
            
            return `
                <div class="goal-item">
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <h3>${icon} ${goal.name}</h3>
                        <div>₹${goal.saved} / ₹${goal.target}</div>
                    </div>
                    <div class="goal-progress">
                        <div class="goal-progress-bar" style="width: ${progress}%"></div>
                    </div>
                    <div style="font-size: 0.9rem; color: #666;">
                        ${progress.toFixed(1)}% complete
                    </div>
                </div>
            `;
        }).join('');
    },
    
    updateGames() {
        const games = [
            { id: 1, name: 'Coin Counter', description: 'Learn to count money', icon: 'fas fa-coins', reward: 10 },
            { id: 2, name: 'Savings Race', description: 'Race to save money', icon: 'fas fa-running', reward: 15 },
            { id: 3, name: 'Budget Challenge', description: 'Plan a budget', icon: 'fas fa-chart-pie', reward: 20 },
            { id: 4, name: 'Money Quiz', description: 'Test your knowledge', icon: 'fas fa-question-circle', reward: 10 },
            { id: 5, name: 'Investment Simulator', description: 'Learn investing', icon: 'fas fa-chart-line', reward: 25 },
            { id: 6, name: 'Crypto Explorer', description: 'Understand crypto', icon: 'fab fa-bitcoin', reward: 20 }
        ];
        
        const grid = document.getElementById('games-grid');
        if (!grid) return;
        
        grid.innerHTML = games.map(game => `
            <div class="game-card" onclick="App.playGame(${game.id}, '${game.name}', ${game.reward})">
                <i class="${game.icon}"></i>
                <h3>${game.name}</h3>
                <p>${game.description}</p>
                <p><strong>Reward: ${game.reward} CB Coins</strong></p>
            </div>
        `).join('');
    },
    
    playGame(gameId, gameName, reward) {
        this.currentUser.balance += reward;
        this.currentUser.totalEarned += reward;
        
        const newTransaction = {
            id: this.transactions.length + 1,
            userId: this.currentUser.id,
            type: 'deposit',
            amount: reward,
            description: 'Reward from ' + gameName + ' game',
            date: new Date().toISOString().split('T')[0],
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        this.transactions.push(newTransaction);
        
        this.updateUserData();
        this.updateDashboard();
        
        this.showNotification('🎮 You earned ' + reward + ' CB Coins by playing ' + gameName + '!', 'success');
    },
    
    updateAchievements() {
        const userTransactionCount = this.transactions.filter(t => t.userId === this.currentUser.id).length;
        const userInvestmentCount = this.investments.filter(i => i.userId === this.currentUser.id || true).length;
        
        const achievements = [
            { name: 'First Deposit', description: 'Made your first deposit', icon: 'fas fa-star', achieved: userTransactionCount > 0 },
            { name: 'Savings Starter', description: 'Saved ₹500+', icon: 'fas fa-piggy-bank', achieved: this.currentUser.balance >= 500 },
            { name: 'Goal Getter', description: 'Set your first goal', icon: 'fas fa-bullseye', achieved: this.goals.some(g => g.userId === this.currentUser.id) },
            { name: 'Transaction Pro', description: 'Made 10 transactions', icon: 'fas fa-exchange-alt', achieved: userTransactionCount >= 10 },
            { name: 'Investor', description: 'Made first investment', icon: 'fas fa-chart-line', achieved: userInvestmentCount > 0 }
        ];
        
        const list = document.getElementById('achievements-list');
        if (!list) return;
        
        list.innerHTML = achievements.map(a => `
            <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 15px; padding: 10px; border-radius: 10px; background-color: ${a.achieved ? '#E8F5E9' : '#F5F5F5'};">
                <i class="${a.icon}" style="color: ${a.achieved ? '#4CAF50' : '#999'}; font-size: 1.5rem;"></i>
                <div>
                    <div><strong>${a.name}</strong></div>
                    <div style="font-size: 0.9rem; color: #666;">${a.description}</div>
                </div>
            </div>
        `).join('');
    },
    
    updateInvestments() {
        const portfolioList = document.getElementById('portfolio-list');
        if (!portfolioList) return;
        
        const userInvestments = this.investments.filter(inv => inv.userId === this.currentUser.id || !inv.userId);
        
        if (userInvestments.length === 0) {
            portfolioList.innerHTML = '<p style="text-align: center; color: #666; padding: 20px;">No investments yet. Start investing to grow your wealth!</p>';
            return;
        }
        
        portfolioList.innerHTML = userInvestments.map(inv => {
            let typeClass = inv.type;
            let profit = 0;
            let profitPercent = 0;
            let displayValue = inv.investedAmount;
            
            if (inv.type === 'fd') {
                const daysElapsed = Math.floor((Date.now() - new Date(inv.startDate).getTime()) / (1000 * 60 * 60 * 24));
                const progress = Math.min(daysElapsed / inv.duration, 1);
                const earnedInterest = (inv.maturityAmount - inv.investedAmount) * progress;
                displayValue = inv.investedAmount + earnedInterest;
                profit = earnedInterest;
                profitPercent = (profit / inv.investedAmount) * 100;
            } else {
                displayValue = inv.currentValue || inv.investedAmount;
                profit = displayValue - inv.investedAmount;
                profitPercent = (profit / inv.investedAmount) * 100;
            }
            
            return `
                <div class="portfolio-item ${typeClass}">
                    <div class="portfolio-header">
                        <div>
                            <strong>${inv.planName || inv.assetName}</strong>
                            <div style="font-size: 0.9rem; color: #666;">
                                ${inv.type === 'fd' ? 'Fixed Deposit' : inv.type === 'crypto' ? 'Cryptocurrency' : 'Stock'}
                            </div>
                        </div>
                        <button class="btn btn-danger btn-small" data-sell-investment="${inv.id}">
                            <i class="fas fa-times"></i> Sell
                        </button>
                    </div>
                    <div class="portfolio-value">
                        <div>Invested: ₹${inv.investedAmount.toLocaleString()}</div>
                        <div>Current: ₹${Math.round(displayValue).toLocaleString()}</div>
                        <div class="${profit >= 0 ? 'profit-positive' : 'profit-negative'}">
                            ${profit >= 0 ? '+' : ''}₹${Math.round(profit).toLocaleString()} (${profitPercent.toFixed(2)}%)
                        </div>
                    </div>
                    ${inv.type === 'fd' ? `
                        <div style="font-size: 0.9rem; color: #666; margin-top: 10px;">
                            Maturity: ${new Date(inv.maturityDate).toLocaleDateString()}
                        </div>
                    ` : ''}
                    ${inv.type === 'crypto' || inv.type === 'stock' ? `
                        <div style="font-size: 0.9rem; color: #666; margin-top: 10px;">
                            Quantity: ${inv.quantity.toFixed(inv.type === 'crypto' ? 6 : 0)} ${inv.symbol || ''}
                        </div>
                    ` : ''}
                </div>
            `;
        }).join('');
    },
    
    showNotification(message, type) {
        const notification = document.getElementById('notification');
        if (!notification) return;
        
        notification.textContent = message;
        
        const colors = {
            success: '#4CAF50',
            error: '#F44336',
            info: '#2196F3'
        };
        notification.style.backgroundColor = colors[type] || colors.info;
        
        notification.classList.add('show');
        
        setTimeout(() => {
            notification.classList.remove('show');
        }, 3000);
    },
    
    getSourceText(source) {
        const sources = {
            'pocket-money': 'Pocket Money',
            'gift': 'Gift',
            'chores': 'Chores',
            'other': 'Other Source'
        };
        return sources[source] || source;
    },
    
    getReasonText(reason) {
        const reasons = {
            'shopping': 'Shopping',
            'gift': 'Buying a Gift',
            'saving': 'Moving to Real Savings',
            'other': 'Other Reason'
        };
        return reasons[reason] || reason;
    },
    
    getRandomColor() {
        const colors = ['#FFC107', '#2196F3', '#4CAF50', '#FF9800', '#9C27B0', '#E91E63'];
        return colors[Math.floor(Math.random() * colors.length)];
    }
};

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    App.init();
});
