# web: node app.js --port $PORT

web: App --workdir="./" --config:postgresql.url=$DATABASE_URL --config:servers.default.port=$PORT --config:servers.default.syncKey=$MY_SYNC_KEY --config:servers.default.dropboxKey=$DB_ACCESS_TOKEN
