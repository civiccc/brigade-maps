<?xml version="1.0" encoding="utf-8"?>
<Map background-color="#d3ddff">
  <Style name="countries">
    <Rule>
      <PolygonSymbolizer fill="#efefef" />
      <LineSymbolizer stroke="#ccc" stroke-width="1" />
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

  <Style name="usa_states">
    <Rule>
      <Filter>[STATE_FIPS]='{{STATE_FIPS}}'</Filter>
      <LineSymbolizer stroke="#ccc" stroke-width="5" />
      <PolygonSymbolizer fill="#fff" />
    </Rule>

    <Rule>
      <Filter>[TYPE]='Water'</Filter>
      <PolygonSymbolizer fill="#d3ddff"/>
    </Rule>
  </Style>

  <Layer name="usa_states">
    <StyleName>usa_states</StyleName>
    <Datasource>
      <Parameter name="file">shapefiles/usa_states/statesp010g.shp</Parameter>
      <Parameter name="encoding">iso-8859-1</Parameter>
      <Parameter name="type">shape</Parameter>
    </Datasource>
  </Layer>

  <Style name="usa_congressional_districts">
    <Rule>
      <Filter>[STATE_FIPS]='{{STATE_FIPS}}' and [CONG_DIST]='{{CONG_DIST}}'</Filter>
      <PolygonSymbolizer fill="#9221c7" />
    </Rule>

    <Rule>
      <LineSymbolizer stroke="#000" stroke-width="1" stroke-opacity="0.1" />
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
