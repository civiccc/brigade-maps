<?xml version="1.0" encoding="utf-8"?>
<Map>
  <Style name="countries">
    <Rule>
      <Filter>not [ISO_A2]='US'</Filter>
      <PolygonSymbolizer fill="#ebebeb" />
      <LineSymbolizer stroke="#fff" stroke-width="2" />
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
      <Filter>[TYPE]='Land'</Filter>
      <PolygonSymbolizer fill="#ebebeb" />
      <LineSymbolizer stroke="#fff" stroke-width="2" />
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

  <!--
    src-atop: only draw where we intersect with the existing render. This fixes
    district lines that extend out into the sea and become unrecognizable.
  -->
  <Style name="places" comp-op="src-atop">
    <Rule>
      <PolygonSymbolizer fill="#ebebeb" />
    </Rule>

    <Rule>
      <Filter>[GEOID]='{{GEOID}}'</Filter>
      <PolygonSymbolizer fill="{{highlightColor}}" />
    </Rule>

    <Rule>
      <LineSymbolizer stroke="#fff" stroke-width="2" />
    </Rule>
  </Style>

  <Layer name="places" status="on">
    <StyleName>places</StyleName>

    <Datasource>
      <Parameter name="file">{{shapefile}}</Parameter>
      <Parameter name="encoding">iso-8859-1</Parameter>
      <Parameter name="type">shape</Parameter>
    </Datasource>
  </Layer>

  <!--
    seaside districts will have covered their seaside border with their fill
    color, so we re-draw the state borders to clear this up.
  -->
  <Style name="usa_states_borders">
    <Rule>
      <Filter>[TYPE]='Land'</Filter>
      <LineSymbolizer stroke="#fff" stroke-width="2" />
    </Rule>
  </Style>

  <Layer name="usa_states_borders">
    <StyleName>usa_states_borders</StyleName>
    <Datasource>
      <Parameter name="file">shapefiles/usa_states/statesp010g.shp</Parameter>
      <Parameter name="encoding">iso-8859-1</Parameter>
      <Parameter name="type">shape</Parameter>
    </Datasource>
  </Layer>
</Map>
