import { useEffect, useRef } from 'react';
import { driver } from 'driver.js';
import 'driver.js/dist/driver.css';

export interface TourStep {
  element: string;
  popover: {
    title: string;
    description: string;
    side?: 'top' | 'right' | 'bottom' | 'left';
    align?: 'start' | 'center' | 'end';
  };
}

export const useTour = () => {
  const driverObj = useRef<ReturnType<typeof driver> | null>(null);

  useEffect(() => {
    // Agregar estilos personalizados
    const style = document.createElement('style');
    style.textContent = `
      .driverjs-theme {
        --driver-popover-color: #AA0F16;
        --driver-popover-background-color: white;
        --driver-arrow-color: white;
      }
      .driver-popover-title {
        color: #AA0F16;
        font-weight: 600;
      }
      .driver-popover-description {
        color: #374151;
      }
      .driver-popover-footer button {
        background-color: #AA0F16 !important;
        color: white !important;
        border: none !important;
        padding: 8px 16px !important;
        border-radius: 6px !important;
        cursor: pointer !important;
        font-size: 14px !important;
      }
      .driver-popover-footer button:hover {
        background-color: #8B0C12 !important;
      }
      .driver-popover-close-btn {
        background-color: transparent !important;
        color: #6b7280 !important;
        border: 1px solid #e5e7eb !important;
      }
      .driver-popover-close-btn:hover {
        background-color: #f3f4f6 !important;
        color: #374151 !important;
      }
    `;
    document.head.appendChild(style);

    return () => {
      if (driverObj.current) {
        driverObj.current.destroy();
      }
      document.head.removeChild(style);
    };
  }, []);

  const startTour = (steps: TourStep[]) => {
    // Destruir instancia previa si existe
    if (driverObj.current) {
      driverObj.current.destroy();
    }

    const handleClose = () => {
      localStorage.setItem('tour-completed', 'true');
      if (driverObj.current) {
        driverObj.current.destroy();
      }
    };

    const driverSteps = steps.map((step) => {
      return {
        element: step.element,
        popover: {
          title: step.popover.title,
          description: step.popover.description,
          side: step.popover.side || 'left',
          align: step.popover.align || 'start',
        },
      };
    });

    // Crear nueva instancia de driver
    driverObj.current = driver({
      showProgress: true,
      allowClose: true,
      popoverClass: 'driverjs-theme',
      progressText: 'Paso {{current}} de {{total}}',
      nextBtnText: 'Siguiente',
      prevBtnText: 'Anterior',
      doneBtnText: 'Finalizar',
      steps: driverSteps,
      onDestroyStarted: () => {
        handleClose();
      },
      onDestroyed: () => {
        localStorage.setItem('tour-completed', 'true');
      },
    });

    driverObj.current.drive();
  };

  const stopTour = () => {
    if (driverObj.current) {
      localStorage.setItem('tour-completed', 'true');
      driverObj.current.destroy();
    }
  };

  const shouldShowTour = (): boolean => {
    return localStorage.getItem('tour-completed') !== 'true';
  };

  return { startTour, shouldShowTour, stopTour };
};
