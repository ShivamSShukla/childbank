// Investment Management Module

const Investments = {
    // Market data (simulated)
    cryptoMarket: [
        { 
            id: 'btc', 
            name: 'Bitcoin', 
            symbol: 'BTC', 
            price: 450000, 
            change24h: 2.5,
            icon: '₿',
            color: '#F7931A'
        },
        { 
            id: 'eth', 
            name: 'Ethereum', 
            symbol: 'ETH', 
            price: 25000, 
            change24h: -1.2,
            icon: 'Ξ',
            color: '#627EEA'
        },
        { 
            id: 'doge', 
            name: 'Dogecoin', 
            symbol: 'DOGE', 
            price: 8, 
            change24h: 5.8,
            icon: 'Ð',
            color: '#C2A633'
        },
        { 
            id: 'ada', 
            name: 'Cardano', 
            symbol: 'ADA', 
            price: 45, 
            change24h: 3.2,
            icon: '₳',
            color: '#0033AD'
        }
    ],

    stockMarket: [
        { 
            id: 'reliance', 
            name: 'Reliance Industries', 
            symbol: 'RELIANCE', 
            price: 2450, 
            change24h: 1.5,
            sector: 'Energy'
        },
        { 
            id: 'tcs', 
            name: 'Tata Consultancy', 
            symbol: 'TCS', 
            price: 3650, 
            change24h: -0.8,
            sector: 'IT'
        },
        { 
            id: 'infosys', 
            name: 'Infosys', 
            symbol: 'INFY', 
            price: 1580, 
            change24h: 2.3,
            sector: 'IT'
        },
        { 
            id: 'hdfc', 
            name: 'HDFC Bank', 
            symbol: 'HDFCBANK', 
            price: 1650, 
            change24h: 0.5,
            sector: 'Banking'
        }
    ],

    fdPlans: [
        {
            id: 'fd_1year',
            name: '1 Year Fixed Deposit',
            duration: 365,
            interestRate: 6.5,
            minAmount: 100,
            description: 'Safe and guaranteed returns for 1 year'
        },
        {
            id: 'fd_3year',
            name: '3 Year Fixed Deposit',
            duration: 1095,
            interestRate: 7.5,
            minAmount: 100,
            description: 'Higher returns for longer commitment'
        },
        {
            id: 'fd_5year',
            name: '5 Year Fixed Deposit',
            duration: 1825,
            interestRate: 8.0,
            minAmount: 100,
            description: 'Best rates for maximum savings period'
        }
    ],

    // Initialize investment section
    init() {
        this.setupEventListeners();
        this.startMarketUpdates();
    },

    setupEventListeners() {
        // Investment type selection
        document.addEventListener('click', (e) => {
            if (e.target.closest('[data-investment-type]')) {
                const type = e.target.closest('[data-investment-type]').dataset.investmentType;
                this.showInvestmentModal(type);
            }

            // Buy crypto
            if (e.target.closest('[data-buy-crypto]')) {
                const cryptoId = e.target.closest('[data-buy-crypto]').dataset.buyCrypto;
                this.buyCrypto(cryptoId);
            }

            // Buy stock
            if (e.target.closest('[data-buy-stock]')) {
                const stockId = e.target.closest('[data-buy-stock]').dataset.buyStock;
                this.buyStock(stockId);
            }

            // Create FD
            if (e.target.id === 'confirm-fd') {
                this.createFD();
            }

            // Sell investment
            if (e.target.closest('[data-sell-investment]')) {
                const investmentId = e.target.closest('[data-sell-investment]').dataset.sellInvestment;
                this.sellInvestment(investmentId);
            }
        });
    },

    showInvestmentModal(type) {
        if (type === 'fd') {
            this.showFDOptions();
        } else if (type === 'crypto') {
            this.showCryptoMarket();
        } else if (type === 'stocks') {
            this.showStockMarket();
        }
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

        // Handle FD plan selection
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
                            <div class="crypto-icon" style="background-color: ${crypto.color}20; color: ${crypto.color};">
                                ${crypto.icon}
                            </div>
                            <div>
                                <strong>${crypto.name}</strong>
                                <div style="font-size: 0.9rem; color: #666;">${crypto.symbol}</div>
                            </div>
                        </div>
                        <div class="crypto-price">
                            <div style="font-weight: bold;">₹${crypto.price.toLocaleString()}</div>
                            <div class="price-change ${crypto.change24h > 0 ? 'up' : 'down'}">
                                ${crypto.change24h > 0 ? '+' : ''}${crypto.change24h}%
                            </div>
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
                            <div class="crypto-icon" style="background-color: var(--success); color: white;">
                                ${stock.symbol.charAt(0)}
                            </div>
                            <div>
                                <strong>${stock.name}</strong>
                                <div style="font-size: 0.9rem; color: #666;">${stock.symbol} - ${stock.sector}</div>
                            </div>
                        </div>
                        <div class="crypto-price">
                            <div style="font-weight: bold;">₹${stock.price.toLocaleString()}</div>
                            <div class="price-change ${stock.change24h > 0 ? 'up' : 'down'}">
                                ${stock.change24h > 0 ? '+' : ''}${stock.change24h}%
                            </div>
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

        // Calculate quantity
        const quantity = investAmount / crypto.price;

        // Deduct from balance
        App.currentUser.balance -= investAmount;

        // Create investment record
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

        // Save investment
        App.investments.push(investment);

        // Add transaction
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
        App.showNotification(`Successfully invested ₹${investAmount} in ${crypto.name}! You now own ${quantity.toFixed(6)} ${crypto.symbol}`, 'success');
    },

    buyStock(stockId) {
        const stock = this.stockMarket.find(s => s.id === stockId);
        if (!stock) return;

        const quantity = prompt(`How many shares of ${stock.name} would you like to buy?\n\nPrice per share: ₹${stock.price}\nYour balance: ₹${App.currentUser.balance}`);
        
        if (!quantity || isNaN(quantity) || quantity <= 0 || !Number.isInteger(parseFloat(quantity))) {
            App.showNotification('Please enter a valid number of shares', 'error');
            return;
        }

        const numShares = parseInt(quantity);
        const investAmount = numShares * stock.price;

        if (investAmount > App.currentUser.balance) {
            App.showNotification('Insufficient balance!', 'error');
            return;
        }

        // Deduct from balance
        App.currentUser.balance -= investAmount;

        // Create investment record
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

        // Add transaction
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
        App.showNotification(`Successfully bought ${numShares} shares of ${stock.name} for ₹${investAmount}!`, 'success');
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

        // Calculate maturity amount
        const maturityAmount = amount * (1 + (plan.interestRate / 100) * (plan.duration / 365));

        // Deduct from balance
        App.currentUser.balance -= amount;

        // Create FD record
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

        // Add transaction
        App.transactions.push({
            id: App.transactions.length + 1,
            userId: App.currentUser.id,
            type: 'investment',
            amount: amount,
            description: `Created ${plan.name} - ₹${amount} @ ${plan.interestRate}%`,
            date: new Date().toISOString().split('T')[0],
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        });

        App.saveData();
        App.updateDashboard();
        
        document.getElementById('investment-modal').classList.remove('show');
        App.showNotification(`FD created successfully! You'll earn ₹${(maturityAmount - amount).toFixed(2)} in ${plan.duration} days!`, 'success');
    },

    sellInvestment(investmentId) {
        const investment = App.investments.find(inv => inv.id === investmentId);
        if (!investment) return;

        if (!confirm(`Are you sure you want to sell this investment?`)) {
            return;
        }

        let saleAmount = 0;
        let description = '';

        if (investment.type === 'fd') {
            // Early withdrawal penalty
            const daysPassed = (Date.now() - new Date(investment.startDate).getTime()) / (24 * 60 * 60 * 1000);
            const penalty = 0.02; // 2% penalty
            saleAmount = investment.investedAmount * (1 - penalty);
            description = `FD withdrawn early (${Math.floor(daysPassed)} days) - 2% penalty applied`;
        } else if (investment.type === 'crypto' || investment.type === 'stock') {
            saleAmount = investment.currentValue;
            description = `Sold ${investment.assetName}`;
        }

        // Add to balance
        App.currentUser.balance += saleAmount;

        // Remove investment
        const index = App.investments.findIndex(inv => inv.id === investmentId);
        App.investments.splice(index, 1);

        // Add transaction
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

        App.showNotification(`Investment sold! ${profit >= 0 ? 'Profit' : 'Loss'}: ₹${Math.abs(profit).toFixed(2)}`, profit >= 0 ? 'success' : 'error');
    },

    startMarketUpdates() {
        // Update market prices every 30 seconds (simulated)
        setInterval(() => {
            this.updateMarketPrices();
        }, 30000);
    },

    updateMarketPrices() {
        // Update crypto prices
        this.cryptoMarket.forEach(crypto => {
            const changePercent = (Math.random() - 0.5) * 5; // -2.5% to +2.5%
            crypto.price = crypto.price * (1 + changePercent / 100);
            crypto.change24h = changePercent;
        });

        // Update stock prices
        this.stockMarket.forEach(stock => {
            const changePercent = (Math.random() - 0.5) * 3; // -1.5% to +1.5%
            stock.price = stock.price * (1 + changePercent / 100);
            stock.change24h = changePercent;
        });

        // Update investment values
        if (App.investments) {
            App.investments.forEach(investment => {
                if (investment.type === 'crypto') {
                    const crypto = this.cryptoMarket.find(c => c.id === investment.assetId);
                    if (crypto) {
                        investment.currentValue = investment.quantity * crypto.price;
                    }
                } else if (investment.type === 'stock') {
                    const stock = this.stockMarket.find(s => s.id === investment.assetId);
                    if (stock) {
                        investment.currentValue = investment.quantity * stock.price;
                    }
                }
            });
            
            App.saveData();
            
            // Update UI if on investments page
            if (document.getElementById('investments-section')?.classList.contains('active-section')) {
                App.updateInvestments();
            }
        }
    },

    calculateTotalInvestmentValue() {
        if (!App.investments || App.investments.length === 0) return 0;
        
        return App.investments.reduce((total, inv) => {
            if (inv.type === 'fd') {
                return total + inv.investedAmount;
            } else {
                return total + inv.currentValue;
            }
        }, 0);
    },

    calculateTotalProfit() {
        if (!App.investments || App.investments.length === 0) return 0;
        
        return App.investments.reduce((total, inv) => {
            if (inv.type === 'fd') {
                return total + (inv.maturityAmount - inv.investedAmount);
            } else {
                return total + (inv.currentValue - inv.investedAmount);
            }
        }, 0);
    }
};
