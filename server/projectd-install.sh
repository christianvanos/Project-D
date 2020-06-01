#!/bin/bash

GREP='/bin/grep'
RM='/bin/rm'
GIT='/usr/bin/git'
SED='/bin/sed'
AWK='/usr/bin/awk'
XARGS='/usr/bin/xargs'
NPM='/usr/bin/npm'
SYSTEMCTL='/bin/systemctl'

${SYSTEMCTL} stop projectd.service

cd /var/www/project-d.christianvanos.com/
${RM} -r /var/www/project-d.christianvanos.com/*
${RM} -r /var/www/project-d.christianvanos.com/.*
${GIT} clone https://github.com/christianvanos/Project-D.git /var/www/project-d.christianvanos.com/
${GREP} -r "http://localhost:8080" /var/www/project-d.christianvanos.com/frontend/src/ | ${SED} 's/:/ /g' | ${AWK} '{print $1}' | ${XARGS} ${SED} -i 's/http:\/\/localhost:8080/https:\/\/api-project-d.christianvanos.com/g'

echo ""

echo "cd /var/www/project-d.christianvanos.com/backend"
echo "${MVN}/root/.sdkman/candidates/maven/current/bin/mvn install"
echo "cd /var/www/project-d.christianvanos.com/frontend"
echo "${NPM} install"
echo "${SYSTEMCTL} start projectd.service"