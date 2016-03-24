shapefiles/coastline:
	mkdir -p shapefiles/coastline
	wget -O- http://dds.cr.usgs.gov/pub/data/nationalatlas/coastl_usa.shp_nt00900.tar.gz | \
		tar xz -C shapefiles/coastline

shapefiles/114_congress:
	mkdir -p shapefiles/114_congress
	wget -O- ftp://rockyftp.cr.usgs.gov/vdelivery/Datasets/Staged/SmallScale/Data/Boundaries/cgd114p010g.shp.tar.gz | \
		tar xz -C shapefiles/114_congress
