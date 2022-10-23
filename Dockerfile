FROM nginx:1.23

COPY ./dist /usr/share/nginx/html
COPY ./nginx/templates /etc/nginx/templates
COPY ./nginx/certificate/8669556_opm.51bolema.com.key /home/cert/cert.key
COPY ./nginx/certificate/8669556_opm.51bolema.com.pem /home/cert/cert.pem

EXPOSE 80
