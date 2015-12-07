# node-edi-poster


Download Raspbian and flash it on SD. Or i

# Installation
sudo raspi-config
change the settings

sudo apt-get update
sudo apt-get upgrade

#Installation Z-Way-Server
wget -q -O - razberry.z-wave.me/install | sudo bash

## Setup Z-Way
ifconfig

Check IP.

http://IP:8083/
To add devices.


# Installation API talker
sudo apt-get install nodejs
sudo ln -s /usr/bin/nodejs /usr/bin/node
sudo apt-get install npm

cd /home/pi
wget https://github.com/jwraats/node-edi-poster/archive/master.zip
unzip master.zip
cd node-edi-poster-master

npm install node-rest-client

TEST RUN:
nodejs app.js 

sudo crontab -e

Add this to the text file:
 \* * * * * nodejs /home/pi/node-edi-poster-master/app.js
 \* * * * * sleep 10; nodejs /home/pi/node-edi-poster-master/app.js
 \* * * * * sleep 20; nodejs /home/pi/node-edi-poster-master/app.js
 \* * * * * sleep 30; nodejs /home/pi/node-edi-poster-master/app.js
 \* * * * * sleep 40; nodejs /home/pi/node-edi-poster-master/app.js
 \* * * * * sleep 50; nodejs /home/pi/node-edi-poster-master/app.js

