<?xml version="1.0" encoding="utf-8"?>
<Map background-color="#d3ddff" srs="+init=epsg:3857">
  <Style name="countries">
    <Rule>
      <Filter>not [ISO_A2]='US'</Filter>
      <PolygonSymbolizer fill="#ebebeb" />
      <LineSymbolizer stroke="#fff" stroke-width="4" />
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

  <Style name="usa_states">
    <Rule>
      <Filter>[TYPE]='Land'</Filter>
      <PolygonSymbolizer fill="#ebebeb" />
      <LineSymbolizer stroke="#fff" stroke-width="4" />
    </Rule>

    <Rule>
      <Filter>[STATE_FIPS]='{{STATE_FIPS}}' and [TYPE]='Land'</Filter>
      <PolygonSymbolizer fill="{{highlightColor}}" />
    </Rule>
  </Style>

  <Layer name="usa_states" srs="+proj=longlat +ellps=GRS80 +datum=NAD83 +no_defs">
    <StyleName>usa_states</StyleName>
    <Datasource>
      <Parameter name="file">shapefiles/usa_states/statesp010g.shp</Parameter>
      <Parameter name="encoding">iso-8859-1</Parameter>
      <Parameter name="type">shape</Parameter>
    </Datasource>
  </Layer>
</Map>
