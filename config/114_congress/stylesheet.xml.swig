<?xml version="1.0" encoding="utf-8"?>
<Map background-color="#d3ddff">
  <Style name="countries">
    <Rule>
      <Filter>not [ISO_A2]='US'</Filter>
      <PolygonSymbolizer fill="#ebebeb" />
      <LineSymbolizer stroke="#fff" stroke-width="4" />
    </Rule>
  </Style>

  <Layer name="countries">
    <StyleName>countries</StyleName>
    <Datasource>
      <Parameter name="file">shapefiles/countries/ne_10m_admin_0_countries.shp</Parameter>
      <Parameter name="encoding">iso-8859-1</Parameter>
      <Parameter name="type">shape</Parameter>
    </Datasource>
  </Layer>

  <Style name="usa_congressional_districts">
    <Rule>
      <PolygonSymbolizer fill="#ebebeb" />
    </Rule>

    <Rule>
      <Filter>[STATE_FIPS]='{{STATE_FIPS}}' and [CONG_DIST]='{{CONG_DIST}}'</Filter>
      <PolygonSymbolizer fill="#FFAF50" />
    </Rule>

    <Rule>
      <LineSymbolizer stroke="#fff" stroke-width="4" />
    </Rule>

  </Style>

  <Layer name="usa_congressional_districts" status="on">
    <StyleName>usa_congressional_districts</StyleName>

    <Datasource>
      <Parameter name="file">shapefiles/114_congress/cgd114p010g.shp</Parameter>
      <Parameter name="encoding">iso-8859-1</Parameter>
      <Parameter name="type">shape</Parameter>
    </Datasource>
  </Layer>
</Map>
