### airbnb backend

## room

### /room/publish (POST)

publish a room

| Body          | Type   | Required | Description      |
| ------------- | ------ | -------- | ---------------- |
| `title`       | string | Yes      | room title       |
| `description` | string | Yes      | room description |
| `price`       | number | Yes      | room price       |

<br>

| headers        | Required | Description |
| -------------- | -------- | ----------- |
| `bearer token` | Yes      | user token  |

<br>
<br>

### /rooms/ (GET)

get a room

| Body | Type   | Required | Description |
| ---- | ------ | -------- | ----------- |
| `id` | string | Yes      | room id     |

<br>

| headers        | Required | Description |
| -------------- | -------- | ----------- |
| `bearer token` | Yes      | user token  |

<br>
<br>

### /room/update/:id (PUT)

update a room

| Body          | Type   | Required | Description      |
| ------------- | ------ | -------- | ---------------- |
| `title`       | string | No       | room title       |
| `description` | string | No       | room description |
| `price`       | number | No       | room price       |
| `id`          | string | Yes      | room id          |

<br>

| headers        | Required | Description |
| -------------- | -------- | ----------- |
| `bearer token` | Yes      | user token  |

<br>
<br>

### //rooms (GET)

get several room

| Body       | Type   | Required | Description                                                     |
| ---------- | ------ | -------- | --------------------------------------------------------------- |
| `title`    | string | Yes      | room title                                                      |
| `pricemin` | number | Yes      | price min                                                       |
| `pricemax` | number | Yes      | price max                                                       |
| `sort`     | string | Yes      | `price-asc` for asending price, `price-desc`for decrasing price |
| `limit`    | number | Yes      | limit room                                                      |
| `page`     | number | Yes      | page                                                            |

<br>

| headers        | Required | Description |
| -------------- | -------- | ----------- |
| `bearer token` | Yes      | user token  |

<br>
<br>

### /roomss (GET)

get several room

| Body       | Type   | Required | Description                                                     |
| ---------- | ------ | -------- | --------------------------------------------------------------- |
| `title`    | string | Yes      | room title                                                      |
| `pricemin` | number | Yes      | price min                                                       |
| `pricemax` | number | Yes      | price max                                                       |
| `sort`     | string | Yes      | `price-asc` for asending price, `price-desc`for decrasing price |
| `limit`    | number | Yes      | limit room                                                      |
| `page`     | number | Yes      | page                                                            |

## user

### /sign-up (POST)

create a new user

| Body          | Type   | Required | Description      |
| ------------- | ------ | -------- | ---------------- |
| `name`        | string | Yes      | user name        |
| `description` | string | Yes      | user description |
| `password`    | string | Yes      | user password    |
| `email`       | string | Yes      | user email       |
| `username`    | string | Yes      | user username    |

<br>
<br>

### /log-in (POST)

log a user

| Body       | Type   | Required | Description   |
| ---------- | ------ | -------- | ------------- |
| `password` | string | Yes      | user password |
| `email`    | string | Yes      | user email    |

<br>
<br>

### /user/upload_picture/:id (PUT)

add user picture

| Body      | Type   | Required | Description  |
| --------- | ------ | -------- | ------------ |
| `id`      | string | Yes      | user id      |
| `picture` | file   | Yes      | user picture |

<br>

| headers        | Required | Description |
| -------------- | -------- | ----------- |
| `bearer token` | Yes      | user token  |

<br>
<br>

### /user/delete_picture/:id (DELETE)

delete a user

| Body | Type   | Required | Description |
| ---- | ------ | -------- | ----------- |
| `id` | string | Yes      | user id     |

<br>

| headers        | Required | Description |
| -------------- | -------- | ----------- |
| `bearer token` | Yes      | user token  |

<br>
<br>

### /users/:id (GET)

get a user

| Body | Type   | Required | Description |
| ---- | ------ | -------- | ----------- |
| `id` | string | Yes      | user id     |

<br>
<br>

### /user/rooms/:id (GET)

get all room of a user

| Body | Type   | Required | Description |
| ---- | ------ | -------- | ----------- |
| `id` | string | Yes      | user id     |

<br>
<br>

### /user/update (PUT)

update user profile

| Body          | Type   | Required | Description      |
| ------------- | ------ | -------- | ---------------- |
| `name`        | string | No       | user name        |
| `description` | string | No       | user description |
| `email`       | string | No       | user email       |
| `username`    | string | No       | user username    |

<br>

| headers        | Required | Description |
| -------------- | -------- | ----------- |
| `bearer token` | Yes      | user token  |

<br>
<br>

### /user/update_password (PUT)

user change password

| Body    | Type   | Required | Description |
| ------- | ------ | -------- | ----------- |
| `email` | string | Yes      | user email  |

<br>
<br>

### /user/reset_password/ (PUT)

after a user ask to change password he have 15 min for check his email and change

| Body        | Type   | Required | Description             |
| ----------- | ------ | -------- | ----------------------- |
| `tokentemp` | string | Yes      | token temporary of user |

<br>

| headers        | Required | Description |
| -------------- | -------- | ----------- |
| `bearer token` | Yes      | user token  |

<br>
<br>

### /user/delete (delete)

delete a user

| Body | Type   | Required | Description |
| ---- | ------ | -------- | ----------- |
| `id` | string | Yes      | user id     |

<br>

| headers        | Required | Description |
| -------------- | -------- | ----------- |
| `bearer token` | Yes      | user token  |

<br>
<br>
