CREATE TABLE IF NOT EXISTS bandwidth_packages (
  id INT PRIMARY KEY AUTO_INCREMENT,
  speed_label VARCHAR(20) NOT NULL UNIQUE,
  monthly_cost DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS lan_pricing_tiers (
  id INT PRIMARY KEY AUTO_INCREMENT,
  min_nodes INT NOT NULL,
  max_nodes INT NOT NULL,
  cost DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT chk_lan_pricing_tiers_min CHECK (min_nodes > 0),
  CONSTRAINT chk_lan_pricing_tiers_max CHECK (max_nodes >= min_nodes)
);

CREATE TABLE IF NOT EXISTS system_users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(50) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  full_name VARCHAR(100) NOT NULL,
  role ENUM('Admin', 'Staff') NOT NULL DEFAULT 'Staff',
  status ENUM('Active', 'Inactive') NOT NULL DEFAULT 'Active',
  last_login_at DATETIME NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS institutions (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  postal_address VARCHAR(200) NULL,
  town VARCHAR(100) NOT NULL,
  county VARCHAR(100) NOT NULL,
  institution_type ENUM('Primary', 'Junior', 'Senior', 'College') NOT NULL,
  bandwidth_package_id INT NOT NULL,
  registration_date DATE NOT NULL,
  status ENUM('Active', 'Disconnected', 'Suspended') NOT NULL DEFAULT 'Active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT uq_institutions_name_town UNIQUE (name, town),
  CONSTRAINT fk_institutions_bandwidth_package
    FOREIGN KEY (bandwidth_package_id) REFERENCES bandwidth_packages(id)
    ON UPDATE CASCADE ON DELETE RESTRICT
);

CREATE TABLE IF NOT EXISTS contact_people (
  id INT PRIMARY KEY AUTO_INCREMENT,
  institution_id INT NOT NULL UNIQUE,
  full_name VARCHAR(100) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  email VARCHAR(100) NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_contact_people_institution
    FOREIGN KEY (institution_id) REFERENCES institutions(id)
    ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS payments (
  id INT PRIMARY KEY AUTO_INCREMENT,
  institution_id INT NOT NULL,
  payment_type ENUM('Registration', 'Installation', 'Monthly', 'Fine', 'Reconnection') NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  payment_date DATE NOT NULL,
  billing_month TINYINT NULL,
  billing_year SMALLINT NULL,
  due_date DATE NULL,
  status ENUM('Paid', 'Pending', 'Overdue') NOT NULL DEFAULT 'Paid',
  notes TEXT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT chk_payments_amount CHECK (amount > 0),
  CONSTRAINT fk_payments_institution
    FOREIGN KEY (institution_id) REFERENCES institutions(id)
    ON UPDATE CASCADE ON DELETE RESTRICT
);

CREATE TABLE IF NOT EXISTS fines (
  id INT PRIMARY KEY AUTO_INCREMENT,
  institution_id INT NOT NULL,
  payment_id INT NULL,
  base_amount DECIMAL(10, 2) NOT NULL,
  fine_rate DECIMAL(5, 2) NOT NULL DEFAULT 0.15,
  fine_amount DECIMAL(10, 2) NOT NULL,
  applied_date DATE NOT NULL,
  status ENUM('Pending', 'Paid', 'Waived') NOT NULL DEFAULT 'Pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_fines_institution
    FOREIGN KEY (institution_id) REFERENCES institutions(id)
    ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT fk_fines_payment
    FOREIGN KEY (payment_id) REFERENCES payments(id)
    ON UPDATE CASCADE ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS disconnections (
  id INT PRIMARY KEY AUTO_INCREMENT,
  institution_id INT NOT NULL,
  effective_date DATE NOT NULL,
  reason VARCHAR(255) NOT NULL,
  outstanding_balance DECIMAL(10, 2) NOT NULL,
  fine_amount DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
  reconnection_fee DECIMAL(10, 2) NOT NULL DEFAULT 1000.00,
  reconnected_at DATETIME NULL,
  status ENUM('Disconnected', 'Reconnected') NOT NULL DEFAULT 'Disconnected',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_disconnections_institution
    FOREIGN KEY (institution_id) REFERENCES institutions(id)
    ON UPDATE CASCADE ON DELETE RESTRICT
);

CREATE TABLE IF NOT EXISTS infrastructure_records (
  id INT PRIMARY KEY AUTO_INCREMENT,
  institution_id INT NOT NULL UNIQUE,
  pcs_purchased INT NOT NULL DEFAULT 0,
  pcs_cost DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
  lan_nodes INT NOT NULL DEFAULT 0,
  lan_cost DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
  installation_fee DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
  total_cost DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
  installation_status ENUM('Pending', 'In Progress', 'Completed', 'Not Eligible') NOT NULL DEFAULT 'Pending',
  installation_date DATE NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT chk_infrastructure_pcs CHECK (pcs_purchased >= 0),
  CONSTRAINT chk_infrastructure_nodes CHECK (lan_nodes >= 0),
  CONSTRAINT fk_infrastructure_institution
    FOREIGN KEY (institution_id) REFERENCES institutions(id)
    ON UPDATE CASCADE ON DELETE RESTRICT
);

CREATE TABLE IF NOT EXISTS bandwidth_upgrades (
  id INT PRIMARY KEY AUTO_INCREMENT,
  institution_id INT NOT NULL,
  old_package_id INT NOT NULL,
  new_package_id INT NOT NULL,
  old_monthly_cost DECIMAL(10, 2) NOT NULL,
  new_monthly_cost DECIMAL(10, 2) NOT NULL,
  discount_percent DECIMAL(5, 2) NOT NULL DEFAULT 10.00,
  discounted_monthly_cost DECIMAL(10, 2) NOT NULL,
  upgrade_date DATE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_bandwidth_upgrades_institution
    FOREIGN KEY (institution_id) REFERENCES institutions(id)
    ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT fk_bandwidth_upgrades_old_package
    FOREIGN KEY (old_package_id) REFERENCES bandwidth_packages(id)
    ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT fk_bandwidth_upgrades_new_package
    FOREIGN KEY (new_package_id) REFERENCES bandwidth_packages(id)
    ON UPDATE CASCADE ON DELETE RESTRICT
);

CREATE INDEX idx_payments_institution_date ON payments (institution_id, payment_date);
CREATE INDEX idx_payments_status ON payments (status);
CREATE INDEX idx_fines_status ON fines (status);
CREATE INDEX idx_disconnections_status ON disconnections (status);
