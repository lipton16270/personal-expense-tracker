const STORAGE_KEY = "personalExpenseTracker.transactions";

const form = document.getElementById("transactionForm");
const titleInput = document.getElementById("title");
const amountInput = document.getElementById("amount");
const typeInput = document.getElementById("type");
const categoryInput = document.getElementById("category");
const dateInput = document.getElementById("date");
const filterInput = document.getElementById("filter");
const list = document.getElementById("transactionList");
const emptyState = document.getElementById("emptyState");
const formError = document.getElementById("formError");
const toast = document.getElementById("toast");

let transactions = loadTransactions();
let toastTimer;

function loadTransactions() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    return Array.isArray(saved) ? saved : [];
  } catch {
    return [];
  }
}

function saveTransactions() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
}

function formatMoney(value) {
  return new Intl.NumberFormat("en-BD", {
    style: "currency",
    currency: "BDT",
    minimumFractionDigits: 2
  }).format(value);
}

function formatDate(value) {
  if (!value) return "";
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day).toLocaleDateString("en-GB", {
    day: "2-digit", month: "short", year: "numeric"
  });
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2600);
}

function updateDashboard() {
  const income = transactions
    .filter(item => item.type === "income")
    .reduce((sum, item) => sum + item.amount, 0);
  const expenses = transactions
    .filter(item => item.type === "expense")
    .reduce((sum, item) => sum + item.amount, 0);

  document.getElementById("totalIncome").textContent = formatMoney(income);
  document.getElementById("totalExpenses").textContent = formatMoney(expenses);
  document.getElementById("currentBalance").textContent = formatMoney(income - expenses);
}

function renderTransactions() {
  const filter = filterInput.value;
  const visibleTransactions = transactions
    .filter(item => filter === "all" || item.type === filter)
    .slice()
    .sort((a, b) => b.date.localeCompare(a.date) || b.createdAt - a.createdAt);

  list.innerHTML = "";

  visibleTransactions.forEach(item => {
    const row = document.createElement("tr");

    const titleCell = document.createElement("td");
    titleCell.textContent = item.title;

   const categoryCell = document.createElement("td");
categoryCell.textContent = item.category;

// Display Income or Expense
const typeCell = document.createElement("td");
const typeBadge = document.createElement("span");
typeBadge.className = `type-pill ${item.type}`;
typeBadge.textContent = item.type;
typeCell.appendChild(typeBadge);

const dateCell = document.createElement("td");
dateCell.textContent = formatDate(item.date);

    const amountCell = document.createElement("td");
    amountCell.textContent = `${item.type === "income" ? "+" : "−"}${formatMoney(item.amount)}`;
    amountCell.className = item.type === "income" ? "amount-income" : "amount-expense";

    const actionCell = document.createElement("td");
    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.className = "delete-button";
    deleteButton.textContent = "×";
    deleteButton.setAttribute("aria-label", `Delete ${item.title}`);
    deleteButton.title = "Delete transaction";
    deleteButton.addEventListener("click", () => deleteTransaction(item.id));
    actionCell.appendChild(deleteButton);

    row.append(titleCell, categoryCell, typeCell, dateCell, amountCell, actionCell);
    list.appendChild(row);
  });

  emptyState.hidden = visibleTransactions.length > 0;
  document.querySelector(".table-wrap").hidden = visibleTransactions.length === 0;
  document.getElementById("transactionCount").textContent =
    `${transactions.length} ${transactions.length === 1 ? "transaction" : "transactions"}`;
}

function refreshUI() {
  updateDashboard();
  renderTransactions();
}

function deleteTransaction(id) {
  transactions = transactions.filter(item => item.id !== id);
  saveTransactions();
  refreshUI();
  showToast("Transaction deleted.");
}

form.addEventListener("submit", event => {
  event.preventDefault();
  formError.textContent = "";

  const title = titleInput.value.trim();
  const amount = Number(amountInput.value);
  const type = typeInput.value;
  const category = categoryInput.value;
  const date = dateInput.value;

  if (!title || !amountInput.value || !category || !date) {
    formError.textContent = "Please complete all fields.";
    return;
  }
  if (!Number.isFinite(amount) || amount <= 0) {
    formError.textContent = "Enter an amount greater than zero.";
    amountInput.focus();
    return;
  }
  if (!["income", "expense"].includes(type)) {
    formError.textContent = "Please select a valid transaction type.";
    return;
  }
  if (date > new Date().toISOString().slice(0, 10)) {
    formError.textContent = "Please choose today or an earlier date.";
    dateInput.focus();
    return;
  }

  transactions.push({
    id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    title,
    amount,
    type,
    category,
    date,
    createdAt: Date.now()
  });

  saveTransactions();
  refreshUI();
  form.reset();
  typeInput.value = "expense";
  dateInput.value = new Date().toISOString().slice(0, 10);
  showToast("Transaction added successfully!");
  titleInput.focus();
});

filterInput.addEventListener("change", renderTransactions);

document.getElementById("todayLabel").textContent =
  new Date().toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short", year: "numeric" });

dateInput.max = new Date().toISOString().slice(0, 10);
dateInput.value = dateInput.max;
refreshUI();
