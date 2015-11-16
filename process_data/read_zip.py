###################################################
# 10/14/15 - Created
# berkley MIDS
# course :205
# Team Members : Tuhin Mahmud
# General parser for GoeLife Trajectory file in PLT format
#####################################################
import glob
import os
import csv
import zipfile
import StringIO
from optparse import OptionParser
import datetime

def read_zip_files(dirName):
    if not dirName:
        return
    dirStr=dirName+"/*.zip"
    print dirStr
    for name in glob.glob(dirStr):
        base = os.path.basename(name)
        filename = os.path.splitext(base)[0]
        print "************ %s ***************" % filename


        datadirectory = dirName
        dataFile = filename
        archive = '.'.join([dataFile, 'zip'])
        fullpath = os.path.join(datadirectory, archive)
        csv_file = dataFile


        filehandle = open(fullpath, 'rb')
        zfile = zipfile.ZipFile(filehandle)
        data = StringIO.StringIO(zfile.read(csv_file)) #don't forget this line!
        reader = csv.reader(data)

        for row in reader:
            #print row
            user_id,latitude,longitude,altitude,date,time,transport = row
            user_id = int(user_id)
            latidude = float(latitude)
            longitude = float(longitude)
            altidude = float(altitude)
            naive = datetime.datetime.strptime (date+" "+time, "%Y-%m-%d %H:%M:%S")
            #ensure it's china timezone to ensure co
            print latitude,longitude,altitude,date,time,transport


def main():
    parser = OptionParser()
    parser.add_option("-f", "--file", action="store", type="string", dest="fileName",
        help="Name of file name")
    parser.add_option("-d", "--dir_path", action="store", type="string", dest="dirName",
        help="Name of directory path")
    parser.add_option("-o", "--outFileName", action="store", type="string", dest="ofileName",
        help="Name of output csv formated file name")

    (options,args) =parser.parse_args()

    print("options %s args %s" % (options,args))
    if len(args)!= 0:
        parser.error("incorrect number of arguments")

    fileName=options.fileName
    dirName=options.dirName
    ofileName=options.ofileName

    if fileName:
        print "work with file %s", fileName
        #read_zip_files(fileName)

    if dirName:
        print "work with dir %s", dirName
        read_zip_files(dirName)
                
if __name__=="__main__":
    main()
