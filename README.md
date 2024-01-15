# Drones

**DATABASE**

```bash
cd db
```

Create an image that will contain the database with initialized data.

```bash
docker build -t drones .
```

```bash
docker run --name drones_db -p 3307:3306  -e MYSQL_ROOT_PASSWORD=root -d drones
```

**RUNNING THE PROJECT**

```bash
cd ..
```

```bash
npm start
```

**ENDPOINTS**

- **GET /api/drones** : get a list of all drones

- **GET /api/drones/available** : check available drones for loading
- **GET /api/drones/:serialNumber/medications** : check loaded medication items
- **GET /api/drones/:serialNumber/battery** : check drone battery level

- **POST /api/drones** : register a drone

```json
{
  "serialNumber": "DRN016",
  "model": "Lightweight",
  "state": "IDLE",
  "weightLimit": "101",
  "batteryCapacity": "100"
}
```

- **POST /api/drones/:serialNumber/medications** : load a drone with medication items

```json
{
  "MED001": "1",
  "MED001": "2"
}
```
