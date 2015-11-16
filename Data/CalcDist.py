
from mrjob.job import MRJob
from mrjob.step import MRStep
from mrjob.compat import jobconf_from_env
from datetime import datetime
import math
import ast

sort_conf = {
    'mapred.reduce.tasks': '1'
}

#convert coordinates to distance
def coor_to_km(x1,y1,x2,y2):
    R = 6371
    dx = (x2-x1) * math.pi / 180
    dy = (y2-y1) * math.pi / 180
    x1 *= math.pi / 180
    x2 *= math.pi / 180
    
    a = math.sin(dx/2)**2 + (math.sin(dy/2)**2) * (math.cos(x1)*math.cos(x2))
    c = 2*math.atan2(math.sqrt(a),math.sqrt(1-a))
    d = R * c
    return d

#convert to seconds (since python 2.6 or below does not have datetime.total_seconds()
#http://stackoverflow.com/questions/28089558/alternative-to-total-seconds-in-python-2-6
def timedelta_total_seconds(timedelta):
    return (
        timedelta.microseconds + 0.0 +
        (timedelta.seconds + timedelta.days * 24 * 3600) * 10 ** 6) / 10 ** 6


class CalcDist(MRJob):
    def steps(self):
        return [MRStep(mapper=self.mapper,
                       reducer_init=self.reducer_init,
                       reducer=self.reducer,
                       jobconf=sort_conf)]
    
    def mapper(self, _, line):
        user_id,x,y,alt,date,time,transport = line.strip().split(",")
        dt = date+' '+time
        yield (user_id,dt), (x,y,transport)
    

    def reducer_init(self):
        self.dt_initial = datetime(2008, 1, 1, 0, 0, 0)
        self.x_initial=0.0
        self.y_initial=0.0
        self.user = ''
        self.dist = {'all':0.0}
        self.max_interval_sec = int(jobconf_from_env('max_interval_sec'))

    
    def reducer(self, key, values):
        
        index=0
        user_id,dt = key
        dt_initial = datetime(2008, 1, 1, 0, 0, 0)
        dt_key = datetime.strptime(dt, '%Y-%m-%d %H:%M:%S')
        time_diff = dt_key - self.dt_initial
#         time_diff = time_diff.total_seconds()  #only for python 2.7 or above
        time_diff = timedelta_total_seconds(time_diff)
        self.dt_initial = dt_key
        
        for value in values:
            x_new,y_new,transport = value
            x_new=float(x_new)
            y_new=float(y_new)
            
            #assume only within certain time interval belong to be in the same trip
            if time_diff < self.max_interval_sec:
                distance = coor_to_km(self.x_initial,self.y_initial,x_new,y_new)
                self.dist['all'] += distance
                self.dist.setdefault(transport,0.0)
                self.dist[transport] += distance

            #if different user, reset distance counter
            if self.user != user_id:
                self.user = user_id
                self.dist = {'all':0.0}
                

            self.x_initial = x_new
            self.y_initial = y_new
            
            yield None, (user_id,dt,x_new,y_new,transport,self.dist)
            
if __name__ == '__main__':
    CalcDist.run()   
                