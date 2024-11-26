<?xml version="1.0" encoding="UTF-8"?>
<tileset version="1.2" tiledversion="1.3.0" name="CoreTileset" tilewidth="32" tileheight="32" tilecount="4" columns="4">
 <image source="../images/tiles/CoreTileset.png" width="128" height="32"/>
 <terraintypes>
  <terrain name="Ground" tile="0">
   <properties>
    <property name="passable" value="true"/>
   </properties>
  </terrain>
  <terrain name="Wall" tile="1">
   <properties>
    <property name="passable" value="false"/>
   </properties>
  </terrain>
 </terraintypes>
 <tile id="0" terrain="0,0,0,0"/>
 <tile id="1" terrain="1,1,1,1"/>
</tileset>
