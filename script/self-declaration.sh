#!/bin/sh

IP=$(ip route get 8.8.8.8 | grep via | cut -d " " -f 3)
BOOT_ID=$(cat /proc/sys/kernel/random/boot_id)
MACHINE_ID=$(cat /etc/machine-id)
HOSTNAME=$(hostnamectl --static)

CHAOS_URL_BASE="http://localhost:3000"

WHO_DATA=""

for user in $(who | cut -d" " -f 1); do
  if [[ $USER != $user ]]; then
    WHO_DATA=$(echo "$WHO_DATA --data logged_in=$user")
  fi
done

echo $WHO_DATA

curl --request POST \
  --url ${CHAOS_URL_BASE}/status \
  --header 'Content-Type: application/x-www-form-urlencoded' \
  --data hostname=$HOSTNAME \
  --data boot_id=$BOOT_ID \
  --data ip_addr=$IP \
  --data machine_id=$MACHINE_ID \
  $WHO_DATA
