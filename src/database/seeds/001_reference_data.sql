INSERT INTO bandwidth_packages (speed_label, monthly_cost)
VALUES
  ('4 MBPS', 1200.00),
  ('10 MBPS', 2000.00),
  ('20 MBPS', 3500.00),
  ('25 MBPS', 4000.00),
  ('50 MBPS', 7000.00)
ON DUPLICATE KEY UPDATE
  monthly_cost = VALUES(monthly_cost),
  updated_at = CURRENT_TIMESTAMP;

INSERT INTO lan_pricing_tiers (min_nodes, max_nodes, cost)
VALUES
  (2, 10, 10000.00),
  (11, 20, 20000.00),
  (21, 40, 30000.00),
  (41, 100, 40000.00)
ON DUPLICATE KEY UPDATE
  cost = VALUES(cost),
  updated_at = CURRENT_TIMESTAMP;
