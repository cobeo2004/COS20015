#!/bin/bash
# start-cluster.sh

echo "Starting config server (configReplSet)..."
mongod --configsvr --replSet configReplSet --port 27018 --dbpath /data/configdb --fork --logpath /data/configdb/config.log

# Wait for config server to be ready
echo "Waiting for config server..."
until mongosh --port 27018 --eval "db.adminCommand('ping')" &> /dev/null; do
  sleep 2
done
echo "Config server is ready."

echo "Initializing config server replica set..."
mongosh --port 27018 < /scripts/replica-config.js
echo "Config server replica set initialized."

echo "Starting shard server (shard1)..."
mongod --shardsvr --replSet shard1 --port 27019 --dbpath /data/shard1 --fork --logpath /data/shard1/shard1.log

# Wait for shard server to be ready
echo "Waiting for shard server..."
until mongosh --port 27019 --eval "db.adminCommand('ping')" &> /dev/null; do
  sleep 2
done
echo "Shard server is ready."

echo "Initializing shard replica set..."
mongosh --port 27019 < /scripts/shard-config.js
echo "Shard replica set initialized."

echo "Starting router (mongos)..."
mongos --configdb configReplSet/localhost:27018 --port 27017 --bind_ip_all --fork --logpath /data/mongos.log

# Wait for router to be ready
echo "Waiting for router..."
until mongosh --port 27017 --eval "db.adminCommand('ping')" &> /dev/null; do
  sleep 2
done
echo "Router is ready."

echo "Adding shard to the cluster via router..."
mongosh --port 27017 < /scripts/router-config.js
echo "Shard added."

echo "Cluster setup complete. Tailing mongos log..."
# Keep container running by tailing a log file
tail -f /data/mongos.log
