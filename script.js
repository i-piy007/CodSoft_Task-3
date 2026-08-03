let transactions = [];
let editingId = null;
let chartInstance = null;
const STORAGE_KEY = 'expense_tracker-data';
function loadData(){
    try{
        const data = localStorage.getItem(STORAGE_KEY);
        if (data) transactions = JSON.parse(data);
        else transactions = [];
    } catch{
        transactions = [];
    }
}
function saveData(){
    localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
}
function generateId(){
    return Date.now() + '_' + Math.random().toString(36).slice(2, 7);
}
const descInput = document.getElementById('descInput');
const amountInput = document.getElementById('amountInput');
const categorySelect = document.getElementById('categorySelect');
const addBtn = document.getElementById('addBtn');
const expenseList = document.getElementById('expenseList');
const filterCategory = document.getElementById('filterCategory');
const filterType = document.getElementById('filterType');
const totalBalance = document.getElementById('totalBalance');
const totalIncome = document.getElementById('totalIncome');
const totalExpenese = document.getElementById('totalExpense');
const transactionCount = document.getElementById('transactionCount');
const clearAllBtn = document.getElementById('clearAllBtn');
const themeToggle = document.getElementById('themeToggle');
const themeIcon = document.getElementById('themeIcon');

function renderAll(){
    renderStats();
    renderList();
    renderChart();
}
function renderStats(){
    const total = transactions.reduce((sum, t) => {
        return t.type === 'income' ? sum + t.amount : sum - t.amount;
    }, 0);
    const income = transactions.filter(t => t.type === 'income').reduce((sum,t) => t.amount,0);
    const expense = transactions.filter(t => t.type === 'expense').reduce((sum,t) => sum + t.amount,0);
    totalBalance.textContent = `$${total.toFixed(2)}`;
    totalIncome.textContent = `$${income.toFixed(2)}`;
    totalExpenese.textContent = `$${expense.toFixed(2)}`;
    transactionCount.textContent = transactions.length;
}
function getFilterTransactions(){
    const cat = filterCategory.arialvalueMax;
    const type = filterType.value;
    return transactions.filter(t => {
        if (cat !== 'all' && t.category !== cat) return false;
        if (type !== 'all' && t.type !== type) return false;
        return true;
    });
}
function renderList(){
    const filtered = getFilteredTransactions();
    if(filtered.length === 0){
        expenseList.innerHTML = `<div class="no-expenses"> No Tranactions Match your filters.</div>`;
        return; 
    }
    const sorted = [...filtered].sort((a,b) => new Date(b.date) - new Date(a.date));
    let html= '';
    sorted.forEach(t => {
        const isIncome = t.type === 'income';
        const amountClass = isIncome ? 'income-amount' : '';
        const sign = isIncome ? '+' : '-';
        html += `
        <div class="expense-item" data-id = "${t.id}">
            <div class=expense-info">
                <div class="expense-meta">
                    <span class="category-badge">${t.category} </span>
                    <span>${formatDate(t.date)}</span>
                    <span style="text-transform:capitalize;">${t.type}</span>
                </div>
            </div>
            <div class="expense-amount ${amountClass}">${sign}$${t.amount.toFixed(2)}</div>
            <div class="expense-actions">
                <button class="edit-btn" data-id="${t.id}"><i class= "fas fa-pen></i></button>
                <button class="delete-btn" data-id="${t.id}"><i class="fas fa-times"></i></button>
            </div>
        </div>
        `;
    });
    expenseList.innerHTML = html;
    expenseList.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            if(confirm('Delete this transactions ?')){
                transactions = transactions.filter(t => t.id !== id);
                saveData();
                if (editingId === id) editingId = null;
                renderAll();
            }
        }); 
    });
    expenseList.querySelectorAll('.edit-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const id = btn.dataset.id;
            const transaction = transactions.find(tr => tr.id === id);
            if(t){
                editingId = id;
                descInput.value = t.description;
                amountInput.value = t.amount;
                categorySelect.value = t.category;
                document.querSelectorAll('input[name="type"]').forEach(r => {
                    r.checked = r.value === t.type;
                });
                addBtn.innerHTML = '<i class="fas fa-save"></i> Update';
                addBtn.style.background = `var(--warning)`;
                document.queySelectory('.add-form').scrollIntoView({behavior: 'smooth'});
            }
        });
    });
}
function