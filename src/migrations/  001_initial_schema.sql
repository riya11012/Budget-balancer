CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

CREATE TABLE financial_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    user_id UUID NOT NULL UNIQUE,

    monthly_salary NUMERIC(12,2) NOT NULL,

    current_savings NUMERIC(12,2) DEFAULT 0,

    emergency_fund NUMERIC(12,2) DEFAULT 0,

    created_at TIMESTAMP DEFAULT NOW(),

    updated_at TIMESTAMP DEFAULT NOW(),

    CONSTRAINT fk_financial_profile_user
        FOREIGN KEY(user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
);

CREATE TABLE transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    user_id UUID NOT NULL REFERENCES users(id),

    type VARCHAR(20) NOT NULL,

    category VARCHAR(100) NOT NULL,

    amount NUMERIC(12,2) NOT NULL,

    description TEXT,

    transaction_date DATE NOT NULL,

    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE budgets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    user_id UUID NOT NULL,

    category VARCHAR(100) NOT NULL,

    monthly_limit NUMERIC(12,2) NOT NULL,

    created_at TIMESTAMP DEFAULT NOW(),

    CONSTRAINT fk_budget_user
        FOREIGN KEY(user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
);

CREATE TABLE financial_rules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    user_id UUID NOT NULL UNIQUE,

    salary_percentage NUMERIC(5,2) DEFAULT 10,

    savings_percentage NUMERIC(5,2) DEFAULT 5,

    protect_emergency_fund BOOLEAN DEFAULT TRUE,

    created_at TIMESTAMP DEFAULT NOW(),

    CONSTRAINT fk_rule_user
        FOREIGN KEY(user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
);

CREATE TABLE affordability_checks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    user_id UUID NOT NULL REFERENCES users(id),

    item_name TEXT NOT NULL,

    description TEXT,

    category TEXT NOT NULL,

    price NUMERIC(12,2) NOT NULL,

    score INTEGER NOT NULL,

    recommendation TEXT NOT NULL,

    financial_impact TEXT NOT NULL,

    reasons TEXT[] NOT NULL,

    salary_allowance NUMERIC(12,2) NOT NULL,

    savings_allowance NUMERIC(12,2) NOT NULL,

    total_allowance NUMERIC(12,2) NOT NULL,

    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE affordability_rules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    user_id UUID UNIQUE NOT NULL
    REFERENCES users(id),

    salary_percentage NUMERIC(5,2) NOT NULL,

    savings_percentage NUMERIC(5,2) NOT NULL,

    protect_emergency_fund BOOLEAN DEFAULT TRUE,

    created_at TIMESTAMP DEFAULT NOW(),

    updated_at TIMESTAMP DEFAULT NOW()
);