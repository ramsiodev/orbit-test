import { useEffect } from 'react';

import AlertView from './AlertView';
import MosaicView from './MosaicView';
import AlertsDetailView from './AlertsDetailView';
import { useAlertsStore } from './store/useAlertsStore';
import PurchaseConfirmDialogProvider from './PurchaseConfirmDialogProvider';

export default function AlertsContainer() {
  // Obtener estado del store de Zustand
  const {
    view,
    detailData,
    selectedAlert,
    isLoading,
    error,
    resetToMosaicView,
    backToPreviousView,
  } = useAlertsStore();

  // Se utiliza para mostrar logs de depuración
  useEffect(() => {
    console.log('AlertsContainer: Renderizando con view =', view);
  }, [view]);

  // Contenido condicional basado en la vista y estado actual
  const renderContent = () => {
    // Mostrar un indicador de carga mientras se procesa
    if (isLoading) {
      return <div>Cargando...</div>;
    }

    // Mostrar mensaje de error si existe
    if (error) {
      return (
        <div>
          <p>Error: {error}</p>
          <button onClick={resetToMosaicView}>Volver a la vista principal</button>
        </div>
      );
    }

    // Renderizar la vista correcta basada en el estado
    if (view === 'alert' && selectedAlert) {
      console.log('AlertsContainer: Renderizando vista de alerta individual');
      return <AlertView alert={selectedAlert} onGoBack={backToPreviousView} />;
    }

    if (view === 'detail' && detailData) {
      console.log('AlertsContainer: Renderizando vista de detalle con datos');
      // Pasamos una función para volver a la vista de mosaico
      return <AlertsDetailView {...detailData} onGoBack={backToPreviousView} />;
    }

    // Por defecto, mostrar la vista de mosaico
    console.log('AlertsContainer: Renderizando vista de mosaico');
    return <MosaicView />;
  };

  // Envolver todo el contenido con el proveedor del diálogo
  return <PurchaseConfirmDialogProvider>{renderContent()}</PurchaseConfirmDialogProvider>;
}
