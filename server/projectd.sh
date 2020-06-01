#!/bin/bash

set -x

MVN='/root/.sdkman/candidates/maven/current/bin/mvn'
NG='/usr/bin/ng'

cd /var/www/project-d.christianvanos.com/backend
${MVN} spring-boot:run &

cd /var/www/project-d.christianvanos.com/frontend
${NG} serve --host 0.0.0.0 --port 80 --disable-host-check