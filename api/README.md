# React ToDo Example

This an example Flask api for interacting with a ToDo database in PostgreSQL.

## Run

Navigate into the project folder and run:
```
./start.sh
```

## Stop

Navigate into the project folder and run:
```
./stop.sh
```

## Reset

Navigate into the project folder and run:
```
./reset.sh
```

## Endpoints

Endpoint will be available on localhost:5000/api/todo

### List

```
curl -X GET localhost:5000/api/todo
```

### Create

```
curl -X POST -H 'Content-Type: application/json' -d '{"description": "Some task", "complete": false}' localhost:5000/api/todo
```

### Read

```
curl -X GET localhost:5000/api/todo/<int:id>
```

### Update

```
curl -X PATCH -H 'Content-Type: application/json' -d '{"description": "Some task", "complete": true}' localhost:5000/api/todo/<int:id>
```

### Delete

```
curl -X DELETE localhost:5000/api/todo/<int:id>
```