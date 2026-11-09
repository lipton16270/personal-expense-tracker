# Personal Expense Tracker

A responsive web application for recording daily income and expenses. It calculates totals automatically and stores transactions in the browser using JavaScript LocalStorage.

## Features

- Dashboard showing total income, total expenses and current balance
- Add transactions with title, amount, type, category and date
- View transaction history
- Delete transactions
- Filter by all transactions, income or expenses
- Form validation and success notifications
- LocalStorage persistence after refresh or reopening the browser
- Responsive layout for desktop, tablet and mobile

## Technologies Used

- HTML5
- CSS3
- JavaScript
- Browser LocalStorage

## How to Run

1. Download or clone this repository.
2. Open the project folder.
3. Open `index.html` in a modern web browser.

No installation or build process is required.

## Data Storage

Transactions are saved in the browser's LocalStorage under the key `personalExpenseTracker.transactions`. Data is stored locally in the browser profile and is not synchronized to other devices.

## Project Structure

```text
personal-expense-tracker/
├── index.html
├── style.css
├── script.js
└── README.md
```

## Notes

- Enter a positive amount for each transaction.
- Choose a category and transaction date.
- The dashboard updates automatically when transactions are added or deleted.
- Clearing browser site data may remove locally stored transactions.
