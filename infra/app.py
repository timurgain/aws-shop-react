#!/usr/bin/env python3
import os
import aws_cdk as cdk
from infra.static_site_stack import StaticSiteStack

# 1. Init cdk app
app = cdk.App()

# 2. Create stack containing s3 bucket, cloudfront distribution, and bucket deployment
StaticSiteStack(app, "WebTM-StaticWebsite")

# 3. Generate AWS CloudFormation template
app.synth()
