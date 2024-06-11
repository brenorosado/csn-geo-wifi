import { CommonModule, NgFor } from "@angular/common";
import { Component } from "@angular/core";
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import {
    bootstrapPinMap,
    bootstrapTools,
    bootstrapWifi,
    bootstrapGear,
    bootstrapBoombox
} from '@ng-icons/bootstrap-icons';
import { RouterLink, RouterLinkActive } from "@angular/router";

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
        iconName: "bootstrapWifi",
        title: "Medidas",
        url: "/medidas",
        isActive: () => window.location.pathname.includes("medidas")
    },
    {
        iconName: "bootstrapBoombox",
        title: "Tipos de rádio",
        url: "/tipos-radio",
        isActive: () => window.location.pathname.includes("/tipos-radio")
    },
    {
        iconName: "bootstrapTools",
        title: "Equipamentos",
        url: "/equipamentos",
        isActive: () => window.location.pathname.includes("equipamentos")
    },
    {
        iconName: "bootstrapBoombox",
        title: "Rádios",
        url: "/radios",
        isActive: () => window.location.pathname.includes("/radios")
    },
    {
        iconName: "bootstrapGear",
        title: "Configuração",
        url: "/configuracao",
        isActive: () => window.location.pathname.includes("configuracao")
    }
]

@Component({
    selector: 'sidebar',
    standalone: true,
    imports: [
        CommonModule,
        NgIconComponent,
        NgFor,
        RouterLink,
        RouterLinkActive
    ],
    viewProviders: [
        provideIcons({
            bootstrapPinMap,
            bootstrapTools,
            bootstrapWifi,
            bootstrapGear,
            bootstrapBoombox
        })
    ],
    templateUrl: './sidebar.component.html',
    styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
    activeSidebarItems: SidebarItem[] = sidebarItems;
}