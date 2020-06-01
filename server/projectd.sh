#!/bin/bash

cd /var/www/project-d.christianvanos.com/backend
/root/.sdkman/candidates/maven/current/bin/mvn spring-boot:run &

cd /var/www/project-d.christianvanos.com/frontend
/usr/bin/ng serve --host 0.0.0.0 --port 80 --disable-host-check