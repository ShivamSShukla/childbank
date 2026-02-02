// Combined JavaScript - app.js + investments.js in ONE file
// This ensures everything loads properly!

// ============================================
// INVESTMENTS MODULE
// ============================================
const Investments = {
    cryptoMarket: [
        { id: 'btc', name: 'Bitcoin', symbol: 'BTC', price: 450000, change24h: 2.5, icon: '₿', color: '#F7931A' },
        { id: 'eth', name: 'Ethereum', symbol: 'ETH', price: 25000, change24h: -1.2, icon: 'Ξ', color: '#627EEA' },
        { id: 'doge', name: 'Dogecoin', symbol: 'DOGE', price: 8, change24h: 5.8, icon: 'Ð', color: '#C2A633' },
        { id: 'ada', name: 'Cardano', symbol: 'ADA', price: 45, change24h: 3.2, icon: '₳', color: '#0033AD' }
    ],

    stockMarket: [
        { id: 'reliance', name: 'Reliance Industries', symbol: 'RELIANCE', price: 2450, change24h: 1.5, sector: 'Energy' },
        { id: 'tcs', name: 'Tata Consultancy', symbol: 'TCS', price: 3650, change24h: -0.8, sector: 'IT' },
        { id: 'infosys', name: 'Infosys', symbol: 'INFY', price: 1580, change24h: 2.3, sector: 'IT' },
        { id: 'hdfc', name: 'HDFC Bank', symbol: 'HDFCBANK', price: 1650, change24h: 0.5, sector: 'Banking' }
    ],

    fdPlans: [
        { id: 'fd_1year', name: '1 Year Fixed Deposit', duration: 365, interestRate: 6.5, minAmount: 100, description: 'Safe and guaranteed returns for 1 year' },
        { id: 'fd_3year', name: '3 Year Fixed Deposit', duration: 1095, interestRate: 7.5, minAmount: 100, description: 'Higher returns for longer commitment' },
        { id: 'fd_5year', name: '5 Year Fixed Deposit', duration: 1825, interestRate: 8.0, minAmount: 100, description: 'Best rates for maximum savings period' }
    ],

    init() {
        this.setupEventListeners();
        this.startMarketUpdates();
    },

    setupEventListeners() {
        document.addEventListener('click', (e) => {
            if (e.target.closest('[data-investment-type]')) {
                const type = e.target.closest('[data-investment-type]').dataset.investmentType;
                this.showInvestmentModal(type);
            }
            if (e.target.closest('[data-buy-crypto]')) {
                const cryptoId = e.target.closest('[data-buy-crypto]').dataset.buyCrypto;
                this.buyCrypto(cryptoId);
            }
            if (e.target.closest('[data-buy-stock]')) {
                const stockId = e.target.closest('[data-buy-stock]').dataset.buyStock;
                this.buyStock(stockId);
            }
            if (e.target.id === 'confirm-fd') {
                this.createFD();
            }
            if (e.target.closest('[data-sell-investment]')) {
                const investmentId = e.target.closest('[data-sell-investment]').dataset.sellInvestment;
                this.sellInvestment(investmentId);
            }
        });
    },

    showInvestmentModal(type) {
        if (type === 'fd') this.showFDOptions();
        else if (type === 'crypto') this.showCryptoMarket();
        else if (type === 'stocks') this.showStockMarket();
    },

    showFDOptions() {
        const modal = document.getElementById('investment-modal');
        const content = modal.querySelector('.modal-content');
        
        content.innerHTML = `
            <span class="close-modal" data-modal="investment-modal">&times;</span>
            <h2>📊 Fixed Deposit Plans</h2>
            <p style="color: #666; margin-bottom: 20px;">Choose a plan and start earning guaranteed returns!</p>
            ${this.fdPlans.map(plan => `
                <div class="investment-option fd-plan" data-fd-id="${plan.id}" style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); color: white; padding: 20px; border-radius: 15px; margin-bottom: 15px; cursor: pointer;">
                    <h3>${plan.name}</h3>
                    <div style="font-size: 2rem; font-weight: bold; margin: 10px 0;">${plan.interestRate}% p.a.</div>
                    <p>${plan.description}</p>
                    <p style="font-size: 0.9rem; margin-top: 10px;">Minimum: ₹${plan.minAmount} | Duration: ${plan.duration} days</p>
                </div>
            `).join('')}
            <div id="fd-form" style="display: none; margin-top: 20px;">
                <div class="form-group">
                    <label>Investment Amount (CB Coins)</label>
                    <input type="number" id="fd-amount" class="form-control" min="100" placeholder="Enter amount">
                </div>
                <button id="confirm-fd" class="btn" style="width: 100%;">
                    <i class="fas fa-check-circle"></i> Invest in FD
                </button>
            </div>
        `;

        content.querySelectorAll('.fd-plan').forEach(plan => {
            plan.addEventListener('click', () => {
                content.querySelectorAll('.fd-plan').forEach(p => p.style.opacity = '0.6');
                plan.style.opacity = '1';
                plan.style.border = '3px solid white';
                document.getElementById('fd-form').style.display = 'block';
                document.getElementById('fd-form').dataset.selectedPlan = plan.dataset.fdId;
            });
        });
        modal.classList.add('show');
    },

    showCryptoMarket() {
        const modal = document.getElementById('investment-modal');
        const content = modal.querySelector('.modal-content');
        
        content.innerHTML = `
            <span class="close-modal" data-modal="investment-modal">&times;</span>
            <h2>🪙 Cryptocurrency Market</h2>
            <p style="color: #666; margin-bottom: 20px;">Buy crypto and watch your investment grow! (Educational - prices are simulated)</p>
            <div class="crypto-list">
                ${this.cryptoMarket.map(crypto => `
                    <div class="crypto-item" data-buy-crypto="${crypto.id}">
                        <div class="crypto-info">
                            <div class="crypto-icon" style="background-color: ${crypto.color}20; color: ${crypto.color};">${crypto.icon}</div>
                            <div>
                                <strong>${crypto.name}</strong>
                                <div style="font-size: 0.9rem; color: #666;">${crypto.symbol}</div>
                            </div>
                        </div>
                        <div class="crypto-price">
                            <div style="font-weight: bold;">₹${crypto.price.toLocaleString()}</div>
                            <div class="price-change ${crypto.change24h > 0 ? 'up' : 'down'}">${crypto.change24h > 0 ? '+' : ''}${crypto.change24h}%</div>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
        modal.classList.add('show');
    },

    showStockMarket() {
        const modal = document.getElementById('investment-modal');
        const content = modal.querySelector('.modal-content');
        
        content.innerHTML = `
            <span class="close-modal" data-modal="investment-modal">&times;</span>
            <h2>📈 Stock Market</h2>
            <p style="color: #666; margin-bottom: 20px;">Invest in top Indian companies! (Educational - prices are simulated)</p>
            <div class="crypto-list">
                ${this.stockMarket.map(stock => `
                    <div class="crypto-item" data-buy-stock="${stock.id}">
                        <div class="crypto-info">
                            <div class="crypto-icon" style="background-color: var(--success); color: white;">${stock.symbol.charAt(0)}</div>
                            <div>
                                <strong>${stock.name}</strong>
                                <div style="font-size: 0.9rem; color: #666;">${stock.symbol} - ${stock.sector}</div>
                            </div>
                        </div>
                        <div class="crypto-price">
                            <div style="font-weight: bold;">₹${stock.price.toLocaleString()}</div>
                            <div class="price-change ${stock.change24h > 0 ? 'up' : 'down'}">${stock.change24h > 0 ? '+' : ''}${stock.change24h}%</div>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
        modal.classList.add('show');
    },

    buyCrypto(cryptoId) {
        const crypto = this.cryptoMarket.find(c => c.id === cryptoId);
        if (!crypto) return;
        const amount = prompt(`How much would you like to invest in ${crypto.name}?\n\nCurrent price: ₹${crypto.price}\nYour balance: ₹${App.currentUser.balance}`);
        if (!amount || isNaN(amount) || amount <= 0) {
            App.showNotification('Please enter a valid amount', 'error');
            return;
        }
        const investAmount = parseFloat(amount);
        if (investAmount > App.currentUser.balance) {
            App.showNotification('Insufficient balance!', 'error');
            return;
        }
        if (investAmount < 10) {
            App.showNotification('Minimum investment is ₹10', 'error');
            return;
        }
        const quantity = investAmount / crypto.price;
        App.currentUser.balance -= investAmount;
        const investment = {
            id: 'inv_' + Date.now(),
            type: 'crypto',
            assetId: cryptoId,
            assetName: crypto.name,
            symbol: crypto.symbol,
            quantity: quantity,
            buyPrice: crypto.price,
            investedAmount: investAmount,
            currentValue: investAmount,
            purchaseDate: new Date().toISOString(),
            icon: crypto.icon,
            color: crypto.color
        };
        App.investments.push(investment);
        App.transactions.push({
            id: App.transactions.length + 1,
            userId: App.currentUser.id,
            type: 'investment',
            amount: investAmount,
            description: `Invested in ${crypto.name} (${crypto.symbol})`,
            date: new Date().toISOString().split('T')[0],
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        });
        App.saveData();
        App.updateDashboard();
        document.getElementById('investment-modal').classList.remove('show');
        App.showNotification(`Successfully invested ₹${investAmount} in ${crypto.name}!`, 'success');
    },

    buyStock(stockId) {
        const stock = this.stockMarket.find(s => s.id === stockId);
        if (!stock) return;
        const quantity = prompt(`How many shares of ${stock.name}?\n\nPrice: ₹${stock.price}\nBalance: ₹${App.currentUser.balance}`);
        if (!quantity || isNaN(quantity) || quantity <= 0 || !Number.isInteger(parseFloat(quantity))) {
            App.showNotification('Please enter valid number of shares', 'error');
            return;
        }
        const numShares = parseInt(quantity);
        const investAmount = numShares * stock.price;
        if (investAmount > App.currentUser.balance) {
            App.showNotification('Insufficient balance!', 'error');
            return;
        }
        App.currentUser.balance -= investAmount;
        const investment = {
            id: 'inv_' + Date.now(),
            type: 'stock',
            assetId: stockId,
            assetName: stock.name,
            symbol: stock.symbol,
            quantity: numShares,
            buyPrice: stock.price,
            investedAmount: investAmount,
            currentValue: investAmount,
            purchaseDate: new Date().toISOString(),
            sector: stock.sector
        };
        App.investments.push(investment);
        App.transactions.push({
            id: App.transactions.length + 1,
            userId: App.currentUser.id,
            type: 'investment',
            amount: investAmount,
            description: `Bought ${numShares} shares of ${stock.name}`,
            date: new Date().toISOString().split('T')[0],
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        });
        App.saveData();
        App.updateDashboard();
        document.getElementById('investment-modal').classList.remove('show');
        App.showNotification(`Successfully bought ${numShares} shares!`, 'success');
    },

    createFD() {
        const selectedPlanId = document.getElementById('fd-form').dataset.selectedPlan;
        const amount = parseFloat(document.getElementById('fd-amount').value);
        if (!selectedPlanId) {
            App.showNotification('Please select a FD plan', 'error');
            return;
        }
        if (!amount || amount <= 0) {
            App.showNotification('Please enter a valid amount', 'error');
            return;
        }
        const plan = this.fdPlans.find(p => p.id === selectedPlanId);
        if (amount < plan.minAmount) {
            App.showNotification(`Minimum investment is ₹${plan.minAmount}`, 'error');
            return;
        }
        if (amount > App.currentUser.balance) {
            App.showNotification('Insufficient balance!', 'error');
            return;
        }
        const maturityAmount = amount * (1 + (plan.interestRate / 100) * (plan.duration / 365));
        App.currentUser.balance -= amount;
        const fd = {
            id: 'fd_' + Date.now(),
            type: 'fd',
            planId: plan.id,
            planName: plan.name,
            investedAmount: amount,
            maturityAmount: maturityAmount,
            interestRate: plan.interestRate,
            duration: plan.duration,
            startDate: new Date().toISOString(),
            maturityDate: new Date(Date.now() + plan.duration * 24 * 60 * 60 * 1000).toISOString(),
            status: 'active'
        };
        App.investments.push(fd);
        App.transactions.push({
            id: App.transactions.length + 1,
            userId: App.currentUser.id,
            type: 'investment',
            amount: amount,
            description: `Created ${plan.name}`,
            date: new Date().toISOString().split('T')[0],
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        });
        App.saveData();
        App.updateDashboard();
        document.getElementById('investment-modal').classList.remove('show');
        App.showNotification(`FD created! You'll earn ₹${(maturityAmount - amount).toFixed(2)}!`, 'success');
    },

    sellInvestment(investmentId) {
        const investment = App.investments.find(inv => inv.id === investmentId);
        if (!investment) return;
        if (!confirm(`Sell this investment?`)) return;
        let saleAmount = 0;
        let description = '';
        if (investment.type === 'fd') {
            const daysPassed = (Date.now() - new Date(investment.startDate).getTime()) / (24 * 60 * 60 * 1000);
            const penalty = 0.02;
            saleAmount = investment.investedAmount * (1 - penalty);
            description = `FD withdrawn early - 2% penalty`;
        } else {
            saleAmount = investment.currentValue;
            description = `Sold ${investment.assetName}`;
        }
        App.currentUser.balance += saleAmount;
        const index = App.investments.findIndex(inv => inv.id === investmentId);
        App.investments.splice(index, 1);
        App.transactions.push({
            id: App.transactions.length + 1,
            userId: App.currentUser.id,
            type: 'deposit',
            amount: saleAmount,
            description: description,
            date: new Date().toISOString().split('T')[0],
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        });
        const profit = saleAmount - investment.investedAmount;
        App.saveData();
        App.updateDashboard();
        App.showNotification(`Sold! ${profit >= 0 ? 'Profit' : 'Loss'}: ₹${Math.abs(profit).toFixed(2)}`, profit >= 0 ? 'success' : 'error');
    },

    startMarketUpdates() {
        setInterval(() => {
            this.cryptoMarket.forEach(crypto => {
                const changePercent = (Math.random() - 0.5) * 5;
                crypto.price = crypto.price * (1 + changePercent / 100);
                crypto.change24h = changePercent;
            });
            this.stockMarket.forEach(stock => {
                const changePercent = (Math.random() - 0.5) * 3;
                stock.price = stock.price * (1 + changePercent / 100);
                stock.change24h = changePercent;
            });
            if (App.investments) {
                App.investments.forEach(investment => {
                    if (investment.type === 'crypto') {
                        const crypto = this.cryptoMarket.find(c => c.id === investment.assetId);
                        if (crypto) investment.currentValue = investment.quantity * crypto.price;
                    } else if (investment.type === 'stock') {
                        const stock = this.stockMarket.find(s => s.id === investment.assetId);
                        if (stock) investment.currentValue = investment.quantity * stock.price;
                    }
                });
                App.saveData();
                if (document.getElementById('investments-section')?.classList.contains('active-section')) {
                    App.updateInvestments();
                }
            }
        }, 30000);
    },

    calculateTotalInvestmentValue() {
        if (!App.investments || App.investments.length === 0) return 0;
        return App.investments.reduce((total, inv) => {
            if (inv.type === 'fd') return total + inv.investedAmount;
            else return total + inv.currentValue;
        }, 0);
    }
};

