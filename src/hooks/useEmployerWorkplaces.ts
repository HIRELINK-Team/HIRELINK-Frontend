import { createContext, useContext } from 'react';
import type {
  EmployerWorkplaceListItem,
  UpdateWorkplaceRequest,
  WorkplaceDetailResponse,
} from '../types/workplace';

interface EmployerWorkplacesContextValue {
  workplaces: EmployerWorkplaceListItem[];
  workplaceDetails: Record<number, WorkplaceDetailResponse>;
  loadWorkplaces: () => Promise<EmployerWorkplaceListItem[]>;
  loadWorkplaceDetail: (
    workplaceId: number,
  ) => Promise<WorkplaceDetailResponse>;
  saveWorkplace: (
    workplaceId: number,
    request: UpdateWorkplaceRequest,
  ) => Promise<WorkplaceDetailResponse>;
}

const EmployerWorkplacesContext =
  createContext<EmployerWorkplacesContextValue | null>(null);

function useEmployerWorkplaces() {
  const context = useContext(EmployerWorkplacesContext);

  if (!context) {
    throw new Error(
      'useEmployerWorkplaces must be used within EmployerWorkplacesProvider',
    );
  }

  return context;
}

export { EmployerWorkplacesContext, useEmployerWorkplaces };
