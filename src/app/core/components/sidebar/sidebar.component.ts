import { CommonModule, NgFor } from "@angular/common";
import { Component } from "@angular/core";
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { bootstrapPinMap, bootstrapTools } from '@ng-icons/bootstrap-icons';

type SidebarItem = {
    iconName: string,
    title: string,
    url: string,
    isActive: () => boolean
}

const sidebarItems: SidebarItem[] = [
    {
        iconName: "bootstrapPinMap",
        title: "Mapa",
        url: "/",
        isActive: () => window.location.pathname === "/"
    },
    {
        iconName: "bootstrapTools",
        title: "Equipamentos",
        url: "/equipamentos",
        isActive: () => window.location.pathname.includes("/equipamentos")
    }
]

@Component({
    selector: 'sidebar',
    standalone: true,
    imports: [
        CommonModule,
        NgIconComponent,
        NgFor
    ],
    viewProviders: [provideIcons({ bootstrapPinMap, bootstrapTools })],
    templateUrl: './sidebar.component.html',
    styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
    activeSidebarItems: SidebarItem[] = sidebarItems;
}