// ============================================
// MAIN APP MODULE
// ============================================
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
        if (typeof Investments !== 'undefined') {
            Investments.init();
        }
    },
    
    loadData() {
        this.users = JSON.parse(localStorage.getItem('cbi_users')) || [];
        this.transactions = JSON.parse(localStorage.getItem('cbi_transactions')) || [];
        this.goals = JSON.parse(localStorage.getItem('cbi_goals')) || [];
        this.investments = JSON.parse(localStorage.getItem('cbi_investments')) || [];
        if (this.users.length === 0) {
            this.initSampleData();
        }
    },
    
    initSampleData() {
        this.users = [{
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
        }];
        this.transactions = [
            { id: 1, userId: 1, type: 'deposit', amount: 500, description: 'Pocket Money', date: '2024-03-01', time: '10:30' },
            { id: 2, userId: 1, type: 'deposit', amount: 300, description: 'Birthday Gift', date: '2024-03-05', time: '14:20' },
            { id: 3, userId: 1, type: 'withdraw', amount: 150, description: 'Toy Purchase', date: '2024-03-10', time: '16:45' }
        ];
        this.goals = [
            { id: 1, userId: 1, name: 'New Bicycle', target: 2000, saved: 1250, icon: 'bicycle', createdAt: '2024-02-01' },
            { id: 2, userId: 1, name: 'Video Game', target: 800, saved: 400, icon: 'game', createdAt: '2024-02-15' }
        ];
        this.saveData();
    },
    
    saveData() {
        localStorage.setItem('cbi_users', JSON.stringify(this.users));
        localStorage.setItem('cbi_transactions', JSON.stringify(this.transactions));
        localStorage.setItem('cbi_goals', JSON.stringify(this.goals));
        localStorage.setItem('cbi_investments', JSON.stringify(this.investments));
    },
    
    initEventListeners() {
        document.getElementById('get-started-btn')?.addEventListener('click', () => this.showPage('login'));
        document.getElementById('switch-to-register')?.addEventListener('click', (e) => {
            e.preventDefault();
            this.showPage('register');
        });
        document.getElementById('switch-to-login')?.addEventListener('click', (e) => {
            e.preventDefault();
            this.showPage('login');
        });
        document.getElementById('login-form')?.addEventListener('submit', (e) => this.handleLogin(e));
        document.getElementById('register-form')?.addEventListener('submit', (e) => this.handleRegister(e));
        document.getElementById('logout-btn')?.addEventListener('click', () => this.handleLogout());
        document.querySelectorAll('.close-modal').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const modalId = e.target.getAttribute('data-modal');
                this.closeModal(modalId);
            });
        });
        document.querySelectorAll('.action-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const action = e.currentTarget.getAttribute('data-action');
                this.openModal(action + '-modal');
            });
        });
        document.addEventListener('click', (e) => {
            if (e.target.closest('.nav-section-btn')) {
                const section = e.target.closest('.nav-section-btn').getAttribute('data-section');
                this.showSection(section);
            }
        });
        document.getElementById('confirm-deposit')?.addEventListener('click', () => this.handleDeposit());
        document.getElementById('confirm-withdraw')?.addEventListener('click', () => this.handleWithdraw());
        document.getElementById('confirm-transfer')?.addEventListener('click', () => this.handleTransfer());
        document.getElementById('confirm-goal')?.addEventListener('click', () => this.handleAddGoal());
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
            this.showNotification('Invalid login ID or password', 'error');
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
            this.showNotification('This login ID is already taken', 'error');
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
        this.showNotification('Account created! Welcome bonus: 100 CB Coins!', 'success');
        document.getElementById('register-form').reset();
    },
    
    handleLogout() {
        this.currentUser = null;
        this.showPage('home');
        this.showNotification('Logged out successfully', 'info');
    },
    
    handleDeposit() {
        const amount = parseInt(document.getElementById('deposit-amount').value);
        const source = document.getElementById('deposit-source').value;
        if (!amount || amount <= 0) {
            this.showNotification('Please enter a valid amount', 'error');
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
            this.showNotification('Please enter a valid amount', 'error');
            return;
        }
        if (amount > this.currentUser.balance) {
            this.showNotification('Insufficient balance', 'error');
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
            this.showNotification('Please enter an account ID', 'error');
            return;
        }
        if (!amount || amount <= 0) {
            this.showNotification('Please enter a valid amount', 'error');
            return;
        }
        if (amount > this.currentUser.balance) {
            this.showNotification('Insufficient balance', 'error');
            return;
        }
        const recipient = this.users.find(u => u.accountNumber === toAccount);
        if (!recipient) {
            this.showNotification('Account not found', 'error');
            return;
        }
        if (recipient.id === this.currentUser.id) {
            this.showNotification('Cannot transfer to own account', 'error');
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
        this.showNotification('Successfully transferred ' + amount + ' CB Coins!', 'success');
    },
    
    handleAddGoal() {
        const name = document.getElementById('goal-name').value;
        const target = parseInt(document.getElementById('goal-target').value);
        const icon = document.getElementById('goal-icon').value;
        if (!name) {
            this.showNotification('Please enter a goal name', 'error');
            return;
        }
        if (!target || target <= 0) {
            this.showNotification('Please enter a valid target amount', 'error');
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
        document.getElementById('welcome-name').textContent = this.currentUser.name;
        document.getElementById('account-number').textContent = this.currentUser.accountNumber;
        document.getElementById('current-balance').textContent = this.currentUser.balance.toLocaleString();
        const investmentValue = typeof Investments !== 'undefined' ? Investments.calculateTotalInvestmentValue() : 0;
        const userGoals = this.goals.filter(g => g.userId === this.currentUser.id);
        document.getElementById('stat-savings').textContent = '₹' + this.currentUser.balance.toLocaleString();
        document.getElementById('stat-investments').textContent = '₹' + Math.round(investmentValue).toLocaleString();
        document.getElementById('stat-goals').textContent = userGoals.length;
        document.getElementById('stat-earned').textContent = '₹' + this.currentUser.totalEarned.toLocaleString();
        const updateAvatar = (id) => {
            const avatar = document.getElementById(id);
            if (avatar) {
                avatar.textContent = this.currentUser.name.charAt(0).toUpperCase();
                avatar.style.backgroundColor = this.currentUser.avatarColor;
            }
        };
        updateAvatar('user-avatar');
        updateAvatar('profile-avatar');
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
            list.innerHTML = '<p style="text-align: center; color: #666; padding: 20px;">No transactions yet</p>';
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
            list.innerHTML = '<p style="text-align: center; color: #666; grid-column: 1/-1;">No savings goals yet</p>';
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
                    <div style="font-size: 0.9rem; color: #666;">${progress.toFixed(1)}% complete</div>
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
        this.showNotification('🎮 You earned ' + reward + ' CB Coins!', 'success');
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
                            <div style="font-size: 0.9rem; color: #666;">${inv.type === 'fd' ? 'Fixed Deposit' : inv.type === 'crypto' ? 'Cryptocurrency' : 'Stock'}</div>
                        </div>
                        <button class="btn btn-danger btn-small" data-sell-investment="${inv.id}"><i class="fas fa-times"></i> Sell</button>
                    </div>
                    <div class="portfolio-value">
                        <div>Invested: ₹${inv.investedAmount.toLocaleString()}</div>
                        <div>Current: ₹${Math.round(displayValue).toLocaleString()}</div>
                        <div class="${profit >= 0 ? 'profit-positive' : 'profit-negative'}">${profit >= 0 ? '+' : ''}₹${Math.round(profit).toLocaleString()} (${profitPercent.toFixed(2)}%)</div>
                    </div>
                    ${inv.type === 'fd' ? `<div style="font-size: 0.9rem; color: #666; margin-top: 10px;">Maturity: ${new Date(inv.maturityDate).toLocaleDateString()}</div>` : ''}
                    ${inv.type === 'crypto' || inv.type === 'stock' ? `<div style="font-size: 0.9rem; color: #666; margin-top: 10px;">Quantity: ${inv.quantity.toFixed(inv.type === 'crypto' ? 6 : 0)} ${inv.symbol || ''}</div>` : ''}
                </div>
            `;
        }).join('');
    },
    
    showNotification(message, type) {
        const notification = document.getElementById('notification');
        if (!notification) return;
        notification.textContent = message;
        const colors = { success: '#4CAF50', error: '#F44336', info: '#2196F3' };
        notification.style.backgroundColor = colors[type] || colors.info;
        notification.classList.add('show');
        setTimeout(() => { notification.classList.remove('show'); }, 3000);
    },
    
    getSourceText(source) {
        const sources = { 'pocket-money': 'Pocket Money', 'gift': 'Gift', 'chores': 'Chores', 'other': 'Other Source' };
        return sources[source] || source;
    },
    
    getReasonText(reason) {
        const reasons = { 'shopping': 'Shopping', 'gift': 'Buying a Gift', 'saving': 'Moving to Real Savings', 'other': 'Other Reason' };
        return reasons[reason] || reason;
    },
    
    getRandomColor() {
        const colors = ['#FFC107', '#2196F3', '#4CAF50', '#FF9800', '#9C27B0', '#E91E63'];
        return colors[Math.floor(Math.random() * colors.length)];
    }
};

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    App.init();
});
