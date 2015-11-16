from datetime import  datetime
from matplotlib.dates import date2num, num2date
import numpy
import csv
from intervaltree import Interval, IntervalTree
###############################################
# readLabelFile(fileName):
# labels.txt data for Transportation mode labels
# Transportation mode labels
# format
# Possible transportation modes are: walk, bike, bus, car, subway, train, airplane,
#boat, run and motorcycle. Again, we have converted the date/time of all labels to GMT,
#even though most of them were created in China.
#Example:
#Start Time End Time Transportation Mode
#2008/04/02 11:24:21 2008/04/02 11:50:45 bus
#2008/04/03 01:07:03 2008/04/03 11:31:55 train
#2008/04/03 11:32:24 2008/04/03 11:46:14 walk
#2008/04/03 11:47:14 2008/04/03 11:55:07 car
##########################################################

def readLabelFile(fileName):
     with open(fileName, 'rb') as csvfile:
	  t= IntervalTree()
	  dialect = csv.Sniffer().sniff(csvfile.read(), delimiters=' \t')
	  csvfile.seek(0)
          #csvreader = csv.reader(csvfile, delimiter=' ', quotechar='"')
          csvreader = csv.reader(csvfile, dialect)
	  csvreader.next() #skip the header
          for row in csvreader:
	      print row
              startd=datetime.strptime(row[0],"%Y/%m/%d %H:%M:%S")
              endd=datetime.strptime(row[1],"%Y/%m/%d %H:%M:%S")
              label=row[2]
	      print "start=%s end=%s label=%s" % (startd,endd,label)
	      t[startd:endd]=label
	  return t

t= IntervalTree()

d0="2007/04/29 12:34:24" 
d1="2007/04/29 12:53:45"
label="taxi"
date0=datetime.strptime(d0,"%Y/%m/%d %H:%M:%S")
date1=datetime.strptime(d1,"%Y/%m/%d %H:%M:%S")
se=(date0,date1)
print se[0]
print se[1]
t[se[0]:se[1]]="walk"
print t
qstr="2007-04-29,08:34:32"
qdate=datetime.strptime(qstr,"%Y-%m-%d,%H:%M:%S")

ivs=t[qdate]
if ivs:
	iv=sorted(ivs)[0]
	print iv
else:
	print "%s not in interal" % qdate

qstr="2007-04-29,12:34:32"
qdate=datetime.strptime(qstr,"%Y-%m-%d,%H:%M:%S")

ivs=t[qdate]
if ivs:
	iv=sorted(ivs)[0]
	print iv[2]
else:
	print "%s not in interal" % qdate

t=readLabelFile("labels.txt")
qs="2007-04-29,08:34:32"
qdate=datetime.strptime(qs,"%Y-%m-%d,%H:%M:%S")
print qdate
ivs=t[qdate]
if ivs:
	iv=sorted(ivs)[0]
	print iv
else:
	print "%s not in interal" % qdate


	 


