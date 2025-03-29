# PuffPics Deployment Documentation

This document provides comprehensive instructions for deploying PuffPics on web servers with load balancing configuration, as required for Part Two of the assignment.

## Table of Contents
1. [System Architecture](#system-architecture)
2. [Server Setup](#server-setup)
3. [Load Balancer Configuration](#load-balancer-configuration)
4. [Deployment Procedure](#deployment-procedure)
5. [Monitoring and Maintenance](#monitoring-and-maintenance)
6. [Troubleshooting](#troubleshooting)

## System Architecture

The PuffPics application uses a simple yet robust architecture:

```
                   ┌─────────────────┐
                   │                 │
                   │  Load Balancer  │
                   │    (NGINX)      │
                   │                 │
                   └────────┬────────┘
                            │
                            ▼
             ┌─────────────────────────────┐
             │                             │
  ┌──────────▼──────────┐      ┌──────────▼──────────┐
  │                     │      │                     │
  │   Web Server 01     │      │   Web Server 02     │
  │  (Static Content)   │      │  (Static Content)   │
  │                     │      │                     │
  └─────────────────────┘      └─────────────────────┘
```

- **Load Balancer**: NGINX load balancer distributes traffic between the web servers
- **Web Servers**: Two identical web servers hosting the PuffPics application
- **External API**: RapidAPI for image hosting (called directly from the client-side)

## Server Setup

### Prerequisites
- Two web servers running a modern Linux distribution (Ubuntu 22.04 LTS recommended)
- NGINX for the load balancer
- Domain name pointing to the load balancer's IP address

### Web Server Configuration

1. **Install required packages**:
   ```bash
   sudo apt update
   sudo apt install -y nginx
   ```

2. **Configure web server directories**:
   ```bash
   sudo mkdir -p /var/www/puffpics
   sudo chown -R $USER:$USER /var/www/puffpics
   ```

3. **Set up web server NGINX configuration**:
   Create a file at `/etc/nginx/sites-available/puffpics`:
   ```nginx
   server {
       listen 80;
       server_name web01.puffpics.example.com; # Replace with your server hostname
       
       root /var/www/puffpics;
       index index.html;
       
       location / {
           try_files $uri $uri/ =404;
       }
       
       # For better security
       location ~ /\. {
           deny all;
       }
       
       # Optimize serving of static files
       location ~* \.(jpg|jpeg|png|gif|ico|css|js)$ {
           expires 30d;
           add_header Cache-Control "public, no-transform";
       }
       
       # Set max upload size
       client_max_body_size 15M;
   }
   ```

4. **Enable the site**:
   ```bash
   sudo ln -s /etc/nginx/sites-available/puffpics /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl restart nginx
   ```

5. **Repeat the above steps for the second web server**

## Load Balancer Configuration

The load balancer is responsible for distributing traffic between the two web servers and providing failover capability.

1. **Install NGINX on load balancer server**:
   ```bash
   sudo apt update
   sudo apt install -y nginx
   ```

2. **Configure NGINX as a load balancer**:
   Create a file at `/etc/nginx/conf.d/load-balancer.conf` with the configuration provided in the `load-balancer-config.yaml` file.

3. **Validate and restart NGINX**:
   ```bash
   sudo nginx -t
   sudo systemctl restart nginx
   ```

### Load Balancing Algorithm

The load balancer is configured to use the IP hash algorithm, which ensures that a client will be directed to the same server based on their IP address. This helps maintain session consistency.

### Health Checks

The load balancer performs health checks on the web servers to ensure they are operational. If a server fails the health check, traffic is automatically routed to the healthy server.

## Deployment Procedure

1. **Prepare application files**:
   - Ensure all HTML, CSS, JavaScript, and other assets are properly optimized
   - Update API keys in the app.js file (keep these secure in production)

2. **Deploy to both web servers**:
   ```bash
   # On your local machine
   # Create a deployment package
   zip -r puffpics.zip index.html results.html app.js results.js theme.js styles.css
   
   # Transfer to both servers
   scp puffpics.zip user@web01.puffpics.example.com:/tmp/
   scp puffpics.zip user@web02.puffpics.example.com:/tmp/
   
   # On each web server
   ssh user@web01.puffpics.example.com "cd /var/www/puffpics && unzip /tmp/puffpics.zip"
   ssh user@web02.puffpics.example.com "cd /var/www/puffpics && unzip /tmp/puffpics.zip"
   ```

3. **Verify deployment**:
   - Check that the site loads properly through the load balancer
   - Test image upload functionality
   - Verify that all static assets are being served correctly

## Monitoring and Maintenance

### Monitoring

1. **Set up uptime monitoring**:
   - Monitor the `/health` endpoint on the load balancer
   - Set up alerts for any downtime

2. **Log analysis**:
   - Regularly review NGINX access and error logs
   - Set up log rotation to manage log file sizes

### Maintenance

1. **Backup strategy**:
   - Regularly backup configuration files
   - Consider using version control for configuration management

2. **Updates**:
   - Update system packages regularly
   - Plan maintenance windows for major updates

## Troubleshooting

### Common Issues and Solutions

1. **Load balancer not distributing traffic**:
   - Verify NGINX configuration
   - Check if both web servers are responding to health checks

2. **Uploads failing**:
   - Check API key validity
   - Verify that the client can connect to the RapidAPI endpoint
   - Check browser console for JavaScript errors

3. **Session persistence issues**:
   - Verify the IP hash configuration in the load balancer
   - Check if there are any proxy or CDN issues affecting client IP addresses

### Debugging Tools

1. **NGINX status**:
   ```bash
   sudo systemctl status nginx
   ```

2. **View NGINX logs**:
   ```bash
   sudo tail -f /var/log/nginx/puffpics_error.log
   sudo tail -f /var/log/nginx/puffpics_access.log
   ```

3. **Test connectivity to web servers**:
   ```bash
   curl -I http://web01.puffpics.example.com
   curl -I http://web02.puffpics.example.com
   ```

---

By following this deployment guide, you'll have a robust, load-balanced deployment of the PuffPics application that meets the requirements for Part Two of the assignment.
