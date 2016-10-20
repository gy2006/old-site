#!/bin/bash

set -e

# VARS
DEPLOY_TIME=`date +%Y%m%d%H%M%S`
REMOTE_DIR="/var/www/flow-site"
DEPLOY_DIR="${REMOTE_DIR}/${DEPLOY_TIME}"
LATEST_DIR="${REMOTE_DIR}/latest"

TARGET=$1
PORT=22
echo "########## Deploy to ${TARGET} ##########"

# BUILD & Choose server
if [ ! -z ${TARGET} ]; then
  TARGET=${TARGET} NODE_ENV=production npm run compile
  USER=deploy

  if [ "${TARGET}" == "local" ]; then
    # 从内部部署lyon
    HOSTS=("192.168.1.249")
  elif [ "${TARGET}" == "lyon" ]; then
    # 从外部部署lyon
    HOSTS=('123.57.70.253')
  fi;
  # FIXME: other target should support here
else
  TARGET=production NODE_ENV=production npm run compile
  USER=deploy
  HOSTS=("192.168.10.1" "192.168.10.2")
fi;

echo "########## Build success ##########"

for HOST in ${HOSTS[@]}; do
# DEPLOY
ssh ${USER}@${HOST} -p ${PORT} "mkdir -p ${DEPLOY_DIR}"
#ssh ${USER}@${HOST} -p ${PORT} "find   ${LATEST_DIR}/ -maxdepth 1 -mtime -1 | xargs -i cp -frv  {} ${DEPLOY_DIR}/"
ssh ${USER}@${HOST} -p ${PORT} "find   ${LATEST_DIR}/ -maxdepth 1 | xargs -i cp -frv  {} ${DEPLOY_DIR}/"
scp -P ${PORT}  -rv ./dist/* ${USER}@${HOST}:${DEPLOY_DIR}

ssh ${USER}@${HOST} -p ${PORT}  <<EOF
if [ -d ${LATEST_DIR} ]; then
   rm -rf ${LATEST_DIR}
fi
ln -s ${DEPLOY_DIR} ${LATEST_DIR}
ls ${REMOTE_DIR} | grep "^[0-9]\{1,\}$" | sort -r | sed -n '6,\$p' | awk '{cmd="rm -rf ${REMOTE_DIR}/"\$1; system(cmd)}'
exit
EOF
echo "########## Deploy $HOST  success ##########"
done
echo "########## Deploy all success ##########"
exit 0
