import { CommonModule, NgFor } from "@angular/common";
import { Component } from "@angular/core";
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { bootstrapPinMap, bootstrapTools, bootstrapFileEarmarkRichtext } from '@ng-icons/bootstrap-icons';
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
        url: "",
        isActive: () => window.location.pathname === "/"
    },
    {
        iconName: "bootstrapTools",
        title: "Equipamentos",
        url: "/equipamentos",
        isActive: () => window.location.pathname.includes("equipamentos")
    },
    {
        iconName: "bootstrapFileEarmarkRichtext",
        title: "Relatórios",
        url: "/relatorios",
        isActive: () => window.location.pathname.includes("relatorios")
    },
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
            bootstrapFileEarmarkRichtext
        })
    ],
    templateUrl: './sidebar.component.html',
    styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
    activeSidebarItems: SidebarItem[] = sidebarItems;
}