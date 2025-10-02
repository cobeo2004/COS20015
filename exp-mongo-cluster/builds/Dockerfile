# Dockerfile
FROM mongo:latest

# Create necessary directories
RUN mkdir -p /data/configdb /data/shard1 /scripts

# Copy initialization scripts
COPY config/replica-config.js /scripts/
COPY config/shard-config.js /scripts/
COPY config/router-config.js /scripts/

# Copy the startup script
COPY scripts/start-cluster.sh /scripts/
RUN chmod +x /scripts/start-cluster.sh

# Expose ports (Router, Config Server, Shard)
EXPOSE 27017 27018 27019

# Set the working directory (optional)
WORKDIR /

# Command to run when the container starts
CMD ["/scripts/start-cluster.sh"]
