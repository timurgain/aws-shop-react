#!/usr/bin/env python3
import os
import aws_cdk as cdk
from infra.static_site_stack import StaticSiteStack

app = cdk.App()
StaticSiteStack(app, "WebTM-StaticWebsite")

app.synth()
