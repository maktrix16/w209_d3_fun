
from mrjob.job import MRJob
from mrjob.step import MRStep
from mrjob.compat import jobconf_from_env
from datetime import datetime
from datetime import timedelta
import ast
import math
# from mrjob.protocol import JSONValueProtocol

sort_conf = {
    'mapred.reduce.tasks': '1'
}

class Aggregate(MRJob):

#     INPUT_PROTOCOL = JSONValueProtocol
    
    def steps(self):
        return [MRStep(mapper_init=self.mapper1_init,
                       mapper=self.mapper1,
                       reducer_init=self.reducer1_init,
                       reducer=self.reducer1,
                       reducer_final=self.reducer1_final
                      )
                ,
                MRStep(mapper=self.mapper2
                       ,
                       reducer_init=self.reducer2_init,
                       reducer=self.reducer2,
                       reducer_final=self.reducer2_final),
                MRStep(mapper=self.mapper3,
                       reducer=self.reducer3,
                       jobconf=sort_conf
                      )
               ]
    
    ### First MrJob: aggregate by the time interval
    
    
    def mapper1_init(self):
        self.interval = int(jobconf_from_env('interval'))
    
    def mapper1(self, _, line):
        key,data = line.strip().split("\t")
        
        user_id,dt,x_new,y_new,transport,dist = ast.literal_eval(data)
        dt_convert = datetime.strptime(dt, '%Y-%m-%d %H:%M:%S')
        sec = dt_convert.second
        remainder = sec%self.interval
        if remainder != 0:  
            update_sec = self.interval-remainder
        else:
            update_sec=0
        
        dt_convert += timedelta(0,update_sec)
        dt_convert = dt_convert.strftime("%Y-%m-%d %H:%M:%S")
        yield (dt_convert,user_id), (dt,x_new,y_new,transport,dist)
    
    def reducer1_init(self):
        self.current_dt = ''
        self.current_user=''
        self.current_max_dist = 0.0
        self.aggregate = {}

    
    def reducer1(self, key, values):
        dt_convert,user_id = key
        self.aggregate.setdefault(dt_convert,{})
        
        if dt_convert != self.current_dt or user_id != self.current_user:
            self.current_dt = dt_convert
            self.current_user = user_id
            self.current_max_dist = 0.0

        for value in values:
            dt,x_new,y_new,transport,dist = value
            if dist['all'] >= self.current_max_dist :
                self.current_max_dist = dist['all']
#                 value.append(user_id)
                self.aggregate[dt_convert][user_id]=value
        
    def reducer1_final(self):
        for dt_convert, values in self.aggregate.iteritems():
            for user_id, value in values.iteritems(): 
                dt,x_new,y_new,transport,dist = value
                yield dt_convert, (user_id,dt,x_new,y_new,transport,dist)
        
    ### 2nd MrJob: aggregate by the users within the time interval
   
    def mapper2(self, dt_convert, value):
        yield dt_convert, value
        
    def reducer2_init(self):
        self.current_dt = ''
        self.aggregate = {}
#         self.users={}
#         self.transports={}
        self.dists={}
            
    def reducer2(self, dt_convert, values): 
        
        for value in values:
            user_id,dt,x_new,y_new,transport,dists = value
            self.aggregate.setdefault(dt_convert,{})

            self.aggregate[dt_convert].setdefault("users",[])
            self.aggregate[dt_convert]["users"].append({user_id:[x_new,y_new,transport]})

            self.aggregate[dt_convert].setdefault("transports",{})
            self.aggregate[dt_convert]["transports"].setdefault(transport,0)
            self.aggregate[dt_convert]["transports"][transport]+=1

            self.dists[user_id] = dists
#             for transport_mode,dist in dists.iteritems():
#                 self.dists.setdefault(user_id,{})
#                 self.dists[user_id].setdefault(transport_mode,0.0)
#                 self.dists[user_id][transport_mode] += dist
#                 self.dists[user]
        
        for user_id, dists in self.dists.iteritems():
            self.aggregate[dt_convert].setdefault('dists',{})
            for transport_mode, dist in dists.iteritems():
                self.aggregate[dt_convert]['dists'].setdefault(transport_mode,0.0)
                self.aggregate[dt_convert]['dists'][transport_mode] += dist
            
#             self.aggregate[dt_convert]['dists'] = self.dists.copy()
                
    def reducer2_final(self):                         
        for dt_convert, value in self.aggregate.iteritems():
            yield dt_convert, value

### 3rd MrJob: sort by dt_convert
    
    def mapper3(self,dt_convert,value):
        yield dt_convert,value
        
    def reducer3(self,dt_convert,values):
        for value in values:
            yield dt_convert,value
            
if __name__ == '__main__':
    Aggregate.run()