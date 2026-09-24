FROM --platform=linux/amd64 nginx:alpine 
RUN rm -rf /usr/share/nginx/html/*
COPY ./dist /usr/share/nginx/html/
EXPOSE 80
EXPOSE 443
CMD ["nginx", "-g", "daemon off;"]