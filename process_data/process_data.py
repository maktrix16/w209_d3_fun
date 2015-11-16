###################################################
# 10/14/15 - Created
# berkley MIDS
# course :205
# Team Members : Tuhin Mahmud
# General parser for GoeLife Trajectory file in PLT format
#####################################################
import os
import csv
from os import listdir
from os.path import isfile,isdir,join
from optparse import OptionParser
from datetime import datetime
import ntpath
from intervaltree import Interval, IntervalTree

def listDir(dirName):
    dirName=os.path.normpath(dirName)
    filenames=[]
    for dirName, subdirList, fileList in os.walk(dirName):
        #print('Found directory: %s' % dirName)
        #print('fileList: %s' % fileList)
        for fname in fileList:
            fileName=os.path.abspath(os.path.join(dirName, fname))
            if not isfile(fileName):
                #print "fileName %s is not a file" % fileName
                continue
            #print('\t%s' % fileName)
            filenames.append(fileName) 
    return filenames

#####################################################    
# readPLTFile:
#   funciton to read the PLT files for information
#   parmaters:
#       fileName = name of the input file
#       ofileName = name of the output csv formated file(optional)
#       interval tree = interval tree to search for labels ( optional)
# 
#   PLT format:
#   Line 1-6 are useless in this dataset, and can be ignored.
#   Points are described in following lines, one for each line.
#       Field 1: Latitude in decimal degrees.
#       Field 2: Longitude in decimal degrees.
#       Field 3: All set to 0 for this dataset.
#       Field 4: Altitude in feet (-777 if not valid).
#       Field 5: Date - number of days (with fractional part) that have passed since 12/30/1899.
#       Field 6: Date as a string.
#       Field 7: Time as a string.
#   Note that field 5 and field 6&7 represent the same date/time in this dataset. 
#   You may use either of them.
#   Example:
#       39.906631,116.385564,0,492,40097.5864583333,2009-10-11,14:04:30
#       39.906554,116.385625,0,492,40097.5865162037,2009-10-11,14:04:35
###################################
def readPLTFile(fileName,ofileName=None,userid=None,itree=None):
    csvwriter=None
    filename, file_extension = os.path.splitext(fileName)
    if file_extension != ".plt":
        return
    print fileName,ofileName
    #print itree
    with open(fileName, 'rb') as csvfile:
        if ofileName:
            csvwriter = csv.writer(open(ofileName,'a'))
        csvreader = csv.reader(csvfile, delimiter=',', quotechar='"')
        #skip the first 6 lines
        for _i in range(6):
            csvreader.next()
        for row in csvreader:
            #print row
            latitude=row[0]
            longitude=row[1]
            altitude=row[3]
            row_date=row[5]
            row_time=row[6]
            event_time="%s,%s" % (row_date,row_time)
            #print "event_time=%s" % event_time
            label="NA"
            if itree:
                qdate=datetime.strptime(event_time,"%Y-%m-%d,%H:%M:%S")
                ivs=itree[qdate]
                if ivs:
                    iv=sorted(ivs)[0]
                    label=iv[2]
                    #print "found label:%s qdate:%s start:%s end:%s" % (label,qdate,iv[0],iv[1])
                #else:
                    #print "%s not any interval" % qdate

            print "userid=%s lat:%s long:%s alt:%s date:%s time %s label:%s" % (userid,latitude,longitude,altitude,row_date,row_time,label)
            if csvwriter:
                csvwriter.writerow([userid,latitude,longitude,altitude,row_date,row_time,label])


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
            #print row
            startd=datetime.strptime(row[0],"%Y/%m/%d %H:%M:%S")
            endd=datetime.strptime(row[1],"%Y/%m/%d %H:%M:%S")
            label=row[2]
            #print "start=%s end=%s label=%s" % (startd,endd,label)
            t[startd:endd]=label
        return t
def check_time_inLabelFile(qtime,filename):
    itree=readLabelFile(filename)
    label=None
    if itree:
        qdate=datetime.strptime(qtime,"%Y-%m-%d,%H:%M:%S")
        ivs=itree[qdate]
        if ivs:
            iv=sorted(ivs)[0]
            print "found label:%s for qdate:%s between [start:%s -- end:%s]" % (iv[2],qdate,iv[0],iv[1])
            label=iv[2]
        else:
            print "%s not any interval" % qdate
    return label
def checkDir(dirName,oDirName=None):
    #print fileName
    label_userid=None
    user_id=""
    intervalT=None
    pltcount=0
    labelsCount=0
    for filename in listDir(dirName):
        #print filename
        #readPLTFile(filename)
        fname=ntpath.basename(filename)
        #print fname
        if fname =="labels.txt":
            # start to add teh labels information to 
            dirname=ntpath.dirname(filename)
            label_userid=ntpath.basename(dirname)
            #print "label_userid %s" % label_userid
            intervalT=readLabelFile(filename)
            labelsCount =labelsCount +1
            continue

        bname=ntpath.dirname(filename)
        bname1=ntpath.dirname(bname)
        userid=ntpath.basename(bname1)
        #print "label_userid %s userid %s" % (label_userid,userid)
        ofileName="%s.csv" % userid
        ofileName=os.path.join(oDirName,ofileName)

        if (label_userid == userid):
            #print "start putting label information into plt data from %s" % filename
            readPLTFile(filename,ofileName,userid,intervalT)
        else:
            readPLTFile(filename,ofileName,userid,None)

        pltcount = pltcount +1

    print "Total processed files:%d  labels.txt files:%d in base dir %s" % (pltcount,labelsCount,dirName)


def main():
    parser = OptionParser()
    parser.add_option("-f", "--file", action="store", type="string", dest="fileName",
        help="Name of file name")
    parser.add_option("-d", "--dir_path", action="store", type="string", dest="dirName",
        help="Name of director path")
    parser.add_option("-q", "--query_time", action="store", type="string", dest="qtime",
        help="query time in \"%Y-%m-%d,%H:%M:%S\" format to search in file specified in --file which is a label file")
    parser.add_option("-o", "--outFileName", action="store", type="string", dest="ofileName",
        help="Name of output csv formated file name")

    (options,args) =parser.parse_args()

    print("options %s args %s" % (options,args))
    if len(args)!= 0:
        parser.error("incorrect number of arguments")

    fileName=options.fileName
    dirName=options.dirName
    qtime=options.qtime
    ofileName=options.ofileName

    if fileName:
        check_time_inLabelFile(qtime,fileName)

    if dirName:
        checkDir(dirName,ofileName)
                
if __name__=="__main__":
    import time
    start_time = time.time()
    main()
    etime= time.time()-start_time
    print "Elasped time --- %s seconds ---" % etime
