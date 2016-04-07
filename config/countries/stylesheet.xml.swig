<?xml version="1.0" encoding="utf-8"?>
<Map background-color="#d3ddff" srs="+init=epsg:3857">
  <Style name="countries">
    <Rule>
      <PolygonSymbolizer fill="#ebebeb" />
      <LineSymbolizer stroke="#fff" stroke-width="2" />
    </Rule>
    <Rule>
      <Filter>[ISO_A2]='{{ISO_A2}}'</Filter>
      <PolygonSymbolizer fill="#ffaf50" />
      <LineSymbolizer stroke="#fff" stroke-width="2" />
    </Rule>
  </Style>

  <Layer name="countries" srs="+proj=longlat +ellps=WGS84 +datum=WGS84 +no_defs">
    <StyleName>countries</StyleName>
    <Datasource>
      <Parameter name="file">shapefiles/countries/ne_10m_admin_0_countries.shp</Parameter>
      <Parameter name="encoding">iso-8859-1</Parameter>
      <Parameter name="type">shape</Parameter>
    </Datasource>
  </Layer>
</Map>
