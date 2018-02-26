#!/bin/bash
# Build specifics for Connected-City

sed -i -e "s,<welcome-file>/nanopay/src/net/nanopay/index.html</welcome-file>,<welcome-file>/nanopay/src/net/nanopay/connected-city.html</welcome-file>,g" WEB-INF/web.xml

sed -i -e "s,<param-value>/merchant/src/net/nanopay/merchant/index.html</param-value>,<param-value>/merchant/src/net/nanopay/merchant/connected-city.html</param-value>,g" WEB-INF/web.xml

sed -i -e "s/\"from\":\"info@nanopay.net\",\"replyTo\":\"noreply@nanopay.net\",\"displayName\":\"nanopay Corporation\"/\"from\":\"info@connectedcity.net\",\"replyTo\":\"noreply@connectedcity.net\",\"displayName\":\"ConnectedCity\"/g" nanopay/src/services

exit 0
