#!/bin/bash

set -x

GREP='/bin/grep'
RM='/bin/rm'
GIT='/usr/bin/git'
SED='/bin/sed'
AWK='/usr/bin/awk'
XARGS='/usr/bin/xargs'
NPM='/usr/bin/npm'
SYSTEMCTL='/bin/systemctl'
MVN='/root/.sdkman/candidates/maven/current/bin/mvn'

${SYSTEMCTL} stop projectd.service

cd /var/www/project-d.christianvanos.com/
${RM} -r /var/www/project-d.christianvanos.com/*
${RM} -r /var/www/project-d.christianvanos.com/.*
${GIT} clone https://github.com/christianvanos/Project-D.git /var/www/project-d.christianvanos.com/
${GREP} -r "http://localhost:8080" /var/www/project-d.christianvanos.com/frontend/src/ | ${SED} 's/:/ /g' | ${AWK} '{print $1}' | ${XARGS} ${SED} -i 's/http:\/\/localhost:8080/https:\/\/api-project-d.christianvanos.com/g'

cd /var/www/project-d.christianvanos.com/frontend
${NPM} install

cd /var/www/project-d.christianvanos.com/backend
${MVN} install
${SYSTEMCTL} enable projectd.service
${SYSTEMCTL} start projectd.service