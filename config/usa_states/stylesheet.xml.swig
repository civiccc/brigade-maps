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
      <PolygonSymbolizer fill="white" />
      <LineSymbolizer stroke="#ccc" stroke-width="3" />
    </Rule>

    <Rule>
      <Filter>[STATE_FIPS]='{{STATE_FIPS}}'</Filter>
      <PolygonSymbolizer fill="#00f" />
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
</Map>
