CREATE DATABASE IF NOT EXISTS drones_db;
use drones_db;
CREATE TABLE IF NOT EXISTS states (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(50) NOT NULL UNIQUE
);
INSERT INTO states (name) VALUES ('IDLE'), ('LOADING'), ('LOADED'), ('DELIVERING'), ('DELIVERED'), ('RETURNING');

CREATE TABLE models (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(50) NOT NULL UNIQUE
);
INSERT INTO models (name) VALUES ('Lightweight'), ('Middleweight'), ('Cruiserweight'), ('Heavyweight');

CREATE TABLE IF NOT EXISTS drones (
	  serialNumber VARCHAR(100) PRIMARY KEY NOT NULL,
	  model INT NOT NULL,
	  weightLimit DECIMAL NOT NULL CHECK (weightLimit >= 0 AND weightLimit <= 500),
	  batteryCapacity DECIMAL NOT NULL CHECK (batteryCapacity >= 0 AND batteryCapacity <=100 ),
	  state INT NOT NULL,
	  FOREIGN KEY (state) REFERENCES states(id),
      FOREIGN KEY (model) REFERENCES models(id)
	);
    
INSERT INTO drones (serialNumber, model, weightLimit, batteryCapacity, state) VALUES
  ('DRN001', 1, 100.50, 80.00, 1),
  ('DRN002', 2, 200.75, 70.25, 1), 
  ('DRN003', 1, 150.00, 90.50, 1), 
  ('DRN004', 3, 300.25, 60.75, 1),
  ('DRN005', 2, 250.00, 75.00, 1), 
  ('DRN006', 1, 120.00, 95.25, 1), 
  ('DRN007', 4, 400.34, 50.00, 1), 
  ('DRN008', 2, 220.50, 65.75, 1), 
  ('DRN009', 3, 350.75, 55.25, 1), 
  ('DRN010', 4, 500.00, 40.00, 1); 
    
CREATE TABLE IF NOT EXISTS medications (
  name VARCHAR(100) NOT NULL,
  weight DECIMAL NOT NULL,
  code VARCHAR(50) PRIMARY KEY NOT NULL,
  image VARCHAR(255)
);
INSERT INTO medications (name, weight, code, image) VALUES
  ('Medication 1', 25.5, 'MED001', 'image1.jpg'),
  ('Medication 2', 15.0, 'MED002', 'image2.jpg'),
  ('Medication 3', 10.2, 'MED003', 'image3.jpg'),
  ('Medication 4', 30.8, 'MED004', 'image4.jpg'),
  ('Medication 5', 12.7, 'MED005', 'image5.jpg'),
  ('Medication 6', 18.3, 'MED006', 'image6.jpg'),
  ('Medication 7', 22.1, 'MED007', 'image7.jpg'),
  ('Medication 8', 17.6, 'MED008', 'image8.jpg'),
  ('Medication 9', 27.9, 'MED009', 'image9.jpg'),
  ('Medication 10', 14.4,'MED010', 'image10.jpg');
  
  
  CREATE TABLE IF NOT EXISTS cargo (
	idCargo INT NOT NULL,
    idDrone VARCHAR(100) NOT NULL,
    idMedication VARCHAR(50) NOT NULL,
    PRIMARY KEY (idCargo,idDrone,idMedication),
	FOREIGN KEY (idDrone) REFERENCES drones(serialNumber),
	FOREIGN KEY (idMedication) REFERENCES medications(code)
  )

