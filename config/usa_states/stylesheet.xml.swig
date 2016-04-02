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

  <Style name="usa_states">
    <Rule>
      <PolygonSymbolizer fill="#ebebeb" />
      <LineSymbolizer stroke="#fff" stroke-width="4" />
    </Rule>

    <Rule>
      <Filter>[STATE_FIPS]='{{STATE_FIPS}}'</Filter>
      <PolygonSymbolizer fill="#ffaf50" />
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
