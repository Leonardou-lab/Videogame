CREATE DATABASE IF NOT EXISTS nekocafe
  CHARACTER SET utf8mb4  -- text stored in utf8
  COLLATE utf8mb4_unicode_ci; -- case insensitive

USE nekocafe;

CREATE TABLE IF NOT EXISTS weekdays (
  id TINYINT UNSIGNED NOT NULL,
  name VARCHAR(20)NOT NULL,
  PRIMARY KEY (id)
);

INSERT INTO weekdays (id, name) VALUES
  (0, 'Sunday'),
  (1, 'Monday'),
  (2, 'Tuesday'),
  (3, 'Wednesday'),
  (4, 'Thursday'),
  (5, 'Friday'),
  (6, 'Saturday');

CREATE TABLE IF NOT EXISTS menu_items (
  id INT UNSIGNED  NOT NULL AUTO_INCREMENT,
  day_id TINYINT UNSIGNED NOT NULL,
  name VARCHAR(100) NOT NULL,
  description VARCHAR(255) NOT NULL,
  price DECIMAL(8,2) NOT NULL,
  category ENUM('Drink','Food','Dessert') NOT NULL,
  image_url TEXT NOT NULL,
  PRIMARY KEY (id),
  CONSTRAINT fk_menu_day FOREIGN KEY (day_id) REFERENCES weekdays(id)
);

INSERT INTO menu_items (day_id, name, description, price, category, image_url) VALUES
-- Sunday
(0, 'Clay pot coffee', 'Coffee with cinnamon and brown sugar.', 55.00, 'Drink', 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&q=80'),
(0, 'Pancakes','Served with honey and fresh fruit.', 85.00, 'Food', 'https://images.unsplash.com/photo-1528207776546-365bb710ee93?w=400&q=80'),
(0, 'Matcha latte','Hot drink with steamed milk.', 70.00, 'Drink', 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?w=400&q=80'),
-- Monday
(1, 'Americano', 'Simple and strong black coffee.', 50.00, 'Drink', 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&q=80'),
(1, 'Avocado toast', 'Toasted bread with avocado.', 90.00, 'Food', 'https://images.unsplash.com/photo-1687276287139-88f7333c8ca4?q=80&w=1064&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'),
(1, 'Green smoothie', 'Apple, spinach and lemon.', 65.00, 'Drink', 'https://images.unsplash.com/photo-1610970881699-44a5587cabec?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'),
-- Tuesday
(2, 'Cold brew', 'Cold coffee with a smooth flavor.', 65.00, 'Drink', 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400&q=80'),
(2, 'Quiche', 'Savory spinach and cheese tart.', 85.00, 'Food', 'https://images.unsplash.com/photo-1619894991209-9f9694be045a?w=400&q=80'),
(2, 'Chai latte', 'Spiced tea with steamed milk.', 70.00, 'Drink', 'https://images.unsplash.com/photo-1570968915860-54d5c301fa9f?q=80&w=1035&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'),
-- Wednesday
(3, 'Cappuccino', 'Espresso with milk and foam.', 60.00, 'Drink', 'https://images.unsplash.com/photo-1534687941688-651ccaafbff8?w=400&q=80'),
(3, 'Waffle', 'Waffle with fruit and chocolate.', 95.00, 'Dessert', 'https://plus.unsplash.com/premium_photo-1664478254358-fb8ce668dca6?q=80&w=1591&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'),
(3, 'Pesto pasta', 'Pasta with basil sauce.', 110.00, 'Food', 'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'),
-- Thursday
(4, 'Espresso', 'Intense coffee shot.', 45.00, 'Drink', 'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?w=400&q=80'),
(4, 'Brownie', 'Chocolate brownie.', 70.00, 'Dessert', 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=400&q=80'),
(4, 'Club sandwich', 'Chicken, lettuce, tomato and bacon.', 100.00, 'Food', 'https://plus.unsplash.com/premium_photo-1738802845911-809a01acfa50?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'),
-- Friday
(5, 'Frappé', 'Cold coffee with whipped cream.', 85.00, 'Drink', 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400&q=80'),
(5, 'Cheesecake', 'Cream cheese cake with mixed berries.', 90.00, 'Dessert', 'https://images.unsplash.com/photo-1578775887804-699de7086ff9?w=400&q=80'),
(5, 'Margherita pizza','Pizza with cheese, tomato and basil.', 30.00, 'Food', 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400&q=80'),
-- Saturday
(6, 'Bubble tea', 'Milk tea with tapioca pearls.', 80.00, 'Drink', 'https://images.unsplash.com/photo-1558857563-b371033873b8?w=400&q=80'),
(6, 'Sweet crepes', 'Crepes with Nutella and fresh fruit.', 95.00, 'Dessert', 'https://images.unsplash.com/photo-1519676867240-f03562e64548?w=400&q=80'),
(6, 'Eggs benedict', 'Poached eggs with hollandaise sauce.', 115.00, 'Food', 'https://images.unsplash.com/photo-1608039829572-78524f79c4c7?w=400&q=80');

CREATE TABLE IF NOT EXISTS cats (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  name VARCHAR(50) NOT NULL,
  age  VARCHAR(20) NOT NULL,
  personality VARCHAR(50) NOT NULL,
  description VARCHAR(255) NOT NULL,
  image_url TEXT  NOT NULL,
  PRIMARY KEY (id)
);

INSERT INTO cats (name, age, personality, description, image_url) VALUES
('Mochi', '2 years', 'Playful', 'Loves running around the cafe and playing with balls.', 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=300&q=80'),
('Sora', '5 years', 'Calm', 'Spends most of the time sleeping by the window.', 'https://images.unsplash.com/photo-1533743983669-94fa5c4338ec?w=300&q=80'),
('Hana', '3 years', 'Shy', 'Hides at first, but eventually comes to say hello.', 'https://images.unsplash.com/photo-1478098711619-5ab0b478d6e6?w=300&q=80'),
('Kumo', '4 years', 'Affectionate', 'Loves sitting close to visitors.', 'https://images.unsplash.com/photo-1495360010541-f48722b34f7d?w=300&q=80'),
('Luna', '6 years', 'Serene', 'Quiet and loves watching everything from her bed.', 'https://images.unsplash.com/photo-1543852786-1cf6624b9987?w=300&q=80'),
('Kiri', '1 year',  'Curious', 'Explores every corner of the cafe and sniffs everything new.', 'https://images.unsplash.com/photo-1592194996308-7b43878e84a6?w=300&q=80'),
('Tofu', '3 years', 'Lazy', 'Prefers to stay on his cushion all day without moving.', 'https://images.unsplash.com/photo-1548247416-ec66f4900b2e?w=300&q=80'),
('Yuki', '2 years', 'Mischievous', 'Pushes objects off tables and runs away before anyone sees.', 'https://images.unsplash.com/photo-1596854407944-bf87f6fdd49e?w=300&q=80');

