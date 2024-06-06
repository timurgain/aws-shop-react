from aws_cdk import (
    aws_s3 as s3,
    aws_s3_deployment as s3deploy,
    aws_cloudfront as cloudfront,
    aws_iam as iam,
)
from constructs import Construct


class StaticSite(Construct):
    def __init__(self, scope: Construct, id: str, **kwargs) -> None:
        super().__init__(scope, id, **kwargs)

        cloud_front_oai = cloudfront.OriginAccessIdentity(
            self, "WebTM-OAI", comment="Allows CloudFront to access the bucket"
        )

        site_bucket = s3.Bucket(
            self,
            "WebTM-StaticBucket",
            bucket_name="tm-web-nodejs-aws-shop-react",
            website_index_document="index.html",
            public_read_access=False,
            block_public_access=s3.BlockPublicAccess.BLOCK_ALL,
        )

        site_bucket.add_to_resource_policy(
            iam.PolicyStatement(
                actions=["s3:GetObject"],
                resources=[site_bucket.arn_for_objects("*")],
                principals=[
                    iam.CanonicalUserPrincipal(
                        cloud_front_oai.cloud_front_origin_access_identity_s3_canonical_user_id
                    )
                ],
            )
        )

        distribution = cloudfront.CloudFrontWebDistribution(
            self,
            "WebTM-Distribution",
            origin_configs=[
                cloudfront.SourceConfiguration(
                    s3_origin_source=cloudfront.S3OriginConfig(
                        s3_bucket_source=site_bucket,
                        origin_access_identity=cloud_front_oai,
                    ),
                    behaviors=[cloudfront.Behavior(is_default_behavior=True)],
                )
            ],
        )

        s3deploy.BucketDeployment(
            self,
            "WebTM-BucketDeployment",
            sources=[s3deploy.Source.asset("../dist")],
            destination_bucket=site_bucket,
            distribution=distribution,
            distribution_paths=["/*"],  # Invalidate the cache for all files
        )
