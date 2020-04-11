#!/bin/bash

rm -rf ./logs/
mkdir ./logs/
ssh -i "/path/to/pem/file.pem" ubuntu@ec2-xx-xx-xxx-xxx.us-xxxx-x.compute.amazonaws.com aws s3 sync /home/ubuntu/helpo/logs/ s3://helpo-logs-raw/
aws s3 sync s3://helpo-logs-raw/ ./logs/
gunzip ./logs/django/*.gz
gunzip ./logs/nginx/*.gz
code ./logs/
