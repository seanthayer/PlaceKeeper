CREATE TABLE PLACEKEEPER_MAPS (
  `Title` varchar(25) NOT NULL,
  PRIMARY KEY (`Title`)
);

CREATE TABLE PINS (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `Map` varchar(25) NOT NULL,
  `Name` varchar(30) NOT NULL,
  `Description` varchar(200) DEFAULT NULL,
  `Lat` double SIGNED NOT NULL,
  `Lng` double SIGNED NOT NULL,
  PRIMARY KEY (`ID`),
  FOREIGN KEY (`Map`) REFERENCES PLACEKEEPER_MAPS(`Title`) ON DELETE CASCADE
);

INSERT INTO PLACEKEEPER_MAPS VALUES
('testMap1'),
('testMap2');

INSERT INTO PINS VALUES 
(0, 'testMap1', 'Portland, OR', "Oregon's most populous city.", 45.50386578962426, -122.67520817154383),
(0, 'testMap1', 'Vancouver, BC', "British Columbia's largest city, and nicknamed 'Hollywood North.'", 49.2821770651017, -123.11982860343056),
(0, 'testMap1', 'Oregon State University', "Go Beavs!", 44.56374453650576, -123.27950160440479),
(0, 'testMap1', 'Denver, CO', null, 39.737022801180196, -104.98684948794832),
(0, 'testMap1', 'San Jose, CA', "The center of Silicon Valley.", 37.337399570316116, -121.88758476686715),
(0, 'testMap1', 'Golden Gate Bridge', null, 37.820213941760045, -122.47850317381773);

INSERT INTO PINS VALUES 
(0, 'testMap2', 'newport', null, 44.63643777124538, -124.05271227815938),
(0, 'testMap2', 'tillamook', null, 45.456267343939025, -123.84339555819759),
(0, 'testMap2', 'astoria', null, 46.187395112985676, -123.83143014844462),
(0, 'testMap2', 'test2', null, 47.58803911372809, -117.07035294114988),
(0, 'testMap2', 'test3', null, 45.96301583448037, -112.54398575364988),
(0, 'testMap2', 'test4', null, 40.56016902590379, -116.41336998283307),
(0, 'testMap2', 'test5', null, 51.19004188033802, -114.08426842033307),
(0, 'testMap2', 'test6', null, 52.11698751339873, -106.52567467033307),
(0, 'testMap2', 'test7', null, 36.0806581189727, -114.90310964668652);