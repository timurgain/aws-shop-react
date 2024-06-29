import aws_cdk as cdk
from constructs import Construct
from infra.static_site import StaticSite


class StaticSiteStack(cdk.Stack):
    def __init__(self, scope: Construct, id: str, **kwargs):
        super().__init__(scope, id, **kwargs)
        StaticSite(self, "TM-Shop-Static-Website-Construct")
