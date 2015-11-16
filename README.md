##Instructions to run website on local machine:
####Install Nodejs
http://howtonode.org/how-to-install-nodejs
####After successful installation, install nodemon
```
npm install -g nodemon
```
####Must also install mongodb
http://docs.mongodb.org/manual/installation/
####Clone this repository to your local computer
```
git clone https://github.com/maktrix16/w209_d3_fun.git
```
####Start mongodb server
```
sudo mongod
```
####Go to repository folder and load data into MongoDB
```
#two arugments are needed (1) the datafile and (2) boolean value for whether to remove data from existing database
python data/load.py data/test_data.txt T

#you may need to install pymongo package (just do "pip install pymongo")
```
####Check if data loaded properly by starting Mongo client to check
```
mongo
```
####Enter these commands to see if data exists properly
```
use w209project
db.getCollectionNames()  #this return the list of colletions (there should only be "locs" colletion there)
db.locs.count()   #this should return value of number of counts
db.locs.find({}).pretty()   #this should return all the values being stored
```

####Once confirm data ok, go to new terminal window and start Node server (note: you must do have already started your MongoDB server at this point)
```
nodemon Website/server.js
```
####Open web browser and go to following link to view website
http://localhost:8000/

####Loading data into database
Go to "Data" folder (https://github.com/maktrix16/w209_d3_fun/tree/master/Data)
Add the data in a text file in the format of:
```
user_id, latitude, longitude, altitude, local_date, local_time, transport_mode
```
Here's a few examples:
```
9,42.97456,119.332025,492,2008-08-20,12:09:04,walk
9,39.974658,106.332114,492,2008-08-20,12:09:07,bus
18,39.974893,136.331959,467,2008-08-20,12:10:35,NA
18,39.974903,126.331965,466,2008-08-20,12:10:37,subway
18,31.97492,136.331962,466,2008-08-20,12:10:39,subway
```
Then, wihtin the "Data" folder, run: 
```
python load.py test_data.txt T all
```
Please note that "load.py" takes in 3 arguments:
- 1st Argument: filename of the data text file to be loaded (eg. test_data.txt) 
- 2nd Argument: whether wiping original data in database ("T" or "F")
- 3rd Argument: how many data points or lines of data to be input from textfile (either type "all" for all data within text file or specifiy an integer like "30")
