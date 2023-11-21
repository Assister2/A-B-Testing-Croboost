BUCKET=ab-website-static
CLOUDFRONT=E3MUM6UMBNCEGX
PROFILE=abdev
npm run build && aws s3 sync ./dist/ s3://$BUCKET/
aws cloudfront create-invalidation --distribution-id $CLOUDFRONT --paths "/*"