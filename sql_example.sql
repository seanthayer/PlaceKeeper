CREATE TABLE MAPS (
  `Title` VARCHAR(25) NOT NULL,
  PRIMARY KEY (`Title`)
);

CREATE TABLE PINS (
  `ID` INT(11) NOT NULL AUTO_INCREMENT,
  `Map` VARCHAR(25) NOT NULL,
  `Name` VARCHAR(30) NOT NULL,
  `Description` VARCHAR(200) DEFAULT NULL,
  `Lat` DOUBLE NOT NULL,
  `Lng` DOUBLE NOT NULL,
  PRIMARY KEY (`ID`),
  FOREIGN KEY (`Map`) REFERENCES MAPS(`Title`) ON DELETE CASCADE
);

INSERT INTO MAPS VALUES
('Some Interesting Cities'),
('Just Some Places');

INSERT INTO PINS VALUES
(DEFAULT, 'Some Interesting Cities', 'New York, NY', "The Big Apple!", 40.74839296355595, -73.98566227667868),
(DEFAULT, 'Some Interesting Cities', 'Denver, CO', "The Mile High City!", 39.73917171007916, -104.98884104501485),
(DEFAULT, 'Some Interesting Cities', 'Portland, OR', "Oregon's most populous city and home to the \"Silicon Forest.\"", 45.52307233319237, -122.67647536600623),
(DEFAULT, 'Some Interesting Cities', 'Vancouver, BC', "British Columbia's largest city, and nicknamed \"Hollywood North.\"", 49.282215558413725, -123.11981183962428),
(DEFAULT, 'Some Interesting Cities', 'San Jose, CA', "The heart of Silicon Valley!", 37.33744652790177, -121.88674475913967);

INSERT INTO PINS VALUES
(DEFAULT, 'Just Some Places', 'Oregon State University', "Go Beavs!", 44.56585836693244, -123.27601243717307),
(DEFAULT, 'Just Some Places', 'Japan', null, 36.57439717438821, 138.8892300200594),
(DEFAULT, 'Just Some Places', 'Germany', null, 51.02433112685012, 10.283990366006943),
(DEFAULT, 'Just Some Places', 'Puerto Rico', null, 18.242239373384724, -66.53137972870934),
(DEFAULT, 'Just Some Places', 'Washington, DC', null, 38.90510279445902, -77.03460472328669),
(DEFAULT, 'Just Some Places', 'Yellowstone National Park', null, 44.41560769034242, -110.59853292434082);