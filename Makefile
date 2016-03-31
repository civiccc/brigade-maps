all: shapefiles renderAll.js build/tiles.json
	node bin/renderAll.js

# data/ocdid-country-us.csv:
# 	wget -O data/ocdid-country-us.csv \
# 		https://raw.githubusercontent.com/opencivicdata/ocd-division-ids/master/identifiers/country-us.csv

build/tiles.json: generateBuildConfig.js config/**/stylesheet.xml.swig config/**/ocdid_mapping.csv config/maps.json
	mkdir -p build
	node generateBuildConfig.js

config/114_congress/ocdid_mapping.csv: config/114_congress/generateOcdidMapping.js data/fips.csv
	node config/114_congress/generateOcdidMapping.js > config/114_congress/ocdid_mapping.csv

california: shapefiles renderAll.js build/tiles.json
	node bin/renderAll.js /06

# TODO: There probably is a better way
.PHONY: shapefiles
shapefiles: shapefiles/114_congress shapefiles/usa_states shapefiles/countries

clean:
	rm -rf build/*

shapefiles/114_congress:
	mkdir -p shapefiles/114_congress
	wget -O- ftp://rockyftp.cr.usgs.gov/vdelivery/Datasets/Staged/SmallScale/Data/Boundaries/cgd114p010g.shp.tar.gz | \
		tar xz -C shapefiles/114_congress

shapefiles/usa_states:
	mkdir -p shapefiles/usa_states
	wget -O- http://dds.cr.usgs.gov/pub/data/nationalatlas/statesp010g.shp_nt00938.tar.gz | \
		tar xz -C shapefiles/usa_states

# This data set is in the public domain:
shapefiles/countries:
	mkdir -p shapefiles/countries
	cd shapefiles/countries && \
	wget http://www.naturalearthdata.com/http//www.naturalearthdata.com/download/10m/cultural/ne_10m_admin_0_countries.zip && \
	unzip ne_10m_admin_0_countries.zip && \
	rm ne_10m_admin_0_countries.zip
