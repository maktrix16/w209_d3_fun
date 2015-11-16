import sys
import os
import json
import pymongo
import datetime, pytz
import re
from pymongo import MongoClient
# from datetime import datetime
# from dateutil import tz

class LoadData():

    client = MongoClient('localhost', 27017)
    db = client.w209project #create/set database name as "w209project"
    collection = db.locs    #create/set collection name as "locs"
    
    def removeData(self):
        self.collection.remove({})
    
    def load(self,data_file, num_data):
        #set limit on number of lines of data
        if num_data=="all": limit=1e15
        else: limit=int(num_data)
        count=0

        with open(data_file, 'r') as f:
            for line in f:
                if count>=limit: break
                
                user_id,latitude,longitude,altitude,date,time,transport = line.strip().split(',')
                user_id = int(user_id)
                latidude = float(latitude)
                longitude = float(longitude)
                altidude = float(altitude)

                #ensure it's china timezone to ensure correct timezone input
                local = pytz.timezone ("Asia/Shanghai")
                naive = datetime.datetime.strptime (date+" "+time, "%Y-%m-%d %H:%M:%S")
                local_dt = local.localize(naive, is_dst=None)
#                 utc_dt = local_dt.astimezone (pytz.utc)
#                 print latitude,longitude,altitude,date,time,transport
                
                location = {"user_id":user_id,
                            "latitude":latitude,
                            "longitude":longitude,
                            "altitude":altitude,
                            "date_time":local_dt,
                            "transport":transport,
                            "created_at":datetime.datetime.utcnow()}
                self.collection.insert_one(location)
            
                count+=1

            print '\n',self.collection.count(),'records loaded into MongoDB'
    
if __name__ == '__main__':
    l = LoadData()
    data_file = sys.argv[1]    #name of data file
    remove_data = sys.argv[2]  #if true, then remove existing data
    num_data = sys.argv[3]     #number of data points (ie. no. of lines of data)

    if remove_data=="T":
        l.removeData()
    l.load(data_file,num_data.lower())
