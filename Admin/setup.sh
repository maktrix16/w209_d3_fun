# initialize
sudo aptitude update
sudo aptitude safe-upgrade
sudo aptitude install build-essential
# install Nginx
sudo apt-get install software-properties-common
sudo -s
nginx=stable
sudo add-apt-repository ppa:nginx/$nginx
sudo apt-get update
sudo apt-get install nginx
# install Node Server
apt-get install curl
curl -sL https://deb.nodesource.com/setup | sudo bash -
sudo apt-get install nodejs
# install MongoDB
sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv 7F0CEB10
echo "deb http://repo.mongodb.org/apt/ubuntu "$(lsb_release -sc)"/mongodb-org/3.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-3.0.list
sudo apt-get update
sudo apt-get install -y mongodb-org
# install Python (including Scrapy, boto, pymongo)
sudo apt-get install idle
sudo apt-get install python-pip python-dev
sudo pip install --upgrade pip 
sudo pip install --upgrade virtualenv 
sudo apt-get install -y libssl-dev libxml2-dev libxslt1-dev libssl-dev libffi-dev
# sudo pip install Scrapy
sudo pip install boto
sudo pip install pymongo
sudo pip install python-dateutil
# Git
sudo add-apt-repository ppa:git-core/ppa
sudo apt-get update
sudo apt-get install git
# pull repo from Github and placed core website code into opt folder
git clone https://github.com/maktrix16/w209_d3_fun.git
sudo mkdir -p /opt/app/website
sudo cp -r ~/w209_d3_fun/Website /opt/app/website/public
# sudo git clone https://github.com/maktrix16/w205_priceright.git app

# fix issue with vim editor
cat <<EOF >> ~/.vimrc
:set nocompatible
set backspace=indent,eol,start
EOF
# install node packages
cd /opt/app/website/public
sudo npm install --save
sudo npm install -g nodemon
# configure node to run 24x7 even when instance die
sudo cp ~/w209_d3_fun/Admin/node-app.conf /etc/init/
sudo cat <<EOF >> /etc/init/node-app.conf
description "App Server"
author "W209 D3 Team"

start on (filesystem and net-device-up IFACE=lo)
stop on runlevel [!2345]

respawn

env PORT=3000

chdir /opt/app/website/public/
exec node server.js
EOF

#setup AWS CLI tool
cd ~
curl -O http://s3.amazonaws.com/ec2-downloads/ec2-api-tools.zip
apt-get install unzip
sudo mkdir /usr/local/ec2
sudo unzip ec2-api-tools.zip -d /usr/local/ec2
sudo apt-get install default-jre
echo 'export JAVA_HOME="/usr/lib/jvm/java-7-openjdk-amd64/jre"' >> ~/.bashrc
echo 'export PATH=$JAVA_HOME/bin:$PATH' >> ~/.bashrc
echo 'export EC2_HOME=/usr/local/ec2/ec2-api-tools-1.7.5.1' >> ~/.bashrc
echo 'export PATH=$PATH:$EC2_HOME/bin' >> ~/.bashrc
echo 'export AWS_ACCESS_KEY=AKIAJHPI47HFRSCIZIBQ' >> ~/.bashrc
echo 'export AWS_SECRET_KEY=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' >> ~/.bashrc
source ~/.bashrc
apt-get install awscli

#load data
#aws configure 
aws --region us-east-1 s3 cp s3://w209-d3/data_csv.zip data_csv.zip 
unzip data_csv.zip
sudo pip install pytz



sudo start node-app
# configure nginx and run it
sudo cp node-app /etc/nginx/sites-available/
sudo rm /etc/nginx/sites-enabled/default
sudo ln -s /etc/nginx/sites-available/node-app /etc/nginx/sites-enabled/node-app
sudo /etc/init.d/nginx restart
