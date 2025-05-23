import type { MapProps } from 'src/components/map';
import type { MapRef, LayerProps } from 'react-map-gl/mapbox';

import mapboxgl from 'mapbox-gl';
import { Layer, Source } from 'react-map-gl/mapbox';
import { useRef, useState, useEffect, useCallback } from 'react';

import { useTheme } from '@mui/material/styles';

import useSubscriptionStore from 'src/store/subscriptionStore';

import { Map, MapControls } from 'src/components/map';

// ----------------------------------------------------------------------

type Props = MapProps & { themes: { [key: string]: string } };

export function MapHomeDash({ themes, sx, ...other }: Props) {
  const [selectTheme, setSelectTheme] = useState('satellite');
  const theme = useTheme();
  const mapRef = useRef<MapRef>(null);

  // Obtener el polígono seleccionado del store
  const { selectedSubscription } = useSubscriptionStore();

  // Estado para almacenar los datos GeoJSON de los polígonos
  const [mainPolygon, setMainPolygon] = useState<any>(null);
  const [processedPolygon5km, setProcessedPolygon5km] = useState<any>(null);
  const [processedPolygon25km, setProcessedPolygon25km] = useState<any>(null);

  // Estado para las propiedades del polígono
  const [polygonProperties, setPolygonProperties] = useState<any>(null);

  const handleChangeTheme = useCallback((value: string) => setSelectTheme(value), []);

  // Crear objeto GeoJSON a partir de geometría
  const createGeoJSON = (geometry: any) => {
    if (!geometry) return null;

    return {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          properties: {},
          geometry,
        },
      ],
    };
  };

  // Log para depuración
  useEffect(() => {
    console.log('🔍 selectedSubscription:', selectedSubscription);

    if (selectedSubscription?.polygons) {
      console.log('🔍 Propiedades del polígono:', selectedSubscription.polygons.properties);
      console.log('🔍 Geometría del polígono:', selectedSubscription.polygons.geometry);
      console.log(
        '🔍 Geometría procesada 5km:',
        selectedSubscription.polygons.processedGeometry5km
      );
      console.log(
        '🔍 Geometría procesada 25km:',
        selectedSubscription.polygons.processedGeometry25km
      );
    }
  }, [selectedSubscription]);

  // Preparar datos GeoJSON y propiedades cuando cambie la suscripción seleccionada
  useEffect(() => {
    if (!selectedSubscription) {
      console.log('⚠️ No hay suscripción seleccionada');
      return;
    }

    if (!selectedSubscription.polygons) {
      console.log('⚠️ La suscripción no tiene polígonos asociados:', selectedSubscription);
      return;
    }

    const { geometry, processedGeometry5km, processedGeometry25km, properties } =
      selectedSubscription.polygons;

    // Guardar las propiedades del polígono
    setPolygonProperties(properties);

    if (!geometry) {
      console.log('⚠️ El polígono no tiene geometría:', selectedSubscription.polygons);
      return;
    }

    console.log('✅ Creando GeoJSON para la geometría:', geometry);

    // Crear objetos GeoJSON para cada polígono
    const mainGeoJson = createGeoJSON(geometry);
    setMainPolygon(mainGeoJson);

    const processedGeoJson5km = createGeoJSON(processedGeometry5km);
    setProcessedPolygon5km(processedGeoJson5km);

    const processedGeoJson25km = createGeoJSON(processedGeometry25km);
    setProcessedPolygon25km(processedGeoJson25km);

    console.log('✅ GeoJSON creado:', mainGeoJson);

    // Hacer zoom al polígono usando directamente las coordenadas del polígono
    if (geometry.coordinates && geometry.coordinates.length > 0) {
      // Usar el primer conjunto de coordenadas (para polígonos simples)
      const coordinates = geometry.coordinates[0];

      if (Array.isArray(coordinates) && coordinates.length > 0) {
        console.log('✅ Coordenadas para el zoom:', coordinates.length);

        // Usando setTimeout para asegurar que el mapa está completamente cargado
        setTimeout(() => {
          if (!mapRef.current) {
            console.error('⚠️ La referencia del mapa no está disponible');
            return;
          }

          try {
            console.log('✅ Calculando límites para el zoom');

            // Crear un objeto de límites
            const bounds = new mapboxgl.LngLatBounds();

            // Extender los límites con cada coordenada
            coordinates.forEach((coord: number[], index: number) => {
              if (Array.isArray(coord) && coord.length >= 2) {
                bounds.extend(coord as [number, number]);

                if (index === 0 || index === coordinates.length - 1) {
                  console.log(`✅ Coordenada ${index}:`, coord);
                }
              } else {
                console.warn('⚠️ Coordenada inválida:', coord);
              }
            });

            // Verificar que los límites sean válidos
            if (bounds.isEmpty()) {
              console.warn('⚠️ No se pudieron calcular límites válidos para el polígono');
              return;
            }

            console.log('✅ Límites calculados:', bounds.toString());

            // Ajustar el mapa a los límites del polígono con padding
            mapRef.current.fitBounds(bounds, {
              padding: 80,
              maxZoom: 12,
              duration: 1000,
            });

            console.log('✅ Zoom aplicado al mapa');
          } catch (error) {
            console.error('❌ Error al hacer zoom al polígono:', error);
          }
        }, 800);
      } else {
        console.warn('⚠️ No hay coordenadas válidas para calcular límites');
      }
    } else {
      console.warn('⚠️ No hay coordenadas para calcular límites');
    }
  }, [selectedSubscription]);

  // Aplicar configuraciones del mapa cuando esté listo
  const onMapLoad = useCallback(() => {
    console.log('✅ Mapa cargado');

    if (selectedSubscription?.polygons?.geometry?.coordinates) {
      const coordinates = selectedSubscription.polygons.geometry.coordinates[0];

      if (Array.isArray(coordinates) && coordinates.length > 0 && mapRef.current) {
        try {
          const bounds = new mapboxgl.LngLatBounds();

          coordinates.forEach((coord: number[]) => {
            if (Array.isArray(coord) && coord.length >= 2) {
              bounds.extend(coord as [number, number]);
            }
          });

          if (!bounds.isEmpty()) {
            mapRef.current.fitBounds(bounds, {
              padding: 80,
              maxZoom: 12,
              duration: 1000,
            });
            console.log('✅ Zoom aplicado en onMapLoad');
          }
        } catch (error) {
          console.error('❌ Error al hacer zoom en onMapLoad:', error);
        }
      }
    }
  }, [selectedSubscription]);

  // Renderizar información del polígono
  const renderPolygonInfo = () => {
    if (!polygonProperties) return null;

    return (
      <div
        style={{
          position: 'absolute',
          bottom: '10px',
          left: '10px',
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
          padding: '10px',
          borderRadius: '4px',
          zIndex: 999,
          fontSize: '12px',
          maxWidth: '300px',
        }}
      >
        <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>{polygonProperties.name}</div>
        <div>
          Área: {polygonProperties.km2} km² ({polygonProperties.hectares} hectáreas)
        </div>
        {polygonProperties.newArea && (
          <div>
            Área procesada: {polygonProperties.newArea.km2} km² (
            {polygonProperties.newArea.hectares} hectáreas)
          </div>
        )}
        {polygonProperties.description && <div>Descripción: {polygonProperties.description}</div>}
      </div>
    );
  };

  return (
    <div style={{ position: 'relative', height: '100%', width: '100%' }}>
      <Map
        ref={mapRef}
        initialViewState={{
          latitude: 19.4326, // Ciudad de México (valores más probables para México)
          longitude: -99.1332,
          zoom: 5,
          bearing: 0,
          pitch: 0,
        }}
        mapStyle={themes?.[selectTheme]}
        onLoad={onMapLoad}
        sx={sx}
        {...other}
      >
        <MapControls />

        {/* Polígono principal */}
        {mainPolygon && (
          <Source id="main-polygon-source" type="geojson" data={mainPolygon}>
            <Layer {...polygonFillLayer('main-fill', theme.palette.primary.main, 0.3)} />
            <Layer {...polygonOutlineLayer('main-outline', theme.palette.primary.dark, 2)} />
          </Source>
        )}

        {/* Polígono procesado 5km */}
        {processedPolygon5km && (
          <Source id="processed-5km-source" type="geojson" data={processedPolygon5km}>
            <Layer {...polygonFillLayer('5km-fill', theme.palette.warning.main, 0.2)} />
            <Layer {...polygonOutlineLayer('5km-outline', theme.palette.warning.dark, 1.5)} />
          </Source>
        )}

        {/* Polígono procesado 25km */}
        {processedPolygon25km && (
          <Source id="processed-25km-source" type="geojson" data={processedPolygon25km}>
            <Layer {...polygonFillLayer('25km-fill', theme.palette.info.main, 0.15)} />
            <Layer {...polygonOutlineLayer('25km-outline', theme.palette.info.dark, 1)} />
          </Source>
        )}
      </Map>

      {/* Información del polígono */}
      {/* {renderPolygonInfo()} */}
    </div>
  );
}

// ----------------------------------------------------------------------

// Capa para el relleno del polígono
const polygonFillLayer = (id: string, color: string, opacity: number): LayerProps => ({
  id: `${id}`,
  type: 'fill',
  paint: {
    'fill-color': color,
    'fill-opacity': opacity,
  },
});

// Capa para el contorno del polígono
const polygonOutlineLayer = (id: string, color: string, width: number): LayerProps => ({
  id: `${id}`,
  type: 'line',
  paint: {
    'line-color': color,
    'line-width': width,
  },
});
