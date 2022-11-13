
image_name=opm_workbench_web
image_version=0.28
company_name=own
repository_name=swr.cn-east-2.myhuaweicloud.com

docker buildx build --platform=linux/amd64 -t ${image_name}:${image_version} .
docker tag ${image_name}:${image_version} ${repository_name}/${company_name}/${image_name}:${image_version}
docker push ${repository_name}/${company_name}/${image_name}:${image_version}
docker image rm ${image_name}:${image_version} -f
docker image rm ${repository_name}/${company_name}/${image_name}:${image_version} -f
