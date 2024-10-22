import express from 'express';
import { existsSync, readFileSync, writeFileSync } from 'fs';
import pkg from 'body-parser';
const { json } = pkg;

const app = express();
app.use(json());

const LOANS_FILE = 'loans.json';
const CUSTOMERS_FILE = 'customers.json';

const loadData = (filePath) => {
    if (!existsSync(filePath)) {
        return [];
    }
    const data = readFileSync(filePath);
    return JSON.parse(data);
};

const saveData = (filePath, data) => {
    writeFileSync(filePath, JSON.stringify(data, null, 4));
};
app.post('/lend', (req, res) => {
    const { customer_id, loan_amount, loan_period, interest_rate } = req.body;
    const interest = loan_amount * loan_period * (interest_rate / 100);
    const total_amount = loan_amount + interest;
    const monthly_emi = total_amount / loan_period;

    const loans = loadData(LOANS_FILE);
    const loan_id = loans.length + 1;  
    const loan = {
        loan_id,
        customer_id,
        loan_amount,
        loan_period,
        interest_rate,
        total_amount,
        monthly_emi,
        amount_paid: 0,
        remaining_balance: total_amount,
        status: "Active"
    };
    loans.push(loan);
    saveData(LOANS_FILE, loans);

    res.status(201).json({ TotalAmount: total_amount, MonthlyEMI: monthly_emi });
});

app.post('/payment', (req, res) => {
    const { loan_id, payment_amount } = req.body;
    const loans = loadData(LOANS_FILE);
    const loan = loans.find(l => l.loan_id === loan_id);

    if (loan) {
        loan.remaining_balance -= payment_amount;
        loan.amount_paid += payment_amount;

        if (loan.remaining_balance <= 0) {
            loan.status = 'Closed';
        }

        saveData(LOANS_FILE, loans);
        res.json({ message: 'Payment recorded successfully' });
    } else {
        res.status(404).json({ error: 'Loan not found' });
    }
});

app.get('/ledger/:loan_id', (req, res) => {
    const loan_id = parseInt(req.params.loan_id);
    const loans = loadData(LOANS_FILE);
    const loan = loans.find(l => l.loan_id === loan_id);

    if (loan) {
        res.json({
            transactions: [], 
            remaining_balance: loan.remaining_balance,
            monthly_emi: loan.monthly_emi,
            number_of_emis_left: Math.ceil(loan.remaining_balance / loan.monthly_emi)
        });
    } else {
        res.status(404).json({ error: 'Loan not found' });
    }
});

app.get('/account_overview/:customer_id', (req, res) => {
    const customer_id = parseInt(req.params.customer_id);
    const loans = loadData(LOANS_FILE);
    const customer_loans = loans.filter(l => l.customer_id === customer_id);

    if (customer_loans.length > 0) {
        const loan_details = customer_loans.map(loan => ({
            loan_amount: loan.loan_amount,
            total_amount: loan.total_amount,
            monthly_emi: loan.monthly_emi,
            amount_paid: loan.amount_paid,
            remaining_balance: loan.remaining_balance,
            status: loan.status
        }));
        res.json(loan_details);
    } else {
        res.status(404).json({ error: 'No loans found for this customer' });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
