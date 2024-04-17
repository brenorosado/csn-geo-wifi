import { Routes } from "@angular/router";
import { MapPage } from "../features/geomap/pages/map/map.page";
import { EquipmentListPage } from "../features/equipments/pages/equipmentList/equipmentList.page";

export const routes: Routes = [
    { path: '/', component: MapPage },
    { path: '/equipamentos', component: EquipmentListPage },
];