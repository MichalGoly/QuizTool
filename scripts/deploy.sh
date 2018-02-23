#!/bin/bash
echo "Deploying to the AWS production environment..."

# 1. Setup config for CircleCI <-> AWS integration
# 2. Login to the Amazon Elastic Container Registry
# 3. Tag Docker images and push them to AWS
# 4. Deploy the app using eb-cli

# https://discuss.circleci.com/t/how-to-setup-elastic-beanstalk-deployment/6154/4
# https://gist.github.com/RobertoSchneiders/9e0e73e836a80d53a21e

# Create a ~/.aws/config file on the CircleCI build engine to store AWS credentials
# Note: $AWS_ACCESS_KEY_ID and $AWS_SECRET_ACCESS_KEY can be changed here:
#       https://circleci.com/gh/MichalGoly/FinalProject/edit#aws
set -x
set -e

AWS_CONFIG_FILE=$HOME/.aws/config

mkdir $HOME/.aws
touch $AWS_CONFIG_FILE
chmod 600 $AWS_CONFIG_FILE

echo "[default]"                                     > $AWS_CONFIG_FILE
echo "aws_access_key_id=$AWS_ACCESS_KEY_ID"         >> $AWS_CONFIG_FILE
echo "aws_secret_access_key=$AWS_SECRET_ACCESS_KEY" >> $AWS_CONFIG_FILE

$(aws ecr get-login --no-include-email --region eu-west-2)

docker tag finalproject_client:latest 993389244112.dkr.ecr.eu-west-2.amazonaws.com/quiz-tool-client:latest
docker tag finalproject_server_node:latest 993389244112.dkr.ecr.eu-west-2.amazonaws.com/quiz-tool-server:latest

docker push 993389244112.dkr.ecr.eu-west-2.amazonaws.com/quiz-tool-client:latest
docker push 993389244112.dkr.ecr.eu-west-2.amazonaws.com/quiz-tool-server:latest

eb deploy prod-env
