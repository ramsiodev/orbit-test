# Store de Alertas con Zustand

Este módulo implementa un store global para la gestión de estado de alertas usando [Zustand](https://github.com/pmndrs/zustand).

## Estructura

El store de alertas maneja los siguientes estados:

- `view`: Controla qué vista se muestra ('mosaic' o 'detail')
- `detailData`: Contiene los datos para la vista detallada de alertas
- `isLoading`: Indica si hay una operación en curso
- `error`: Almacena mensajes de error cuando algo falla

## Acciones principales

- `showDetailView`: Cambia a la vista detallada, procesa los datos y los guarda en el store
- `resetToMosaicView`: Vuelve a la vista de mosaico y limpia los datos de detalle

## Beneficios de usar Zustand

1. **Persistencia de estado**: A diferencia de localStorage, el estado persiste solo durante la sesión del usuario
2. **Tipado fuerte**: TypeScript garantiza la estructura correcta de los datos
3. **No requiere recarga**: Las transiciones entre vistas son instantáneas sin recargar la página
4. **Manejo de fechas**: Convierte automáticamente strings de fecha a objetos Date

## Uso

```tsx
// Importar el hook del store
import { useAlertsStore } from './store';

// En un componente que necesita mostrar la vista detallada
const YourComponent = () => {
  const { showDetailView } = useAlertsStore();

  const handleViewAll = (data, title, date) => {
    // Cambia a la vista detallada
    showDetailView(data, title, date);
  };

  return (
    <Button onClick={() => handleViewAll(alertsData, 'Alertas', '20 Mayo 2024')}>
      Ver detalles
    </Button>
  );
};

// En un componente que necesita volver a la vista de mosaico
const DetailView = () => {
  const { resetToMosaicView } = useAlertsStore();

  return <Button onClick={resetToMosaicView}>Volver</Button>;
};
```

## Diagrama de flujo

```
MosaicView -> handleViewAll -> showDetailView (store action) -> Vista detallada
  ^                                                                   |
  |                                                                   |
  +------------------- resetToMosaicView (store action) <-------------+
```
