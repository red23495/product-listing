# How to generate jwt access token?
To generate auth token, you have to first create a user. To create a user make a post request to the url `/auth/sign-up/` providing username and password as json payload
```
url: /auth/sign-up/
data: 
{
  username: "<your username>",
  password: "<your password>"
}
```
Then, make a post request to the url `/auth/authenticate/` with your username and password in the same format. The response will contain the access_token
```
{
  access_token: "<your access token>"
}
```
To authenticate your requests with the provided token, set the token as bearer token in your request header
```
Authorization: Bearer <your token>
```

# How to crud the products api?
Refer to the swagger documentation to the url `/api/`, there will be a list of all the available api endpoints with specification. You will find all the api endpoints for curd'ing product there.

To upload image, you need to upload file in the endpoint `/product/<product id>/image/`, the name of the parameter of file should be `file`.

There is also graphql support for product crud. To explore the api, go to the endpoint `/graphql`.


# Live Preview:
[Link](http://3.109.133.185/)