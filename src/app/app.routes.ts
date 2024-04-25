import { Routes } from '@angular/router';
import { MapPage } from './features/geomap/pages/map/map.page';
import { EquipmentListPage } from './features/equipments/pages/equipmentList/equipmentList.page';
import { EquipmentMergePage } from './features/equipments/pages/equipmentMerge/equipmentMerge.page';
import { MeasuresListPage } from './features/measures/pages/measuresList/measuresList.page';

export const routes: Routes = [
    {
        path: '',
        component: MapPage
    },
    {
        path: 'equipamentos',
        component: EquipmentListPage,
    },
    {
        path: 'equipamentos/novo',
        component: EquipmentMergePage
    },
    {
        path: 'equipamentos/:id',
        component: EquipmentMergePage
    },
    {
        path: 'medidas',
        component: MeasuresListPage
    },
];