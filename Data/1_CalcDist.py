
from mrjob.job import MRJob
from mrjob.step import MRStep
import ast

sort_conf = {
    'mapred.reduce.tasks': '1'
}

class CalcDist.py(MRJob):
    
    num_nodes = 0 
    
    def steps(self):
        return [MRStep(mapper=self.mapper_1,
                       combiner=self.combiner_1,
                       reducer_init=self.reducer_1_init,
                       reducer=self.reducer_1,
                        reducer_final=self.reducer_1_final),
                MRStep(reducer_init=self.reducer_2_init, reducer=self.reducer_2, #mapper=self.mapper_2,
                       jobconf=sort_conf)
               ]
    

if __name__ == '__main__':
    CalcDist.run()