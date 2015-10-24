#!/bin/bash
FILES="../../Geolife Trajectories 1.3/data_csv"
for f in "$FILES"/*.csv
do
  echo "Processing ${f} data file..."
  python load.py "${f}" F all
done
# http://www.cyberciti.biz/faq/bash-loop-over-file/