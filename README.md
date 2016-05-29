brigade-maps
============================

OCD Division ID (OCDID) Shapefiles

![example map - CA-12](https://raw.githubusercontent.com/tdooner/brigade-maps/master/example.png)

# Adding a New Map
To add a new map, follow the instructions [in this commit
message](https://github.com/tdooner/brigade-maps/commit/15b485c1d8c4f2e8ff4fc1542961ab991bf60cbd)

# Installation

1. install node 5.x via nodenv or via some package manager
2. `npm install`
   This will download and install mapnik, the map rendering tool.
3. Install GraphicsMagick (`brew install GraphicsMagick`)
4. `npm run render`

# Commands
To see all available commands, run:

```bash
export PATH=$(npm bin):$PATH
jake -T
```

# Uploading to Cloudinary

```
  node bin/upload.js > cloudinary_images.csv
  # Recommended: use `jq` to count number of tiles to be uploaded, `pv` to show upload progress:
  # node bin/upload.js | pv -ls ${ jq ‘. | length’ < build/tiles.json} > cloudinary_images.csv
```

Copy `cloudinary_images.csv` to a Rails server, and then update the Districts
with the appropriate images from a Rails console:

```
open('cloudinary_images.csv') do |csv|
  csv.readline # advance past headers
  csv.each_line do |row|
    ocdid, level, version, public_id = row.strip.split(',')
    District.
      joins(:civic_division).
      where(level: level).
      where(civic_divisions: { ocd_id: ocdid }).
      update_all(image: "v#{version}/#{public_id}.png")
  end
end
```
